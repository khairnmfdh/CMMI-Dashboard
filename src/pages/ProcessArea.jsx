import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  TabList,
  Tab,
  Accordion,
} from "@legion-ui-kit/react-core";
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
    1: base[0],
    2: base[1],
    3: base[2],
    4: base[3],
    5: base[4],
    6: base[5],
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
      { id: "PR-101", title: "Missing reviewer sign-off on release branch", project: "Mobile App", tribe: "Platform", created: "2025-06-02", closed: "2025-06-08", status: "Done", month: 6 },
      { id: "PR-102", title: "Review checklist skipped for hotfix", project: "Checkout", tribe: "Commerce", created: "2025-06-03", closed: "", status: "In Progress", month: 6 },
      { id: "PR-103", title: "Peer review comments unresolved before merge", project: "Discovery", tribe: "Commerce", created: "2025-06-05", closed: "", status: "To Do", month: 6 },
      { id: "PR-104", title: "Review turnaround exceeded SLA", project: "Notifications", tribe: "Platform", created: "2025-06-07", closed: "2025-06-12", status: "Done", month: 6 },
      { id: "PR-105", title: "No secondary reviewer assigned", project: "Analytics UI", tribe: "Data", created: "2025-06-08", closed: "", status: "To Do", month: 6 },
      { id: "PR-106", title: "Review record missing in tracker", project: "Reports", tribe: "Data", created: "2025-06-09", closed: "", status: "In Progress", month: 6 },
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
      { id: "ISS-001", title: "Login page crashes on iOS 17", project: "Mobile App", tribe: "Platform", created: "2025-06-02", closed: "2025-06-10", status: "Done", month: 6 },
      { id: "ISS-002", title: "Cart total rounding error", project: "Checkout", tribe: "Commerce", created: "2025-06-03", closed: "", status: "In Progress", month: 6 },
      { id: "ISS-003", title: "Search returns empty on filter", project: "Discovery", tribe: "Commerce", created: "2025-06-05", closed: "", status: "To Do", month: 6 },
      { id: "ISS-004", title: "Notification push delay >5min", project: "Notifications", tribe: "Platform", created: "2025-06-07", closed: "2025-06-12", status: "Done", month: 6 },
      { id: "ISS-005", title: "Dashboard chart misaligned", project: "Analytics UI", tribe: "Data", created: "2025-06-08", closed: "", status: "To Do", month: 6 },
      { id: "ISS-006", title: "Export CSV corrupts UTF-8", project: "Reports", tribe: "Data", created: "2025-06-09", closed: "", status: "In Progress", month: 6 },
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
      { id: "VV-201", title: "Test case fails on regression suite", project: "Mobile App", tribe: "Platform", created: "2025-06-02", closed: "2025-06-09", status: "Done", month: 6 },
      { id: "VV-202", title: "Validation script skipped in pipeline", project: "Checkout", tribe: "Commerce", created: "2025-06-04", closed: "", status: "In Progress", month: 6 },
      { id: "VV-203", title: "Coverage below threshold on module", project: "Discovery", tribe: "Commerce", created: "2025-06-05", closed: "", status: "To Do", month: 6 },
      { id: "VV-204", title: "Verification evidence not attached", project: "Notifications", tribe: "Platform", created: "2025-06-07", closed: "2025-06-13", status: "Done", month: 6 },
    ],
  },
};

function StatusBadge({ status }) {
  const color =
    status === "Done"
      ? "success"
      : status === "In Progress"
        ? "information"
        : "secondary";
  return <Badge color={color} label={status} />;
}

