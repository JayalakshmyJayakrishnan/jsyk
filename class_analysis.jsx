import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Legend 
} from "recharts";

const subjectData = [
  { subject: "AIT362-R", failures: 5, absents: 1, passing: 24, total: 30, avg: 34.2 },
  { subject: "CDT304-MLC", failures: 7, absents: 4, passing: 19, total: 30, avg: 29.1 },
  { subject: "CDT308-CCW", failures: 4, absents: 3, passing: 23, total: 30, avg: 33.4 },
  { subject: "CST302-CD", failures: 10, absents: 3, passing: 17, total: 30, avg: 28.3 },
  { subject: "CST306-AAD", failures: 12, absents: 0, passing: 18, total: 30, avg: 24.6 },
  { subject: "HUT300-IEFT", failures: 1, absents: 3, passing: 26, total: 27, avg: 31.2 },
];

const riskBuckets = [
  { label: "Safe Zone", desc: "Passing all subjects", count: 9, color: "#22c55e" },
  { label: "Watch Out", desc: "Failing 1–2 subjects", count: 11, color: "#f59e0b" },
  { label: "Danger Zone", desc: "Failing 3+ subjects", count: 7, color: "#ef4444" },
  { label: "Critical", desc: "Multiple absents + fails", count: 3, color: "#7f1d1d" },
];

const radarData = [
  { subject: "AIT362", classAvg: 68, threshold: 50 },
  { subject: "CDT304", classAvg: 58, threshold: 50 },
  { subject: "CDT308", classAvg: 67, threshold: 50 },
  { subject: "CST302", classAvg: 57, threshold: 50 },
  { subject: "CST306", classAvg: 49, threshold: 50 },
  { subject: "HUT300", classAvg: 62, threshold: 50 },
];

const COLORS = {
  danger: "#ef4444",
  warn: "#f59e0b",
  safe: "#22c55e",
  absent: "#7c3aed",
  bg: "#0a0a0f",
  card: "#111118",
  border: "#1e1e2e",
  text: "#e2e8f0",
  muted: "#64748b",
};

const CustomBar = (props) => {
  const { x, y, width, height, payload } = props;
  const pct = (payload.failures / payload.total) * 100;
  const fill = pct > 40 ? COLORS.danger : pct > 25 ? COLORS.warn : COLORS.safe;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />;
};

const AbsentBar = (props) => {
  const { x, y, width, height } = props;
  return <rect x={x} y={y} width={width} height={height} fill={COLORS.absent} rx={4} />;
};

export default function ClassDashboard() {
  const totalAbsents = subjectData.reduce((a, b) => a + b.absents, 0);
  const totalFailInstances = subjectData.reduce((a, b) => a + b.failures, 0);
  const worstSubject = subjectData.reduce((a, b) => (a.failures > b.failures ? a : b));
  const riskTotal = riskBuckets.filter(b => b.label === "Danger Zone" || b.label === "Critical").reduce((a, b) => a + b.count, 0);
  const classRiskPct = Math.round((riskTotal / 30) * 100);

  return (
    <div style={{ fontFamily: "'Courier New', monospace", background: COLORS.bg, minHeight: "100vh", color: COLORS.text, padding: "0" }}>
      <div style={{ background: "linear-gradient(135deg, #1a0000 0%, #0a0a0f 60%)", borderBottom: `2px solid ${COLORS.danger}`, padding: "28px 32px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "100%", background: "radial-gradient(ellipse at top right, rgba(239,68,68,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <span style={{ color: COLORS.danger, fontSize: "11px", letterSpacing: "4px", fontWeight: "bold" }}>INTERNAL MARKS — CLASS PERFORMANCE REPORT</span>
        </div>
        <h1 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: "bold", color: "#fff", margin: "0 0 4px", letterSpacing: "-1px" }}>
          Wake Up, <span style={{ color: COLORS.danger }}>Batch.</span>
        </h1>
        <p style={{ color: COLORS.muted, fontSize: "13px", margin: 0 }}>Report taken: 26-02-2026 · 30 students · 6 subjects</p>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Fail Instances", value: totalFailInstances, sub: "across all 6 subjects", color: COLORS.danger, icon: "❌" },
            { label: "Students at Risk", value: `${classRiskPct}%`, sub: "failing 3+ subjects", color: COLORS.danger, icon: "🚨" },
            { label: "Absences Logged", value: totalAbsents, sub: "across all subjects", color: COLORS.absent, icon: "🔴" },
            { label: "Worst Subject", value: worstSubject.subject.split('-')[0], sub: `${worstSubject.failures} students failing`, color: COLORS.warn, icon: "📉" },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${s.color}`, borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "bold", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: COLORS.text, fontWeight: "bold", marginBottom: "2px" }}>{s.label}</div>
              <div style={{ fontSize: "10px", color: COLORS.muted }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "13px", letterSpacing: "3px", color: COLORS.danger, margin: "0 0 4px" }}>SUBJECT-WISE FAILURE COUNT</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
              <XAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 15]} />
              <Tooltip contentStyle={{ background: "#1e1e2e", border: `1px solid ${COLORS.danger}`, borderRadius: "6px", fontSize: "12px" }} />
              <Bar dataKey="failures" name="failures" shape={<CustomBar />} />
              <Bar dataKey="absents" name="absents" shape={<AbsentBar />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
