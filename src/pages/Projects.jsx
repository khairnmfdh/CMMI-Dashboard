import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { Select } from "@legion-ui-kit/react-core";
import styles from "../Projects.module.css";

const projects = [
  {
    id: "netmonk",
    name: "NETMONK",
    team: "Team User123",
    status: "Active",
    level: "Level 3 - Defined",
    peerReview: 78,
    pqa: 78,
    vv: 78,
    overall: 40,
    detail: {
      peerReview: { reviewsConducted: 6, openFindings: 4, closeFindings: 11, practicesMet: "PR.1.1, PR.1.2, PR.2.1" },
      pqa: { auditsCompleted: 6, nonCompliancesFound: 6, processAdherence: "86%", lastAudit: "2026-06-10" },
      vv: { verificationPassed: "36/40", validationPassed: "16/40", testCoverage: "76%" },
    },
  },
  {
    id: "padi-umkm",
    name: "PaDi UMKM",
    team: "Team User123",
    status: "Active",
    level: "Level 3 - Defined",
    peerReview: 78,
    pqa: 78,
    vv: 78,
    overall: 71,
    detail: {
      peerReview: { reviewsConducted: 8, openFindings: 2, closeFindings: 14, practicesMet: "PR.1.1, PR.1.2, PR.2.1" },
      pqa: { auditsCompleted: 7, nonCompliancesFound: 3, processAdherence: "90%", lastAudit: "2026-06-12" },
      vv: { verificationPassed: "38/40", validationPassed: "22/40", testCoverage: "84%" },
    },
  },
  {
    id: "legion-ai",
    name: "Legion AI",
    team: "Team User123",
    status: "Active",
    level: "Level 3 - Defined",
    peerReview: 78,
    pqa: 78,
    vv: 78,
    overall: 82,
    detail: {
      peerReview: { reviewsConducted: 9, openFindings: 1, closeFindings: 17, practicesMet: "PR.1.1, PR.1.2, PR.2.1" },
      pqa: { auditsCompleted: 9, nonCompliancesFound: 1, processAdherence: "95%", lastAudit: "2026-06-14" },
      vv: { verificationPassed: "39/40", validationPassed: "26/40", testCoverage: "91%" },
    },
  },
];

const chartData = [
  { name: "Netmonk", "Peer Review": 13000, "Process QA": 11000, "V&V": 20000 },
  { name: "PaDi UMKM", "Peer Review": 19500, "Process QA": 15500, "V&V": 9000 },
  { name: "Legion AI", "Peer Review": 12500, "Process QA": 20000, "V&V": 8500 },
];

const statOptions = [{ label: "All Statuses", value: "all" }];
const levelOptions = [{ label: "All CMMI Levels", value: "all" }];

function overallColor(pct) {
  if (pct < 50) return "#F04438";
  if (pct < 80) return "#F59E0B";
  return "#12B76A";
}

