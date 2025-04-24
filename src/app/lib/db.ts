import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Define the structure of a tree node
export type TreeNode = {
    id: number
    label: string
    children: TreeNode[]
}

// Define the structure of the database data
export type Data = {
    trees: TreeNode[]
    lastId: number
}

const adapter = new JSONFile<Data>(process.cwd() + '/db.json')

// Default data to use when initializing an empty database
const defaultData: Data = {
    trees: [],
    lastId: 0
}
// Create a Low instance with the adapter to manage the database
const db = new Low<Data>(adapter, defaultData)

export async function initDb() {
    try {
        await db.read();
    } catch (error) {
        console.error('Error reading the database file:', error);
        // Reset the database file if it is invalid
        db.data = defaultData;
        await db.write();
    }

    // Ensure `db.data` is initialized even if the file is empty
    db.data ||= { trees: [], lastId: 0 };

    return db;
}

export default db;