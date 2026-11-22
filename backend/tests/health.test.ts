import request from 'supertest'
import { expect, test } from 'vitest'
import { app } from '../src/app.js'

test('GET /health', async () => {
  const res = await request(app).get('/health')
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ ok: true })
})