import { useState } from "react";
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

const projects = [
  {
    id: "netmonk",
    name: "NETMONK",
    initials: "NM",
    count: 7,
    updated: "terhubung ke 5 tools · terakhir diperbarui 2 jam lalu",
    artifacts: [
      "Sprint Velocity Tracker", "Backlog Issue #231", "MR!47 - Auth-refactor",
      "Build #88 - main branch", "Quality Gate Report v2.4",
      "Architecture Overview", "SCC Report - Q2 2025",
    ],
  },
  {
    id: "padi-umkm",
    name: "PaDi UMKM",
    initials: "PU",
    count: 5,
    updated: "terhubung ke 5 tools · terakhir diperbarui 2 jam lalu",
    artifacts: [
      "Sprint Velocity Tracker", "Backlog Issue #231", "MR!47 - Auth-refactor",
      "Build #88 - main branch", "Quality Gate Report v2.4",
    ],
  },
  {
    id: "legion-ai",
    name: "Legion AI",
    initials: "LA",
    count: 5,
    updated: "terhubung ke 5 tools · terakhir diperbarui 2 jam lalu",
    artifacts: [
      "Sprint Velocity Tracker", "Backlog Issue #231", "MR!47 - Auth-refactor",
      "Build #88 - main branch", "Quality Gate Report v2.4",
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
  const [activeTools, setActiveTools] = useState(new Set());

  const toggleTool = (key) => {
    setActiveTools((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

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
          onChange={setProjectFilter}
          inputWrapperClassName={styles.filterSelectWrapper}
          inputClassName={styles.filterSelectInput}
        />
      </div>

      <div className={styles.projectGroups}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={styles.projectGroup}>
            <div className={styles.projectGroupHeader}>
              <Avatar size="lg" className={styles.projectAvatar}>
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
              {project.artifacts.map((artifact) => (
                <Card
                  key={artifact}
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