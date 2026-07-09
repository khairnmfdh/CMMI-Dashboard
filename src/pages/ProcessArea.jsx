import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import styles from "../ProcessArea.module.css";

const tabs = [
  { key: "peer-review", label: "Peer Review" },
  { key: "sqa", label: "SQA" },
  { key: "vv", label: "V&V" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const monthOptions = [
  { value: 6, label: "June 2025" },
  { value: 5, label: "May 2025" },
  { value: 4, label: "April 2025" },
  { value: 3, label: "March 2025" },
  { value: 2, label: "February 2025" },
  { value: 1, label: "January 2025" },
];

function makeMonthData(base) {
  return {
    1: base[0], 2: base[1], 3: base[2], 4: base[3], 5: base[4], 6: base[5],
  };
}

const PROCESS_DATA = {
  "peer-review": {
    title: "Peer Review",
    monthData: makeMonthData([
      { staging: 18, prod: 4, total: 22 },
      { staging: 21, prod: 3, total: 24 },
      { staging: 15, prod: 6, total: 21 },
      { staging: 26, prod: 5, total: 31 },
      { staging: 23, prod: 4, total: 27 },
      { staging: 25, prod: 2, total: 27 },
    ]),
    issues: [
      { id: "PR-101", title: "Missing reviewer sign-off on release branch", project: "Mobile App", tribe: "Platform", created: "2025-06-02", closed: "2025-06-08", status: "Done", month: 6, env: "staging" },
      { id: "PR-102", title: "Review checklist skipped for hotfix", project: "Checkout", tribe: "Commerce", created: "2025-06-03", closed: "", status: "In Progress", month: 6, env: "production" },
      { id: "PR-103", title: "Peer review comments unresolved before merge", project: "Discovery", tribe: "Commerce", created: "2025-06-05", closed: "", status: "To Do", month: 6, env: "staging" },
      { id: "PR-104", title: "Review turnaround exceeded SLA", project: "Notifications", tribe: "Platform", created: "2025-06-07", closed: "2025-06-12", status: "Done", month: 6, env: "staging" },
      { id: "PR-105", title: "No secondary reviewer assigned", project: "Analytics UI", tribe: "Data", created: "2025-06-08", closed: "", status: "To Do", month: 6, env: "staging" },
      { id: "PR-106", title: "Review record missing in tracker", project: "Reports", tribe: "Data", created: "2025-06-09", closed: "", status: "In Progress", month: 6, env: "production" },
      { id: "PR-107", title: "Conflicting review approvals", project: "Mobile App", tribe: "Platform", created: "2025-06-10", closed: "2025-06-15", status: "Done", month: 6, env: "staging" },
      { id: "PR-108", title: "Review bypassed via admin merge", project: "Checkout", tribe: "Commerce", created: "2025-06-11", closed: "", status: "In Progress", month: 6, env: "production" },
    ],
  },
  sqa: {
    title: "Software Quality Assurance (SQA)",
    monthData: makeMonthData([
      { staging: 28, prod: 7, total: 35 },
      { staging: 31, prod: 5, total: 36 },
      { staging: 22, prod: 9, total: 31 },
      { staging: 40, prod: 8, total: 48 },
      { staging: 35, prod: 6, total: 41 },
      { staging: 38, prod: 4, total: 42 },
    ]),
    issues: [
      { id: "ISS-001", title: "Login page crashes on iOS 17", project: "Mobile App", tribe: "Platform", created: "2025-06-02", closed: "2025-06-10", status: "Done", month: 6, env: "staging" },
      { id: "ISS-002", title: "Cart total rounding error", project: "Checkout", tribe: "Commerce", created: "2025-06-03", closed: "", status: "In Progress", month: 6, env: "production" },
      { id: "ISS-003", title: "Search returns empty on filter", project: "Discovery", tribe: "Commerce", created: "2025-06-05", closed: "", status: "To Do", month: 6, env: "staging" },
      { id: "ISS-004", title: "Notification push delay >5min", project: "Notifications", tribe: "Platform", created: "2025-06-07", closed: "2025-06-12", status: "Done", month: 6, env: "staging" },
      { id: "ISS-005", title: "Dashboard chart misaligned", project: "Analytics UI", tribe: "Data", created: "2025-06-08", closed: "", status: "To Do", month: 6, env: "staging" },
      { id: "ISS-006", title: "Export CSV corrupts UTF-8", project: "Reports", tribe: "Data", created: "2025-06-09", closed: "", status: "In Progress", month: 6, env: "production" },
      { id: "ISS-007", title: "Profile photo upload fails >5MB", project: "Mobile App", tribe: "Platform", created: "2025-06-10", closed: "2025-06-15", status: "Done", month: 6, env: "staging" },
      { id: "ISS-008", title: "Payment gateway timeout 30s", project: "Checkout", tribe: "Commerce", created: "2025-06-11", closed: "", status: "In Progress", month: 6, env: "production" },
    ],
  },
  vv: {
    title: "Validation and Verification (V&V)",
    monthData: makeMonthData([
      { staging: 12, prod: 2, total: 14 },
      { staging: 15, prod: 3, total: 18 },
      { staging: 10, prod: 4, total: 14 },
      { staging: 19, prod: 3, total: 22 },
      { staging: 17, prod: 2, total: 19 },
      { staging: 20, prod: 1, total: 21 },
    ]),
    issues: [
      { id: "VV-201", title: "Test case fails on regression suite", project: "Mobile App", tribe: "Platform", created: "2025-06-02", closed: "2025-06-09", status: "Done", month: 6, env: "staging" },
      { id: "VV-202", title: "Validation script skipped in pipeline", project: "Checkout", tribe: "Commerce", created: "2025-06-04", closed: "", status: "In Progress", month: 6, env: "production" },
      { id: "VV-203", title: "Coverage below threshold on module", project: "Discovery", tribe: "Commerce", created: "2025-06-05", closed: "", status: "To Do", month: 6, env: "staging" },
      { id: "VV-204", title: "Verification evidence not attached", project: "Notifications", tribe: "Platform", created: "2025-06-07", closed: "2025-06-13", status: "Done", month: 6, env: "staging" },
      { id: "VV-205", title: "Test environment mismatch", project: "Analytics UI", tribe: "Data", created: "2025-06-08", closed: "", status: "To Do", month: 6, env: "staging" },
      { id: "VV-206", title: "Validation sign-off pending", project: "Reports", tribe: "Data", created: "2025-06-09", closed: "", status: "In Progress", month: 6, env: "production" },
    ],
  },
};

function StatusPill({ status }) {
  const cls =
    status === "Done" ? styles.statusDone :
    status === "In Progress" ? styles.statusInProgress :
    styles.statusTodo;
  return <span className={`${styles.statusPill} ${cls}`}>{status}</span>;
}

function FlatTable({ rows }) {
  if (!rows.length) {
    return <p className={styles.emptyText}>No issues this month.</p>;
  }
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th style={{ width: 80 }}>ID</th>
          <th>Title</th>
          <th style={{ width: 110 }}>Project</th>
          <th style={{ width: 90 }}>Tribe</th>
          <th style={{ width: 90 }}>Created</th>
          <th style={{ width: 90 }}>Closed</th>
          <th style={{ width: 100 }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className={styles.idCell}>{r.id}</td>
            <td className={styles.titleCell} title={r.title}>{r.title}</td>
            <td>{r.project}</td>
            <td>{r.tribe}</td>
            <td>{r.created}</td>
            <td className={styles.mutedCell}>{r.closed || "—"}</td>
            <td><StatusPill status={r.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CollapsibleGroup({ id, icon, label, badge, badgeStyle, count, openGroups, toggleGroup, children }) {
  const isOpen = openGroups.has(id);
  return (
    <div className={styles.tribeGroup}>
      <div className={styles.tribeHeader} onClick={() => toggleGroup(id)}>
        <span className={styles.tribeIcon}>{icon}</span>
        <span className={styles.tribeLabel}>{label}</span>
        {badge && <span className={styles.tribeBadge} style={badgeStyle}>{badge}</span>}
        <span className={styles.tribeCountBadge}>{count} issues</span>
        <span className={`${styles.tribeArrow} ${isOpen ? styles.tribeArrowOpen : ""}`}>›</span>
      </div>
      {isOpen && <div className={styles.tribeBody}>{children}</div>}
    </div>
  );
}

function TribeView({ rows, openGroups, toggleGroup }) {
  const tribes = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      if (!map[r.tribe]) map[r.tribe] = {};
      if (!map[r.tribe][r.project]) map[r.tribe][r.project] = [];
      map[r.tribe][r.project].push(r);
    });
    return map;
  }, [rows]);

  return (
    <>
      {Object.entries(tribes).map(([tribe, projects]) => {
        const allRows = Object.values(projects).flat();
        const id = `tribe_${tribe}`;
        return (
          <CollapsibleGroup
            key={id}
            id={id}
            icon="👥"
            label={tribe}
            count={allRows.length}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
          >
            {Object.entries(projects).map(([proj, prows]) => (
              <div key={proj}>
                <div className={styles.projectSubHeader}>
                  📁 {proj} <span className={styles.mutedCell}>({prows.length})</span>
                </div>
                <FlatTable rows={prows} />
              </div>
            ))}
          </CollapsibleGroup>
        );
      })}
    </>
  );
}

function ProjectView({ rows, openGroups, toggleGroup }) {
  const projects = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      if (!map[r.project]) map[r.project] = { tribe: r.tribe, rows: [] };
      map[r.project].rows.push(r);
    });
    return map;
  }, [rows]);

  return (
    <>
      {Object.entries(projects).map(([proj, data]) => {
        const id = `proj_${proj}`;
        return (
          <CollapsibleGroup
            key={id}
            id={id}
            icon="📁"
            label={proj}
            badge={data.tribe}
            badgeStyle={{ background: "#ECFDF3", color: "#12B76A" }}
            count={data.rows.length}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
          >
            <FlatTable rows={data.rows} />
          </CollapsibleGroup>
        );
      })}
    </>
  );
}

