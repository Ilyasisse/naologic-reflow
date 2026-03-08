import { ReflowService } from "./src/reflow/reflow.service";
import type { ReflowInput } from "./src/reflow/reflow.service";

const input: ReflowInput = {
  workOrders: [],
  workCenters: [],
};

const service = new ReflowService();
const result = service.reflow(input);

console.log(JSON.stringify(result, null, 2));
