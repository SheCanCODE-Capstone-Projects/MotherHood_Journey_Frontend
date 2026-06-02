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
    syncLogs: ["government", "sync-logs"] as const,
    analytics: ["government", "analytics"] as const,
  },
  geo: {
    provinces: ["geo", "provinces"] as const,
    districts: ["geo", "districts"] as const,
    sectors: ["geo", "sectors"] as const,
    cells: ["geo", "cells"] as const,
    villages: ["geo", "villages"] as const,
    facilities: ["geo", "facilities"] as const,
  },
  facilityStats: {
    list: ["facility-stats", "list"] as const,
    detail: (id: string) => ["facility-stats", "detail", id] as const,
    heatmap: ["facility-stats", "heatmap"] as const,
  },
  notification: {
    list: ["notification", "list"] as const,
  },
};
