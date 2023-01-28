import { describe, test } from 'vitest'
import { SLORepository } from '../../infrastructure/slo-prisma'
import { SLOs } from './slos'
import db from '../../../db.server'

beforeAll(async () => {
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
  const readSLOs = await slos.read()
  expect(readSLO).toEqual(createdSLO)
  expect(readSLOs).toEqual([createdSLO])

  // // UPDATE
  // const updatedPendulum = await api.put(pendulumIdUrl, { length: 3 })
  // expect(updatedPendulum).toEqual({ ...readPendulum, length: 3 })

  // // DELETE
  // const deleteData = await api.delete(pendulumIdUrl)
  // expect(deleteData).toEqual({ success: true })

  // const error = await api.get(pendulumIdUrl).catch(resolve)
  // expect(error.status).toBe(404)
  // expect(error.data).toEqual({
  //   message: `No pendulum was found with the id of ${pendulumId}`,
  // })
})
