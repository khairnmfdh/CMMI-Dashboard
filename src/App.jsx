import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./sidebar";
import Header from "./header";
import Dashboard from "./pages/Dashboard";
import ProcessArea from "./pages/ProcessArea";
import { CardBody } from "@legion-ui-kit/react-core";
import Projects from "./pages/Projects";
import Artifacts from "./pages/Artifacts";
import Reports from "./pages/Reports";
import Authentication from "./pages/Authentication";
import Register from "./pages/Register";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState("signin");
  const [activeLabel, setActiveLabel] = useState("Home");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const renderPage = () => {
    switch (activeLabel) {
      case "Home":
        return <Dashboard />;
      case "Projects":
        return <Projects />;
      case "Artifacts":
        return <Artifacts />;
      case "Peer Review":
        return <ProcessArea key="peer-review" initialTab="peer-review" onTabChange={setActiveLabel} />;
      case "Software Quality Assurance":
        return <ProcessArea key="sqa" initialTab="sqa" onTabChange={setActiveLabel} />;
      case "Validation and Verification":
        return <ProcessArea key="vv" initialTab="vv" onTabChange={setActiveLabel} />;
      case "Reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return authView === "signin" ? (
      <Authentication
        onSignIn={() => setIsAuthenticated(true)}
        onNavigate={setAuthView}
      />
    ) : (
      <Register
        onRegister={() => setIsAuthenticated(true)}
        onNavigate={setAuthView}
      />
    );
  }
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeLabel={activeLabel} onNavigate={setActiveLabel} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "100vh",
        }}
      >
        <Header
          breadcrumbLabel={activeLabel === "Home" ? "Dashboard" : activeLabel}
          toggleTheme={toggleTheme}
          theme={theme}
        />
        <div style={{ padding: "24px", overflowY: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
}

export default App;
