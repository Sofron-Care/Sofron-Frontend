import { Button, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDemo } from "../../../demo/useDemo";

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(25);
  const [businessType, setBusinessType] = useState<string | undefined>();
  const { isDemo } = useDemo();

  const handleSearch = () => {
    if (isDemo) {
      navigate(
        `/demo/search?city=Boston&radius=25${
          businessType ? `&businessType=${businessType}` : ""
        }`,
      );
      return;
    }

    navigate(
      `/demo/search?city=${encodeURIComponent(query)}&radius=${radius}${
        businessType ? `&businessType=${businessType}` : ""
      }`,
    );
  };

  return (
    <section className="section section-no-top">
      <div className="container hero-grid">
        {/* LEFT */}
        <div>
          <h1 className="hero-title">{t("entry.hero.title")}</h1>

          <p className="hero-subtitle">{t("entry.hero.subtitle")}</p>

          <div className="hero-cta-group">
            <Input
              size="large"
              value={isDemo ? "Boston" : query}
              disabled={isDemo}
              onChange={(e) => {
                if (!isDemo) setQuery(e.target.value);
              }}
              placeholder={t("entry.hero.searchPlaceholder")}
              style={{ maxWidth: 320 }}
              onPressEnter={handleSearch}
            />

            <Select
              allowClear
              size="large"
              value={businessType}
              onChange={setBusinessType}
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
              size="large"
              value={radius}
              onChange={setRadius}
              style={{ width: 120 }}
              options={[
                { value: 5, label: "5 mi" },
                { value: 10, label: "10 mi" },
                { value: 25, label: "25 mi" },
                { value: 50, label: "50 mi" },
                { value: 100, label: "100 mi" },
              ]}
            />

            <Button type="primary" size="large" onClick={handleSearch}>
              {t("entry.hero.searchButton")}
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="card product-preview-card">
            <img
              src="/images/previews/booking_preview.png"
              alt="Sofron dashboard preview"
              className="product-preview-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
