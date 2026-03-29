import { Button, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(25);

  const handleSearch = () => {
    if (!query) return;

    navigate(
      `/demo/search?city=${encodeURIComponent(query)}&radius=${radius}`,
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("entry.hero.searchPlaceholder")}
              style={{ maxWidth: 320 }}
              onPressEnter={handleSearch}
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
          <div className="card">{t("entry.hero.visualPlaceholder")}</div>
        </div>
      </div>
    </section>
  );
}
