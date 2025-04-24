import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

export type TreeNode = {
    id: number
    label: string
    children: TreeNode[]
}

export type Data = {
    trees: TreeNode[]
    lastId: number
}

const adapter = new JSONFile<Data>('db.json')
const db = new Low<Data>(adapter, {
    trees: [],
    lastId: 0
})

export async function initDb() {
    await db.read()
    db.data ||= { trees: [], lastId: 0 }
    await db.write()
    return db
}

export default db;