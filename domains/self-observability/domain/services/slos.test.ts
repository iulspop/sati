import { test, beforeEach } from 'vitest'
import { SLORepository } from '../../infrastructure/slo-prisma'
import { SLOs } from './slos'
import db from '../../../db.server'

beforeEach(async () => {
  await db.slo.deleteMany()
})

test('SLO CRUD', async () => {
  const slos = SLOs(SLORepository())
  const slo = {
    createdAt: new Date(),
    name: 'Go to Bed By 10PM',
    denominatorLabel: 'Days',
    denominator: 365,
    targetPercentage: 99.0,
    interpreter: 'boolean',
  }

  // CREATE
  const createdSLO = await slos.create(slo)
  expect(createdSLO).toEqual({ id: createdSLO.id, ...slo })

  // READ
  const readSLO = await slos.read(createdSLO.id)
  let readSLOs = await slos.read()
  expect(readSLO).toEqual(createdSLO)
  expect(readSLOs).toEqual([createdSLO])

  // UPDATE
  const name = 'Go to Bed By 9:30PM'
  const updatedSLO = await slos.update(createdSLO.id, { name })
  expect(updatedSLO).toEqual({ ...createdSLO, name })

  // DELETE
  const deletedSLO = await slos.delete(createdSLO.id)
  readSLOs = await slos.read()
  expect(deletedSLO).toEqual(updatedSLO)
  expect(readSLOs).toEqual([])
})
