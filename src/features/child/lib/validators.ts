export function validateLotNumber(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

export function formatLotNumber(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "-");
}
