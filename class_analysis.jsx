import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";

const subjectData = [
  { subject: "AIT362", failures: 5, absents: 1, passing: 24, total: 30, avg: 34.2 },
  { subject: "CDT304", failures: 7, absents: 4, passing: 19, total: 30, avg: 29.1 },
  { subject: "CDT308", failures: 4, absents: 3, passing: 23, total: 30, avg: 33.4 },
  { subject: "CST302", failures: 10, absents: 3, passing: 17, total: 30, avg: 28.3 },
  { subject: "CST306", failures: 12, absents: 0, passing: 18, total: 30, avg: 24.6 },
  { subject: "HUT300", failures: 1, absents: 3, passing: 26, total: 27, avg: 31.2 },
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

const CustomBar = ({ x, y, width, height, value }) => {
  const pct = (value / 30) * 100;
  const fill = pct > 40 ? "#ef4444" : pct > 25 ? "#f59e0b" : "#22c55e";
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />;
};

const AbsentBar = ({ x, y, width, height }) => (
  <rect x={x} y={y} width={width} height={height} fill="#7c3aed" rx={4} />
);

export default function ClassDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalAbsents = subjectData.reduce((a, b) => a + b.absents, 0);
  const totalFailInstances = subjectData.reduce((a, b) => a + b.failures, 0);
  const worstSubject = subjectData.reduce((a, b) => (a.failures > b.failures ? a : b));
  const classRiskPct = Math.round(((7 + 3) / 30) * 100);

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      background: COLORS.bg,
      minHeight: "100vh",
      color: COLORS.text,
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a0000 0%, #0a0a0f 60%)",
        borderBottom: "2px solid #ef4444",
        padding: "28px 32px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: "300px", height: "100%",
          background: "radial-gradient(ellipse at top right, rgba(239,68,68,0.15) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <span style={{ fontSize: "22px" }}>⚠️</span>
          <span style={{ color: "#ef4444", fontSize: "11px", letterSpacing: "4px", fontWeight: "bold" }}>
            INTERNAL MARKS — CLASS PERFORMANCE REPORT
          </span>
        </div>
        <h1 style={{
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: "bold",
          color: "#fff",
          margin: "0 0 4px",
          letterSpacing: "-1px"
        }}>
          Wake Up, <span style={{ color: "#ef4444" }}>Batch.</span>
        </h1>
        <p style={{ color: COLORS.muted, fontSize: "13px", margin: 0 }}>
          Report taken: 26-02-2026 · 30 students · 6 subjects
        </p>
      </div>

      <div style={{ padding: "24px 20px", maxWidth: "900px", margin: "0 auto" }}>

        {/* Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Fail Instances", value: totalFailInstances, sub: "across all 6 subjects", color: "#ef4444", icon: "❌" },
            { label: "Students at Risk", value: `${classRiskPct}%`, sub: "failing 3+ subjects", color: "#ef4444", icon: "🚨" },
            { label: "Absences Logged", value: totalAbsents, sub: "across all subjects", color: "#7c3aed", icon: "🔴" },
            { label: "Worst Subject", value: worstSubject.subject, sub: `${worstSubject.failures} students failing`, color: "#f59e0b", icon: "📉" },
          ].map((s, i) => (
            <div key={i} style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderLeft: `3px solid ${s.color}`,
              borderRadius: "8px",
              padding: "16px",
            }}>
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
              <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "bold", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: COLORS.text, fontWeight: "bold", marginBottom: "2px" }}>{s.label}</div>
              <div style={{ fontSize: "10px", color: COLORS.muted }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Failures per Subject */}
        <div style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}>
          <h2 style={{ fontSize: "13px", letterSpacing: "3px", color: "#ef4444", margin: "0 0 4px" }}>
            SUBJECT-WISE FAILURE COUNT
          </h2>
          <p style={{ fontSize: "11px", color: COLORS.muted, margin: "0 0 20px" }}>
            Students scoring below passing threshold (out of 30 total)
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
              <XAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 15]} />
              <Tooltip
                contentStyle={{ background: "#1e1e2e", border: "1px solid #ef4444", borderRadius: "6px", fontSize: "12px" }}
                labelStyle={{ color: "#fff" }}
                formatter={(val, name) => [val + " students", name === "failures" ? "Failing" : "Absent"]}
              />
              <Bar dataKey="failures" name="failures" shape={<CustomBar />} />
              <Bar dataKey="absents" name="absents" shape={<AbsentBar />} />
              <Legend
                formatter={(val) => <span style={{ color: COLORS.muted, fontSize: "11px" }}>
                  {val === "failures" ? "🔴 Failing" : "🟣 Absents"}
                </span>}
              />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
            {[["< 30%", "#22c55e", "OK"], ["30–40%", "#f59e0b", "Concerning"], ["> 40%", "#ef4444", "Critical"]].map(([r, c, l]) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", background: c, borderRadius: "2px" }} />
                <span style={{ fontSize: "10px", color: COLORS.muted }}>{r} fail rate — {l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Risk Distribution */}
        <div style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}>
          <h2 style={{ fontSize: "13px", letterSpacing: "3px", color: "#f59e0b", margin: "0 0 4px" }}>
            STUDENT RISK DISTRIBUTION
          </h2>
          <p style={{ fontSize: "11px", color: COLORS.muted, margin: "0 0 20px" }}>Where does your class stand right now?</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {riskBuckets.map((b) => (
              <div key={b.label} style={{
                flex: "1 1 140px",
                background: `${b.color}12`,
                border: `1px solid ${b.color}40`,
                borderTop: `3px solid ${b.color}`,
                borderRadius: "8px",
                padding: "14px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "32px", fontWeight: "900", color: b.color }}>{b.count}</div>
                <div style={{ fontSize: "11px", fontWeight: "bold", color: COLORS.text, marginBottom: "4px" }}>{b.label}</div>
                <div style={{ fontSize: "10px", color: COLORS.muted }}>{b.desc}</div>
                <div style={{ marginTop: "10px", background: "#ffffff10", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${(b.count / 30) * 100}%`, height: "100%", background: b.color, borderRadius: "4px" }} />
                </div>
                <div style={{ fontSize: "10px", color: b.color, marginTop: "4px" }}>{Math.round((b.count / 30) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar: Class average vs threshold */}
        <div style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
        }}>
          <h2 style={{ fontSize: "13px", letterSpacing: "3px", color: "#7c3aed", margin: "0 0 4px" }}>
            CLASS AVERAGE vs MINIMUM THRESHOLD
          </h2>
          <p style={{ fontSize: "11px", color: COLORS.muted, margin: "0 0 8px" }}>
            Scores normalized to 100. The red boundary is the passing threshold.
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e1e2e" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
              <Radar name="Class Avg %" dataKey="classAvg" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Pass Threshold" dataKey="threshold" stroke="#ef4444" fill="transparent" strokeWidth={1.5} strokeDasharray="4 3" />
              <Legend formatter={(val) => <span style={{ color: COLORS.muted, fontSize: "11px" }}>{val}</span>} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{
            background: "#ef444412",
            border: "1px solid #ef444430",
            borderRadius: "6px",
            padding: "10px 14px",
            marginTop: "8px",
            fontSize: "12px",
            color: "#fca5a5",
          }}>
            🚨 <strong>CST306</strong> class average dips <strong>below the passing threshold</strong> — over 40% of students are failing this subject.
          </div>
        </div>

        {/* Wake-up call */}
        <div style={{
          background: "linear-gradient(135deg, #1a0000, #0a0a0f)",
          border: "1px solid #ef444450",
          borderRadius: "10px",
          padding: "22px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>⏰</div>
          <h3 style={{ color: "#ef4444", fontSize: "16px", letterSpacing: "2px", margin: "0 0 8px" }}>
            THE NUMBERS DON'T LIE
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.7", margin: "0 0 14px" }}>
            <strong style={{ color: "#fff" }}>70% of the class</strong> is either failing at least one subject, sitting with dangerously low scores, or has missed exams entirely.
            <br />
            Exams are around the corner. <strong style={{ color: "#ef4444" }}>Now</strong> is the time to act.
          </p>
          <div style={{
            display: "inline-block",
            background: "#ef4444",
            color: "#fff",
            padding: "8px 24px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "bold",
            letterSpacing: "2px",
          }}>
            PRIORITIZE · STUDY · PASS
          </div>
        </div>

      </div>
    </div>
  );
}
