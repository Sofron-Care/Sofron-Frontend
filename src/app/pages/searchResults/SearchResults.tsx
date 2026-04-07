import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin, Empty, Input, Select, Button } from "antd";
import axios from "./../../../shared/api/axios";
import OrganizationCard from "./components/OrganizationCard";
import Nav from "../home/components/Nav";
import Footer from "../home/components/Footer";
import { useTranslation } from "react-i18next";

type Organization = {
  publicId: string;
  name: string;
  city: string;
  state: string;
  streetAddress: string;
  logoUrl?: string;
};

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const city = params.get("city") || "";
  const radius = params.get("radius") || "25";

  const [cityInput, setCityInput] = useState(city);
  const [radiusInput, setRadiusInput] = useState(radius);

  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const businessTypeParam = params.get("businessType") || "";

  const [businessType, setBusinessType] = useState(businessTypeParam);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/organizations/search?city=${city}&radius=${radius}${
            businessType ? `&businessType=${businessType}` : ""
          }`,
        );

        setOrgs(res.data.data.organizations);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchResults();
    } else {
      setOrgs([]);
      setLoading(false);
      setError(false);
    }
  }, [city, radius]);

  return (
    <>
      <Nav />
      <div className="section">
        <div className="container">
          <div className="search-bar search-bar--results">
            <div className="search-bar-inner">
              <Input
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="City, state, or zip"
                size="large"
              />

              <Select
                allowClear
                value={businessType || undefined}
                onChange={(value) => setBusinessType(value)}
                size="large"
                style={{ width: 220 }}
                placeholder={t("search.businessTypePlaceholder")}
                options={[
                  {
                    value: "physical_therapy",
                    label: t("businessTypes.physical_therapy"),
                  },
                  {
                    value: "chiropractic",
                    label: t("businessTypes.chiropractic"),
                  },
                  {
                    value: "massage_therapy",
                    label: t("businessTypes.massage_therapy"),
                  },
                  {
                    value: "personal_training",
                    label: t("businessTypes.personal_training"),
                  },
                  { value: "recovery", label: t("businessTypes.recovery") },
                ]}
              />

              <Select
                value={radiusInput}
                onChange={(value) => setRadiusInput(value)}
                size="large"
                style={{ width: 120 }}
                options={[
                  { value: "5", label: "5 mi" },
                  { value: "10", label: "10 mi" },
                  { value: "25", label: "25 mi" },
                  { value: "50", label: "50 mi" },
                ]}
              />

              <Button
                type="primary"
                size="large"
                onClick={() => {
                  navigate(
                    `/demo/search?city=${cityInput}&radius=${radiusInput}${
                      businessType ? `&businessType=${businessType}` : ""
                    }`,
                  );
                }}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Empty state BEFORE search */}
          {!city && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Empty description="Enter a location to find clinics near you" />
            </div>
          )}

          {/* Results heading */}
          {city && (
            <h2 className="results-heading">
              {t("search.resultsHeading", {
                city,
                radius,
                type: businessType ? t(`businessTypes.${businessType}`) : "",
              })}
            </h2>
          )}

          {/* Loading */}
          {city && loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          )}

          {/* Error */}
          {city && !loading && error && (
            <Empty description="Something went wrong" />
          )}

          {/* No results */}
          {city && !loading && !error && orgs.length === 0 && (
            <Empty description="No clinics found in this area" />
          )}

          {/* Results */}
          {city && !loading && !error && orgs.length > 0 && (
            <div className="results-list">
              {orgs.map((org) => (
                <OrganizationCard key={org.publicId} org={org} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
