import { useState } from "react";
import { Card, Text, ProgressBar, Divider, Select } from "@legion-ui-kit/react-core";
import styles from "../Dashboard.module.css";

const statCards = [
  { label: "Overall CMMI Score", value: "77%", sub: "Overall CMMI Score · Level 3" },
  { label: "Peer Review", value: "78%", sub: "39/50 practices met" },
  { label: "Process QA", value: "82%", sub: "39/50 practices met" },
  { label: "Verification & Validation", value: "71%", sub: "39/50 practices met" },
];

const assessmentProgress = [
  { label: "Verification & Validation (VV)", pct: 88 },
  { label: "Peer Review (PR)", pct: 74 },
  { label: "Process Quality Assurance (PQA)", pct: 78 },
];

const upcomingReviews = [
  { day: "14", month: "JUL", label: "VV Verification Audit" },
  { day: "18", month: "JUL", label: "PQA Quarterly Review" },
  { day: "22", month: "JUL", label: "PR Quarterly Review" },
  { day: "24", month: "JUL", label: "PR Verification Audit" },
];

const recentActivities = Array.from({ length: 6 }).map(() => ({
  time: "Today · 09:42",
  text: "User123 approved evidence for PQA - 2.3",
}));

const chartGroups = [
  { name: "Netmonk", approved: 17500, pending: 9500, rejected: 10500 },
  { name: "PaDi UMKM", approved: 8000, pending: 13000, rejected: 18500 },
  { name: "Legion AI", approved: 6500, pending: 20000, rejected: 15500 },
];

const processAreaOptions = [
  { label: "All Process Area", value: "all" },
  { label: "Peer Review", value: "peer-review" },
  { label: "Process QA", value: "pqa" },
  { label: "Verification & Validation", value: "vv" },
];

export const Dashboard = () => {
  const [selectedArea, setSelectedArea] = useState("all");
  const maxChartVal = 25000;

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
                <div key={group.name} className={styles.chartGroup}>
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
                  <Text as="span" className={styles.chartGroupLabel}>{group.name}</Text>
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