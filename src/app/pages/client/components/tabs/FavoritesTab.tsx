import { useEffect, useState } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

/* =========================
   TYPES (MATCH BACKEND)
========================= */
interface FavoriteOrganization {
  id: number;
  publicId: string;
  name: string;
  city?: string;
  state?: string;
}

/* =========================
   RESPONSE
========================= */
interface FavoritesResponse {
  data: {
    favorites: FavoriteOrganization[];
  };
}

export default function FavoritesTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<FavoriteOrganization[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH
  ========================= */
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);

      try {
        const res = await axios.get<FavoritesResponse>(
          "/client/favorites"
        );

        setFavorites(res.data.data.favorites);
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
    navigate(`/booking/${org.publicId}`);
  };

  const handleRemove = async (org: FavoriteOrganization) => {
    try {
      await axios.delete(`/client/favorites/${org.publicId}`);

      setFavorites((prev) =>
        prev.filter((o) => o.publicId !== org.publicId)
      );

      message.success(t("clientDashboard.messages.removedFavorite"));
    } catch {
      message.error(t("clientDashboard.messages.error"));
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <div className="client-dashboard__section">
      <h3>{t("clientDashboard.favorites.title")}</h3>

      {favorites.length === 0 ? (
        <p>{t("clientDashboard.favorites.empty")}</p>
      ) : (
        <div className="client-favorites__list">
          {favorites.map((org) => (
            <div key={org.publicId} className="client-favorites__card">
              <div className="client-favorites__info">
                <p className="client-favorites__name">
                  {org.name}
                </p>

                {(org.city || org.state) && (
                  <p className="client-favorites__meta">
                    {org.city}, {org.state}
                  </p>
                )}
              </div>

              <div className="client-favorites__actions">
                <Button onClick={() => handleBook(org)}>
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