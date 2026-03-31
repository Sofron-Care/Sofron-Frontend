import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Empty, message, Modal, Rate, Pagination } from "antd";
import axios from "../../../shared/api/axios";
import Nav from "../home/components/Nav";
import Footer from "../home/components/Footer";
import BookingHeader from "./components/BookingHeader";
import BookingStepIndicator from "./components/BookingStepIndicator";
import BookingSummary from "./components/BookingSummary";
import ServiceStep from "./components/ServiceStep";
import SpecialistStep from "./components/SpecialistStep";
import DateTimeStep from "./components/DateTimeStep";
import DetailsStep from "./components/DetailsStep";
import ConfirmStep from "./components/ConfirmStep";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

type Organization = {
  id: number;
  publicId: string;
  name: string;
  phone?: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  website?: string;
  logoUrl?: string;
  schedulingMode: "organization" | "specialist";
  cancellationPolicy?: {
    minHoursBefore: number;
    feePercentage: number;
    isEnabled: boolean;
    appliedTo: string;
  } | null;
  reviews?: any[];
  rating: string;
  reviewCount: number;
};

type Service = {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: number | string;
  categoryId?: number | null;
  otherCategory?: string | null;
};

type ServiceCategory = {
  id: number | null;
  title: string;
  services: Service[];
};

type Specialist = {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  phone?: string;
  specializations?: string[];
};

type AvailabilitySlot = {
  start: string;
  end: string;
  displayStart: string;
  displayEnd: string;
};

type StepKey = "service" | "specialist" | "datetime" | "details" | "confirm";

