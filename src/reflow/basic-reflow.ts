import { DateTime } from "luxon";
import { WorkOrder } from "./types.js";


type ReflowResult = {
  updatedWorkOrders: WorkOrder[];
};

export function basicReflow(workOrders: WorkOrder[]): ReflowResult {
  const updatedWorkOrders = workOrders.map((workOrder) => {
    const startTime = DateTime.fromISO(workOrder.data.startDate, { zone: "utc" });

    const recalculatedEndTime = startTime.plus({
      minutes: workOrder.data.durationMinutes
    });

    return {
      ...workOrder,
      data: {
        ...workOrder.data,
        endDate: recalculatedEndTime.toISO({ suppressMilliseconds: true })!
      }
    };
  });

  return { updatedWorkOrders };
}