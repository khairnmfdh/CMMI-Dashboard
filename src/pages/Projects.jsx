import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Select,
  Badge,
  ProgressBar,
} from "@legion-ui-kit/react-core";
import styles from "../Projects.module.css";

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const levelOptions = [
  { label: "All CMMI Levels", value: "all" },
  { label: "Level 1 - Initial", value: "level-1" },
  { label: "Level 2 - Managed", value: "level-2" },
  { label: "Level 3 - Defined", value: "level-3" },
  { label: "Level 4 - Quantitatively Managed", value: "level-4" },
  { label: "Level 5 - Optimizing", value: "level-5" },
];

function overallColor(pct) {
  if (pct < 50) return "#F04438";
  if (pct < 80) return "#F59E0B";
  return "#12B76A";
}

function getPct(achieved, target) {
  if (!target) return 0;
  return Math.floor((achieved / target) * 100);
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
          
          sumPr += getPct(prScore, p.pr_target);
          sumPqa += getPct(pqaScore, p.pqa_target);
          sumVv += getPct(vvScore, p.vv_target);

          return {
            id: p.name.toLowerCase().replace(/ /g, "-"),
            name: p.name,
            team: p.team,
            status: p.status,
            statusValue: p.status.toLowerCase().includes('inactive') ? 'inactive' : 'active',
            level: p.level,
            levelValue: 'level-3', // Simplified
            peerReview: getPct(prScore, p.pr_target),
            pqa: getPct(pqaScore, p.pqa_target),
            vv: getPct(vvScore, p.vv_target),
            overall: getPct(overallScore, p.overall_target),
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
          avg_pr: Math.round(sumPr / count),
          avg_pqa: Math.round(sumPqa / count),
          avg_vv: Math.round(sumVv / count)
        });
        
        const newChartData = combinedProjects.map(p => ({
          name: p.name,
          "Peer Review": p.peerReview * 100, // scaled up for chart look
          "Process QA": p.pqa * 100,
          "V&V": p.vv * 100
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

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || p.statusValue === status;
    const matchesLevel = level === "all" || p.levelValue === level;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className={styles.projects}>
      <div className={styles.statsRow}>
        <Card className={styles.statCard} elevation="none">
          <Text as="p" color="white" className={styles.statLabel}>Total Projects</Text>
          <Text as="h2" color="white" className={styles.statValue}>{metrics?.total_projects}</Text>
          <Text as="p" color="white" className={styles.statSub}>Overall CMMI Score · Level 3</Text>
        </Card>
        <Card className={styles.statCard} elevation="none">
          <Text as="p" color="white" className={styles.statLabel}>Avg Peer Review</Text>
          <Text as="h2" color="white" className={styles.statValue}>{metrics?.avg_pr}%</Text>
          <Text as="p" color="white" className={styles.statSub}>Average Score</Text>
        </Card>
        <Card className={styles.statCard} elevation="none">
          <Text as="p" color="white" className={styles.statLabel}>Avg PQA Score</Text>
          <Text as="h2" color="white" className={styles.statValue}>{metrics?.avg_pqa}%</Text>
          <Text as="p" color="white" className={styles.statSub}>Average Score</Text>
        </Card>
        <Card className={styles.statCard} elevation="none">
          <Text as="p" color="white" className={styles.statLabel}>Avg V&V Score</Text>
          <Text as="h2" color="white" className={styles.statValue}>{metrics?.avg_vv}%</Text>
          <Text as="p" color="white" className={styles.statSub}>Average Score</Text>
        </Card>
      </div>

      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          placeholder="Search Project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={statusOptions}
          value={status}
          onChange={setStatus}
          inputWrapperClassName={styles.filterSelectWrapper}
          inputClassName={styles.filterSelectInput}
        />
        <Select
          options={levelOptions}
          value={level}
          onChange={setLevel}
          inputWrapperClassName={styles.filterSelectWrapper}
          inputClassName={styles.filterSelectInput}
        />
      </div>

      <Card bordered elevation="elevation-1" className={styles.panel}>
        <CardHeader title="Process area Scores - all projects" noDivider />
        <CardBody>
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
        </CardBody>
      </Card>

      <div className={styles.mainGrid}>
        <div className={styles.projectList}>
          {filteredProjects.length === 0 ? (
            <Text as="p" color="tertiary">No projects match the current filters.</Text>
          ) : (
            filteredProjects.map((p) => (
              <Card
                key={p.id}
                bordered
                elevation="none"
                className={`${styles.projectCard} ${selectedId === p.id ? styles.projectCardActive : ""}`}
                onClick={() => setSelectedId(p.id)}
              >
                <div className={styles.projectCardTop}>
                  <div>
                    <Text as="h3" className={styles.projectName}>{p.name}</Text>
                    <Text as="p" color="tertiary" className={styles.projectTeam}>{p.team}</Text>
                  </div>
                  <div className={styles.projectBadges}>
                    <Badge color={p.statusValue === "active" ? "success" : "secondary"} label={p.status} />
                    <Badge color="secondary" label={p.level} />
                  </div>
                </div>

                <div className={styles.projectMetrics}>
                  <div className={styles.metricBox}>
                    <Text as="p" className={styles.metricLabel}>Peer Review</Text>
                    <Text as="p" className={styles.metricValue}>{p.peerReview}%</Text>
                  </div>
                  <div className={styles.metricBox}>
                    <Text as="p" className={styles.metricLabel}>PQA</Text>
                    <Text as="p" className={styles.metricValue}>{p.pqa}%</Text>
                  </div>
                  <div className={styles.metricBox}>
                    <Text as="p" className={styles.metricLabel}>VV</Text>
                    <Text as="p" className={styles.metricValue}>{p.vv}%</Text>
                  </div>
                </div>

                <div className={styles.overallRow}>
                  <ProgressBar
                    value={p.overall}
                    labelPosition="right"
                    className={styles.overallBar}
                    trackStyle={{ height: "6px" }}
                    indicatorStyle={{ background: overallColor(p.overall) }}
                  />
                  <Text as="span" color="tertiary" className={styles.overallSuffix}>Overall</Text>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card bordered elevation="elevation-1" className={styles.radarPanel}>
          <CardHeader title={selected.name} description={selected.team} noDivider />
          <CardBody>
            <ResponsiveContainer width="100%" height={550}>
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 13, fontWeight: 600 }} />
                <Radar dataKey="value" stroke="#12B76A" fill="#12B76A" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className={styles.detailRow}>
        <Card bordered elevation="elevation-1" className={styles.detailCard}>
          <CardHeader title="Peer Review" noDivider iconRight={<Badge color="primary" label={`${selected.peerReview}%`} />} />
          <CardBody>
            <div className={styles.progressGap}>
              <ProgressBar
                value={selected.peerReview}
                labelPosition="bottom-right"
                trackStyle={{ height: "10px", width: "230px" }}
                indicatorStyle={{ background: "#F59E0B" }}
              />
            </div>
            <div className={styles.detailList}>
              <div className={styles.detailItem}><span>Reviews conducted</span><span>{selected.detail.peerReview.reviewsConducted}</span></div>
              <div className={styles.detailItem}><span>Open findings</span><span>{selected.detail.peerReview.openFindings}</span></div>
              <div className={styles.detailItem}><span>Close findings</span><span>{selected.detail.peerReview.closeFindings}</span></div>
              <div className={styles.detailItem}><span>Practices met</span><span>{selected.detail.peerReview.practicesMet}</span></div>
            </div>
          </CardBody>
        </Card>

        <Card bordered elevation="elevation-1" className={styles.detailCard}>
          <CardHeader title="Process Quality Assurance" noDivider iconRight={<Badge color="primary" label={`${selected.pqa}%`} />} />
          <CardBody>
            <div className={styles.progressGap}>
              <ProgressBar
                value={selected.pqa}
                labelPosition="bottom-right"
                trackStyle={{ height: "10px", width: "230px" }}
                indicatorStyle={{ background: "#F59E0B" }}
              />
            </div>
            <div className={styles.detailList}>
              <div className={styles.detailItem}><span>Audits completed</span><span>{selected.detail.pqa.auditsCompleted}</span></div>
              <div className={styles.detailItem}><span>Non-compliances found</span><span>{selected.detail.pqa.nonCompliancesFound}</span></div>
              <div className={styles.detailItem}><span>Process adherence</span><span>{selected.detail.pqa.processAdherence}</span></div>
              <div className={styles.detailItem}><span>Last audit</span><span>{selected.detail.pqa.lastAudit}</span></div>
            </div>
          </CardBody>
        </Card>

        <Card bordered elevation="elevation-1" className={styles.detailCard}>
          <CardHeader title="Verification & Validation" noDivider iconRight={<Badge color="primary" label={`${selected.vv}%`} />} />
          <CardBody>
            <div className={styles.progressGap}>
              <ProgressBar
                value={selected.vv}
                labelPosition="bottom-right"
                trackStyle={{ height: "10px", width: "230px" }}
                indicatorStyle={{ background: "#F59E0B" }}
              />
            </div>
            <div className={styles.detailList}>
              <div className={styles.detailItem}><span>Verification passed</span><span>{selected.detail.vv.verificationPassed}</span></div>
              <div className={styles.detailItem}><span>Validation passed</span><span>{selected.detail.vv.validationPassed}</span></div>
              <div className={styles.detailItem}><span>Test coverage</span><span>{selected.detail.vv.testCoverage}</span></div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Projects;