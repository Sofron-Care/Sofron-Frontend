import { useEffect, useState } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { Button, message, Spin, Empty, Avatar } from "antd";
import { useNavigate } from "react-router-dom";

/* =========================
   TYPES (MATCH BACKEND)
========================= */
interface FavoriteApi {
  id: number;
  organization: {
    publicId: string;
    name: string;
    city?: string;
    state?: string;
    logoUrl?: string;
  };
}

interface FavoritesResponse {
  data: {
    status: string;
    results: number;
    favorites: FavoriteApi[];
  };
}

interface FavoriteOrganization {
  id: number;
  publicId: string;
  name: string;
  city?: string;
  state?: string;
  logoUrl?: string;
}

/* =========================
   COMPONENT
========================= */
export default function FavoritesTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<FavoriteOrganization[]>([]);
  const [loading, setLoading] = useState(false);
  console.log(favorites);
  /* =========================
     FETCH
  ========================= */
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      try {
        const res = await axios.get<FavoritesResponse>("/client/favorites", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        const mapped = res.data.data.favorites.map((fav) => ({
          id: fav.id,
          publicId: fav.organization.publicId,
          name: fav.organization.name,
          city: fav.organization.city,
          state: fav.organization.state,
          logoUrl: fav.organization.logoUrl,
        }));

        setFavorites(mapped);
      } catch {
        message.error(t("clientDashboard.messages.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [t]);

  /* =========================
     ACTIONS
  ========================= */
  const handleBook = (org: FavoriteOrganization) => {
    navigate(`/demo/clinic/${org.publicId}`);
  };

  const handleRemove = async (org: FavoriteOrganization) => {
    try {
      await axios.delete(`/client/favorites/${org.publicId}`);

      setFavorites((prev) => prev.filter((o) => o.publicId !== org.publicId));

      message.success(t("clientDashboard.messages.removedFavorite"));
    } catch {
      message.error(t("clientDashboard.messages.error"));
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="client-dashboard__section client-dashboard__section--fluid">
      <h3 className="client-section-title">
        {t("clientDashboard.favorites.title")}
      </h3>

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <Spin />
        </div>
      ) : favorites.length === 0 ? (
        <Empty description={t("clientDashboard.favorites.empty")} />
      ) : (
        <div className="client-favorites-grid">
          {favorites.map((org) => (
            <div key={org.publicId} className="client-favorites-card">
              <div className="client-favorites-card__content">
                <Avatar src={org.logoUrl} size={44}>
                  {org.name[0]}
                </Avatar>

                <div>
                  <p className="client-favorites-card__name">{org.name}</p>

                  {(org.city || org.state) && (
                    <p className="client-favorites-card__meta">
                      {[org.city, org.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="client-favorites-card__actions">
                <Button type="primary" onClick={() => handleBook(org)}>
                  {t("clientDashboard.actions.book")}
                </Button>

                <Button danger onClick={() => handleRemove(org)}>
                  {t("clientDashboard.actions.remove")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
