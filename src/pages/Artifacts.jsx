import { useState, useEffect } from "react";
import axios from "axios";
import { Chip, Avatar, Card, Text, Select } from "@legion-ui-kit/react-core";
import styles from "../Artifacts.module.css";

const tools = [
  { key: "gitlab", label: "Gitlab", icon: "🦊" },
  { key: "radar", label: "Radar", icon: "📡" },
  { key: "taiga", label: "Taiga", icon: "🏃" },
  { key: "wiki", label: "WiKi", icon: "📖" },
  { key: "jenkins", label: "Jenkins", icon: "⚙️" },
  { key: "scc", label: "SCC", icon: "📄" },
  { key: "sonarqube", label: "SonarQube", icon: "🛡️" },
];

export const Artifacts = () => {
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [activeTools, setActiveTools] = useState(new Set());
  
  // API State
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleTool = (key) => {
    setActiveTools((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

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

  // Generate project options dynamically from fetched data
  const projectOptions = [
    { label: "All Projects", value: "all" },
    ...projectsData.map(p => ({ label: p.name, value: p.id }))
  ];

  const filteredProjects = projectsData.filter((p) => {
    if (projectFilter !== "all" && p.id !== projectFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.artifacts}>
      <div className={styles.toolRow}>
        {tools.map((tool) => (
          <Chip
            key={tool.key}
            color="primary"
            variant={activeTools.has(tool.key) ? "solid" : "outline"}
            hoverable
            className={styles.toolChip}
            onClick={() => toggleTool(tool.key)}
          >
            <span className={styles.toolIcon}>{tool.icon}</span>
            {tool.label}
          </Chip>
        ))}
      </div>

      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          placeholder="Search Artifacts....."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={projectOptions}
          value={projectFilter}
          onChange={setProjectFilter}
          inputWrapperClassName={styles.filterSelectWrapper}
          inputClassName={styles.filterSelectInput}
        />
      </div>

      <div className={styles.projectGroups}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.projectGroup}>
            <div className={styles.projectGroupHeader}>
              <Avatar size="lg" className={styles.projectAvatar} style={{ background: project.color }}>
                {project.initials}
              </Avatar>
              <div>
                <Text as="h3" className={styles.projectGroupName}>{project.name}</Text>
                <Text as="p" color="tertiary" className={styles.projectGroupMeta}>
                  {project.count} artifacts · {project.updated}
                </Text>
              </div>
            </div>

            <div className={styles.artifactGrid}>
              {project.artifacts.map((artifact, idx) => (
                <Card
                  key={idx}
                  bordered={false}
                  elevation="none"
                  className={styles.artifactCard}
                >
                  <Text as="p" className={styles.artifactLabel}>{artifact}</Text>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artifacts;