export default function Booking() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { publicId } = useParams<{ publicId: string }>();

  const [org, setOrg] = useState<Organization | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [orgError, setOrgError] = useState(false);

  const [servicesLoading, setServicesLoading] = useState(false);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [specialistsLoading, setSpecialistsLoading] = useState(false);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);

  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  const [step, setStep] = useState<StepKey>("service");
  const [completedSteps, setCompletedSteps] = useState<StepKey[]>([]);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const reviews = org?.reviews || [];

  const [booking, setBooking] = useState({
    serviceId: null as number | null,
    serviceName: "",
    duration: null as number | null,
    price: null as number | string | null,

    specialistId: null as number | null,
    specialistName: "",

    date: "",
    timeStart: "",
    timeEnd: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    details: "",
  });

  const stepOrder: StepKey[] = useMemo(
    () => ["service", "specialist", "datetime", "details", "confirm"],
    [],
  );

  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * pageSize;
    return reviews.slice(start, start + pageSize);
  }, [reviews, page, pageSize]);

  useEffect(() => {
    if (!publicId) return;

    const fetchOrganization = async () => {
      try {
        setLoadingOrg(true);
        setOrgError(false);

        const res = await axios.get(`/public/organizations/${publicId}`);
        setOrg(res.data.data.organization);
      } catch (err) {
        console.error(err);
        setOrgError(true);
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchOrganization();
  }, [publicId]);

  useEffect(() => {
    if (user) {
      setBooking((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!publicId) return;

    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const res = await axios.get(
          `/public/organizations/${publicId}/services`,
        );
        setFeaturedServices(res.data.data.featuredServices || []);
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error(err);
        message.error(t("booking.messages.loadServicesError"));
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, [publicId]);

  useEffect(() => {
    if (
      !publicId ||
      !org ||
      org.schedulingMode !== "specialist" ||
      !booking.serviceId
    ) {
      setSpecialists([]);
      return;
    }

    const fetchSpecialists = async () => {
      try {
        setSpecialistsLoading(true);
        const res = await axios.get(
          `/public/organizations/${publicId}/specialists`,
          {
            params: { serviceId: booking.serviceId },
          },
        );
        setSpecialists(res.data.data.specialists || []);
      } catch (err) {
        console.error(err);
        message.error(t("booking.messages.loadSpecialistsError"));
      } finally {
        setSpecialistsLoading(false);
      }
    };

    fetchSpecialists();
  }, [publicId, org, booking.serviceId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFavorites = async () => {
      try {
        const res = await axios.get("/client/favorites");

        const ids = res.data.data.map((fav: any) => fav.organization.publicId);

        setFavorites(ids);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const isFavorited = useMemo(() => {
    return !!org?.publicId && favorites.includes(org.publicId);
  }, [favorites, org]);

  const markComplete = (stepKey: StepKey) => {
    setCompletedSteps((prev) =>
      prev.includes(stepKey) ? prev : [...prev, stepKey],
    );
  };

  const canGoToStep = (target: StepKey) => {
    const targetIndex = stepOrder.indexOf(target);
    const currentIndex = stepOrder.indexOf(step);

    if (targetIndex <= currentIndex) return true;

    if (target === "specialist") return !!booking.serviceId;
    if (target === "datetime") {
      if (!booking.serviceId) return false;
      if (org?.schedulingMode === "organization") return true;
      return !!booking.specialistId;
    }
    if (target === "details") return !!booking.timeStart;
    if (target === "confirm") return !!booking.timeStart;

    return false;
  };

  const handleStepChange = (target: StepKey) => {
    if (!canGoToStep(target)) return;
    setStep(target);
  };

  const handleServiceSelect = (service: Service) => {
    setBooking((prev) => ({
      ...prev,
      serviceId: service.id,
      serviceName: service.name,
      duration: service.duration,
      price: service.price,
      specialistId: null,
      specialistName: "",
      date: "",
      timeStart: "",
      timeEnd: "",
    }));

    markComplete("service");

    if (org?.schedulingMode === "organization") {
      setStep("datetime");
    } else {
      setStep("specialist");
    }
  };

  const handleFavoriteToggle = async () => {
    if (!org?.publicId) return;

    setFavLoading(true);
    try {
      if (isFavorited) {
        await axios.delete(`/client/favorites/${org.publicId}`);

        setFavorites((prev) => prev.filter((id) => id !== org.publicId));
      } else {
        await axios.post(`/client/favorites/${org.publicId}`);

        setFavorites((prev) => [...prev, org.publicId]);
      }
    } catch (err) {
      message.error("Failed to update favorites");
    } finally {
      setFavLoading(false);
    }
  };

  const handleSpecialistSelect = (specialist: Specialist) => {
    setBooking((prev) => ({
      ...prev,
      specialistId: specialist.id,
      specialistName: `${specialist.firstName} ${specialist.lastName}`,
      date: "",
      timeStart: "",
      timeEnd: "",
    }));

    markComplete("specialist");
    setStep("datetime");
  };

  const handleLoadAvailability = async (date: string) => {
    if (!publicId || !booking.serviceId) return;

    setBooking((prev) => ({
      ...prev,
      date,
      timeStart: "",
      timeEnd: "",
    }));

    try {
      setAvailabilityLoading(true);
      setAvailability([]);

      const params: any = {
        serviceId: booking.serviceId,
        date,
      };

      if (org?.schedulingMode === "specialist" && booking.specialistId) {
        params.specialistId = booking.specialistId;
      }

      const res = await axios.get(
        `/public/organizations/${publicId}/availability`,
        { params },
      );

      setAvailability(res.data.data.availability || []);
    } catch (err) {
      console.error(err);
      message.error(t("booking.messages.loadAvailabilityError"));
      setAvailability([]);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleSlotSelect = (date: string, slot: AvailabilitySlot) => {
    setBooking((prev) => ({
      ...prev,
      date,
      timeStart: slot.start,
      timeEnd: slot.end,
    }));

    markComplete("datetime");
    setStep("details");
  };

  const handleDetailsContinue = () => {
    markComplete("details");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    if (!org || !booking.serviceId || !booking.timeStart) return;
    let res;
    try {
      if (isAuthenticated) {
        res = await axios.post("/appointments", {
          serviceId: booking.serviceId,
          organizationId: org.id,
          specialistId: booking.specialistId,
          start: booking.timeStart,
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
        });
      } else {
        res = await axios.post("/appointments/guest", {
          serviceId: booking.serviceId,
          organizationPublicId: org.publicId,
          specialistId: booking.specialistId,
          start: booking.timeStart,
          guestData: {
            firstName: booking.firstName,
            lastName: booking.lastName,
            email: booking.email,
            phone: booking.phone,
          },
        });
      }

      navigate(`/book/clinic/${org.publicId}/confirmed`, {
        state: {
          appointment: res.data.data.appointment,
          service: booking.serviceName,
          org,
        },
      });

      message.success(t("booking.messages.bookingSuccess"));
    } catch (err: any) {
      console.error(err);
      message.error(
        err?.response?.data?.message || t("booking.messages.bookingError"),
      );
    }
  };

  if (loadingOrg) {
    return (
      <>
        <Nav />
        <div className="section">
          <div className="booking-loading">
            <Spin size="large" />
            <div>{t("common.loading")}</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (orgError || !org) {
    return (
      <>
        <Nav />
        <div className="section">
          <div className="container">
            <Empty description={t("booking.messages.orgNotFound")} />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />

      <div className="section booking-page">
        <div className="container">
          <BookingHeader
            organization={org}
            isAuthenticated={isAuthenticated}
            isFavorited={isFavorited}
            favLoading={favLoading}
            onToggleFavorite={handleFavoriteToggle}
            onOpenReviews={() => {
              setPage(1);
              setReviewsOpen(true);
            }}
          />

          <BookingStepIndicator
            currentStep={step}
            completedSteps={completedSteps}
            schedulingMode={org.schedulingMode}
            onStepChange={handleStepChange}
          />

          <div className="booking-body">
            <div className="booking-main">
              {step === "service" && (
                <ServiceStep
                  loading={servicesLoading}
                  featuredServices={featuredServices}
                  categories={categories}
                  selectedServiceId={booking.serviceId}
                  onSelect={handleServiceSelect}
                />
              )}

              {step === "specialist" && (
                <SpecialistStep
                  loading={specialistsLoading}
                  specialists={specialists}
                  selectedSpecialistId={booking.specialistId}
                  onSelect={handleSpecialistSelect}
                />
              )}

              {step === "datetime" && (
                <DateTimeStep
                  loading={availabilityLoading}
                  availability={availability}
                  selectedDate={booking.date}
                  onDateChange={handleLoadAvailability}
                  onSlotSelect={handleSlotSelect}
                />
              )}

              {step === "details" && (
                <DetailsStep
                  details={booking.details}
                  firstName={booking.firstName}
                  lastName={booking.lastName}
                  email={booking.email}
                  phone={booking.phone}
                  onDetailsChange={(value) =>
                    setBooking((prev) => ({ ...prev, details: value }))
                  }
                  onFirstNameChange={(value) =>
                    setBooking((prev) => ({ ...prev, firstName: value }))
                  }
                  onLastNameChange={(value) =>
                    setBooking((prev) => ({ ...prev, lastName: value }))
                  }
                  onEmailChange={(value) =>
                    setBooking((prev) => ({ ...prev, email: value }))
                  }
                  onPhoneChange={(value) =>
                    setBooking((prev) => ({ ...prev, phone: value }))
                  }
                  onContinue={handleDetailsContinue}
                />
              )}

              {step === "confirm" && (
                <ConfirmStep
                  organization={org}
                  booking={booking}
                  onConfirm={handleConfirm}
                  onBack={() => setStep("details")}
                />
              )}
            </div>

            <BookingSummary organization={org} booking={booking} />
          </div>
        </div>
      </div>

      <Footer />

      <Modal
        title="Reviews"
        open={reviewsOpen}
        onCancel={() => setReviewsOpen(false)}
        footer={null}
      >
        {reviews.length === 0 ? (
          <Empty description="No reviews yet" />
        ) : (
          <>
            <div className="reviews-modal-body">
              {paginatedReviews.map((review: any) => (
                <div key={review.id} className="review-item">
                  <div className="review-item__header">
                    <Rate
                      disabled
                      value={review.rating}
                      style={{ color: "var(--color-primary)", fontSize: 14 }}
                    />
                    <span className="review-item__date">
                      {dayjs(review.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>

                  <p className="review-item__text">{review.text}</p>
                </div>
              ))}
            </div>

            <Pagination
              current={page}
              pageSize={pageSize}
              total={reviews.length}
              onChange={(p) => setPage(p)}
              style={{ marginTop: 16, textAlign: "center" }}
            />
          </>
        )}
      </Modal>
    </>
  );
}
