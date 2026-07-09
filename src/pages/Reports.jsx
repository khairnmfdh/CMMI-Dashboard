import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody, Text, Select, Button, Table, Badge } from "@legion-ui-kit/react-core";
import styles from "../Reports.module.css";

const projectOptions = [{ label: "All Projects", value: "all" }];
const areaOptions = [{ label: "All Areas", value: "all" }];
const monthOptions = [
  { label: "July 2026", value: "2026-07" },
  { label: "June 2026", value: "2026-06" },
  { label: "May 2026", value: "2026-05" },
];

const statCards = [
  { label: "Total Issues", value: 3, sub: "Overall CMMI Score · Level 3" },
  { label: "Resolved", value: 28, sub: "39/50 practices met" },
  { label: "In Progress", value: 10, sub: "39/50 practices met" },
  { label: "To-Do", value: 4, sub: "39/50 practices met" },
];

const issuesChartData = [
  { month: "Jan", Open: 10500, Closed: 20500 },
  { month: "Feb", Open: 12000, Closed: 20000 },
  { month: "Mar", Open: 6500, Closed: 15500 },
  { month: "Apr", Open: 8500, Closed: 21500 },
  { month: "Mei", Open: 20500, Closed: 8000 },
];

const scoreTrendData = [
  { month: "JAN", PR: 12, PQA: 18, VV: 20 },
  { month: "FEB", PR: 14, PQA: 20, VV: 19 },
  { month: "MAR", PR: 18, PQA: 38, VV: 29 },
  { month: "APR", PR: 22, PQA: 32, VV: 30 },
  { month: "MAY", PR: 46, PQA: 46, VV: 48 },
];

const issuesPreview = [
  { id: "PR-1.1", area: "Peer Review", project: "Netmonk", title: "Auth module Riview", status: "Done", created: "31.01.2019", closed: "31.01.2019" },
  { id: "PR-1.2", area: "Peer Review", project: "PaDi UMKM", title: "Cart calculation logic review", status: "In Progress", created: "31.01.2019", closed: "31.01.2019" },
  { id: "SQA-1.1", area: "SQA", project: "LegionAI", title: "Functional  test- logic flow", status: "Done", created: "30.01.2019", closed: "30.01.2019" },
];

function StatusBadge({ status }) {
  return (
    <Badge
      color={status === "Done" ? "success" : "information"}
      label={status}
    />
  );
}

export const Reports = () => {
  const [project, setProject] = useState("all");
  const [area, setArea] = useState("all");
  const [month, setMonth] = useState("2026-07");

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className={styles.reports}>
      <div className={styles.filterRow}>
        <div className={styles.filterLeft}>
          <Select
            options={projectOptions}
            value={project}
            onChange={setProject}
            inputWrapperClassName={styles.filterSelectWrapper}
            inputClassName={styles.filterSelectInput}
          />
          <Select
            options={areaOptions}
            value={area}
            onChange={setArea}
            inputWrapperClassName={styles.filterSelectWrapper}
            inputClassName={styles.filterSelectInput}
          />
          <Select
            options={monthOptions}
            value={month}
            onChange={setMonth}
            inputWrapperClassName={styles.filterSelectWrapper}
            inputClassName={styles.filterSelectInput}
          />
        </div>

        <Button color="primary" variant="solid" onClick={handleDownloadPdf}>
          ⬇ Download PDF
        </Button>
      </div>

      <div className={styles.statsRow}>
        {statCards.map((stat) => (
          <Card key={stat.label} className={styles.statCard} elevation="none">
            <Text as="p" color="white" className={styles.statLabel}>{stat.label}</Text>
            <Text as="h2" color="white" className={styles.statValue}>{stat.value}</Text>
            <Text as="p" color="white" className={styles.statSub}>{stat.sub}</Text>
          </Card>
        ))}
      </div>

      <div className={styles.chartsRow}>
        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader title="Monthly Issues - Open vs Closed" noDivider />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={issuesChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
                />
                <Bar dataKey="Open" fill="#12B76A" radius={[4, 4, 0, 0]} barSize={26} />
                <Bar dataKey="Closed" fill="#F04438" radius={[4, 4, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card bordered elevation="elevation-1" className={styles.chartCard}>
          <CardHeader title="Monthly Score Trend by Process Area" noDivider />
          <CardBody>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={scoreTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="plainline"
                  formatter={(value) => <span className={styles.legendLabel}>{value}</span>}
                />
                <Line type="monotone" dataKey="PR" stroke="#12B76A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="PQA" stroke="#875BF7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="VV" stroke="#F04478" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card bordered elevation="elevation-1" className={styles.tablePanel}>
        <CardHeader title="Issues List Preview" noDivider />
        <CardBody>
          <Table borderCell="row" hoverable className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>AREAS</th>
                <th>PROJECTED</th>
                <th>TITTLE</th>
                <th>STATUS</th>
                <th>CREATED</th>
                <th>CLOSED</th>
              </tr>
            </thead>
            <tbody>
              {issuesPreview.map((row) => (
                <tr key={row.id}>
                  <td className={styles.idCell}>{row.id}</td>
                  <td>{row.area}</td>
                  <td>{row.project}</td>
                  <td>{row.title}</td>
                  <td><StatusBadge status={row.status} /></td>
                  <td>{row.created}</td>
                  <td>{row.closed}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Reports;