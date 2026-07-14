import { useState, useMemo } from "react";
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
  Select,
  Button,
  Table,
  Badge,
} from "@legion-ui-kit/react-core";
import styles from "../Reports.module.css";

const projectOptions = [
  { label: "All Projects", value: "all" },
  { label: "NETMONK", value: "netmonk" },
  { label: "PaDi UMKM", value: "padi" },
  { label: "Legion AI", value: "legion-ai" },
];
const monthOptions = [
  { label: "July 2026", value: "2026-07" },
  { label: "June 2026", value: "2026-06" },
  { label: "May 2026", value: "2026-05" },
];

const allIssues = [
  {
    id: "PR-1.1",
    area: "pr",
    project: "netmonk",
    title: "Auth module Review",
    status: "Done",
    created: "2026-07-02",
    closed: "2026-07-05",
    month: "2026-07",
  },
  {
    id: "PR-1.2",
    area: "pr",
    project: "padi",
    title: "Cart calculation logic review",
    status: "In Progress",
    created: "2026-07-03",
    closed: null,
    month: "2026-07",
  },
  {
    id: "SQA-1.1",
    area: "sqa",
    project: "legion-ai",
    title: "Functional test - logic flow",
    status: "Done",
    created: "2026-07-01",
    closed: "2026-07-04",
    month: "2026-07",
  },
  {
    id: "VV-1.1",
    area: "vv",
    project: "netmonk",
    title: "Regression suite validation",
    status: "To-Do",
    created: "2026-07-06",
    closed: null,
    month: "2026-07",
  },
  {
    id: "PR-2.1",
    area: "pr",
    project: "legion-ai",
    title: "API contract review",
    status: "Done",
    created: "2026-06-10",
    closed: "2026-06-14",
    month: "2026-06",
  },
  {
    id: "SQA-2.1",
    area: "sqa",
    project: "padi",
    title: "Static analysis sweep",
    status: "In Progress",
    created: "2026-06-12",
    closed: null,
    month: "2026-06",
  },
  {
    id: "VV-2.1",
    area: "vv",
    project: "padi",
    title: "Load test validation",
    status: "Done",
    created: "2026-06-15",
    closed: "2026-06-20",
    month: "2026-06",
  },
  {
    id: "PR-3.1",
    area: "pr",
    project: "netmonk",
    title: "Payment flow review",
    status: "Done",
    created: "2026-05-05",
    closed: "2026-05-09",
    month: "2026-05",
  },
  {
    id: "SQA-3.1",
    area: "sqa",
    project: "legion-ai",
    title: "Unit test coverage audit",
    status: "To-Do",
    created: "2026-05-08",
    closed: null,
    month: "2026-05",
  },
  {
    id: "VV-3.1",
    area: "vv",
    project: "legion-ai",
    title: "Integration test pass",
    status: "Done",
    created: "2026-05-11",
    closed: "2026-05-16",
    month: "2026-05",
  },
];

const projectLabelMap = {
  netmonk: "Netmonk",
  padi: "PaDi UMKM",
  "legion-ai": "LegionAI",
};
const areaLabelMap = { pr: "Peer Review", sqa: "SQA", vv: "V&V" };

function StatusBadge({ status }) {
  return (
    <Badge
      color={
        status === "Done"
          ? "success"
          : status === "In Progress"
            ? "information"
            : "warning"
      }
      label={status}
    />
  );
}

