/**
 * Knowledge Base Manager Component
 * Interface untuk mengelola knowledge base chatbot
 */

import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";

interface KBEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  adminToken: string;
}

export default function KnowledgeBaseManager({ adminToken }: Props) {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    question: "",
    answer: "",
    keywords: "",
  });

  // Fetch knowledge base entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/knowledge-base", {
        headers: {
          "x-admin-token": adminToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.data);
      }
    } catch (error) {
      console.error("Error fetching knowledge base:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchEntries();
    }
  }, [adminToken]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: editingId, // Include ID for update
      category: formData.category,
      question: formData.question,
      answer: formData.answer,
      keywords: formData.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k),
    };

    try {
      const response = await fetch("/api/admin/knowledge-base", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({ category: "", question: "", answer: "", keywords: "" });
        setEditingId(null);
        setShowForm(false);
        fetchEntries();
      }
    } catch (error) {
      console.error("Error saving knowledge base entry:", error);
    }
  };

  // Handle edit
  const handleEdit = (entry: KBEntry) => {
    setEditingId(entry.id);
    setFormData({
      category: entry.category,
      question: entry.question,
      answer: entry.answer,
      keywords: entry.keywords.join(", "),
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus entry ini?")) {
      try {
        const response = await fetch("/api/admin/knowledge-base", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          fetchEntries();
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({ category: "", question: "", answer: "", keywords: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>📚 Knowledge Base Manager</h2>
        <button
          className={styles.primaryBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Tutup Form" : "+ Tambah Entry Baru"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className={styles.formContainer}>
          <h3>{editingId ? "Edit Entry" : "Tambah Entry Baru"}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Kategori *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Product Info, General, FAQ"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Pertanyaan *</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="Masukkan pertanyaan"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Jawaban *</label>
              <textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder="Masukkan jawaban detail"
                rows={5}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Keywords (pisahkan dengan koma)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
                placeholder="e.g., laser, product, price"
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryBtn}>
                {editingId ? "Update Entry" : "Tambah Entry"}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      <div className={styles.entriesList}>
        <h3>Daftar Entry ({entries.length})</h3>

        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>Belum ada entry knowledge base</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Pertanyaan</th>
                  <th>Jawaban</th>
                  <th>Keywords</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <span className={styles.badge}>{entry.category}</span>
                    </td>
                    <td className={styles.question}>{entry.question}</td>
                    <td>{entry.answer.substring(0, 100)}...</td>
                    <td>
                      {entry.keywords.length > 0 ? (
                        <div className={styles.keywords}>
                          {entry.keywords.slice(0, 2).map((kw, i) => (
                            <span key={i} className={styles.keyword}>
                              {kw}
                            </span>
                          ))}
                          {entry.keywords.length > 2 && (
                            <span className={styles.keyword}>
                              +{entry.keywords.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(entry)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(entry.id)}
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
