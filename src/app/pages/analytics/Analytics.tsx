import { useEffect, useState } from "react";
import { Row, Col, Spin, message, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import axios from "../../../shared/api/axios";
import PageLayout from "../../layout/PageLayout";
import KPIStat from "./components/KPIStat";
import AnalyticsFilters from "./components/AnalyticsFilters";
import AppointmentsTab from "./components/AppointmentsTab";
import ServicesTab from "./components/ServicesTab";
import RevenueTab from "./components/RevenueTab";
import DemographicsTab from "./components/DemographicsTab";

export default function Analytics() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<string>("30");

  const [data, setData] = useState<any>({});

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        appointmentsRes,
        revenueRes,
        schedulingRes,
        demographicsRes,
        servicesRes,
      ] = await Promise.all([
        axios.get("/analytics/appointments", { params: { range } }),
        axios.get("/analytics/revenue", { params: { range } }),
        axios.get("/analytics/scheduling", { params: { range } }),
        axios.get("/analytics/demographics", { params: { range } }),
        axios.get("/analytics/services", { params: { range } }),
      ]);
      const appointments = appointmentsRes.data.data;
      const revenue = revenueRes.data.data;
      const scheduling = schedulingRes.data.data;
      const demographics = demographicsRes.data.data;
      const services = servicesRes.data.data;

      const normalized = {
        appointments,
        revenue,
        scheduling,
        demographics,
        services,

        kpis: {
          totalAppointments:
            Number(appointments?.totalAppointments?.[0]?.total_appointments) ||
            0,

          totalRevenue: Number(revenue?.net_revenue) || 0,

          utilizationRate:
            Number(appointments?.completedAppointments?.[0]?.completion_rate) ||
            0,

          newPatients:
            Number(demographics?.repeatNewPatients?.[0]?.new_patients) || 0,
        },
      };

      console.log(normalized);

      setData(normalized);
    } catch (err) {
      message.error(t("analytics.errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range]);

  const handleRangeChange = (value: string) => {
    setRange(value);
  };

  return (
    <PageLayout title={t("analytics.title")}>
      <div className="analytics-page">
        <AnalyticsFilters range={range} setRange={handleRangeChange} />

        {loading ? (
          <div className="analytics-loading">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* KPI Row */}
            <Row gutter={[16, 16]} className="analytics-kpi-row">
              <Col span={6}>
                <KPIStat
                  title={t("analytics.kpis.totalAppointments")}
                  value={data.kpis?.totalAppointments}
                />
              </Col>

              <Col span={6}>
                <KPIStat
                  title={t("analytics.kpis.totalRevenue")}
                  value={`$${data.kpis?.totalRevenue?.toFixed(2)}`}
                />
              </Col>

              <Col span={6}>
                <KPIStat
                  title={t("analytics.kpis.utilizationRate")}
                  value={`${data.kpis?.utilizationRate}%`}
                />
              </Col>

              <Col span={6}>
                <KPIStat
                  title={t("analytics.kpis.newPatients")}
                  value={data.kpis?.newPatients}
                />
              </Col>
            </Row>

            {/* Charts */}
            <Tabs
              defaultActiveKey="appointments"
              className="analytics-tabs"
              items={[
                {
                  key: "appointments",
                  label: t("analytics.tabs.appointments"),
                  children: <AppointmentsTab data={data.appointments} />,
                },
                {
                  key: "revenue",
                  label: t("analytics.tabs.revenue"),
                  children: <RevenueTab data={data.revenue?.revenue_by_service} />,
                },
                // {
                //   key: "scheduling",
                //   label: t("analytics.tabs.scheduling"),
                //   children: <SchedulingTab data={data.scheduling} />,
                // },
                {
                  key: "demographics",
                  label: t("analytics.tabs.demographics"),
                  children: <DemographicsTab data={data.demographics} />,
                },
                {
                  key: "services",
                  label: t("analytics.tabs.services"),
                  children: <ServicesTab data={data.services} />,
                },
              ]}
            />
          </>
        )}
      </div>
    </PageLayout>
  );
}
