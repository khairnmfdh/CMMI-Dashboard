import { useState } from "react";
import "./App.css";
import Sidebar from "./sidebar";
import Header from "./header";
import Dashboard from "./pages/Dashboard";
import ProcessArea from "./pages/ProcessArea";
import { CardBody } from "@legion-ui-kit/react-core";
import Projects from "./pages/Projects";
import Artifacts from "./pages/Artifacts";
import Reports from "./pages/Reports";

function App() {
  const [activeLabel, setActiveLabel] = useState("Home");

  const renderPage = () => {
    switch (activeLabel) {
      case "Home":
        return <Dashboard />;
      case "Projects":
        return <Projects />;
      case "Artifacts":
        return <Artifacts />;
      case "Peer Review":
        return <ProcessArea key="peer-review" initialTab="peer-review" />;
      case "Software Quality Assurance":
        return <ProcessArea key="sqa" initialTab="sqa" />;
      case "Validation and Verification":
        return <ProcessArea key="vv" initialTab="vv" />;
      case "Reports":
        return <Reports />;
      case "Product 1":
      case "Product 2":
      case "Product 3":
        return (
          <CardBody title={activeLabel}>
            {activeLabel} page coming soon
          </CardBody>
        );
      case "Service 1":
      case "Service 2":
      case "Service 3":
        return (
          <CardBody title={activeLabel}>
            {activeLabel} page coming soon
          </CardBody>
        );
      case "About":
        return <CardBody title="About">About page coming soon</CardBody>;
      default:
        return <Dashboard />;
    }
  };

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
        />
        <div style={{ padding: "24px", overflowY: "auto" }}>{renderPage()}</div>
      </div>
    </div>
  );
}

export default App;
