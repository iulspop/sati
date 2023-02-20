import { beforeEach, test } from 'vitest'

import { db } from '~/database.server'
import { EventRepository } from '~/domains/self-observability/infrastructure/event-prisma'

import { SLORepository } from '../../infrastructure/slo-prisma'
import { StreamRepository } from '../../infrastructure/stream-prisma'
import type { InquireRepositoryAPI } from '../repositories/inquire-repository'
import { SLOs } from './slos'
import { Streams } from './streams'

const MockInquireRepository = (answers: {}[] = []): InquireRepositoryAPI => ({
  getAnswers: async () => answers,
})

beforeEach(async () => {
  await db.slo.deleteMany()
})

test('Stream CRUD', async () => {
  const slos = SLOs(SLORepository())
  const slo = { name: 'Go to Bed By 10PM' }
  const createdSLO = await slos.create(slo)

  const streams = Streams(MockInquireRepository())(StreamRepository())(EventRepository())
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
  let readStreams = await streams.readAll()
  let readStreamBySLOId = await streams.findBySLOId(createdSLO.id)
  expect(readStream).toEqual(createdStream)
  expect(readStreams).toEqual([createdStream])
  expect(readStreamBySLOId).toEqual(createdStream)

  // UPDATE
  const updatedStream = await streams.update(createdStream.id, {
    source: 'X',
  })
  expect(updatedStream).toEqual({ ...createdStream, source: 'X' })

  // DELETE
  const deletedStream = await streams.delete(createdStream.id)
  readStreams = await streams.readAll()
  expect(deletedStream).toEqual(updatedStream)
  expect(readStreams).toEqual([])
})

test('Stream Events', async () => {
  const slos = SLOs(SLORepository())
  const slo = { name: 'Go to Bed By 10PM' }
  const createdSLO = await slos.create(slo)

  const streams = Streams(MockInquireRepository())(StreamRepository())(EventRepository())
  const stream = {
    createdAt: new Date(),
    sloId: createdSLO.id,
    source: 'inquireQuestionId',
  }
  const eventData = { questionId: 'inquireQuestionId' }

  const createdStream = await streams.create(stream)
  const idOfStreamAppendedTo = await streams.appendEvent(eventData)
  const events = await streams.readEvents(createdStream.id)
  expect(idOfStreamAppendedTo).toEqual(createdStream.id)
  expect(events[0].data).toEqual(eventData)
})

test('Streams cache events on create', async () => {
  const slos = SLOs(SLORepository())
  const slo = { name: 'Go to Bed By 10PM' }
  const createdSLO = await slos.create(slo)

  const eventData = { questionId: 'inquireQuestionId' }
  const streams = Streams(MockInquireRepository([eventData]))(StreamRepository())(EventRepository())
  const stream = {
    createdAt: new Date(),
    sloId: createdSLO.id,
    source: 'inquireQuestionId',
  }

  const createdStream = await streams.create(stream)
  const events = await streams.readEvents(createdStream.id)
  expect(events[0].data).toEqual(eventData)
})
