import { ReflowService } from "./reflow/reflow.service";
import type { ReflowInput } from "./reflow/reflow.service";
import { scenarioDeps } from "./scenarios/scenario-deps";

const { workOrders, workCenters } = scenarioDeps();

const input: ReflowInput = { workOrders, workCenters };

const result = new ReflowService().reflow(input);
console.log(JSON.stringify(result, null, 2));