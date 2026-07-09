import { useState } from "react";
import { Select } from "@legion-ui-kit/react-core";
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

const projects = [
  {
    id: "netmonk",
    name: "NETMONK",
    initials: "NETMONK",
    color: "#0A2540",
    count: 7,
    tools: 5,
    updated: "terhubung ke 5 tools · terakhir diperbarui 2 jam lalu",
    artifacts: [
      "Sprint Velocity Tracker",
      "Backlog Issue #231",
      "MR!47 - Auth-refactor",
      "Build #88 - main branch",
      "Quality Gate Report v2.4",
      "Architecture Overview",
      "SCC Report - Q2 2025",
    ],
  },
  {
    id: "padi-umkm",
    name: "PaDi UMKM",
    initials: "UMKM",
    color: "#0F9D8C",
    count: 5,
    tools: 5,
    updated: "terhubung ke 5 tools · terakhir diperbarui 2 jam lalu",
    artifacts: [
      "Sprint Velocity Tracker",
      "Backlog Issue #231",
      "MR!47 - Auth-refactor",
      "Build #88 - main branch",
      "Quality Gate Report v2.4",
    ],
  },
  {
    id: "legion-ai",
    name: "Legion AI",
    initials: "Legion",
    color: "#7C3AED",
    count: 5,
    tools: 5,
    updated: "terhubung ke 5 tools · terakhir diperbarui 2 jam lalu",
    artifacts: [
      "Sprint Velocity Tracker",
      "Backlog Issue #231",
      "MR!47 - Auth-refactor",
      "Build #88 - main branch",
      "Quality Gate Report v2.4",
    ],
  },
];

const projectOptions = [
  { label: "All Projects", value: "all" },
  ...projects.map((p) => ({ label: p.name, value: p.id })),
];

export const Artifacts = () => {
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");

  const filteredProjects = projects
    .filter((p) => projectFilter === "all" || p.id === projectFilter)
    .map((p) => ({
      ...p,
      artifacts: p.artifacts.filter((a) =>
        a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((p) => p.artifacts.length > 0 || search === "");

  return (
    <div className={styles.artifacts}>
      <div className={styles.toolRow}>
        {tools.map((tool) => (
          <button key={tool.key} className={styles.toolPill}>
            <span className={styles.toolIcon}>{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          placeholder="Search Artifacts....."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={projectOptions}
          value={projectFilter}
          onChange={(value) => setProjectFilter(value)}
        />
      </div>

      <div className={styles.projectGroups}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.projectGroup}>
            <div className={styles.projectGroupHeader}>
              <div
                className={styles.projectLogo}
                style={{ background: project.color }}
              >
                {project.initials}
              </div>
              <div>
                <div className={styles.projectGroupName}>{project.name}</div>
                <div className={styles.projectGroupMeta}>
                  {project.count} artifacts · {project.updated}
                </div>
              </div>
            </div>

            <div className={styles.artifactGrid}>
              {project.artifacts.map((artifact) => (
                <div key={artifact} className={styles.artifactCard}>
                  {artifact}
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