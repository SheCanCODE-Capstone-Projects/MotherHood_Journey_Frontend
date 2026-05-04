import { NextResponse } from "next/server";

import { getMotherByHealthId } from "../../_data";

export async function GET(_request: Request, { params }: { params: { healthId: string } }) {
  const mother = getMotherByHealthId(params.healthId);

  if (!mother) {
    return NextResponse.json({ message: "Mother not found" }, { status: 404 });
  }

  return NextResponse.json(mother);
}
