import { initDb, TreeNode } from "@/app/lib/db";
import { findNodeById } from "@/app/utils/node";
import { NextResponse } from "next/server";

// Retrieves all trees from the database.
export async function GET() {
    const db = await initDb();

    // Ensure the database is initialized and contains valid data
    if (!db.data || !Array.isArray(db.data.trees)) {
        return NextResponse.json(
            { error: 'Tree data is missing or corrupted' },
            { status: 500 }
        );
    }

    // Return the tree data
    return NextResponse.json(db.data.trees, { status: 200 });
}

// Adds a new node to the tree. 
export async function POST(req: Request) {
    const db = await initDb();

    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON payload', details: error },
            { status: 400 }
        );
    }

    const { label, parentId } = body;

    // Check if label is provided and is a string
    if (!label || typeof label !== 'string') {
        return NextResponse.json(
            { error: 'Label is required and must be a string' },
            { status: 400 }
        );
    }

    // Check if parentId is provided and is a valid number
    if (parentId !== undefined && (typeof parentId !== 'number' || parentId < 0)) {
        return NextResponse.json(
            { error: 'Parent ID must be a positive number' },
            { status: 400 }
        );
    }

    // Create a new node with an incremented ID, a label, and an empty children array
    const newNode: TreeNode = {
        id: ++db.data.lastId,
        label,
        children: [],
    };

    // If parentId is provided, find the parent node and add the new node as a child
    if (parentId !== undefined) {
        const parentNode = findNodeById(db.data.trees, parentId);
        if (!parentNode) {
            return NextResponse.json(
                { error: `Parent with ID ${parentId} not found` },
                { status: 404 }
            );
        }
        parentNode.children.push(newNode);
    } else {
        // Add the new node as a root node
        db.data.trees.push(newNode);
    }

    // Write the updated data back to the database
    try {
        await db.write();
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to save data to the database', details: error },
            { status: 500 }
        );
    }

    return NextResponse.json(newNode, { status: 201 });
}