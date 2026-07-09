import { Sidebar as SidebarComponent } from "@legion-ui-kit/react-core";
import styles from "./Sidebar.module.css";

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const IconProjects = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />
    <path d="M12 11v6M9 14h6" />
  </svg>
);

const IconArtifacts = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
    <path d="M8 11h8M8 15h8M8 7h4" />
  </svg>
);

const IconProcessArea = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="4" cy="6" r="1" fill="currentColor" />
    <circle cx="4" cy="12" r="1" fill="currentColor" />
    <circle cx="4" cy="18" r="1" fill="currentColor" />
    <path d="M9 6h12M9 12h12M9 18h12" />
  </svg>
);

const IconReports = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20V10M12 20V4M20 20v-7" />
  </svg>
);

export default function AppSidebar({ activeLabel, onNavigate }) {
  const listMenu = [
    {
      menu: {
        label: (
          <span className={styles.menuLabel} onClick={() => onNavigate("Home")}>
            <IconDashboard />
            Dashboard
          </span>
        ),
        isActive: activeLabel === "Home",
      },
    },
    {
      menu: {
        label: (
          <span className={styles.menuLabel} onClick={() => onNavigate("Projects")}>
            <IconProjects />
            Products
          </span>
        ),
        isActive: activeLabel === "Products",
      },
    },
    {
      menu: {
        label: (
          <span className={styles.menuLabel} onClick={() => onNavigate("Artifacts")}>
            <IconArtifacts />
            Artifacts
          </span>
        ),
        isActive: activeLabel === "Artifacts",
      },
    },
    {
      menu: {
        label: (
          <span className={styles.menuLabel}>
            <IconProcessArea />
            Process Area
          </span>
        ),
      },
      subMenu: [
        {
          label: (
            <p
              style={{ whiteSpace: "nowrap" }}
              onClick={() => onNavigate("Peer Review")}
            >
              Peer Review
            </p>
          ),
          isActive: activeLabel === "Peer Review",
        },
        {
          label: (
            <p
              style={{ whiteSpace: "nowrap" }}
              onClick={() => onNavigate("Software Quality Assurance")}
            >
              Software Quality Assurance
            </p>
          ),
          isActive: activeLabel === "Software Quality Assurance",
        },
        {
          label: (
            <p
              style={{ whiteSpace: "nowrap" }}
              onClick={() => onNavigate("Validation and Verification")}
            >
              Validation and Verification
            </p>
          ),
          isActive: activeLabel === "Validation and Verification",
        },
      ],
    },
    {
      menu: {
        label: (
          <span className={styles.menuLabel} onClick={() => onNavigate("Reports")}>
            <IconReports />
            Reports & Analytics
          </span>
        ),
        isActive: activeLabel === "Reports",
      },
    },
  ];

  return (
    <div className={styles.sidebarWrapper}>
      <SidebarComponent
        listMenu={listMenu}
        mainMenuClassName={styles.mainMenu}
        activeMainMenuClassName={styles.activeMenu}
        activeSubMenuClassName={styles.activeSubMenu}
      />
    </div>
  );
}