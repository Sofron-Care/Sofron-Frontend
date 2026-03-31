import { Spin } from "antd";

type Specialist = {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  specializations?: string[];
};

type Props = {
  loading: boolean;
  specialists: Specialist[];
  selectedSpecialistId: number | null;
  onSelect: (specialist: Specialist) => void;
};

export default function SpecialistStep({
  loading,
  specialists,
  selectedSpecialistId,
  onSelect,
}: Props) {
  if (loading) {
    return (
      <div className="booking-panel booking-panel--loading">
        <Spin />
      </div>
    );
  }

  console.log(specialists)

  return (
    <div className="booking-panel">
      <h2 className="booking-panel__title">Select a specialist</h2>

      <div className="booking-specialist-list">
        {specialists.map((specialist) => (
          <button
            key={specialist.id}
            type="button"
            className={`booking-specialist-card ${
              selectedSpecialistId === specialist.id ? "is-selected" : ""
            }`}
            onClick={() => onSelect(specialist)}
          >
            {specialist.profilePicture ? (
              <img
                src={specialist.profilePicture}
                alt={`${specialist.firstName} ${specialist.lastName}`}
                className="booking-specialist-card__avatar"
              />
            ) : (
              <div className="booking-specialist-card__avatar booking-specialist-card__avatar--placeholder" />
            )}

            <div>
              <div className="booking-specialist-card__name">
                {specialist.firstName} {specialist.lastName}
              </div>

              {specialist.specializations?.length ? (
                <div className="booking-specialist-card__meta">
                  {specialist.specializations.join(", ")}
                </div>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
