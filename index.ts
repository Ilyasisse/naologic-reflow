import { ReflowService } from "./src/reflow/reflow.service";
import { scenarioDeps } from "./src/scenarios/scenario-deps";
import { buildScenarioDelayCascade } from "./src/scenarios/scenario1.delay-cascade";
import { scenarioMaintenance } from "./src/scenarios/scenario2.maintenance";

// Choose one scenario
// const scenario = scenarioDeps();
// const scenario = scenarioDelayCascade();
const scenario = scenarioMaintenance();

const result = new ReflowService().reflow({
  workOrders: scenario.workOrders,
  workCenters: scenario.workCenters,
});

console.log(JSON.stringify(result, null, 2));
