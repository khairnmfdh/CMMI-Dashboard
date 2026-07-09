import { useState } from "react";
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

const statCards = [
  {
    label: "Overall CMMI Score",
    value: "77%",
    sub: "Overall CMMI Score · Level 3",
  },
  { label: "Peer Review", value: "78%", sub: "39/50 practices met" },
  { label: "Process QA", value: "82%", sub: "39/50 practices met" },
  {
    label: "Verification & Validation",
    value: "71%",
    sub: "39/50 practices met",
  },
];

const assessmentProgress = [
  { label: "NETMONK", pct: 88 },
  { label: "PaDi UMKM", pct: 74 },
  { label: "Legion AI", pct: 78 },
];

const piidResults = [
  { count: 14, label: "Achieved", tone: "achieved" },
  { count: 18, label: "Partially Achieved", tone: "partial" },
  { count: 22, label: "Not Achieved", tone: "notAchieved" },
];

const recentActivities = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  time: "Today · 09:42",
  text: "User123 approved evidence for PQA - 2.3",
}));

const processAreaOptions = [
  { label: "All Process Area", value: "all" },
  { label: "Peer Review", value: "peer-review" },
  { label: "Process QA", value: "pqa" },
  { label: "Verification & Validation", value: "vv" },
];

// ── Recharts data ──────────────────────────────────────────────────────────────

// Practice Status — grouped bar chart
const practiceStatusData = [
  { name: "Netmonk", Achieved: 20, Partial: 2, NotAchieved: 13 },
  { name: "PaDi UMKM", Achieved: 10, Partial: 15, NotAchieved: 20 },
  { name: "Legion AI", Achieved: 2, Partial: 18, NotAchieved: 13 },
];

// Total Weakness — horizontal bar chart
const weaknessData = [
  { name: "Netmonk", value: 7.8 },
  { name: "PaDi UMKM", value: 4.2 },
  { name: "Legion AI", value: 10.3 },
];

const WEAKNESS_COLORS = ["#4F46E5", "#6366F1", "#818CF8"];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const Dashboard = () => {
  const [selectedArea, setSelectedArea] = useState("all");

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

      {/* ── Mid grid: Assessment Progress + PIID ── */}
      <div className={styles.midGrid}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">
              Product Process Area
            </Text>
          </div>
          <div className={styles.progressList}>
            {assessmentProgress.map((item) => (
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
          <Text as="h3" variant="heading">
            PIID Result
          </Text>
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
        {/* Recent Assessment Activities */}
        <Card className={styles.panel}>
          <Text as="h3" variant="heading">
            Recent Assessment Activities
          </Text>
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

        {/* Right column: charts */}
        <div className={styles.bottomRightCol}>
          {/* Practice Status Distribution — Recharts grouped BarChart */}
          <Card className={styles.panel}>
            <Text as="h3" variant="heading">
              Practice Status Distribution
            </Text>

            <ResponsiveContainer width="100%" height={220}>
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
                  domain={[0, 25]}
                  ticks={[0, 5, 10, 15, 20, 25]}
                  tick={{ fontSize: 11, fill: "#667085" }}
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

          {/* Total Weakness — Recharts horizontal BarChart */}
          <Card className={styles.panel}>
            <Text as="h3" className={styles.weaknessChartTitle}>
              Total Weakness
            </Text>

            <ResponsiveContainer width="100%" height={250}>
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
                  domain={[0, 22]}
                  ticks={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]}
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
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
                  formatter={(v) => [v, "Weakness"]}
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
