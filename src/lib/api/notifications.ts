import { apiClient } from "./client";
import type { SendNotificationRequest, NotificationResponse } from "@/shared/types/backend";

/** Enqueue an SMS notification (FACILITY_ADMIN / MOH_ADMIN) */
export async function sendNotification(data: SendNotificationRequest): Promise<NotificationResponse> {
  return apiClient.post<NotificationResponse>("/api/v1/notifications/send", data);
}

/** Manually trigger the notification queue processor (MOH_ADMIN) */
export async function processNotificationQueue(): Promise<{ processed: number }> {
  return apiClient.post<{ processed: number }>("/api/v1/notifications/process-queue");
}
