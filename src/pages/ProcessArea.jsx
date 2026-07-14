import { useState, useEffect, useMemo } from "react";
import axios from "axios";
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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthOptions = [
  { value: 12, label: "December" },
  { value: 11, label: "November" },
  { value: 10, label: "October" },
  { value: 9, label: "September" },
  { value: 8, label: "August" },
  { value: 7, label: "July" },
  { value: 6, label: "June" },
  { value: 5, label: "May" },
  { value: 4, label: "April" },
  { value: 3, label: "March" },
  { value: 2, label: "February" },
  { value: 1, label: "January" },
];

function StatusBadge({ status }) {
  const color =
    status === "Done" || status === "Closed"
      ? "success"
      : status === "In Progress" || status === "In progress"
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
  
  const currentMonthNum = new Date().getMonth() + 1; // 1-12
  const [month, setMonth] = useState(currentMonthNum);
  const [view, setView] = useState("tribe");
  const [openGroups, setOpenGroups] = useState(new Set());
  
  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/process-areas/tasks");
        setProcessData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch process area data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeTab = tabs[tabIndex].key;
  const data = processData ? processData[activeTab] : null;

  const chartData = useMemo(() => {
    if (!data) return [];
    return MONTHS.map((label, i) => {
      const m = data.monthData[i + 1];
      if (!m) return { month: label, Detection: 0, Leakage: 0, Staging: 0, Production: 0 };
      return {
        month: label,
        Detection: m.total ? +((m.staging / m.total) * 100).toFixed(1) : 0,
        Leakage: m.total ? +((m.prod / m.total) * 100).toFixed(1) : 0,
        Staging: m.staging,
        Production: m.prod,
      };
    });
  }, [data]);

  if (loading) return <div style={{ padding: 40, color: "white" }}>Loading Process Areas...</div>;
  if (!processData || !data) return <div style={{ padding: 40, color: "white" }}>Failed to load data.</div>;

  const current = data.monthData[month] || { staging: 0, prod: 0, total: 1 }; // fallback to avoid NaN
  const detectPct = current.total ? ((current.staging / current.total) * 100).toFixed(1) : "0.0";
  const leakPct = current.total ? ((current.prod / current.total) * 100).toFixed(1) : "0.0";
  const monthRows = data.issues.filter((i) => i.month === month);
  const openCount = monthRows.filter((i) => i.status !== "Done" && i.status !== "Closed").length;

  const toggleGroup = (id) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleTabChange = (index) => {
    setTabIndex(index);
    setMonth(currentMonthNum);
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