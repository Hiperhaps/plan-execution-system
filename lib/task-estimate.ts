const estimatedHoursPattern = /预计耗时：\s*(\d+(?:\.\d+)?)\s*小时/;

export function parseEstimatedHours(description?: string | null) {
  if (!description) {
    return null;
  }

  const match = estimatedHoursPattern.exec(description);

  return match ? Number(match[1]) : null;
}

export function resolveEstimatedHours(
  estimatedHours?: number | null,
  description?: string | null,
) {
  return estimatedHours ?? parseEstimatedHours(description);
}
