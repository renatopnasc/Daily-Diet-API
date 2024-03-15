/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealRoutes(app: FastifyInstance) {
  app.post('/:user_id', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_part_of_diet: z.boolean(),
    })

    const createRequestParamsSchema = z.object({
      user_id: z.string().uuid(),
    })

    const meal = createMealBodySchema.parse(request.body)
    const { user_id } = createRequestParamsSchema.parse(request.params)

    const { name, description, is_part_of_diet } = meal

    await knex('meals').insert({
      id: randomUUID(),
      name,
      user_id,
      description,
      is_part_of_diet,
    })

    return reply.status(201).send()
  })
}
