"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflow_service_1 = require("./reflow/reflow.service");
const scenario_deps_1 = require("./scenarios/scenario-deps");
const { workOrders, workCenters } = (0, scenario_deps_1.scenarioDeps)();
const input = { workOrders, workCenters };
const result = new reflow_service_1.ReflowService().reflow(input);
console.log(JSON.stringify(result, null, 2));
