import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  History,
  FileText,
  Calendar,
  IndianRupee,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./TaxHistory.css";

const API = "http://localhost:8000";

function TaxHistory() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.email) {
        setError("Please log in to view your tax history.");
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API}/api/v1/tax/history`, {
        email: userInfo.email,
      });
      setRecords(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tax history");
      toast.error("Could not fetch tax history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const formatCurrency = (val) =>
    `₹${Number(val || 0).toLocaleString("en-IN")}`;

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleViewReport = (token) => {
    localStorage.setItem("Token", token);
    navigate("/doc");
  };

  // ─── Empty state ────────────────────────────
  if (!loading && !error && records.length === 0) {
    return (
      <section className="th-page">
        <div className="th-empty">
          <History size={56} strokeWidth={1.2} />
          <h2>No Tax Filings Yet</h2>
          <p>Your past tax calculations will appear here once you file.</p>
          <button className="th-cta" onClick={() => navigate("/form-filling")}>
            Start Filing
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="th-page">
      <div className="th-header">
        <div>
          <h1 className="th-title">
            <History size={24} /> Tax Filing History
          </h1>
          <p className="th-subtitle">
            {records.length} filing{records.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          className="th-refresh"
          onClick={fetchHistory}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="th-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="th-loading">
          <RefreshCw size={28} className="spin" />
          <span>Loading your filings…</span>
        </div>
      ) : (
        <div className="th-grid">
          {records.map((rec) => (
            <article key={rec._id} className="th-card">
              <div className="th-card-top">
                <span className="th-year">
                  <Calendar size={14} /> AY {rec.Year || "—"}
                </span>
                <span
                  className={`th-badge ${
                    rec.PreferredSystem === "OldRegime" ? "old" : "new"
                  }`}
                >
                  {rec.PreferredSystem === "OldRegime"
                    ? "Old Regime"
                    : "New Regime"}
                </span>
              </div>

              <div className="th-card-body">
                <div className="th-stat">
                  <span className="th-stat-label">Gross Income</span>
                  <span className="th-stat-value">
                    <IndianRupee size={14} />
                    {Number(rec.TotalIncome || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="th-stat">
                  <span className="th-stat-label">Old Regime Tax</span>
                  <span className="th-stat-value">
                    {formatCurrency(rec.OldFinalTax)}
                  </span>
                </div>
                <div className="th-stat">
                  <span className="th-stat-label">New Regime Tax</span>
                  <span className="th-stat-value">
                    {formatCurrency(rec.NewFinalTax)}
                  </span>
                </div>
              </div>

              <div className="th-card-foot">
                <span className="th-date">
                  <FileText size={13} /> Filed {formatDate(rec.createdAt)}
                </span>
                <button
                  className="th-view-btn"
                  onClick={() => handleViewReport(rec.Token)}
                >
                  View Report <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TaxHistory;
