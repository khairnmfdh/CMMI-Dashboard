import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  Table,
  Badge,
} from "@legion-ui-kit/react-core";
import styles from "../Reports.module.css";

function StatusBadge({ status }) {
  let bgColor, textColor;
  if (status === "Done" || status === "Closed") {
    bgColor = "rgba(16, 185, 129, 0.15)";
    textColor = "#059669";
  } else if (status === "In Progress" || status === "In progress") {
    bgColor = "rgba(59, 130, 246, 0.15)";
    textColor = "#2563eb";
  } else {
    bgColor = "rgba(245, 158, 11, 0.15)";
    textColor = "#d97706";
  }

  return (
    <span
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "6px 12px",
        borderRadius: "99px",
        fontSize: "12px",
        fontWeight: "700",
        whiteSpace: "nowrap",
        display: "inline-block",
        lineHeight: "1",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
      }}
    >
      {status}
    </span>
  );
}

export const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/reports/analytics");
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div style={{ padding: 40, color: "white" }}>Loading Reports...</div>;
  if (!data) return <div style={{ padding: 40, color: "white" }}>Failed to load data.</div>;

  const statCards = [
    { label: "Total Issues", value: data.total_issues, sub: "Overall Issues" },
    { label: "Resolved", value: data.resolved, sub: `${data.resolved}/${data.total_issues || 1} issues resolved` },
    { label: "In Progress", value: data.in_progress, sub: `${data.in_progress}/${data.total_issues || 1} issues in progress` },
    { label: "To-Do", value: data.to_do, sub: `${data.to_do}/${data.total_issues || 1} issues to-do` },
  ];

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className={styles.reports}>
      {/* Print-only header */}
      <div className={styles.printHeader}>
        <Text as="h2">CMMI Report — All Projects</Text>
        <Text as="p" color="tertiary">
          Generated {new Date().toLocaleDateString()}
        </Text>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterLeft}>
           <Text as="h3" variant="heading">Overview Analytics</Text>
        </div>
        <Button color="primary" variant="solid" onClick={handleDownloadPdf}>
          ⬇ Download PDF
        </Button>
      </div>

      <div className={styles.statsRow}>
        {statCards.map((stat) => (
          <Card key={stat.label} className={styles.statCard} elevation="none">
            <Text as="p" color="white" className={styles.statLabel}>{stat.label}</Text>
            <Text as="h2" color="white" className={styles.statValue}>{stat.value}</Text>
            <Text as="p" color="white" className={styles.statSub}>{stat.sub}</Text>
          </Card>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader title="Monthly Issues - Open vs Closed" noDivider />
          <CardBody>
            {isPrinting ? (
              <BarChart width={740} height={260} data={data.issues_chart_data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} stroke="var(--border-main)" />
                <YAxis
                  tickFormatter={(v) => `${v}`}
                  tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
                  stroke="var(--border-main)"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-glass)", color: "var(--text-primary)", borderRadius: "8px", backdropFilter: "blur(10px)" }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
                />
                <Bar dataKey="Open" fill="#12B76A" radius={[4, 4, 0, 0]} barSize={26} isAnimationActive={false} />
                <Bar dataKey="Closed" fill="#F04438" radius={[4, 4, 0, 0]} barSize={26} isAnimationActive={false} />
              </BarChart>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.issues_chart_data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} stroke="var(--border-main)" />
                  <YAxis
                    tickFormatter={(v) => `${v}`}
                    tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
                    stroke="var(--border-main)"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-glass)", color: "var(--text-primary)", borderRadius: "8px", backdropFilter: "blur(10px)" }}
                    itemStyle={{ color: "var(--text-primary)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
                  />
                  <Bar dataKey="Open" fill="#12B76A" radius={[4, 4, 0, 0]} barSize={26} />
                  <Bar dataKey="Closed" fill="#F04438" radius={[4, 4, 0, 0]} barSize={26} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader title="Monthly Score Trend by Process Area" noDivider />
          <CardBody>
            {isPrinting ? (
              <LineChart width={740} height={260} data={data.score_trend_data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} stroke="var(--border-main)" />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} stroke="var(--border-main)" />
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-glass)", color: "var(--text-primary)", borderRadius: "8px", backdropFilter: "blur(10px)" }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
                />
                <Line type="monotone" dataKey="PR" stroke="#12B76A" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="PQA" stroke="#875BF7" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="VV" stroke="#F04478" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.score_trend_data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} stroke="var(--border-main)" />
                  <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} stroke="var(--border-main)" />
                  <Tooltip
                    formatter={(v) => `${v}%`}
                    contentStyle={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-glass)", color: "var(--text-primary)", borderRadius: "8px", backdropFilter: "blur(10px)" }}
                    itemStyle={{ color: "var(--text-primary)" }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="plainline"
                    formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
                  />
                  <Line type="monotone" dataKey="PR" stroke="#12B76A" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="PQA" stroke="#875BF7" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="VV" stroke="#F04478" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      <Card bordered elevation="elevation-1" className={styles.tablePanel}>
        <CardHeader title="Issues List Preview" noDivider />
        <CardBody>
          {data.issues_preview.length === 0 ? (
            <Text as="p" color="tertiary">No issues match the selected filters.</Text>
          ) : (
            <Table borderCell="row" hoverable className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>AREAS</th>
                  <th>PROJECT</th>
                  <th>TITLE</th>
                  <th>STATUS</th>
                  <th>CREATED</th>
                  <th>CLOSED</th>
                </tr>
              </thead>
              <tbody>
                {data.issues_preview.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.idCell}>{row.id}</td>
                    <td>{row.area}</td>
                    <td>{row.project}</td>
                    <td>{row.title}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>{row.created}</td>
                    <td>{row.closed || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Reports;
