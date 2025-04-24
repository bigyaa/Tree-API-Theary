import { GET, POST } from '@/app/api/tree/route'
import { NextRequest } from 'next/server'

jest.mock('@/app/lib/db', () => ({
    __esModule: true,
    default: {
      data: { trees: [], lastId: 0 },
      read: jest.fn(async () => {}),
      write: jest.fn(async () => {})
    },
    initDb: jest.fn(async () => ({
      data: { trees: [], lastId: 0 },
      read: async () => {},
      write: async () => {}
    }))
  }))

function mockPostRequest(body: object): NextRequest {
  return {
    json: async () => body,
    method: 'POST'
  } as unknown as NextRequest
}

describe('Tree API Routes', () => {
      

  it('GET /api/tree → should return an array', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it('POST /api/tree → should create a root node', async () => {
    const req = mockPostRequest({ label: 'root-test' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.label).toBe('root-test')
    expect(typeof data.id).toBe('number')
  })

  it('POST /api/tree → should fail without label', async () => {
    const req = mockPostRequest({})
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBeDefined()
  })
})
