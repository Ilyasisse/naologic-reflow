"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOverlappingMaintenanceWindow = findOverlappingMaintenanceWindow;
const luxon_1 = require("luxon");
/**
 * Returns the first maintenance window that overlaps the given interval.
 */
function findOverlappingMaintenanceWindow(start, end, maintenanceWindows) {
    for (const window of maintenanceWindows) {
        const windowStart = luxon_1.DateTime.fromISO(window.startDate, { zone: "utc" });
        const windowEnd = luxon_1.DateTime.fromISO(window.endDate, { zone: "utc" });
        const overlaps = start < windowEnd && end > windowStart;
        if (overlaps) {
            return window;
        }
    }
    return null;
}
