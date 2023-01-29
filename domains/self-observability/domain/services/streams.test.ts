import { beforeEach, test } from 'vitest'
import { EventRepository } from '@domains/self-observability/infrastructure/event-prisma'
import { SLORepository } from '../../infrastructure/slo-prisma'
import { SLOs } from './slos'
import { StreamRepository } from '../../infrastructure/stream-prisma'
import { Streams } from './streams'
import db from '../../../db.server'

beforeEach(async () => {
  await db.slo.deleteMany()
})

test('Stream CRUD', async () => {
  const slos = SLOs(SLORepository())
  const slo = { name: 'Go to Bed By 10PM' }
  const createdSLO = await slos.create(slo)

  const streams = Streams(StreamRepository())(EventRepository())
  const stream = {
    createdAt: new Date(),
    sloId: createdSLO.id,
    source: 'inquireQuestionId',
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

test('Stream Events', async () => {
  const slos = SLOs(SLORepository())
  const slo = { name: 'Go to Bed By 10PM' }
  const createdSLO = await slos.create(slo)

  const streams = Streams(StreamRepository())(EventRepository())
  const stream = {
    createdAt: new Date(),
    sloId: createdSLO.id,
    source: 'inquireQuestionId',
  }
  const eventData = { questionId: 'inquireQuestionId' }

  const createdStream = await streams.create(stream)
  const streamId = await streams.appendEvent(eventData)
  const events = await streams.readEvents(createdStream.id)
  expect(streamId).toEqual(createdStream.id)
  expect(events[0].data).toEqual(eventData)
})
