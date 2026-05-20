import { NextResponse } from "next/server";

function addMinutes(base: Date, minutes: number) {
  const date = new Date(base);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export async function GET() {
  const now = new Date();

  const demo = [
    {
      id: "742dfbd2-041b-4539-95ab-8e8b91317791",
      createdAt: addMinutes(now, -6),
      targetSystem: "HMIS",
      syncType: "MATERNAL_VISIT_PUSH",
      status: "IN_FLIGHT",
      retryCount: 1,
      lastErrorMessage: null,
    },
    {
      id: "2a6c2c56-c0c2-4818-86f8-7c9df72ea861",
      createdAt: addMinutes(now, -18),
      targetSystem: "NIDA",
      syncType: "NATIONAL_ID_LOOKUP",
      status: "SUCCEEDED",
      retryCount: 0,
      lastErrorMessage: null,
    },
    {
      id: "a2cbb6e9-0d7f-44ad-b13a-010e2b8bcb0c",
      createdAt: addMinutes(now, -31),
      targetSystem: "IREMBO",
      syncType: "APPOINTMENT_NOTIFICATION",
      status: "FAILED",
      retryCount: 2,
      lastErrorMessage:
        "IREMBO gateway returned HTTP 503 after the appointment payload was accepted by the local queue.",
    },
  ];

  // Return wrapped object matching client normalization expectations
  return NextResponse.json({ content: demo });
}

export async function POST() {
  // Start sync - for demo purposes we just return a success message
  return NextResponse.json({ status: "started" });
}
