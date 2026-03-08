import { DateTime } from "luxon";
import type { WorkOrder, WorkCenter } from "./types.js";
import { topologicalSortWorkOrders } from "./dependency-graph";
import { calculateEndDateWithShifts } from "../utils/shift-calculator";
import { findOverlappingMaintenanceWindow } from "../utils/maintenance";

export type ReflowInput = {
  workOrders: WorkOrder[];
  workCenters: WorkCenter[];
};

export type WorkOrderChange = {
  workOrderId: string;
  originalStartDate: string;
  originalEndDate: string;
  newStartDate: string;
  newEndDate: string;
  reason: string[];
};

export type ReflowResult = {
  updatedWorkOrders: WorkOrder[];
  changes: WorkOrderChange[];
  explanation: string;
};

export class ReflowService {
  reflow(input: ReflowInput): ReflowResult {
    const workCentersById = new Map<string, WorkCenter>(
      input.workCenters.map((wc) => [wc.docId, wc]),
    );

    // Keep an immutable copy of original values for change reporting
    const originalById = new Map<string, WorkOrder>(
      input.workOrders.map((wo) => [wo.docId, structuredClone(wo)]),
    );

    // NOTE: Day 2 we will replace this with topo-sort by dependencies
    const sorted = topologicalSortWorkOrders(input.workOrders);

    // Track last scheduled end per work center (placeholder overlap prevention)
    const lastEndByWorkCenter = new Map<string, DateTime>();

    const updated: WorkOrder[] = [];
    const changes: WorkOrderChange[] = [];

    for (const wo of sorted) {
      const wcId = wo.data.workCenterId;
      const wc = workCentersById.get(wcId);
      if (!wc)
        throw new Error(
          `WorkCenter not found: ${wcId} (workOrder ${wo.docId})`,
        );

      // Maintenance work orders cannot be rescheduled
      if (wo.data.isMaintenance) {
        updated.push(structuredClone(wo));
        continue;
      }

      const original = originalById.get(wo.docId);
      if (!original)
        throw new Error(`Missing original for workOrder: ${wo.docId}`);

      const reasons: string[] = [];

      // Start from current startDate
      let start = DateTime.fromISO(wo.data.startDate, { zone: "utc" });

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
      let end = calculateEndDateWithShifts(
  start,
  wo.data.durationMinutes,
  wc.data.shifts
);

// Maintenance window avoidance
let overlappingWindow = findOverlappingMaintenanceWindow(
  start,
  end,
  wc.data.maintenanceWindows
);

while (overlappingWindow) {
  const maintenanceEnd = DateTime.fromISO(overlappingWindow.endDate, { zone: "utc" });

  start = maintenanceEnd;
  reasons.push("Moved to avoid maintenance window");

  end = calculateEndDateWithShifts(
    start,
    wo.data.durationMinutes,
    wc.data.shifts
  );

  overlappingWindow = findOverlappingMaintenanceWindow(
    start,
    end,
    wc.data.maintenanceWindows
  );
}

      lastEndByWorkCenter.set(wcId, end);

      const newWO: WorkOrder = {
        ...wo,
        data: {
          ...wo.data,
          startDate: start.toUTC().toISO() ?? wo.data.startDate,
          endDate: end.toUTC().toISO() ?? wo.data.endDate,
        },
      };

      updated.push(newWO);

      // Change reporting
      if (
        original.data.startDate !== newWO.data.startDate ||
        original.data.endDate !== newWO.data.endDate
      ) {
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
      explanation:
        "Skeleton reflow executed. Next: dependency ordering, shift pause/resume, and maintenance avoidance.",
    };
  }
}
