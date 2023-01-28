import { SLORepository } from '../../infrastructure/slo-prisma'
import { SLOs } from './slos'
import { StreamRepository } from '../../infrastructure/stream-prisma'
import { Streams } from './streams'
import { test, beforeEach } from 'vitest'
import db from '../../../db.server'

beforeEach(async () => {
  await db.stream.deleteMany()
})

test('Stream CRUD', async () => {
  const slos = SLOs(SLORepository())
  const slo = { name: 'Go to Bed By 10PM' }
  const createdSLO = await slos.create(slo)

  const streams = Streams(StreamRepository())
  const stream = {
    createdAt: new Date(),
    sloId: createdSLO.id,
    source: 'manual',
  }

  // CREATE
  const createdStream = await streams.create(stream)
  expect(createdStream).toEqual({ id: createdStream.id, ...stream })
})