export const Projects = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [level, setLevel] = useState("all");
  const [selectedId, setSelectedId] = useState(projects[0].id);

  const selected = projects.find((p) => p.id === selectedId);
  const radarData = [
    { axis: "PR", value: selected.peerReview },
    { axis: "PQA", value: selected.pqa },
    { axis: "VV", value: selected.vv },
  ];

  const avg = (key) => Math.round(projects.reduce((sum, p) => sum + p[key], 0) / projects.length);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.projects}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Projects</div>
          <div className={styles.statValue}>{projects.length}</div>
          <div className={styles.statSub}>Overall CMMI Score · Level 3</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg Peer Review</div>
          <div className={styles.statValue}>{avg("peerReview")}%</div>
          <div className={styles.statSub}>39/50 practices met</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg PQA Score</div>
          <div className={styles.statValue}>{avg("pqa")}%</div>
          <div className={styles.statSub}>39/50 practices met</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg V&V Score</div>
          <div className={styles.statValue}>{avg("vv")}%</div>
          <div className={styles.statSub}>39/50 practices met</div>
        </div>
      </div>

      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          placeholder="Search Project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select options={statOptions} value={status} onChange={setStatus} />
        <Select options={levelOptions} value={level} onChange={setLevel} />
      </div>

      <div className={styles.panel}>
        <h3 className={styles.panelTitle}>Process area Scores - all projects</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="Peer Review" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Process QA" fill="#F04438" radius={[4, 4, 0, 0]} />
            <Bar dataKey="V&V" fill="#12B76A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.projectList}>
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className={`${styles.projectCard} ${selectedId === p.id ? styles.projectCardActive : ""}`}
              onClick={() => setSelectedId(p.id)}
            >
              <div className={styles.projectCardTop}>
                <div>
                  <div className={styles.projectName}>{p.name}</div>
                  <div className={styles.projectTeam}>{p.team}</div>
                </div>
                <div className={styles.projectBadges}>
                  <span className={styles.badgeActive}>{p.status}</span>
                  <span className={styles.badgeLevel}>{p.level}</span>
                </div>
              </div>

              <div className={styles.projectMetrics}>
                <div className={styles.metricBox}>
                  <div className={styles.metricLabel}>Peer Review</div>
                  <div className={styles.metricValue}>{p.peerReview}%</div>
                </div>
                <div className={styles.metricBox}>
                  <div className={styles.metricLabel}>PQA</div>
                  <div className={styles.metricValue}>{p.pqa}%</div>
                </div>
                <div className={styles.metricBox}>
                  <div className={styles.metricLabel}>VV</div>
                  <div className={styles.metricValue}>{p.vv}%</div>
                </div>
              </div>

              <div className={styles.overallRow}>
                <div className={styles.overallTrack}>
                  <div
                    className={styles.overallFill}
                    style={{ width: `${p.overall}%`, background: overallColor(p.overall) }}
                  />
                </div>
                <span className={styles.overallLabel}>{p.overall}% Overall</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.radarPanel}>
          <div className={styles.projectName}>{selected.name}</div>
          <div className={styles.projectTeam}>{selected.team}</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 13, fontWeight: 600 }} />
              <Radar
                dataKey="value"
                stroke="#12B76A"
                fill="#12B76A"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.detailRow}>
        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <span>Peer Review</span>
            <span className={styles.detailBadge}>{selected.peerReview}%</span>
          </div>
          <div className={styles.detailProgress}>
            <div className={styles.detailFill} style={{ width: `${selected.peerReview}%`, background: "#F59E0B" }} />
          </div>
          <div className={styles.detailList}>
            <div className={styles.detailItem}><span>Reviews conducted</span><span>{selected.detail.peerReview.reviewsConducted}</span></div>
            <div className={styles.detailItem}><span>Open findings</span><span>{selected.detail.peerReview.openFindings}</span></div>
            <div className={styles.detailItem}><span>Close findings</span><span>{selected.detail.peerReview.closeFindings}</span></div>
            <div className={styles.detailItem}><span>Practices met</span><span>{selected.detail.peerReview.practicesMet}</span></div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <span>Process Quality Assurance</span>
            <span className={styles.detailBadge}>{selected.pqa}%</span>
          </div>
          <div className={styles.detailProgress}>
            <div className={styles.detailFill} style={{ width: `${selected.pqa}%`, background: "#F59E0B" }} />
          </div>
          <div className={styles.detailList}>
            <div className={styles.detailItem}><span>Audits completed</span><span>{selected.detail.pqa.auditsCompleted}</span></div>
            <div className={styles.detailItem}><span>Non-compliances found</span><span>{selected.detail.pqa.nonCompliancesFound}</span></div>
            <div className={styles.detailItem}><span>Process adherence</span><span>{selected.detail.pqa.processAdherence}</span></div>
            <div className={styles.detailItem}><span>Last audit</span><span>{selected.detail.pqa.lastAudit}</span></div>
          </div>
        </div>

        <div className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <span>Verification & Validation</span>
            <span className={styles.detailBadge}>{selected.vv}%</span>
          </div>
          <div className={styles.detailProgress}>
            <div className={styles.detailFill} style={{ width: `${selected.vv}%`, background: "#F59E0B" }} />
          </div>
          <div className={styles.detailList}>
            <div className={styles.detailItem}><span>Verification passed</span><span>{selected.detail.vv.verificationPassed}</span></div>
            <div className={styles.detailItem}><span>Validation passed</span><span>{selected.detail.vv.validationPassed}</span></div>
            <div className={styles.detailItem}><span>Test coverage</span><span>{selected.detail.vv.testCoverage}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;