function FlatTable({ rows }) {
  if (!rows.length)
    return (
      <Text as="p" color="tertiary">
        No issues this month.
      </Text>
    );
  return (
    <Table borderCell="row" hoverable className={styles.table}>
      <thead>
        <tr>
          <th style={{ width: 80 }}>ID</th>
          <th>Title</th>
          <th style={{ width: 110 }}>Project</th>
          <th style={{ width: 90 }}>Tribe</th>
          <th style={{ width: 90 }}>Created</th>
          <th style={{ width: 90 }}>Closed</th>
          <th style={{ width: 110 }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className={styles.idCell}>{r.id}</td>
            <td className={styles.titleCell} title={r.title}>
              {r.title}
            </td>
            <td>{r.project}</td>
            <td>{r.tribe}</td>
            <td>{r.created}</td>
            <td className={styles.mutedCell}>{r.closed || "—"}</td>
            <td>
              <StatusBadge status={r.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function GroupedView({ rows, groupBy, openGroups, toggleGroup }) {
  const groups = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      const key = r[groupBy];
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [rows, groupBy]);

  return (
    <>
      {Object.entries(groups).map(([key, groupRows]) => (
        <Accordion
          key={key}
          isOpen={openGroups.has(key)}
          onClick={() => toggleGroup(key)}
          toggleIcon="chevron-arrow"
          title={
            <div className={styles.accordionTitle}>
              <span>
                {groupBy === "tribe" ? "👥" : "📁"} {key}
              </span>
              <Badge color="secondary" label={`${groupRows.length} issues`} />
            </div>
          }
        >
          <FlatTable rows={groupRows} />
        </Accordion>
      ))}
    </>
  );
}

export const ProcessArea = ({ initialTab = "sqa" }) => {
  const activeIndex = tabs.findIndex((t) => t.key === initialTab);
  const [tabIndex, setTabIndex] = useState(
    activeIndex === -1 ? 1 : activeIndex,
  );
  const [month, setMonth] = useState(6);
  const [view, setView] = useState("tribe");
  const [openGroups, setOpenGroups] = useState(new Set());

  const activeTab = tabs[tabIndex].key;
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
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleTabChange = (index) => {
    setTabIndex(index);
    setMonth(6);
    setView("tribe");
    setOpenGroups(new Set());
  };

  return (
    <div className={styles.processArea}>
      <div className={styles.pageHeader}>
        <Text as="h1" variant="title">
          Process Areas
        </Text>
        <Text as="p" color="tertiary">
          Monitoring CMMI Process Area
        </Text>
      </div>

      <TabList
        activeTab={tabIndex}
        onChange={handleTabChange}
        className={styles.tabList}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            className={styles.tab}
            activeClassName={styles.tabActive}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <div className={styles.sectionTitleRow}>
        <span className={styles.sectionTitleBar} />
        <Text as="h2" variant="heading">
          {data.title}
        </Text>
      </div>

      <div className={styles.topBar}>
        <span />
        <Select
          options={monthOptions}
          value={month}
          onChange={(v) => setMonth(Number(v))}
          inputWrapperClassName={styles.monthSelectWrapper}
          inputClassName={styles.monthSelectInput}
        />
      </div>

      <div className={styles.kpiRow}>
        <Card bordered elevation="none" className={styles.kpiCard}>
          <Text as="p" className={styles.kpiLabel}>
            🐛 Issue detection %
          </Text>
          <Text as="h2" className={styles.kpiValueDetect}>
            {detectPct}%
          </Text>
          <Text as="p" className={styles.kpiSub}>
            {current.staging} staging / {current.total} total
          </Text>
        </Card>
        <Card bordered elevation="none" className={styles.kpiCard}>
          <Text as="p" className={styles.kpiLabel}>
            ⚠️ Issue leakage %
          </Text>
          <Text as="h2" className={styles.kpiValueLeak}>
            {leakPct}%
          </Text>
          <Text as="p" className={styles.kpiSub}>
            {current.prod} production / {current.total} total
          </Text>
        </Card>
        <Card bordered elevation="none" className={styles.kpiCard}>
          <Text as="p" className={styles.kpiLabel}>
            📋 Total defects
          </Text>
          <Text as="h2" className={styles.kpiValue}>
            {current.total}
          </Text>
          <Text as="p" className={styles.kpiSub}>
            this month
          </Text>
        </Card>
        <Card bordered elevation="none" className={styles.kpiCard}>
          <Text as="p" className={styles.kpiLabel}>
            🕐 Open issues
          </Text>
          <Text as="h2" className={styles.kpiValue}>
            {openCount}
          </Text>
          <Text as="p" className={styles.kpiSub}>
            to do + in progress
          </Text>
        </Card>
      </div>

      <div className={styles.chartsRow}>
        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader
            title="Monthly trend — detection vs leakage (%)"
            noDivider
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11 }}
                  domain={[0, 100]}
                />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line
                  type="monotone"
                  dataKey="Detection"
                  stroke="#2970FF"
                  strokeDasharray="6 3"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Leakage"
                  stroke="#F04438"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader
            title="Defects by month — staging vs production"
            noDivider
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar
                  dataKey="Staging"
                  fill="#2970FF"
                  radius={[3, 3, 0, 0]}
                  barSize={16}
                />
                <Bar
                  dataKey="Production"
                  fill="#F04438"
                  radius={[3, 3, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card bordered elevation="elevation-1" className={styles.listCard}>
        <CardHeader title="📋 Issue list" noDivider />
        <CardBody>
          <div className={styles.viewToggleRow}>
            <Button
              size="sm"
              variant={view === "tribe" ? "solid" : "outline"}
              color="primary"
              onClick={() => setView("tribe")}
            >
              By tribe
            </Button>
            <Button
              size="sm"
              variant={view === "project" ? "solid" : "outline"}
              color="primary"
              onClick={() => setView("project")}
            >
              By project
            </Button>
            <Button
              size="sm"
              variant={view === "all" ? "solid" : "outline"}
              color="primary"
              onClick={() => setView("all")}
            >
              All
            </Button>
          </div>

          {monthRows.length === 0 ? (
            <Text as="p" color="tertiary">
              No issues for this month.
            </Text>
          ) : view === "tribe" ? (
            <GroupedView
              rows={monthRows}
              groupBy="tribe"
              openGroups={openGroups}
              toggleGroup={toggleGroup}
            />
          ) : view === "project" ? (
            <GroupedView
              rows={monthRows}
              groupBy="project"
              openGroups={openGroups}
              toggleGroup={toggleGroup}
            />
          ) : (
            <FlatTable rows={monthRows} />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProcessArea;