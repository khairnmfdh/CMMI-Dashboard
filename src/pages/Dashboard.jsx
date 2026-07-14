import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Card,
  Text,
  ProgressBar,
  Divider,
  Select,
} from "@legion-ui-kit/react-core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import styles from "../Dashboard.module.css";

// ─── Data ─────────────────────────────────────────────────────────────────────

const processAreaOptions = [
  { label: "All Process Area", value: "all" },
  { label: "Peer Review", value: "peer-review" },
  { label: "Process QA", value: "pqa" },
  { label: "Verification & Validation", value: "vv" },
];

const WEAKNESS_COLORS = ["#4F46E5", "#6366F1", "#818CF8"];
const PROJECT_NAMES = ["Netmonk", "PaDi UMKM", "Legion AI"];
const PROJECT_WEIGHTS = [1 / 2, 2 / 7, 3 / 14];

function splitByProject(total) {
  const raw = PROJECT_WEIGHTS.map((w) => total * w);
  const floors = raw.map(Math.floor);
  const used = floors.reduce((a, b) => a + b, 0);
  let remainder = total - used;

  const order = raw
    .map((r, i) => ({ i, frac: r - floors[i] }))
    .sort((a, b) => b.frac - a.frac);

  const result = [...floors];
  for (let k = 0; k < remainder; k++) {
    result[order[k].i] += 1;
  }
  return result; // [netmonkCount, padiCount, legionCount]
}

