"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflowService = void 0;
const luxon_1 = require("luxon");
const dependency_graph_1 = require("./dependency-graph");
const shift_calculator_1 = require("../utils/shift-calculator");
const maintenance_1 = require("../utils/maintenance");
class ReflowService {
    reflow(input) {
        const workCentersById = new Map(input.workCenters.map((wc) => [wc.docId, wc]));
        // Keep an immutable copy of original values for change reporting
        const originalById = new Map(input.workOrders.map((wo) => [wo.docId, structuredClone(wo)]));
        // NOTE: Day 2 we will replace this with topo-sort by dependencies
        const sorted = (0, dependency_graph_1.topologicalSortWorkOrders)(input.workOrders);
        // Track last scheduled end per work center (placeholder overlap prevention)
        const lastEndByWorkCenter = new Map();
        const updated = [];
        const changes = [];
        for (const wo of sorted) {
            const wcId = wo.data.workCenterId;
            const wc = workCentersById.get(wcId);
            if (!wc)
                throw new Error(`WorkCenter not found: ${wcId} (workOrder ${wo.docId})`);
            // Maintenance work orders cannot be rescheduled
            if (wo.data.isMaintenance) {
                updated.push(structuredClone(wo));
                continue;
            }
            const original = originalById.get(wo.docId);
            if (!original)
                throw new Error(`Missing original for workOrder: ${wo.docId}`);
            const reasons = [];
            // Start from current startDate
            let start = luxon_1.DateTime.fromISO(wo.data.startDate, { zone: "utc" });
            // TODO Day 2: dependencies (start after max endDate of all parents)
            // start = max(start, maxParentEnd)
            // reasons.push("Moved due to dependency completion");
            // Work center conflict (basic placeholder)
            const lastEnd = lastEndByWorkCenter.get(wcId);
            if (lastEnd && start < lastEnd) {
                start = lastEnd;
                reasons.push("Moved to avoid overlap on work center");
            }
            // TODO Day 3: shift logic (pause/resume)
            // TODO Day 4: maintenance windows avoidance
            let end = (0, shift_calculator_1.calculateEndDateWithShifts)(start, wo.data.durationMinutes, wc.data.shifts);
            // Maintenance window avoidance
            let overlappingWindow = (0, maintenance_1.findOverlappingMaintenanceWindow)(start, end, wc.data.maintenanceWindows);
            while (overlappingWindow) {
                const maintenanceEnd = luxon_1.DateTime.fromISO(overlappingWindow.endDate, { zone: "utc" });
                start = maintenanceEnd;
                reasons.push("Moved to avoid maintenance window");
                end = (0, shift_calculator_1.calculateEndDateWithShifts)(start, wo.data.durationMinutes, wc.data.shifts);
                overlappingWindow = (0, maintenance_1.findOverlappingMaintenanceWindow)(start, end, wc.data.maintenanceWindows);
            }
            lastEndByWorkCenter.set(wcId, end);
            const newWO = {
                ...wo,
                data: {
                    ...wo.data,
                    startDate: start.toUTC().toISO() ?? wo.data.startDate,
                    endDate: end.toUTC().toISO() ?? wo.data.endDate,
                },
            };
            updated.push(newWO);
            // Change reporting
            if (original.data.startDate !== newWO.data.startDate ||
                original.data.endDate !== newWO.data.endDate) {
                changes.push({
                    workOrderId: wo.docId,
                    originalStartDate: original.data.startDate,
                    originalEndDate: original.data.endDate,
                    newStartDate: newWO.data.startDate,
                    newEndDate: newWO.data.endDate,
                    reason: reasons.length ? reasons : ["Recalculated timing"],
                });
            }
        }
        return {
            updatedWorkOrders: updated,
            changes,
            explanation: "Skeleton reflow executed. Next: dependency ordering, shift pause/resume, and maintenance avoidance.",
        };
    }
}
exports.ReflowService = ReflowService;
