import { initDb } from "@/app/lib/db";
import { deepCloneNode, findNodeById } from "@/app/utils/node";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const db = await initDb();

    const { nodeId, newParentId } = await req.json();

    // Run validtion logic
    if (typeof nodeId !== 'number') {
        return NextResponse.json({
            error: 'nodeId must be a number'
        }, {
            status: 400
        })
    }

    await db.read()

    const originalNode = findNodeById(db.data.trees, nodeId);

    if (!originalNode) {
        return NextResponse.json({
            error: "Node with id " + nodeId + " not found"
        }, {
            status: 404
        })
    }

    // deep clone the node
    const clonedNode = deepCloneNode(originalNode, db.data);

    if (newParentId) {
        const parentNode = findNodeById(db.data.trees, newParentId);

        if (!parentNode) {
            return NextResponse.json({
                error: "Parent id with id " + newParentId + " new found!"
            }, {
                status: 404
            })
        }

        parentNode.children.push(clonedNode)
    } else {
        return NextResponse.json({
            error: "New parent with id " + newParentId + " not found!"
        }, {
            status: 404
        })
    }

    await db.write();

    return NextResponse.json(clonedNode, {
        status: 201
    })
}