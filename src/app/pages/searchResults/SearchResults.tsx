import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spin, Empty, Input, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "./../../../shared/api/axios";
import OrganizationCard from "./components/OrganizationCard";
import Nav from "../home/components/Nav";
import Footer from "../home/components/Footer";

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

  const [cityInput, setCityInput] = useState(params.get("city") || "");
  const [radiusInput, setRadiusInput] = useState(params.get("radius") || "25");
  const navigate = useNavigate();
  const city = params.get("city") || "";
  const radius = params.get("radius") || "25";

  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `/organizations/search?city=${city}&radius=${radius}`,
        );

        setOrgs(res.data.data.organizations);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (city) fetchResults();
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
                    `/demo/search?city=${cityInput}&radius=${radiusInput}`,
                  );
                }}
              >
                Search
              </Button>
            </div>
          </div>
          <h2 className="results-heading">
            Results near "{city}" ({radius} miles)
          </h2>

          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          )}

          {!loading && error && <Empty description="Something went wrong" />}

          {!loading && !error && orgs.length === 0 && (
            <Empty description="No clinics found in this area" />
          )}

          {!loading && !error && orgs.length > 0 && (
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
