<img width="313" height="623" alt="image" src="https://github.com/user-attachments/assets/1f5e8612-1164-444a-a23f-83b823e75de5" />Production Schedule Reflow Engine
Overview

This project implements a production scheduling reflow algorithm that recalculates work order schedules when disruptions occur. The system ensures the schedule remains valid while respecting constraints such as dependencies, work center availability, shift hours, and maintenance windows.

Features

Dependency handling – Work orders cannot start until all parent dependencies are completed.

Work center conflict resolution – Prevents overlapping jobs on the same machine.

Shift-aware scheduling – Work only occurs during defined shift hours and pauses outside shifts.

Maintenance window handling – Work orders are moved if they conflict with maintenance periods.

Change tracking – Records original and updated scheduling times along with reasons for changes.

Project Structure:

naologic-reflow
 ├─ src
 │   ├─ reflow
 │   │   ├─ basic-reflow.ts
 │   │   ├─ constraint-checker.ts
 │   │   ├─ dependency-graph.ts
 │   │   ├─ reflow.service.ts
 │   │   └─ types.ts
 │   │
 │   ├─ scenarios
 │   │   ├─ scenario-deps.ts
 │   │   └─ scenario1.delay-cascade.ts
 │   │
 │   └─ utils
 │       ├─ maintenance.ts
 │       ├─ shift-calculator.ts
 │       └─ index.ts
 │
 ├─ 5-WorkCenter.json
 ├─ 100-workorders.json
 ├─ manufacturing-orders.json
 ├─ index.ts
 ├─ package.json

 How It Works

The algorithm processes work orders in the following order:

Sort work orders based on dependencies.

Ensure work center availability (no overlapping jobs).

Calculate work order duration within shift hours.

Adjust scheduling if maintenance windows block the work center.

Output the updated schedule and explanation of changes.

Run the Project

Install dependencies: npm install

Run the scheduler:npm run start

Technologies

TypeScript

Node.js

Luxon for date and time calculations

Notes

The current implementation moves work orders after maintenance windows when conflicts occur. A more advanced system could split work across maintenance periods for finer scheduling control.
