"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyCycleError = void 0;
exports.topologicalSortWorkOrders = topologicalSortWorkOrders;
class DependencyCycleError extends Error {
    constructor(message) {
        super(message);
        this.name = "DependencyCycleError";
    }
}
exports.DependencyCycleError = DependencyCycleError;
/**
 * Returns work orders in an order that guarantees:
 * all parents appear before their children (topological order).
 * Throws if a cycle is detected.
 */
function topologicalSortWorkOrders(workOrders) {
    const byId = new Map();
    for (const wo of workOrders)
        byId.set(wo.docId, wo);
    // Build graph: parent -> children
    const childrenByParent = new Map();
    const inDegree = new Map();
    // init
    for (const wo of workOrders) {
        childrenByParent.set(wo.docId, []);
        inDegree.set(wo.docId, 0);
    }
    for (const child of workOrders) {
        for (const parentId of child.data.dependsOnWorkOrderIds ?? []) {
            // If parent not found in current set, we treat it as an error.
            if (!byId.has(parentId)) {
                throw new Error(`Missing dependency: workOrder ${child.docId} depends on ${parentId}, but ${parentId} not found`);
            }
            childrenByParent.get(parentId).push(child.docId);
            inDegree.set(child.docId, (inDegree.get(child.docId) ?? 0) + 1);
        }
    }
    // Kahn's algorithm
    const queue = [];
    for (const [id, deg] of inDegree.entries()) {
        if (deg === 0)
            queue.push(id);
    }
    const result = [];
    while (queue.length) {
        const id = queue.shift();
        const node = byId.get(id);
        result.push(node);
        for (const childId of childrenByParent.get(id) ?? []) {
            const nextDeg = (inDegree.get(childId) ?? 0) - 1;
            inDegree.set(childId, nextDeg);
            if (nextDeg === 0)
                queue.push(childId);
        }
    }
    // If not all nodes processed => cycle
    if (result.length !== workOrders.length) {
        const remaining = [...inDegree.entries()]
            .filter(([, deg]) => deg > 0)
            .map(([id]) => id);
        throw new DependencyCycleError(`Circular dependency detected among work orders: ${remaining.join(", ")}`);
    }
    return result;
}
