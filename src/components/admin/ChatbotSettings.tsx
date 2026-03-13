/**
 * Chatbot Settings Component
 * Interface untuk mengatur konfigurasi chatbot
 */

import React, { useState } from "react";
import styles from "./AdminPanel.module.css";

interface Props {
  adminToken: string;
}

export default function ChatbotSettings({ adminToken }: Props) {
  const [settings, setSettings] = useState({
    modelName: "Gemini 3 Flash",
    responseLanguage: "indonesian",
    maxTokens: 512,
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  });

  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? parseFloat(value) : value;
    setSettings({ ...settings, [name]: newValue });
  };

  const handleSave = async () => {
    try {
      // Save settings (could be to API/database in production)
      localStorage.setItem("chatbotSettings", JSON.stringify(settings));
      setSaveMessage("✅ Pengaturan berhasil disimpan!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("❌ Gagal menyimpan pengaturan");
      console.error("Error saving settings:", error);
    }
  };

  const handleReset = () => {
    if (confirm("Reset pengaturan ke default?")) {
      const defaultSettings = {
        modelName: "Gemini 3 Flash",
        responseLanguage: "indonesian",
        maxTokens: 512,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      };
      setSettings(defaultSettings);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>⚙️ Pengaturan Chatbot</h2>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label>Model AI *</label>
          <select name="modelName" value={settings.modelName} onChange={handleChange}>
            <option value="Gemini 3 Flash">Gemini 3 Flash</option>
            <option value="Gemini Pro">Gemini Pro</option>
            <option value="GPT-4">GPT-4</option>
            <option value="Claude">Claude</option>
          </select>
          <small>Model AI yang digunakan untuk generate response</small>
        </div>

        <div className={styles.formGroup}>
          <label>Bahasa Response *</label>
          <select
            name="responseLanguage"
            value={settings.responseLanguage}
            onChange={handleChange}
          >
            <option value="indonesian">Bahasa Indonesia</option>
            <option value="english">English</option>
            <option value="mixed">Mixed (Auto-detect)</option>
          </select>
        </div>

        <div className={styles.twoColForm}>
          <div className={styles.formGroup}>
            <label>Max Tokens</label>
            <input
              type="number"
              name="maxTokens"
              value={settings.maxTokens}
              onChange={handleChange}
              min="100"
              max="2000"
              step="50"
            />
            <small>Maksimal token untuk response (100-2000)</small>
          </div>

          <div className={styles.formGroup}>
            <label>Temperature</label>
            <input
              type="number"
              name="temperature"
              value={settings.temperature}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.1"
            />
            <small>Kontrol kreativitas (0-1, default 0.7)</small>
          </div>
        </div>

        <div className={styles.twoColForm}>
          <div className={styles.formGroup}>
            <label>Top K</label>
            <input
              type="number"
              name="topK"
              value={settings.topK}
              onChange={handleChange}
              min="1"
              max="100"
              step="5"
            />
            <small>Jumlah token teratas untuk sampling</small>
          </div>

          <div className={styles.formGroup}>
            <label>Top P</label>
            <input
              type="number"
              name="topP"
              value={settings.topP}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.05"
            />
            <small>Nucleus sampling threshold (default 0.95)</small>
          </div>
        </div>

        {saveMessage && <div className={styles.message}>{saveMessage}</div>}

        <div className={styles.formActions}>
          <button className={styles.primaryBtn} onClick={handleSave}>
            💾 Simpan Pengaturan
          </button>
          <button className={styles.secondaryBtn} onClick={handleReset}>
            🔄 Reset ke Default
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <h3>📖 Informasi Parameter</h3>
        <ul>
          <li>
            <strong>Temperature:</strong> Nilai lebih tinggi = response lebih
            kreatif/random, nilai lebih rendah = response lebih konsisten
          </li>
          <li>
            <strong>Top K:</strong> Hanya mempertimbangkan K token paling likely
            berikutnya
          </li>
          <li>
            <strong>Top P:</strong> Nucleus sampling - mempertimbangkan
            cumulatively paling likely tokens
          </li>
          <li>
            <strong>Max Tokens:</strong> Pembatasan panjang response untuk
            mengontrol cost & latency
          </li>
        </ul>
      </div>
    </div>
  );
}
