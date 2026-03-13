/**
 * Marketing Configuration Component
 * Interface untuk marketing team mengatur rekomendasi produk dan tips
 */

import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";

interface BudgetRange {
  id: string;
  minBudget: number;
  maxBudget: number;
  name: string;
  description: string;
}

interface ProductRecommendation {
  id: string;
  budgetRangeId: string;
  userType: "rental" | "project";
  productNo: number;
  productName: string;
  reason: string;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

interface MarketingTip {
  id: string;
  userType: "rental" | "project";
  title: string;
  content: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type SubTab = "budget-ranges" | "recommendations" | "marketing-tips";

interface Props {
  adminToken: string;
}

export default function MarketingConfig({ adminToken }: Props) {
  const [subTab, setSubTab] = useState<SubTab>("budget-ranges");
  const [loading, setLoading] = useState(false);

  // Budget Ranges State
  const [budgetRanges, setBudgetRanges] = useState<BudgetRange[]>([]);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetFormData, setBudgetFormData] = useState({
    minBudget: "",
    maxBudget: "",
    name: "",
    description: "",
  });
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);

  // Recommendations State
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [showRecForm, setShowRecForm] = useState(false);
  const [recFormData, setRecFormData] = useState({
    budgetRangeId: "",
    userType: "rental" as "rental" | "project",
    productNo: "",
    productName: "",
    reason: "",
    priority: "1",
  });
  const [editingRecId, setEditingRecId] = useState<string | null>(null);
  const [filterUserType, setFilterUserType] = useState<"all" | "rental" | "project">("all");

  // Marketing Tips State
  const [marketingTips, setMarketingTips] = useState<MarketingTip[]>([]);
  const [showTipForm, setShowTipForm] = useState(false);
  const [tipFormData, setTipFormData] = useState({
    userType: "rental" as "rental" | "project",
    title: "",
    content: "",
    active: true,
  });
  const [editingTipId, setEditingTipId] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      const [budgetRes, recRes, tipsRes] = await Promise.all([
        fetch("/api/admin/marketing-config?action=budget-ranges", {
          headers: { "x-admin-token": adminToken },
        }),
        fetch("/api/admin/marketing-config?action=recommendations", {
          headers: { "x-admin-token": adminToken },
        }),
        fetch("/api/admin/marketing-config?action=marketing-tips", {
          headers: { "x-admin-token": adminToken },
        }),
      ]);

