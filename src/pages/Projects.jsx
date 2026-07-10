import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import { Select } from "@legion-ui-kit/react-core";
import styles from "../Projects.module.css";

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
  const [projects, setProjects] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/projects/cmmi-details");
        const data = res.data.data;
        
        let sumPr = 0, sumPqa = 0, sumVv = 0;

        const combinedProjects = data.projects.map((p) => {
          const b = data.breakdowns;
          
          const prScore = p.pr_achieved;
          const pqaScore = p.pqa_achieved;
          const vvScore = p.vv_achieved;
          const overallScore = p.overall_achieved;
          
          sumPr += prScore;
          sumPqa += pqaScore;
          sumVv += vvScore;

          return {
            id: p.name.toLowerCase().replace(/ /g, "-"),
            name: p.name,
            team: p.team,
            status: p.status,
            level: p.level,
            peerReview: prScore,
            pqa: pqaScore,
            vv: vvScore,
            overall: overallScore,
            prTarget: p.pr_target,
            pqaTarget: p.pqa_target,
            vvTarget: p.vv_target,
            overallTarget: p.overall_target,
            detail: {
              peerReview: {
                reviewsConducted: b[0]?.details["Reviews conducted"] || p.pr_achieved,
                openFindings: b[0]?.details["Open findings"] || 0,
                closeFindings: b[0]?.details["Close findings"] || 0,
                practicesMet: `${p.pr_achieved}/${p.pr_target}`
              },
              pqa: {
                auditsCompleted: b[1]?.details["Audits completed"] || p.pqa_achieved,
                nonCompliancesFound: b[1]?.details["Non-compliances found"] || 0,
                processAdherence: `${p.pqa_achieved}/${p.pqa_target}`,
                lastAudit: b[1]?.details["Last audit"] || "N/A"
              },
              vv: {
                verificationPassed: b[2]?.details["Verification passed"] || p.vv_achieved,
                validationPassed: b[2]?.details["Validation passed"] || p.vv_achieved,
                testCoverage: b[2]?.details["Test coverage"] || "100%"
              }
            }
          };
        });

        const count = combinedProjects.length || 1;

        setProjects(combinedProjects);
        setMetrics({
          total_projects: data.total_projects,
          avg_pr: (sumPr / count).toFixed(1),
          avg_pqa: (sumPqa / count).toFixed(1),
          avg_vv: (sumVv / count).toFixed(1)
        });
        
        const newChartData = combinedProjects.map(p => ({
          name: p.name,
          "Peer Review": p.peerReview,
          "Process QA": p.pqa,
          "V&V": p.vv
        }));
        setChartData(newChartData);
        setSelectedId(combinedProjects[0]?.id || "");
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div style={{ padding: 40, color: "var(--text-primary)" }}>Loading Projects...</div>;
  if (!projects.length) return <div style={{ padding: 40, color: "var(--text-primary)" }}>Failed to load data.</div>;

  const selected = projects.find((p) => p.id === selectedId) || projects[0];
  const radarData = [
    { axis: "PR", value: selected.peerReview },
    { axis: "PQA", value: selected.pqa },
    { axis: "VV", value: selected.vv },
  ];

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.projects}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Projects</div>
          <div className={styles.statValue}>{metrics.total_projects}</div>
          <div className={styles.statSub}>Overall CMMI Score · Level 3</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg Peer Review</div>
          <div className={styles.statValue}>{metrics.avg_pr}</div>
          <div className={styles.statSub}>Average Score</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg PQA Score</div>
          <div className={styles.statValue}>{metrics.avg_pqa}</div>
          <div className={styles.statSub}>Average Score</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Avg V&V Score</div>
          <div className={styles.statValue}>{metrics.avg_vv}</div>
          <div className={styles.statSub}>Average Score</div>
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
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} domain={[0, 3]} />
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
                  <div className={styles.metricValue}>{p.peerReview}/{p.prTarget}</div>
                </div>
                <div className={styles.metricBox}>
                  <div className={styles.metricLabel}>PQA</div>
                  <div className={styles.metricValue}>{p.pqa}/{p.pqaTarget}</div>
                </div>
                <div className={styles.metricBox}>
                  <div className={styles.metricLabel}>VV</div>
                  <div className={styles.metricValue}>{p.vv}/{p.vvTarget}</div>
                </div>
              </div>

              <div className={styles.overallRow}>
                <div className={styles.overallTrack}>
                  <div
                    className={styles.overallFill}
                    style={{ width: `${(p.overall / p.overallTarget) * 100}%`, background: overallColor((p.overall / p.overallTarget) * 100) }}
                  />
                </div>
                <span className={styles.overallLabel}>{p.overall}/{p.overallTarget} Overall</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.radarPanel}>
          <div className={styles.projectName}>{selected.name}</div>
          <div className={styles.projectTeam}>{selected.team}</div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="var(--border-main)" />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 13, fontWeight: 600, fill: "var(--text-secondary)" }} />
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
            <span className={styles.detailBadge}>{selected.peerReview}/{selected.prTarget}</span>
          </div>
          <div className={styles.detailProgress}>
            <div className={styles.detailFill} style={{ width: `${(selected.peerReview / selected.prTarget) * 100}%`, background: "#F59E0B" }} />
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
            <span className={styles.detailBadge}>{selected.pqa}/{selected.pqaTarget}</span>
          </div>
          <div className={styles.detailProgress}>
            <div className={styles.detailFill} style={{ width: `${(selected.pqa / selected.pqaTarget) * 100}%`, background: "#F59E0B" }} />
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
            <span className={styles.detailBadge}>{selected.vv}/{selected.vvTarget}</span>
          </div>
          <div className={styles.detailProgress}>
            <div className={styles.detailFill} style={{ width: `${(selected.vv / selected.vvTarget) * 100}%`, background: "#F59E0B" }} />
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