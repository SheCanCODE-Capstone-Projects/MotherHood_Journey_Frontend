import { NextResponse } from "next/server";

import { searchMothers } from "../_data";

function readPageParam(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = readPageParam(url.searchParams.get("page"), 0);
  const pageSize = readPageParam(url.searchParams.get("page_size"), 10);
  const searchTerm = url.searchParams.get("search_term");

  return NextResponse.json(searchMothers(searchTerm, page, pageSize));
}