      if (budgetRes.ok) {
        const data = await budgetRes.json();
        setBudgetRanges(data.data);
      }
      if (recRes.ok) {
        const data = await recRes.json();
        setRecommendations(data.data);
      }
      if (tipsRes.ok) {
        const data = await tipsRes.json();
        setMarketingTips(data.data);
      }
    } catch (error) {
      console.error("Error fetching marketing config:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchData();
    }
  }, [adminToken]);

  // Budget Ranges Functions
  const handleAddBudgetRange = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/admin/marketing-config?action=budget-ranges`,
        {
          method: editingBudgetId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify(
            editingBudgetId
              ? {
                  id: editingBudgetId,
                  minBudget: parseInt(budgetFormData.minBudget),
                  maxBudget: parseInt(budgetFormData.maxBudget),
                  name: budgetFormData.name,
                  description: budgetFormData.description,
                }
              : {
                  minBudget: parseInt(budgetFormData.minBudget),
                  maxBudget: parseInt(budgetFormData.maxBudget),
                  name: budgetFormData.name,
                  description: budgetFormData.description,
                }
          ),
        }
      );

      if (response.ok) {
        setBudgetFormData({
          minBudget: "",
          maxBudget: "",
          name: "",
          description: "",
        });
        setEditingBudgetId(null);
        setShowBudgetForm(false);
        fetchData();
      }
    } catch (error) {
      alert("Error saving budget range");
      console.error(error);
    }
  };

  const handleEditBudgetRange = (range: BudgetRange) => {
    setEditingBudgetId(range.id);
    setBudgetFormData({
      minBudget: range.minBudget.toString(),
      maxBudget: range.maxBudget.toString(),
      name: range.name,
      description: range.description,
    });
    setShowBudgetForm(true);
  };

  const handleDeleteBudgetRange = async (id: string) => {
    if (confirm("Hapus budget range ini?")) {
      try {
        await fetch(`/api/admin/marketing-config?action=budget-ranges`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify({ id }),
        });
        fetchData();
      } catch (error) {
        alert("Error deleting budget range");
      }
    }
  };

  // Recommendations Functions
  const handleAddRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/admin/marketing-config?action=recommendations`,
        {
          method: editingRecId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify(
            editingRecId
              ? {
                  id: editingRecId,
                  budgetRangeId: recFormData.budgetRangeId,
                  userType: recFormData.userType,
                  productNo: parseInt(recFormData.productNo),
                  productName: recFormData.productName,
                  reason: recFormData.reason,
                  priority: parseInt(recFormData.priority),
                }
              : {
                  budgetRangeId: recFormData.budgetRangeId,
                  userType: recFormData.userType,
                  productNo: parseInt(recFormData.productNo),
                  productName: recFormData.productName,
                  reason: recFormData.reason,
                  priority: parseInt(recFormData.priority),
                }
          ),
        }
      );

      if (response.ok) {
        setRecFormData({
          budgetRangeId: "",
          userType: "rental",
          productNo: "",
          productName: "",
          reason: "",
          priority: "1",
        });
        setEditingRecId(null);
        setShowRecForm(false);
        fetchData();
      }
    } catch (error) {
      alert("Error saving recommendation");
      console.error(error);
    }
  };

  const handleDeleteRecommendation = async (id: string) => {
    if (confirm("Hapus rekomendasi ini?")) {
      try {
        await fetch(`/api/admin/marketing-config?action=recommendations`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify({ id }),
        });
        fetchData();
      } catch (error) {
        alert("Error deleting recommendation");
      }
    }
  };

  // Marketing Tips Functions
  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/admin/marketing-config?action=marketing-tips`,
        {
          method: editingTipId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify(
            editingTipId
              ? {
                  id: editingTipId,
                  userType: tipFormData.userType,
                  title: tipFormData.title,
                  content: tipFormData.content,
                  active: tipFormData.active,
                }
              : {
                  userType: tipFormData.userType,
                  title: tipFormData.title,
                  content: tipFormData.content,
                  active: tipFormData.active,
                }
          ),
        }
      );

      if (response.ok) {
        setTipFormData({
          userType: "rental",
          title: "",
          content: "",
          active: true,
        });
        setEditingTipId(null);
        setShowTipForm(false);
        fetchData();
      }
    } catch (error) {
      alert("Error saving marketing tip");
      console.error(error);
    }
  };

  const handleDeleteTip = async (id: string) => {
    if (confirm("Hapus marketing tip ini?")) {
      try {
        await fetch(`/api/admin/marketing-config?action=marketing-tips`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify({ id }),
        });
        fetchData();
      } catch (error) {
        alert("Error deleting marketing tip");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>💰 Marketing Configuration</h2>
        <span className={styles.badge}>Setup untuk Rekomendasi Chatbot</span>
      </div>

      {/* Sub Tabs */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${subTab === "budget-ranges" ? styles.active : ""}`}
          onClick={() => setSubTab("budget-ranges")}
        >
          💵 Budget Ranges
        </button>
        <button
          className={`${styles.tab} ${
            subTab === "recommendations" ? styles.active : ""
          }`}
          onClick={() => setSubTab("recommendations")}
        >
          📌 Rekomendasi Produk
        </button>
        <button
          className={`${styles.tab} ${subTab === "marketing-tips" ? styles.active : ""}`}
          onClick={() => setSubTab("marketing-tips")}
        >
          💡 Marketing Tips
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Budget Ranges Tab */}
          {subTab === "budget-ranges" && (
            <div>
              <h3>Atur Budget Range untuk Rekomendasi</h3>
              <p style={{ color: "#666", marginBottom: "20px" }}>
                Tentukan range budget dan chatbot akan merekomendasikan produk yang sesuai
              </p>

              {!showBudgetForm && (
                <button
                  className={styles.primaryBtn}
                  onClick={() => setShowBudgetForm(true)}
                  style={{ marginBottom: "20px" }}
                >
                  + Tambah Budget Range
                </button>
              )}

              {showBudgetForm && (
                <div className={styles.formContainer}>
                  <h4>
                    {editingBudgetId ? "Edit Budget Range" : "Tambah Budget Range Baru"}
                  </h4>
                  <form onSubmit={handleAddBudgetRange}>
                    <div className={styles.twoColForm}>
                      <div className={styles.formGroup}>
                        <label>Min Budget (IDR) *</label>
                        <input
                          type="number"
                          value={budgetFormData.minBudget}
                          onChange={(e) =>
                            setBudgetFormData({
                              ...budgetFormData,
                              minBudget: e.target.value,
                            })
                          }
                          placeholder="0"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Max Budget (IDR) *</label>
                        <input
                          type="number"
                          value={budgetFormData.maxBudget}
                          onChange={(e) =>
                            setBudgetFormData({
                              ...budgetFormData,
                              maxBudget: e.target.value,
                            })
                          }
                          placeholder="10000000"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Nama Range *</label>
                      <input
                        type="text"
                        value={budgetFormData.name}
                        onChange={(e) =>
                          setBudgetFormData({
                            ...budgetFormData,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Entry Level"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Deskripsi</label>
                      <textarea
                        value={budgetFormData.description}
                        onChange={(e) =>
                          setBudgetFormData({
                            ...budgetFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Jelaskan untuk siapa range ini cocok"
                        rows={3}
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.primaryBtn}>
                        {editingBudgetId ? "Update" : "Tambah"}
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => {
                          setShowBudgetForm(false);
                          setEditingBudgetId(null);
                          setBudgetFormData({
                            minBudget: "",
                            maxBudget: "",
                            name: "",
                            description: "",
                          });
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Budget Ranges List */}
              <div className={styles.tableWrapper} style={{ marginTop: "30px" }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Min Budget</th>
                      <th>Max Budget</th>
                      <th>Nama</th>
                      <th>Deskripsi</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetRanges.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: "30px" }}>
                          Belum ada budget range
                        </td>
                      </tr>
                    ) : (
                      budgetRanges.map((range) => (
                        <tr key={range.id}>
                          <td>{formatPrice(range.minBudget)}</td>
                          <td>
                            {range.maxBudget === Infinity
                              ? "Unlimited"
                              : formatPrice(range.maxBudget)}
                          </td>
                          <td>
                            <strong>{range.name}</strong>
                          </td>
                          <td>{range.description}</td>
                          <td>
                            <button
                              className={styles.editBtn}
                              onClick={() => handleEditBudgetRange(range)}
                            >
                              ✏️
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteBudgetRange(range.id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {subTab === "recommendations" && (
            <div>
              <h3>Atur Rekomendasi Produk untuk Setiap Budget & User Type</h3>
              <p style={{ color: "#666", marginBottom: "20px" }}>
                Tentukan produk apa yang direkomendasikan untuk user rental dan project
              </p>

              {!showRecForm && (
                <button
                  className={styles.primaryBtn}
                  onClick={() => setShowRecForm(true)}
                  style={{ marginBottom: "20px" }}
                >
                  + Tambah Rekomendasi
                </button>
              )}

              {showRecForm && (
                <div className={styles.formContainer}>
                  <h4>{editingRecId ? "Edit Rekomendasi" : "Tambah Rekomendasi Baru"}</h4>
                  <form onSubmit={handleAddRecommendation}>
                    <div className={styles.twoColForm}>
                      <div className={styles.formGroup}>
                        <label>Budget Range *</label>
                        <select
                          value={recFormData.budgetRangeId}
                          onChange={(e) =>
                            setRecFormData({
                              ...recFormData,
                              budgetRangeId: e.target.value,
                            })
                          }
                          required
                        >
                          <option value="">-- Pilih Range --</option>
                          {budgetRanges.map((range) => (
                            <option key={range.id} value={range.id}>
                              {range.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label>User Type *</label>
                        <select
                          value={recFormData.userType}
                          onChange={(e) =>
                            setRecFormData({
                              ...recFormData,
                              userType: e.target.value as "rental" | "project",
                            })
                          }
                          required
                        >
                          <option value="rental">Rental</option>
                          <option value="project">Project</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.twoColForm}>
                      <div className={styles.formGroup}>
                        <label>Product No *</label>
                        <input
                          type="number"
                          value={recFormData.productNo}
                          onChange={(e) =>
                            setRecFormData({
                              ...recFormData,
                              productNo: e.target.value,
                            })
                          }
                          placeholder="e.g., 1"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Product Name *</label>
                        <input
                          type="text"
                          value={recFormData.productName}
                          onChange={(e) =>
                            setRecFormData({
                              ...recFormData,
                              productName: e.target.value,
                            })
                          }
                          placeholder="e.g., MOXLITE HADES VI"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Alasan Rekomendasi</label>
                      <textarea
                        value={recFormData.reason}
                        onChange={(e) =>
                          setRecFormData({
                            ...recFormData,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Mengapa produk ini cocok untuk budget dan user type ini?"
                        rows={3}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Priority (1=highest)</label>
                      <input
                        type="number"
                        value={recFormData.priority}
                        onChange={(e) =>
                          setRecFormData({
                            ...recFormData,
                            priority: e.target.value,
                          })
                        }
                        min="1"
                        max="5"
                      />
                      <small>Produk dengan priority lebih rendah akan ditampilkan duluan</small>
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.primaryBtn}>
                        {editingRecId ? "Update" : "Tambah"}
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => {
                          setShowRecForm(false);
                          setEditingRecId(null);
                          setRecFormData({
                            budgetRangeId: "",
                            userType: "rental",
                            productNo: "",
                            productName: "",
                            reason: "",
                            priority: "1",
                          });
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Filter */}
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <label>Filter: </label>
                <select
                  value={filterUserType}
                  onChange={(e) =>
                    setFilterUserType(e.target.value as "all" | "rental" | "project")
                  }
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <option value="all">Semua</option>
                  <option value="rental">Rental</option>
                  <option value="project">Project</option>
                </select>
              </div>

              {/* Recommendations List */}
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Budget Range</th>
                      <th>User Type</th>
                      <th>Product</th>
                      <th>Reason</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations
                      .filter(
                        (rec) =>
                          filterUserType === "all" || rec.userType === filterUserType
                      )
                      .sort((a, b) => a.priority - b.priority)
                      .map((rec) => {
                        const budget = budgetRanges.find(
                          (b) => b.id === rec.budgetRangeId
                        );
                        return (
                          <tr key={rec.id}>
                            <td>{budget?.name || "Unknown"}</td>
                            <td>
                              <span className={styles.badge}>
                                {rec.userType === "rental"
                                  ? "🏪 Rental"
                                  : "🎬 Project"}
                              </span>
                            </td>
                            <td>
                              <strong>{rec.productName}</strong>
                              <br />
                              <small>(No: {rec.productNo})</small>
                            </td>
                            <td>{rec.reason}</td>
                            <td>{rec.priority}</td>
                            <td>
                              <button
                                className={styles.editBtn}
                                onClick={() => {
                                  setEditingRecId(rec.id);
                                  setRecFormData({
                                    budgetRangeId: rec.budgetRangeId,
                                    userType: rec.userType,
                                    productNo: rec.productNo.toString(),
                                    productName: rec.productName,
                                    reason: rec.reason,
                                    priority: rec.priority.toString(),
                                  });
                                  setShowRecForm(true);
                                }}
                              >
                                ✏️
                              </button>
                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteRecommendation(rec.id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Marketing Tips Tab */}
          {subTab === "marketing-tips" && (
            <div>
              <h3>Marketing Tips untuk Chatbot</h3>
              <p style={{ color: "#666", marginBottom: "20px" }}>
                Tambahkan tips dan informasi marketing yang akan ditampilkan chatbot untuk
                membantu customer membuat keputusan
              </p>

              {!showTipForm && (
                <button
                  className={styles.primaryBtn}
                  onClick={() => setShowTipForm(true)}
                  style={{ marginBottom: "20px" }}
                >
                  + Tambah Marketing Tip
                </button>
              )}

              {showTipForm && (
                <div className={styles.formContainer}>
                  <h4>{editingTipId ? "Edit Marketing Tip" : "Tambah Marketing Tip Baru"}</h4>
                  <form onSubmit={handleAddTip}>
                    <div className={styles.formGroup}>
                      <label>User Type *</label>
                      <select
                        value={tipFormData.userType}
                        onChange={(e) =>
                          setTipFormData({
                            ...tipFormData,
                            userType: e.target.value as "rental" | "project",
                          })
                        }
                        required
                      >
                        <option value="rental">Rental</option>
                        <option value="project">Project</option>
                      </select>
                      <small>Tip ini akan ditampilkan ketika user memilih tipe ini</small>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Judul Tips *</label>
                      <input
                        type="text"
                        value={tipFormData.title}
                        onChange={(e) =>
                          setTipFormData({
                            ...tipFormData,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g., Mulai Bisnis Rental Lampu"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Isi Tips *</label>
                      <textarea
                        value={tipFormData.content}
                        onChange={(e) =>
                          setTipFormData({
                            ...tipFormData,
                            content: e.target.value,
                          })
                        }
                        placeholder="Jelaskan tips marketing secara detail..."
                        rows={5}
                        required
                      />
                    </div>

                    <div className={styles.formGroup} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <input
                        type="checkbox"
                        checked={tipFormData.active}
                        onChange={(e) =>
                          setTipFormData({
                            ...tipFormData,
                            active: e.target.checked,
                          })
                        }
                      />
                      <label style={{ margin: 0 }}>Aktif (ditampilkan di chatbot)</label>
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.primaryBtn}>
                        {editingTipId ? "Update" : "Tambah"}
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => {
                          setShowTipForm(false);
                          setEditingTipId(null);
                          setTipFormData({
                            userType: "rental",
                            title: "",
                            content: "",
                            active: true,
                          });
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Marketing Tips List */}
              <div style={{ marginTop: "30px" }}>
                {marketingTips.length === 0 ? (
                  <p>Belum ada marketing tips</p>
                ) : (
                  <div>
                    {["rental", "project"].map((userType) => {
                      const tips = marketingTips.filter(
                        (t) => t.userType === (userType as "rental" | "project")
                      );
                      return (
                        <div key={userType} style={{ marginBottom: "30px" }}>
                          <h4>
                            {userType === "rental" ? "🏪 Rental" : "🎬 Project"} Tips
                          </h4>

                          {tips.length === 0 ? (
                            <p style={{ color: "#999" }}>Belum ada tips untuk {userType}</p>
                          ) : (
                            <div>
                              {tips.map((tip) => (
                                <div
                                  key={tip.id}
                                  style={{
                                    background: "#f9f9f9",
                                    padding: "15px",
                                    borderLeft: `4px solid ${tip.active ? "#27ae60" : "#bbb"}`,
                                    marginBottom: "15px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "start",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <div>
                                      <h5 style={{ marginBottom: "5px" }}>
                                        {tip.title}{" "}
                                        {!tip.active && (
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              color: "#bbb",
                                              fontWeight: "normal",
                                            }}
                                          >
                                            (Tidak Aktif)
                                          </span>
                                        )}
                                      </h5>
                                      <p style={{ margin: "0", color: "#666", lineHeight: "1.5" }}>
                                        {tip.content}
                                      </p>
                                    </div>
                                    <div style={{ display: "flex", gap: "5px" }}>
                                      <button
                                        className={styles.editBtn}
                                        onClick={() => {
                                          setEditingTipId(tip.id);
                                          setTipFormData({
                                            userType: tip.userType,
                                            title: tip.title,
                                            content: tip.content,
                                            active: tip.active,
                                          });
                                          setShowTipForm(true);
                                        }}
                                        style={{
                                          padding: "6px 8px",
                                          fontSize: "12px",
                                        }}
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteTip(tip.id)}
                                        style={{
                                          padding: "6px 8px",
                                          fontSize: "12px",
                                        }}
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