function niceMax(value) {
  if (value <= 10) return Math.ceil(value / 2) * 2 || 2;
  if (value <= 25) return Math.ceil(value / 5) * 5;
  return Math.ceil(value / 10) * 10;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const Dashboard = () => {
  const [selectedArea, setSelectedArea] = useState("all");
  const [data, setData] = useState(null);
  const [chartGroups, setChartGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, chartRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/dashboard/cmmi-summary"),
          axios.get("http://localhost:8080/api/v1/artifacts/review-progress")
        ]);
        setData(summaryRes.data.data);
        setChartGroups(chartRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute derived state for charts using useMemo based on chartGroups
  const practiceStatusData = useMemo(() => {
    if (!chartGroups.length) return [];
    return chartGroups.map((g) => ({
      name: g.tribe,
      Achieved: g.approved,
      Partial: g.pending,
      NotAchieved: g.rejected,
    }));
  }, [chartGroups]);

  const weaknessData = useMemo(() => {
    if (!chartGroups.length) return [];
    return chartGroups.map((g) => ({
      name: g.tribe,
      value: g.rejected,
    }));
  }, [chartGroups]);

  const practiceMax = niceMax(
    Math.max(...practiceStatusData.flatMap((d) => [d.Achieved, d.Partial, d.NotAchieved]), 1)
  );
  const weaknessMax = niceMax(Math.max(...weaknessData.map((d) => d.value), 1));
  const weaknessStep = weaknessMax <= 10 ? 2 : weaknessMax <= 25 ? 5 : 10;
  const weaknessTicks = Array.from(
    { length: Math.floor(weaknessMax / weaknessStep) + 1 },
    (_, i) => i * weaknessStep
  );

  if (loading) return <div style={{ padding: 40, color: "white" }}>Loading Dashboard...</div>;
  if (!data) return <div style={{ padding: 40, color: "white" }}>Failed to load data.</div>;

  // Map API response to UI structures
  const statCards = [
    { label: "Overall CMMI Score", value: `${data.overall_score}%`, sub: `Overall CMMI Score · Level ${data.overall_level}` },
    ...data.process_areas.map(pa => ({
      label: pa.name.split(' (')[0], // e.g. "Peer Review"
      value: `${pa.score}%`,
      sub: `${pa.met}/${pa.total} practices met`
    }))
  ];

  // We mock the PIID Result based on the overall data for now
  const piidResults = [
    { count: data.process_areas[0]?.met || 0, label: "Achieved", tone: "achieved" },
    { count: Math.floor((data.process_areas[0]?.total || 0) * 0.2), label: "Partially Achieved", tone: "partial" },
    { count: Math.floor((data.process_areas[0]?.total || 0) * 0.3), label: "Not Achieved", tone: "notAchieved" },
  ];
  
  const productProcessArea = chartGroups.map(g => ({
    label: g.tribe,
    pct: Math.floor((g.approved / (g.approved + g.pending + g.rejected)) * 100) || 0
  }));

  const recentActivities = data.recent_activities.map((act, i) => ({
    id: i,
    time: act.time,
    text: act.description
  }));

  return (
    <div className={styles.dashboard}>
      {/* ── Filter row ── */}
      <div className={styles.filterRow}>
        <Select
          options={processAreaOptions}
          value={selectedArea}
          onChange={(value) => setSelectedArea(value)}
          className={styles.processSelect}
          inputWrapperClassName={styles.processSelectInputWrapper}
          inputClassName={styles.processSelectInput}
        />
      </div>

      {/* ── Stat cards ── */}
      <div className={styles.statsRow}>
        {statCards.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
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

      {/* ── Mid grid ── */}
      <div className={styles.midGrid}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">
              Product Process Area
            </Text>
          </div>
          <div className={styles.progressList}>
            {productProcessArea.map((item) => (
              <div key={item.label} className={styles.progressItem}>
                <Text as="p" className={styles.progressLabel}>
                  {item.label}
                </Text>
                <ProgressBar value={item.pct} color="warning" />
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">
              PIID Result
            </Text>
          </div>
          <div className={styles.piidList}>
            {piidResults.map((item) => (
              <div key={item.label} className={styles.piidItem}>
                <span
                  className={`${styles.piidBadge} ${styles[`piidBadge_${item.tone}`]}`}
                >
                  {item.count}
                </span>
                <Text as="span" className={styles.piidLabel}>
                  {item.label}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Bottom grid ── */}
      <div className={styles.bottomGrid}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">
              Recent Assessment Activities
            </Text>
          </div>

          <div className={styles.timeline}>
            {recentActivities.map((activity, i) => (
              <div key={activity.id} className={styles.timelineItem}>
                <div className={styles.timelineDotCol}>
                  <span className={styles.timelineDot} />
                  {i < recentActivities.length - 1 && (
                    <span className={styles.timelineLine} />
                  )}
                </div>
                <div className={styles.timelineContent}>
                  <Text as="p" className={styles.timelineTime}>
                    {activity.time}
                  </Text>
                  <Text as="p" className={styles.timelineText}>
                    {activity.text}
                  </Text>
                </div>
                {i < recentActivities.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.bottomRightCol}>
          {/* Practice Status Distribution */}
          <Card className={styles.panel}>
            <div className={styles.panelHeader}>
              <Text as="h3" variant="heading">
                Practice Status Distribution
              </Text>
            </div>

            <ResponsiveContainer width="100%" height={285}>
              <BarChart
                data={practiceStatusData}
                barSize={16}
                barGap={4}
                margin={{ top: 9, right: 0, left: -20, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E4E7EC"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#667085", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, practiceMax]}
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #E4E7EC",
                    background: "#fff",
                  }}
                />
                <Bar
                  dataKey="Achieved"
                  name="Achieved"
                  fill="#12B76A"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Partial"
                  name="Partial"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="NotAchieved"
                  name="Not Achieved"
                  fill="#F04438"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span
                  className={`${styles.legendDot} ${styles.legendDotApproved}`}
                />
                Achieved
              </span>
              <span className={styles.legendItem}>
                <span
                  className={`${styles.legendDot} ${styles.legendDotPending}`}
                />
                Partial
              </span>
              <span className={styles.legendItem}>
                <span
                  className={`${styles.legendDot} ${styles.legendDotRejected}`}
                />
                Not Achieved
              </span>
            </div>
          </Card>

          {/* Total Weakness */}
          <Card className={styles.panel}>
            <Text as="h3" className={styles.weaknessChartTitle}>
              Total Weakness
            </Text>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={weaknessData}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                barSize={32}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E4E7EC"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  domain={[0, weaknessMax]}
                  ticks={weaknessTicks}
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={76}
                  tick={{ fontSize: 13, fill: "#667085", fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #E4E7EC",
                    background: "#fff",
                  }}
                  formatter={(v) => [v, "Not Achieved"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {weaknessData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={WEAKNESS_COLORS[i % WEAKNESS_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;