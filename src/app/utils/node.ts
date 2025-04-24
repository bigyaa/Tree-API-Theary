import { TreeNode } from "../lib/db";

export function findNodeById(nodes: TreeNode[], id: number): TreeNode | null {
    for (const node of nodes) {
        if (node.id === id) return node
        const childMatch = findNodeById(node.children, id)
        if (childMatch) return childMatch
    }
    return null
}