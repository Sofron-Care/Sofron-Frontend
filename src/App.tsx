import { Routes, Route } from "react-router-dom";

import Home from "./marketing/pages/Home";
import WhyCashCare from "./marketing/pages/WhyCashCare";
import Product from "./marketing/pages/Product";
import Interest from "./marketing/pages/Interest";

import Entry from "./app/pages/home/pages/Entry";
import Login from "./app/auth/Login";
import RegisterClinic from "./app/auth/RegisterClinic";
import AppShell from "./app/layout/AppShell";
import Services from "./app/pages/services/Services";
import Onboarding from "./app/pages/onboarding/Onboarding";
import Specialists from "./app/pages/specialists/Specialists";
import Schedule from "./app/pages/schedules/Schedule";
import Dashboard from "./app/pages/dashboard/Dashboard";
import Appointments from "./app/pages/appointments/Appointments";
import Analytics from "./app/pages/analytics/Analytics";
import Documents from "./app/pages/documents/Documents";
import Notifications from "./app/pages/notifications/Notifications";
import Patients from "./app/pages/patients/Patients";
import Settings from "./app/pages/settings/Settings";
import OrgDeactivated from "./app/pages/general/OrgDeactivated";
import SearchResultsPage from "./app/pages/searchResults/SearchResults";

function App() {
  return (
    <Routes>
      {/* Marketing */}
      <Route path="/" element={<Home />} />
      <Route path="/why-cash-care" element={<WhyCashCare />} />
      <Route path="/product" element={<Product />} />
      <Route path="/contact" element={<Interest />} />

      {/* Demo Public */}
      <Route path="/demo" element={<Entry />} />
      <Route path="/demo/search" element={<SearchResultsPage />} />
      <Route path="/demo/login" element={<Login />} />
      <Route path="/demo/register/clinic" element={<RegisterClinic />} />

      {/* Demo App */}
      <Route path="/demo/app" element={<AppShell />}>
        <Route path="onboarding" element={<Onboarding />} />
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="specialists" element={<Specialists />} />
        <Route path="services" element={<Services />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="patients" element={<Patients />} />
        <Route path="documents" element={<Documents />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/demo/org-deactivated" element={<OrgDeactivated />} />
    </Routes>
  );
}

export default App;
