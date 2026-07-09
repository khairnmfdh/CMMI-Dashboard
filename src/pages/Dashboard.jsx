import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Text, ProgressBar, Divider, Select } from "@legion-ui-kit/react-core";
import styles from "../Dashboard.module.css";

const processAreaOptions = [
  { label: "All Process Area", value: "all" },
  { label: "Peer Review", value: "peer-review" },
  { label: "Process QA", value: "pqa" },
  { label: "Verification & Validation", value: "vv" },
];

export const Dashboard = () => {
  const [selectedArea, setSelectedArea] = useState("all");
  const [data, setData] = useState(null);
  const [chartGroups, setChartGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const maxChartVal = 25000;

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

  const assessmentProgress = data.process_areas.map(pa => ({
    label: pa.name,
    pct: pa.score
  }));

  const upcomingReviews = data.upcoming_schedules.map(sch => {
    const parts = sch.date.split(" ");
    return {
      day: parts[0],
      month: parts[1] || "",
      label: sch.title
    };
  });

  const recentActivities = data.recent_activities.map(act => ({
    time: act.time,
    text: act.description
  }));

  return (
    <div className={styles.dashboard}>
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

      <div className={styles.statsRow}>
        {statCards.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <Text as="p" color="white" className={styles.statLabel}>{stat.label}</Text>
            <Text as="h2" color="white" className={styles.statValue}>{stat.value}</Text>
            <Text as="p" color="white" className={styles.statSub}>{stat.sub}</Text>
          </Card>
        ))}
      </div>

      <div className={styles.midGrid}>
        <Card className={styles.panel}>
          <div className={styles.panelHeader}>
            <Text as="h3" variant="heading">Assesment Progress</Text>
            <a className={styles.viewAllLink} href="#">View All →</a>
          </div>

          <div className={styles.progressList}>
            {assessmentProgress.map((item) => (
              <div key={item.label} className={styles.progressItem}>
                <Text as="p" className={styles.progressLabel}>{item.label}</Text>
                <ProgressBar value={item.pct} color="warning" />
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panel}>
          <Text as="h3" variant="heading">Upcoming Review Schedule</Text>
          <div className={styles.scheduleList}>
            {upcomingReviews.map((item, i) => (
              <div key={i} className={styles.scheduleItem}>
                <div className={styles.scheduleDateBadge}>
                  <span className={styles.scheduleDay}>{item.day}</span>
                  <span className={styles.scheduleMonth}>{item.month}</span>
                </div>
                <Text as="span" className={styles.scheduleLabel}>{item.label}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        <Card className={styles.panel}>
          <Text as="h3" variant="heading">Recent Assessment Activities</Text>
          <div className={styles.timeline}>
            {recentActivities.map((activity, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDotCol}>
                  <span className={styles.timelineDot} />
                  {i < recentActivities.length - 1 && (
                    <span className={styles.timelineLine} />
                  )}
                </div>
                <div className={styles.timelineContent}>
                  <Text as="p" className={styles.timelineTime}>{activity.time}</Text>
                  <Text as="p" className={styles.timelineText}>{activity.text}</Text>
                </div>
                {i < recentActivities.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </Card>

        <Card className={styles.panel}>
          <Text as="h3" variant="heading">Artifacts Review Progress</Text>

          <div className={styles.chartWrapper}>
            <div className={styles.chartYAxis}>
              <span>25k</span>
              <span>20k</span>
              <span>15k</span>
              <span>10k</span>
              <span>5k</span>
              <span>0</span>
            </div>

            <div className={styles.chartBody}>
              {chartGroups.map((group) => (
                <div key={group.tribe} className={styles.chartGroup}>
                  <div className={styles.chartBars}>
                    <div
                      className={`${styles.chartBar} ${styles.chartBarRejected}`}
                      style={{ height: `${(group.rejected / maxChartVal) * 100}%` }}
                    />
                    <div
                      className={`${styles.chartBar} ${styles.chartBarPending}`}
                      style={{ height: `${(group.pending / maxChartVal) * 100}%` }}
                    />
                    <div
                      className={`${styles.chartBar} ${styles.chartBarApproved}`}
                      style={{ height: `${(group.approved / maxChartVal) * 100}%` }}
                    />
                  </div>
                  <Text as="span" className={styles.chartGroupLabel}>{group.tribe}</Text>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.chartLegend}>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotApproved}`} />
              Approved
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotPending}`} />
              Pending
            </span>
            <span className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles.legendDotRejected}`} />
              Rejected
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;