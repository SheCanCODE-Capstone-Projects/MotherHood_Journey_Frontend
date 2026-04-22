export const queryKeys = {
  auth: {
    currentUser: ["auth", "current-user"] as const,
  },
  maternal: {
    mothers: ["maternal", "mothers"] as const,
    pregnancies: ["maternal", "pregnancies"] as const,
    visits: ["maternal", "visits"] as const,
  },
  child: {
    children: ["child", "children"] as const,
  },
  appointment: {
    appointments: ["appointment", "appointments"] as const,
  },
  government: {
    reports: ["government", "reports"] as const,
    sync: ["government", "sync"] as const,
    analytics: ["government", "analytics"] as const,
  },
  geo: {
    facilities: ["geo", "facilities"] as const,
  },
  notification: {
    list: ["notification", "list"] as const,
  },
};
