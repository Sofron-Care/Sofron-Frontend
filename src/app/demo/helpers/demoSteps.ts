export const getClinicTourSteps = (publicId: string) => [
  {
    path: "/demo/app",
    title: "Dashboard",
    description:
      "This is your clinic’s command center. View today’s appointments and manage your day at a glance.",
  },
  {
    path: "/demo/app/appointments",
    title: "Appointments",
    description:
      "Manage upcoming and past appointments, filter results, and create new bookings instantly.",
  },
  {
    path: "/demo/app/services",
    title: "Services",
    description: "Define the services your clinic offers.",
  },
  {
    path: "/demo/app/specialists",
    title: "Specialists",
    description: "Manage your team and assign services.",
  },
  {
    path: "/demo/app/schedule",
    title: "Schedule",
    description: "Set your availability so clients can book automatically.",
  },
  {
    path: `/demo/clinic/${publicId}`,
    title: "Booking Experience",
    description: "This is what your clients see when booking online.",
  },
  {
    path: "/demo/app/documents",
    title: "Documents",
    description: "Collect intake forms before appointments.",
  },
  {
    path: "/demo/app/analytics",
    title: "Analytics",
    description: "Track performance and revenue.",
  },
];

export const getClientTourSteps = (publicId?: string) => [
  {
    path: "/demo",
    title: "Find Care",
    description: "Start by searching for clinics based on your needs.",
  },
  {
    path: "/demo/search?city=Boston&radius=25",
    title: "Browse Clinics",
    description:
      "Here are clinics near Boston. Compare and choose one to book with.",
  },
  {
    path: publicId ? `/demo/clinic/${publicId}` : undefined,
    title: "Booking",
    description: "Select a service, provider, and time that works for you.",
  },
  {
    path: "/demo/client",
    title: "Your Dashboard",
    description: "Manage your appointments and activity here.",
  },
  {
    tab: "overview",
    title: "Overview",
    description: "See your upcoming appointment.",
  },
  {
    tab: "appointments",
    title: "Appointments",
    description: "Manage your bookings.",
  },
  {
    tab: "favorites",
    title: "Favorites",
    description: "Quick access to saved clinics.",
  },
  {
    tab: "reviews",
    title: "Reviews",
    description: "Leave feedback on clinics.",
  },
];
