/**
 * Product Manager Component
 * Interface untuk melihat dan mengelola daftar produk (CRUD)
 */

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/productKnowledgeBase";
import styles from "./AdminPanel.module.css";

interface Props {
  adminToken: string;
}

export default function ProductManager({ adminToken }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [editingNo, setEditingNo] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    no: "",
    series: "",
    model: "",
    description: "",
    price: "",
    tag: "",
  });

  // Fetch products on mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products", {
        headers: {
          "x-admin-token": adminToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data);
        setFilteredProducts(data.data);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchProducts();
    }
  }, [adminToken]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Filter by series
    if (selectedSeries !== "all") {
      filtered = filtered.filter((p) => p.series === selectedSeries);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedSeries, products]);

  // Get unique series
  const series = Array.from(new Set(products.map((p) => p.series)));

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      no: parseInt(formData.no),
      series: formData.series,
      model: formData.model,
      description: formData.description,
      price: parseFloat(formData.price),
      tag: formData.tag || undefined,
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: editingNo ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData({
          no: "",
          series: "",
          model: "",
          description: "",
          price: "",
          tag: "",
        });
        setEditingNo(null);
        setShowForm(false);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert("Error saving product");
      console.error("Error saving product:", error);
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingNo(product.no);
    setFormData({
      no: product.no.toString(),
      series: product.series,
      model: product.model,
      description: product.description,
      price: product.price.toString(),
      tag: product.tag || "",
    });
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (no: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk ${no}?`)) {
      try {
        const response = await fetch("/api/admin/products", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify({ no }),
        });

        if (response.ok) {
          fetchProducts();
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        alert("Error deleting product");
        console.error("Error deleting product:", error);
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      no: "",
      series: "",
      model: "",
      description: "",
      price: "",
      tag: "",
    });
    setEditingNo(null);
    setShowForm(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>📦 Product Manager</h2>
        <button
          className={styles.primaryBtn}
          onClick={() => (showForm ? handleReset() : setShowForm(true))}
        >
          {showForm ? "Tutup Form" : "+ Tambah Produk"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className={styles.formContainer}>
          <h3>{editingNo ? `Edit Produk ${editingNo}` : "Tambah Produk Baru"}</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.twoColForm}>
              <div className={styles.formGroup}>
                <label>No Produk * {editingNo && "(Read-only)"}</label>
                <input
                  type="number"
                  value={formData.no}
                  onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                  placeholder="e.g., 1"
                  required
                  disabled={!!editingNo}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Seri Produk *</label>
                <select
                  value={formData.series}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  required
                >
                  <option value="">-- Pilih Seri --</option>
                  <option value="Laser">Laser</option>
                  <option value="Moving Light">Moving Light</option>
                  <option value="Wash">Wash</option>
                  <option value="Beam">Beam</option>
                  <option value="Strobe">Strobe</option>
                  <option value="LED">LED</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Model Produk *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., MOXLITE HADES VI"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Deskripsi *</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="e.g., 6W Laser up to 2600mw laser power"
                rows={3}
                required
              />
            </div>

            <div className={styles.twoColForm}>
              <div className={styles.formGroup}>
                <label>Harga (IDR) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 22530000"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tag (Opsional)</label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g., laser-entry, beam-pro"
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryBtn}>
                {editingNo ? "Update Produk" : "Tambah Produk"}
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

      {/* Filters */}
      <div className={styles.filterContainer}>
        <div className={styles.filterGroup}>
          <label>Cari Produk:</label>
          <input
            type="text"
            placeholder="Cari model, seri, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Filter Seri:</label>
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Semua Seri</option>
            {series.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      <div className={styles.productsList}>
        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p>Tidak ada produk yang cocok</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Seri</th>
                  <th>Model</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Tag</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, idx) => (
                  <tr key={`${product.no}-${product.model}`}>
                    <td>{product.no}</td>
                    <td>
                      <span className={styles.badge}>{product.series}</span>
                    </td>
                    <td className={styles.modelName}>{product.model}</td>
                    <td>{product.description}</td>
                    <td className={styles.price}>
                      {formatPrice(product.price)}
                    </td>
                    <td>
                      {product.tag ? (
                        <span className={styles.tag}>{product.tag}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.no)}
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

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <strong>Total Produk:</strong> {products.length}
        </div>
        <div className={styles.summaryItem}>
          <strong>Seri Aktif:</strong> {series.length}
        </div>
        <div className={styles.summaryItem}>
          <strong>Harga Terendah:</strong>{" "}
          {products.length > 0
            ? formatPrice(Math.min(...products.map((p) => p.price)))
            : "-"}
        </div>
        <div className={styles.summaryItem}>
          <strong>Harga Tertinggi:</strong>{" "}
          {products.length > 0
            ? formatPrice(Math.max(...products.map((p) => p.price)))
            : "-"}
        </div>
      </div>
    </div>
  );
}
