// src/reflow/dependency-graph.ts
import type { WorkOrder } from "./types";

export class DependencyCycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DependencyCycleError";
  }
}

/**
 * Returns work orders in an order that guarantees:
 * all parents appear before their children (topological order).
 * Throws if a cycle is detected.
 */
export function topologicalSortWorkOrders(workOrders: WorkOrder[]): WorkOrder[] {
  const byId = new Map<string, WorkOrder>();
  for (const wo of workOrders) byId.set(wo.docId, wo);

  // Build graph: parent -> children
  const childrenByParent = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // init
  for (const wo of workOrders) {
    childrenByParent.set(wo.docId, []);
    inDegree.set(wo.docId, 0);
  }

  for (const child of workOrders) {
    for (const parentId of child.data.dependsOnWorkOrderIds ?? []) {
      // If parent not found in current set, we treat it as an error.
      if (!byId.has(parentId)) {
        throw new Error(
          `Missing dependency: workOrder ${child.docId} depends on ${parentId}, but ${parentId} not found`
        );
      }

      childrenByParent.get(parentId)!.push(child.docId);
      inDegree.set(child.docId, (inDegree.get(child.docId) ?? 0) + 1);
    }
  }

  // Kahn's algorithm
  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const result: WorkOrder[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    const node = byId.get(id)!;
    result.push(node);

    for (const childId of childrenByParent.get(id) ?? []) {
      const nextDeg = (inDegree.get(childId) ?? 0) - 1;
      inDegree.set(childId, nextDeg);
      if (nextDeg === 0) queue.push(childId);
    }
  }

  // If not all nodes processed => cycle
  if (result.length !== workOrders.length) {
    const remaining = [...inDegree.entries()]
      .filter(([, deg]) => deg > 0)
      .map(([id]) => id);

    throw new DependencyCycleError(
      `Circular dependency detected among work orders: ${remaining.join(", ")}`
    );
  }

  return result;
}