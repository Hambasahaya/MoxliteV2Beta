/**
 * Quick Reference Component untuk Admin Panel
 * Menampilkan tips dan info penting
 */

import React from "react";
import styles from "./AdminPanel.module.css";

export default function QuickReference() {
  return (
    <div className={styles.infoBox}>
      <h3>🚀 Quick Reference</h3>

      <div style={{ marginBottom: "20px" }}>
        <h4>Keyboard Shortcuts</h4>
        <ul>
          <li>
            <kbd>Ctrl</kbd> + <kbd>K</kbd>: Buka search knowledge base
          </li>
          <li>
            <kbd>Esc</kbd>: Tutup modal/form
          </li>
          <li>
            <kbd>Ctrl</kbd> + <kbd>S</kbd>: Save form
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Best Practices</h4>
        <ul>
          <li>
            ✅ Selalu backup knowledge base sebelum update besar-besaran
          </li>
          <li>✅ Gunakan keywords yang relevant dan specific</li>
          <li>✅ Test chatbot response setelah menambah entry baru</li>
          <li>✅ Update password admin secara berkala</li>
          <li>✅ Monitor chatbot logs untuk optimization</li>
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Tips untuk Knowledge Base</h4>
        <ul>
          <li>
            💡 Pertanyaan harus natural - gunakan bahasa yang user gunakan
          </li>
          <li>
            💡 Jawaban harus detail tapi singkat - hindari wall of text
          </li>
          <li>💡 Keywords bantu matching - gunakan 3-5 keywords per entry</li>
          <li>
            💡 Kategori membantu organisasi - group questions yang sejenis
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Contoh Knowledge Base Entry</h4>
        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "5px" }}>
          <p>
            <strong>Category:</strong> Product Info
          </p>
          <p>
            <strong>Question:</strong> Apa perbedaan antara HADES VI dan HADES X?
          </p>
          <p>
            <strong>Answer:</strong> HADES VI adalah laser 6W dengan power hingga
            2600mw, cocok untuk entry level. HADES X adalah laser 10W dengan
            power hingga 4000mw, lebih powerful dan cocok untuk profesional.
            Harga HADES VI Rp 22.530.000 sedangkan HADES X Rp 24.430.000.
          </p>
          <p>
            <strong>Keywords:</strong> laser, HADES, perbedaan, power, harga
          </p>
        </div>
      </div>

      <div>
        <h4>Troubleshooting Common Issues</h4>
        <ul>
          <li>
            <strong>Knowledge base tidak tersimpan?</strong> Cek browser console
            (F12) untuk error messages
          </li>
          <li>
            <strong>Chatbot response tidak optimal?</strong> Tambah lebih banyak
            knowledge base entries dan adjust temperature
          </li>
          <li>
            <strong>Lupa password?</strong> Reset di environment variables atau
            gunakan password default
          </li>
        </ul>
      </div>
    </div>
  );
}
