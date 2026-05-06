export function formatRWDate(dateString: string): string {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-RW", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
