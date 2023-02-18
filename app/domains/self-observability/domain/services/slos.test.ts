import { beforeEach, test } from 'vitest'
import { db } from '../../../db.server'
import { SLORepository } from '../../infrastructure/slo-prisma'
import { SLO } from '../entities/slo'
import { SLOs } from './slos'

beforeEach(async () => {
  await db.slo.deleteMany()
})

test('SLO CRUD', async () => {
  const slos = SLOs(SLORepository())
  const slo: Partial<SLO> = {
    createdAt: new Date(),
    name: 'Go to Bed By 10PM',
    denominatorLabel: 'Days',
    denominator: 365,
    targetPercentage: 99.0,
  }

  // CREATE
  const createdSLO = await slos.create(slo)
  expect(createdSLO).toEqual({ id: createdSLO.id, ...slo })

  // READ
  const readSLO = await slos.read(createdSLO.id)
  let readSLOs = await slos.readAll()
  expect(readSLO).toEqual(createdSLO)
  expect(readSLOs).toEqual([createdSLO])

  // UPDATE
  const name = 'Go to Bed By 9:30PM'
  const updatedSLO = await slos.update(createdSLO.id, { name })
  expect(updatedSLO).toEqual({ ...createdSLO, name })

  // DELETE
  const deletedSLO = await slos.delete(createdSLO.id)
  readSLOs = await slos.readAll()
  expect(deletedSLO).toEqual(updatedSLO)
  expect(readSLOs).toEqual([])
})