export const ProcessArea = ({ initialTab = "sqa" }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [month, setMonth] = useState(6);
  const [view, setView] = useState("tribe");
  const [openGroups, setOpenGroups] = useState(new Set());

  const data = PROCESS_DATA[activeTab];

  const chartData = useMemo(() => {
    return MONTHS.map((label, i) => {
      const m = data.monthData[i + 1];
      return {
        month: label,
        Detection: +((m.staging / m.total) * 100).toFixed(1),
        Leakage: +((m.prod / m.total) * 100).toFixed(1),
        Staging: m.staging,
        Production: m.prod,
      };
    });
  }, [data]);

  const current = data.monthData[month];
  const detectPct = ((current.staging / current.total) * 100).toFixed(1);
  const leakPct = ((current.prod / current.total) * 100).toFixed(1);
  const monthRows = data.issues.filter((i) => i.month === month);
  const openCount = monthRows.filter((i) => i.status !== "Done").length;

  const toggleGroup = (id) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setMonth(6);
    setView("tribe");
    setOpenGroups(new Set());
  };

  return (
    <div className={styles.processArea}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Process Areas</h1>
        <p className={styles.pageSubtitle}>Monitoring CMMI Process Area</p>
      </div>

      <div className={styles.tabPills}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabPill} ${activeTab === tab.key ? styles.tabPillActive : ""}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.sectionTitleRow}>
        <span className={styles.sectionTitleBar} />
        <h2 className={styles.sectionTitle}>{data.title}</h2>
      </div>

      <div className={styles.topBar}>
        <span />
        <div className={styles.monthSelect}>
          📅
          <select
            className={styles.monthSelectInput}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>🐛 Issue detection %</div>
          <div className={styles.kpiValueDetect}>{detectPct}%</div>
          <div className={styles.kpiSub}>{current.staging} staging / {current.total} total</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>⚠️ Issue leakage %</div>
          <div className={styles.kpiValueLeak}>{leakPct}%</div>
          <div className={styles.kpiSub}>{current.prod} production / {current.total} total</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>📋 Total defects</div>
          <div className={styles.kpiValue}>{current.total}</div>
          <div className={styles.kpiSub}>this month</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>🕐 Open issues</div>
          <div className={styles.kpiValue}>{openCount}</div>
          <div className={styles.kpiSub}>to do + in progress</div>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Monthly trend — detection vs leakage (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="Detection" stroke="#2970FF" strokeDasharray="6 3" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Leakage" stroke="#F04438" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Defects by month — staging vs production</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="Staging" fill="#2970FF" radius={[3, 3, 0, 0]} barSize={16} />
              <Bar dataKey="Production" fill="#F04438" radius={[3, 3, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeading}>📋 Issue list</h2>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.vbtn} ${view === "tribe" ? styles.vbtnActive : ""}`}
              onClick={() => setView("tribe")}
            >
              By tribe
            </button>
            <button
              className={`${styles.vbtn} ${view === "project" ? styles.vbtnActive : ""}`}
              onClick={() => setView("project")}
            >
              By project
            </button>
            <button
              className={`${styles.vbtn} ${view === "all" ? styles.vbtnActive : ""}`}
              onClick={() => setView("all")}
            >
              All
            </button>
          </div>
        </div>

        {monthRows.length === 0 ? (
          <p className={styles.emptyText}>No issues for this month.</p>
        ) : view === "tribe" ? (
          <TribeView rows={monthRows} openGroups={openGroups} toggleGroup={toggleGroup} />
        ) : view === "project" ? (
          <ProjectView rows={monthRows} openGroups={openGroups} toggleGroup={toggleGroup} />
        ) : (
          <FlatTable rows={monthRows} />
        )}
      </div>
    </div>
  );
};

export default ProcessArea;