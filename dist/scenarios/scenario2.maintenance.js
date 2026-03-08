"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioMaintenance = scenarioMaintenance;
function scenarioMaintenance() {
    const wc1 = {
        docId: "WC-1",
        docType: "workCenter",
        data: {
            name: "Extruder 1",
            shifts: [
                { dayOfWeek: 1, startHour: 8, endHour: 17 },
                { dayOfWeek: 2, startHour: 8, endHour: 17 },
                { dayOfWeek: 3, startHour: 8, endHour: 17 },
                { dayOfWeek: 4, startHour: 8, endHour: 17 },
                { dayOfWeek: 5, startHour: 8, endHour: 17 },
            ],
            maintenanceWindows: [
                {
                    startDate: "2026-03-03T08:30:00Z",
                    endDate: "2026-03-03T10:00:00Z",
                    reason: "Routine maintenance",
                },
            ],
        },
    };
    const wc2 = {
        docId: "WC-2",
        docType: "workCenter",
        data: {
            name: "Mixer 1",
            shifts: wc1.data.shifts,
            maintenanceWindows: [
                {
                    startDate: "2026-03-04T09:00:00Z",
                    endDate: "2026-03-04T10:30:00Z",
                    reason: "Blade replacement",
                },
            ],
        },
    };
    const wc3 = {
        docId: "WC-3",
        docType: "workCenter",
        data: {
            name: "Packaging Line",
            shifts: wc1.data.shifts,
            maintenanceWindows: [
                {
                    startDate: "2026-03-05T13:00:00Z",
                    endDate: "2026-03-05T14:30:00Z",
                    reason: "Sensor calibration",
                },
            ],
        },
    };
    const wc4 = {
        docId: "WC-4",
        docType: "workCenter",
        data: {
            name: "Inspection Station",
            shifts: wc1.data.shifts,
            maintenanceWindows: [
                {
                    startDate: "2026-03-06T11:00:00Z",
                    endDate: "2026-03-06T12:30:00Z",
                    reason: "Quality system update",
                },
            ],
        },
    };
    const wc5 = {
        docId: "WC-5",
        docType: "workCenter",
        data: {
            name: "Cooling Tunnel",
            shifts: wc1.data.shifts,
            maintenanceWindows: [
                {
                    startDate: "2026-03-07T09:00:00Z",
                    endDate: "2026-03-07T10:00:00Z",
                    reason: "Cooling inspection",
                },
            ],
        },
    };
    const workOrders = [];
    const centers = ["WC-1", "WC-2", "WC-3", "WC-4", "WC-5"];
    const start = new Date("2026-03-03T08:00:00Z");
    for (let i = 0; i < 1000; i++) {
        const startTime = new Date(start.getTime() + i * 60 * 60 * 1000);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        workOrders.push({
            docId: `WO-${i + 1}`,
            docType: "workOrder",
            data: {
                workOrderNumber: `${i + 1}`,
                manufacturingOrderId: `MO-${Math.floor(i / 10) + 1}`,
                workCenterId: centers[i % 5],
                startDate: startTime.toISOString(),
                endDate: endTime.toISOString(),
                durationMinutes: 60,
                isMaintenance: false,
                dependsOnWorkOrderIds: i === 0 ? [] : [`WO-${i}`],
            },
        });
    }
    return {
        workOrders,
        workCenters: [wc1, wc2, wc3, wc4, wc5],
    };
}
