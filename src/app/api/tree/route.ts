import { initDb, TreeNode } from "@/app/lib/db";
import { findNodeById } from "@/app/utils/node";
import { NextResponse } from "next/server";

export async function GET() {
    const db = await initDb()
    return NextResponse.json(db.data.trees)
}

export async function POST(req: Request) {
    const db = await initDb()
    const { label, parentId } = await req.json()

    if (!label || typeof label !== 'string') {
        return NextResponse.json({
            error: 'Label is required and must be a string'
        }, {
            status: 400
        })
    }

    const newNode: TreeNode = {
        id: ++db.data.lastId,
        label,
        children: []
    }

    if (!parentId) {
        db.data.trees.push(newNode)
    } else {
        const parentNode = findNodeById(db.data.trees, parentId)
        if (!parentNode) {
            return NextResponse.json({
                error: `Parent with id ${parentId} not found`
            }, {
                status: 404
            })
        }
        parentNode?.children.push(newNode)
    }

    await db.write()
    return NextResponse.json(newNode, { status: 201 })
}