import { useEffect, useState } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import {
  Table,
  Button,
  Modal,
  Rate,
  Input,
  message,
  Popconfirm,
  Pagination,
} from "antd";
import { formatTime } from "../../../../utils/time";
import type { Appointment } from "../../../appointments/types";

/* =========================
   RESPONSE TYPE
========================= */
interface AppointmentResponse {
  data: {
    appointments: Appointment[];
  };
}

interface Review {
  id: number;
  rating: number;
  text?: string;
  createdAt: string;
  organization?: {
    name: string;
    publicId: string;
  };
  appointment?: {
    serviceBooked?: {
      name: string;
    };
    startTime: string;
  };
}

export default function ReviewsTab() {
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const pageSize = 5;

  /* =========================
     FETCH PAST APPOINTMENTS
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [appointmentsRes, reviewsRes] = await Promise.all([
          axios.get<AppointmentResponse>("/appointments/me?filter=past"),
          axios.get("/reviews/me"),
        ]);

        const filteredAppointments =
          appointmentsRes.data.data.appointments.filter(
            (appt: any) => !appt.hasReview,
          );

        setAppointments(filteredAppointments);
        setReviews(reviewsRes.data.data.reviews);
      } catch {
        message.error(t("clientDashboard.messages.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const handleUpdateReview = async () => {
    if (!editingReview) return;

    try {
      setSubmitting(true);

      await axios.patch(`/reviews/${editingReview.id}`, {
        rating,
        text,
      });

      message.success(t("clientDashboard.reviews.updated"));

      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id ? { ...r, rating, text } : r,
        ),
      );

      setEditingReview(null);
    } catch {
      message.error(t("clientDashboard.messages.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      await axios.delete(`/reviews/${id}`);

      message.success(t("clientDashboard.reviews.deleted"));

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      message.error(t("clientDashboard.messages.error"));
    }
  };
  /* =========================
     OPEN MODAL
  ========================= */
  const openReviewModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setRating(0);
    setText("");
  };

  /* =========================
     SUBMIT REVIEW
  ========================= */
  const handleSubmitReview = async () => {
    if (!selectedAppt) return;

    if (!rating) {
      message.warning(t("clientDashboard.reviews.ratingRequired"));
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `/reviews/organization/${selectedAppt.organization?.publicId}`,
        {
          appointmentId: selectedAppt.id,
          rating,
          text,
        },
      );

      message.success(t("clientDashboard.reviews.success"));

      // remove from UI
      setAppointments((prev) => prev.filter((a) => a.id !== selectedAppt.id));

      setSelectedAppt(null);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || t("clientDashboard.messages.error"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     TABLE COLUMNS
  ========================= */
  const columns = [
    {
      title: t("clientDashboard.reviews.service"),
      dataIndex: ["serviceBooked", "name"],
      key: "service",
    },
    {
      title: t("clientDashboard.reviews.clinic"),
      dataIndex: ["organization", "name"],
      key: "clinic",
    },
    {
      title: t("clientDashboard.reviews.time"),
      key: "time",
      render: (_: any, record: Appointment) => formatTime(record.startTime),
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: Appointment) => (
        <Button onClick={() => openReviewModal(record)}>
          {t("clientDashboard.reviews.leaveReview")}
        </Button>
      ),
    },
  ];

  const paginatedReviews = reviews.slice(
    (reviewPage - 1) * pageSize,
    reviewPage * pageSize,
  );

  /* =========================
     UI
  ========================= */
  return (
    <div className="client-dashboard__section client-dashboard__section--constrained">
      <h3 className="client-section-title">
        {t("clientDashboard.reviews.title")}
      </h3>

      {appointments.length === 0 ? (
        <p>{t("clientDashboard.reviews.empty")}</p>
      ) : (
        <div className="client-appointments-table-wrapper">
          <Table
            rowKey="id"
            dataSource={appointments}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}

      {reviews.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>{t("clientDashboard.reviews.yourReviews")}</h3>

          <div className="client-reviews__list">
            {paginatedReviews.map((review) => (
              <div key={review.id} className="client-reviews__card">
                <div className="client-reviews__info">
                  <p className="client-reviews__primary">
                    {review.appointment?.serviceBooked?.name}
                  </p>

                  <p className="client-reviews__secondary">
                    {review.organization?.name}
                  </p>

                  <Rate disabled allowHalf value={review.rating} />

                  {review.text && (
                    <p className="client-reviews__meta">{review.text}</p>
                  )}
                </div>

                <div className="client-reviews__actions">
                  <Button
                    onClick={() => {
                      setEditingReview(review);
                      setRating(review.rating);
                      setText(review.text || "");
                    }}
                  >
                    {t("common.edit")}
                  </Button>

                  <Popconfirm
                    title={t("clientDashboard.reviews.deleteConfirmTitle")}
                    description={t("clientDashboard.reviews.deleteConfirmDesc")}
                    okText={t("common.delete")}
                    cancelText={t("common.cancel")}
                    onConfirm={() => handleDeleteReview(review.id)}
                  >
                    <Button danger>{t("common.delete")}</Button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ PAGINATION GOES HERE */}
          <Pagination
            current={reviewPage}
            pageSize={pageSize}
            total={reviews.length}
            onChange={(page) => setReviewPage(page)}
            style={{ marginTop: 16 }}
          />
        </div>
      )}

      {/* REVIEW MODAL */}
      <Modal
        title={
          editingReview
            ? t("clientDashboard.reviews.editTitle")
            : t("clientDashboard.reviews.modalTitle")
        }
        open={!!selectedAppt || !!editingReview}
        onCancel={() => {
          setSelectedAppt(null);
          setEditingReview(null);
        }}
        onOk={editingReview ? handleUpdateReview : handleSubmitReview}
        confirmLoading={submitting}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Rate allowHalf value={rating} onChange={setRating} />

          <Input.TextArea
            rows={4}
            placeholder={t("clientDashboard.reviews.optionalText")}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
