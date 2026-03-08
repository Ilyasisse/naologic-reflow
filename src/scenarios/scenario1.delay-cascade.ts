import type { WorkCenter, WorkOrder } from "../reflow/types.js";

export function buildScenarioDelayCascade() {
  const extrusionLine1: WorkCenterDocument = {
    docId: "WC-1",
    docType: "workCenter",
    data: {
      name: "Extrusion Line 1",
      shifts: [
        { dayOfWeek: 1, startHour: 8, endHour: 17 }, // Mon
        { dayOfWeek: 2, startHour: 8, endHour: 17 }, // Tue
        { dayOfWeek: 3, startHour: 8, endHour: 17 }, // Wed
        { dayOfWeek: 4, startHour: 8, endHour: 17 }, // Thu
        { dayOfWeek: 5, startHour: 8, endHour: 17 }  // Fri
      ],
      maintenanceWindows: []
    }
  };

  const workOrders: WorkOrder[] = [
    {
      docId: "WO-100",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-100",
        manufacturingOrderId: "MO-1",
        workCenterId: "WC-1",
        startDate: "2026-03-02T08:00:00Z",
        endDate: "2026-03-02T10:00:00Z",
        durationMinutes: 240, // runs long -> causes cascade
        isMaintenance: false,
        dependsOnWorkOrderIds: []
      }
    },
    {
      docId: "WO-200",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-200",
        manufacturingOrderId: "MO-1",
        workCenterId: "WC-1",
        startDate: "2026-03-02T10:00:00Z",
        endDate: "2026-03-02T11:00:00Z",
        durationMinutes: 60,
        isMaintenance: false,
        dependsOnWorkOrderIds: ["WO-100"]
      }
    },
    {
      docId: "WO-300",
      docType: "workOrder",
      data: {
        workOrderNumber: "WO-300",
        manufacturingOrderId: "MO-1",
        workCenterId: "WC-1",
        startDate: "2026-03-02T11:00:00Z",
        endDate: "2026-03-02T12:00:00Z",
        durationMinutes: 60,
        isMaintenance: false,
        dependsOnWorkOrderIds: ["WO-200"]
      }
    }
  ];

  return { workCenters: [extrusionLine1], workOrders };
}