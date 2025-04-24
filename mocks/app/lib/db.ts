import type { Data } from '../../../src/app/lib/db'

const mockData: Data = {
  trees: [],
  lastId: 0
}

const db = {
  data: mockData,
  read: async () => {},
  write: async () => {}
}

export async function initDB() {
  return db
}

export default db
