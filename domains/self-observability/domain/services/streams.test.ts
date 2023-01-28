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
    source: 'inquireQuestion',
  }

  // CREATE
  const createdStream = await streams.create(stream)
  expect(createdStream).toEqual({ id: createdStream.id, ...stream })

  // READ
  const readStream = await streams.read(createdStream.id)
  let readStreams = await streams.read()
  expect(readStream).toEqual(createdStream)
  expect(readStreams).toEqual([createdStream])

  // UPDATE
  const updatedStream = await streams.update(createdStream.id, {
    source: 'X',
  })
  expect(updatedStream).toEqual({ ...createdStream, source: 'X' })

  // DELETE
  const deletedStream = await streams.delete(createdStream.id)
  readStreams = await streams.read()
  expect(deletedStream).toEqual(updatedStream)
  expect(readStreams).toEqual([])
})