export const Reports = () => {
  const [project, setProject] = useState("all");
  const [month, setMonth] = useState("2026-07");

  const filteredIssues = useMemo(() => {
    return allIssues.filter((issue) => {
      const matchProject = project === "all" || issue.project === project;
      const matchMonth = issue.month === month;
      return matchProject && matchMonth;
    });
  }, [project, month]);

  const statCards = useMemo(() => {
    const total = filteredIssues.length;
    const resolved = filteredIssues.filter((i) => i.status === "Done").length;
    const inProgress = filteredIssues.filter(
      (i) => i.status === "In Progress",
    ).length;
    const todo = filteredIssues.filter((i) => i.status === "To-Do").length;
    return [
      {
        label: "Total Issues",
        value: total,
        sub: "Overall CMMI Score · Level 3",
      },
      {
        label: "Resolved",
        value: resolved,
        sub: `${resolved}/${total || 1} practices met`,
      },
      {
        label: "In Progress",
        value: inProgress,
        sub: `${inProgress}/${total || 1} practices met`,
      },
      {
        label: "To-Do",
        value: todo,
        sub: `${todo}/${total || 1} practices met`,
      },
    ];
  }, [filteredIssues]);

  const issuesChartData = useMemo(() => {
    const scopedIssues = allIssues.filter(
      (issue) => project === "all" || issue.project === project,
    );
    const monthOrder = ["2026-05", "2026-06", "2026-07"];
    const monthLabels = {
      "2026-05": "May",
      "2026-06": "Jun",
      "2026-07": "Jul",
    };
    return monthOrder.map((m) => {
      const monthIssues = scopedIssues.filter((i) => i.month === m);
      const open = monthIssues.filter((i) => i.status !== "Done").length;
      const closed = monthIssues.filter((i) => i.status === "Done").length;
      return {
        month: monthLabels[m],
        Open: open * 5000 + 3000,
        Closed: closed * 5000 + 3000,
      };
    });
  }, [project]);

  const scoreTrendData = useMemo(() => {
    const scopedIssues = allIssues.filter(
      (issue) => project === "all" || issue.project === project,
    );
    const monthOrder = ["2026-05", "2026-06", "2026-07"];
    const monthLabels = {
      "2026-05": "MAY",
      "2026-06": "JUN",
      "2026-07": "JUL",
    };
    return monthOrder.map((m) => {
      const monthIssues = scopedIssues.filter((i) => i.month === m);
      const pctFor = (areaCode) => {
        const areaIssues = monthIssues.filter((i) => i.area === areaCode);
        if (areaIssues.length === 0) return 0;
        const done = areaIssues.filter((i) => i.status === "Done").length;
        return Math.round((done / areaIssues.length) * 100);
      };
      return {
        month: monthLabels[m],
        PR: pctFor("pr"),
        PQA: pctFor("sqa"),
        VV: pctFor("vv"),
      };
    });
  }, [project]);

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className={styles.reports}>
      {/* Print-only header, replaces the hidden filter row so the PDF has context */}
      <div className={styles.printHeader}>
        <Text as="h2">
          CMMI Report — {projectOptions.find((p) => p.value === project)?.label}
        </Text>
        <Text as="p" color="tertiary">
          {monthOptions.find((m) => m.value === month)?.label} · Generated{" "}
          {new Date().toLocaleDateString()}
        </Text>
      </div>
      <div className={styles.filterRow}>
        <div className={styles.filterLeft}>
          <Select
            options={projectOptions}
            value={project}
            onChange={setProject}
            inputWrapperClassName={styles.filterSelectWrapper}
            inputClassName={styles.filterSelectInput}
          />
          <Select
            options={monthOptions}
            value={month}
            onChange={setMonth}
            inputWrapperClassName={styles.filterSelectWrapper}
            inputClassName={styles.filterSelectInput}
          />
        </div>

        <Button color="primary" variant="solid" onClick={handleDownloadPdf}>
          ⬇ Download PDF
        </Button>
      </div>

      <div className={styles.statsRow}>
        {statCards.map((stat) => (
          <Card key={stat.label} className={styles.statCard} elevation="none">
            <Text as="p" color="white" className={styles.statLabel}>
              {stat.label}
            </Text>
            <Text as="h2" color="white" className={styles.statValue}>
              {stat.value}
            </Text>
            <Text as="p" color="white" className={styles.statSub}>
              {stat.sub}
            </Text>
          </Card>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader title="Monthly Issues - Open vs Closed" noDivider />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={issuesChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(v) => `${v / 1000}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => (
                    <span className={styles.legendLabel}>{value}</span>
                  )}
                />
                <Bar
                  dataKey="Open"
                  fill="#12B76A"
                  radius={[4, 4, 0, 0]}
                  barSize={26}
                />
                <Bar
                  dataKey="Closed"
                  fill="#F04438"
                  radius={[4, 4, 0, 0]}
                  barSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader title="Monthly Score Trend by Process Area" noDivider />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={scoreTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  formatter={(value) => (
                    <span className={styles.legendLabel}>{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="PR"
                  stroke="#12B76A"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="PQA"
                  stroke="#875BF7"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="VV"
                  stroke="#F04478"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card bordered elevation="elevation-1" className={styles.tablePanel}>
        <CardHeader title="Issues List Preview" noDivider />
        <CardBody>
          {filteredIssues.length === 0 ? (
            <Text as="p" color="tertiary">
              No issues match the selected filters.
            </Text>
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
                {filteredIssues.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.idCell}>{row.id}</td>
                    <td>{areaLabelMap[row.area]}</td>
                    <td>{projectLabelMap[row.project]}</td>
                    <td>{row.title}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>{row.created}</td>
                    <td>{row.closed ?? "—"}</td>
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
