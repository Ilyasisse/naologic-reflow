"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicReflow = basicReflow;
const luxon_1 = require("luxon");
function basicReflow(workOrders) {
    const updatedWorkOrders = workOrders.map((workOrder) => {
        const startTime = luxon_1.DateTime.fromISO(workOrder.data.startDate, { zone: "utc" });
        const recalculatedEndTime = startTime.plus({
            minutes: workOrder.data.durationMinutes
        });
        return {
            ...workOrder,
            data: {
                ...workOrder.data,
                endDate: recalculatedEndTime.toISO({ suppressMilliseconds: true })
            }
        };
    });
    return { updatedWorkOrders };
}
