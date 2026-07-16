import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Text,
  ProgressBar,
} from "@legion-ui-kit/react-core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "../Dashboard.module.css";

function niceMax(value) {
  if (value <= 10) return Math.ceil(value / 2) * 2 || 2;
  if (value <= 25) return Math.ceil(value / 5) * 5;
  return Math.ceil(value / 10) * 10;
}

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/dashboard/cmmi-summary");
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: 40, color: "white" }}>Loading Dashboard...</div>;
  if (!data) return <div style={{ padding: 40, color: "white" }}>Failed to load data.</div>;

  const statCards = [
    {
      label: "Overall CMMI Score",
      value: `${data.overall_score}%`,
      sub: `Overall CMMI Score · Level ${data.overall_level}`,
    },
  ];
  
  if (data.process_areas) {
    data.process_areas.forEach((pa) => {
      statCards.push({
        label: pa.name.split(" ")[0] === "PR" ? "Peer Review" : pa.name.split(" ")[0] === "PQA" ? "Process QA" : pa.name,
        value: `${pa.score}%`,
        sub: `${pa.met}/${pa.total} practices met`,
      });
    });
  }

  const practiceMax = niceMax(
    Math.max(...(data.practice_status_data || []).flatMap((d) => [d.Achieved, d.Partial, d.NotAchieved]), 1)
  );
  
  const weaknessMax = niceMax(
    Math.max(
      ...(data.weakness_data || []).map((d) => (d.Netmonk || 0) + (d["PaDi UMKM"] || 0) + (d["Legion AI"] || 0)),
      1
    )
  );
  const weaknessStep = weaknessMax <= 10 ? 2 : weaknessMax <= 25 ? 5 : 10;
  const weaknessTicks = Array.from(
    { length: Math.floor(weaknessMax / weaknessStep) + 1 },
    (_, i) => i * weaknessStep
  );

  return (
    <div className={styles.dashboard}>
      {/* ─── Stat cards ─── */}
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

      {/* ─── Mid grid ─── */}
      <div className={styles.midGrid}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">
              Product Process Area
            </Text>
          </div>
          <div className={styles.progressList}>
            {data.process_areas && data.process_areas.map((item) => (
              <div key={item.name} className={styles.progressItem}>
                <Text as="p" className={styles.progressLabel}>
                  {item.name}
                </Text>
                <ProgressBar value={item.score} color="warning" />
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">
              PIID Result Breakdown
            </Text>
          </div>
          <div className={styles.piidList}>
             {/* Show summary of practice status data here instead of hardcoded PIID result tone */}
             <div className={styles.piidItem}>
                <span className={`${styles.piidBadge} ${styles.piidBadge_achieved}`}>
                  {(data.practice_status_data || []).reduce((acc, curr) => acc + curr.Achieved, 0)}
                </span>
                <Text as="span" className={styles.piidLabel}>Achieved</Text>
             </div>
             <div className={styles.piidItem}>
                <span className={`${styles.piidBadge} ${styles.piidBadge_partial}`}>
                  {(data.practice_status_data || []).reduce((acc, curr) => acc + curr.Partial, 0)}
                </span>
                <Text as="span" className={styles.piidLabel}>Partially Achieved</Text>
             </div>
             <div className={styles.piidItem}>
                <span className={`${styles.piidBadge} ${styles.piidBadge_notAchieved}`}>
                  {(data.practice_status_data || []).reduce((acc, curr) => acc + curr.NotAchieved, 0)}
                </span>
                <Text as="span" className={styles.piidLabel}>Not Achieved</Text>
             </div>
          </div>
        </Card>
      </div>

      {/* ─── Bottom grid ─── */}
      <div className={styles.bottomGrid}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">
              Recent Assessment Activities
            </Text>
          </div>

          <div className={styles.timeline}>
            {data.recent_activities && data.recent_activities.map((activity, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDotCol}>
                  <span className={styles.timelineDot} />
                  {i < data.recent_activities.length - 1 && (
                    <span className={styles.timelineLine} />
                  )}
                </div>
                <div className={styles.timelineContent}>
                  <Text as="p" className={styles.timelineTime}>
                    {activity.time}
                  </Text>
                  <Text as="p" className={styles.timelineText}>
                    {activity.title || activity.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.bottomRightCol}>
          <Card className={styles.panel}>
            <div className={styles.panelHeader}>
              <Text as="h3" variant="heading">
                Practice Status Distribution
              </Text>
            </div>

            <ResponsiveContainer width="100%" height={285}>
              <BarChart
                data={data.practice_status_data}
                barSize={16}
                barGap={4}
                margin={{ top: 9, right: 0, left: -20, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-secondary)", fontWeight: 600 }} axisLine={false} tickLine={false} stroke="var(--border-main)" />
                <YAxis domain={[0, practiceMax]} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} allowDecimals={false} stroke="var(--border-main)" />
                <Tooltip
                  contentStyle={{
                    fontSize: 12, borderRadius: 8, border: "1px solid var(--border-glass)",
                    background: "var(--bg-panel)", color: "var(--text-primary)", backdropFilter: "blur(10px)"
                  }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
                <Bar dataKey="Achieved" name="Achieved" fill="#12B76A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Partial" name="Partial" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="NotAchieved" name="Not Achieved" fill="#F04438" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendDotApproved}`} />Achieved</span>
              <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendDotPending}`} />Partial</span>
              <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.legendDotRejected}`} />Not Achieved</span>
            </div>
          </Card>

          <Card className={styles.panel}>
            <Text as="h3" className={styles.weaknessChartTitle}>
              Total Weakness
            </Text>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.weakness_data}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                <XAxis dataKey="area" tick={{ fontSize: 13, fill: "var(--text-secondary)", fontWeight: 700 }} axisLine={false} tickLine={false} stroke="var(--border-main)" />
                <YAxis domain={[0, weaknessMax]} ticks={weaknessTicks} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} axisLine={false} tickLine={false} allowDecimals={false} stroke="var(--border-main)" />
                <Tooltip
                  contentStyle={{
                    fontSize: 12, borderRadius: 8, border: "1px solid var(--border-glass)",
                    background: "var(--bg-panel)", color: "var(--text-primary)", backdropFilter: "blur(10px)"
                  }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} iconType="circle" />
                <Bar dataKey="Netmonk" stackId="a" fill="#1D4ED8" />
                <Bar dataKey="PaDi UMKM" stackId="a" fill="#F59E0B" />
                <Bar dataKey="Legion AI" stackId="a" fill="#12B76A" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
