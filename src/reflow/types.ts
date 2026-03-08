export interface WorkOrder {
  docId: string;
  docType: string;
  data: {
    workOrderNumber: string;
    workCenterId: string;
    manufacturingOrderId: string;
    //Timing
    startDate: string;
    endDate: string;
    durationMinutes: number;
    //Constraints
    isMaintenance: boolean;

    //Dependencies
    dependsOnWorkOrderIds: string[];
  };
}

export type Shift = {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
};

export type MaintenanceWindow = {
  startDate: string;
  endDate: string;
  reason?: string;
};


//WORK CENTER
export interface WorkCenter {
  docId: string;
  docType: "workCenter";
  data: {
    name: string;

    shifts: Array<{
      dayOfWeek: number;
      startHour: number;
      endHour: number;
    }>;
    // Maintenance windows (blocked time periods)

    maintenanceWindows: Array<{

      startDate: string;           

      endDate: string;             

      reason?: string;             // Optional description

    }>;

  }
}



//Manufacturing Order
export interface ManufacturingOrder{

  docId: string;

  docType: "manufacturingOrder";

  data: {

    manufacturingOrderNumber: string;

    itemId: string;

    quantity: number;

    dueDate: string;               

  }

}



