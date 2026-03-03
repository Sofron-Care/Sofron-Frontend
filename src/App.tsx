import { Routes, Route } from "react-router-dom";

import Home from "./marketing/pages/Home";
import WhyCashCare from "./marketing/pages/WhyCashCare";
import Product from "./marketing/pages/Product";
import Interest from "./marketing/pages/Interest";

import DemoEntry from "./demo/pages/DemoEntry";
import Login from "./app/auth/Login";
import RegisterClinic from "./app/auth/RegisterClinic";
import AppShell from "./app/layout/AppShell";
import Services from "./app/pages/services/Services";
import Onboarding from "./app/pages/onboarding/Onboarding";
import Specialists from "./app/pages/specialists/Specialists";
import Schedule from "./app/pages/schedules/Schedule";
import Dashboard from "./app/pages/dashboard/Dashboard";
// import Appointments from "./app/appointments/Appointments";
// import Patients from "./app/patients/Patients";

function App() {
  return (
    <Routes>
      {/* Marketing */}
      <Route path="/" element={<Home />} />
      <Route path="/why-cash-care" element={<WhyCashCare />} />
      <Route path="/product" element={<Product />} />
      <Route path="/contact" element={<Interest />} />

      {/* Demo Public */}
      <Route path="/demo" element={<DemoEntry />} />
      <Route path="/demo/login" element={<Login />} />
      <Route path="/demo/register/clinic" element={<RegisterClinic />} />
      {/* Demo App */}
      <Route path="/demo/app" element={<AppShell />}>
        <Route path="onboarding" element={<Onboarding />} />
        <Route index element={<Dashboard />} />
        {/* <Route path="appointments" element={<Appointments />} /> */}
        <Route path="specialists" element={<Specialists />} />
        {/* <Route path="patients" element={<Patients />} /> */}
        <Route path="services" element={<Services />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>
    </Routes>
  );
}

export default App;
