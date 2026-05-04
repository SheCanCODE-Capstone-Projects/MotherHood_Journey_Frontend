import { NextResponse } from "next/server";

import { getMotherById } from "../_data";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const mother = getMotherById(params.id);

  if (!mother) {
    return NextResponse.json({ message: "Mother not found" }, { status: 404 });
  }

  return NextResponse.json(mother);
}
