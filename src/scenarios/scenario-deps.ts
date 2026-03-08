import type { WorkCenter, WorkOrder } from "../reflow/types";

export function scenarioDeps(): { workOrders: WorkOrder[]; workCenters: WorkCenter[] } {
  const wc1: WorkCenter = {
    docId: "WC-1",
    docType: "workCenter",
    data: {
      name: "Extruder 1",
      shifts: [
        { dayOfWeek: 1, startHour: 8, endHour: 17 }, // Monday
        { dayOfWeek: 2, startHour: 8, endHour: 17 }, // Tuesday
        { dayOfWeek: 3, startHour: 8, endHour: 17 }, // Wednesday
        { dayOfWeek: 4, startHour: 8, endHour: 17 }, // Thursday
        { dayOfWeek: 5, startHour: 8, endHour: 17 }, // Friday
      ],
      maintenanceWindows: [
        {
          startDate: "2026-03-03T08:30:00.000Z",
          endDate: "2026-03-03T10:00:00.000Z",
          reason: "Routine maintenance",
        },
      ],
    },
  };

  const a: WorkOrder = {
    docId: "WO-A",
    docType: "workOrder",
    data: {
      workOrderNumber: "A",
      manufacturingOrderId: "MO-1",
      workCenterId: "WC-1",
      startDate: "2026-03-02T16:00:00.000Z", // Monday 4PM
      endDate: "2026-03-02T17:00:00.000Z",
      durationMinutes: 120, // 2 hours → will cross shift
      isMaintenance: false,
      dependsOnWorkOrderIds: [],
    },
  };

  const b: WorkOrder = {
    docId: "WO-B",
    docType: "workOrder",
    data: {
      workOrderNumber: "B",
      manufacturingOrderId: "MO-1",
      workCenterId: "WC-1",
      startDate: "2026-03-02T08:00:00.000Z",
      endDate: "2026-03-02T08:30:00.000Z",
      durationMinutes: 30,
      isMaintenance: false,
      dependsOnWorkOrderIds: ["WO-A"],
    },
  };

  // Intentionally reversed to test dependency sorting
  return { workOrders: [b, a], workCenters: [wc1] };
}