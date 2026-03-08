import { DateTime } from "luxon";
import type { MaintenanceWindow } from "../reflow/types";

/**
 * Returns the first maintenance window that overlaps the given interval.
 */
export function findOverlappingMaintenanceWindow(
  start: DateTime,
  end: DateTime,
  maintenanceWindows: MaintenanceWindow[]
): MaintenanceWindow | null {
  for (const window of maintenanceWindows) {
    const windowStart = DateTime.fromISO(window.startDate, { zone: "utc" });
    const windowEnd = DateTime.fromISO(window.endDate, { zone: "utc" });

    const overlaps = start < windowEnd && end > windowStart;
    if (overlaps) {
      return window;
    }
  }

  return null;
}