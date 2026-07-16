import { useState, useMemo } from "react";
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

// ΓöÇΓöÇΓöÇ Data ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

const statCards = [
  {
    label: "Overall CMMI Score",
    value: "77%",
    sub: "Overall CMMI Score ┬╖ Level 3",
  },
  { label: "Peer Review", value: "78%", sub: "39/50 practices met" },
  { label: "Process QA", value: "82%", sub: "39/50 practices met" },
  {
    label: "Verification & Validation",
    value: "71%",
    sub: "39/50 practices met",
  },
];

const processAreaOptions = [
  { label: "All Process Area", value: "all" },
  { label: "Peer Review", value: "peer-review" },
  { label: "Process QA", value: "pqa" },
  { label: "Verification & Validation", value: "vv" },
];

const AREA_DATA = {
  all: {
    productProcessArea: [
      { label: "NETMONK", pct: 82 },
      { label: "PaDi UMKM", pct: 71 },
      { label: "Legion AI", pct: 40 },
    ],
    piidResults: [
      { count: 14, label: "Achieved", tone: "achieved" },
      { count: 18, label: "Partially Achieved", tone: "partial" },
      { count: 22, label: "Not Achieved", tone: "notAchieved" },
    ],
  },
  "peer-review": {
    productProcessArea: [
      { label: "NETMONK", pct: 25 },
      { label: "PaDi UMKM", pct: 50 },
      { label: "Legion AI", pct: 78 },
    ],
    piidResults: [
      { count: 6, label: "Achieved", tone: "achieved" },
      { count: 5, label: "Partially Achieved", tone: "partial" },
      { count: 9, label: "Not Achieved", tone: "notAchieved" },
    ],
  },
  pqa: {
    productProcessArea: [
      { label: "NETMONK", pct: 66 },
      { label: "PaDi UMKM", pct: 40 },
      { label: "Legion AI", pct: 30 },
    ],
    piidResults: [
      { count: 5, label: "Achieved", tone: "achieved" },
      { count: 7, label: "Partially Achieved", tone: "partial" },
      { count: 8, label: "Not Achieved", tone: "notAchieved" },
    ],
  },
  vv: {
    productProcessArea: [
      { label: "NETMONK", pct: 20 },
      { label: "PaDi UMKM", pct: 78 },
      { label: "Legion AI", pct: 38 },
    ],
    piidResults: [
      { count: 3, label: "Achieved", tone: "achieved" },
      { count: 6, label: "Partially Achieved", tone: "partial" },
      { count: 5, label: "Not Achieved", tone: "notAchieved" },
    ],
  },
};

const recentActivities = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  time: "Today ┬╖ 09:42",
  text: "User123 approved evidence for PQA - 2.3",
}));

const WEAKNESS_COLORS = ["#4F46E5", "#6366F1", "#818CF8"];

// ΓöÇΓöÇ Proportional project split ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// Netmonk gets 1/2, PaDi UMKM gets 2/7, Legion AI gets 3/14 of any total.
// Verified against the example: split(14) => [7, 4, 3].
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

// ΓöÇΓöÇΓöÇ Dashboard ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export const Dashboard = () => {
  const [selectedArea, setSelectedArea] = useState("all");

  const { productProcessArea, piidResults } =
    AREA_DATA[selectedArea] || AREA_DATA.all;

  const findCount = (tone) =>
    piidResults.find((r) => r.tone === tone)?.count ?? 0;

  const practiceStatusData = useMemo(() => {
    const achieved = splitByProject(findCount("achieved"));
    const partial = splitByProject(findCount("partial"));
    const notAchieved = splitByProject(findCount("notAchieved"));

    return PROJECT_NAMES.map((name, i) => ({
      name,
      Achieved: achieved[i],
      Partial: partial[i],
      NotAchieved: notAchieved[i],
    }));
  }, [piidResults]);

  const weaknessData = useMemo(() => {
    const notAchieved = splitByProject(findCount("notAchieved"));
    return PROJECT_NAMES.map((name, i) => ({
      name,
      value: notAchieved[i],
    }));
  }, [piidResults]);

  const practiceMax = niceMax(
    Math.max(...practiceStatusData.flatMap((d) => [d.Achieved, d.Partial, d.NotAchieved]), 1)
  );
  const weaknessMax = niceMax(Math.max(...weaknessData.map((d) => d.value), 1));
  const weaknessStep = weaknessMax <= 10 ? 2 : weaknessMax <= 25 ? 5 : 10;
  const weaknessTicks = Array.from(
    { length: Math.floor(weaknessMax / weaknessStep) + 1 },
    (_, i) => i * weaknessStep
  );

  return (
    <div className={styles.dashboard}>
      {/* ΓöÇΓöÇ Filter row ΓöÇΓöÇ */}
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

      {/* ΓöÇΓöÇ Stat cards ΓöÇΓöÇ */}
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

      {/* ΓöÇΓöÇ Mid grid ΓöÇΓöÇ */}
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

      {/* ΓöÇΓöÇ Bottom grid ΓöÇΓöÇ */}
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
          {/* Practice Status Distribution ΓÇö now derived from PIID split per project */}
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

          {/* Total Weakness ΓÇö Not Achieved count split per project, filter-reactive */}
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
