import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Select } from "@legion-ui-kit/react-core";
import styles from "../Artifacts.module.css";

const projectOptions = [
  { label: "All Projects", value: "all" },
  { label: "Netmonk", value: "netmonk" },
  { label: "PaDi UMKM", value: "padi" },
  { label: "Legion AI", value: "legion" },
];

export const Artifacts = () => {
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/artifacts/list");
        setProjectsData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch artifacts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtifacts();
  }, []);

  if (loading) return <div style={{ padding: 40, color: "white" }}>Loading Artifacts...</div>;
  if (!projectsData.length) return <div style={{ padding: 40, color: "white" }}>Failed to load data.</div>;

  const filteredProjects = projectsData.filter((p) => {
    if (filterProject !== "all" && !p.id.includes(filterProject)) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.artifacts}>
      <div className={styles.topToolbar}>
        <div className={styles.toolList}>
          <Button variant="ghost" className={styles.toolBtn}>🦊 Gitlab</Button>
          <Button variant="ghost" className={styles.toolBtn}>📡 Radar</Button>
          <Button variant="ghost" className={styles.toolBtn}>🏃 Taiga</Button>
          <Button variant="ghost" className={styles.toolBtn}>📖 WiKi</Button>
          <Button variant="ghost" className={styles.toolBtn}>⚙️ Jenkins</Button>
          <Button variant="ghost" className={styles.toolBtn}>📄 SCC</Button>
          <Button variant="ghost" className={styles.toolBtn}>🛡️ SonarQube</Button>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          placeholder="Search Artifacts....."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select options={projectOptions} value={filterProject} onChange={setFilterProject} />
      </div>

      <div className={styles.projectList}>
        {filteredProjects.map((p) => (
          <div key={p.id} className={styles.projectRow}>
            <div className={styles.projectHeader}>
              <div
                className={styles.projectIcon}
                style={{ background: p.color }}
              >
                {p.initials}
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectName}>{p.name}</h3>
                <p className={styles.projectMeta}>
                  {p.count} artifacts · {p.updated}
                </p>
              </div>
            </div>

            <div className={styles.artifactGrid}>
              {p.artifacts.map((art, idx) => (
                <div key={idx} className={styles.artifactCard}>
                  {art}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artifacts;