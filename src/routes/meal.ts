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

  app.put('/:user_id/:id', async (request, reply) => {
    const createRequestParamsSchema = z.object({
      user_id: z.string().uuid(),
      id: z.string().uuid(),
    })

    const createUpdateMealBodySchema = z.object({
      name: z.string().nullable().default(null),
      description: z.string().nullable().default(null),
      is_part_of_diet: z.boolean(),
    })

    const { name, description, is_part_of_diet } =
      createUpdateMealBodySchema.parse(request.body)
    const { id, user_id } = createRequestParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    await knex('meals')
      .where({ user_id, id })
      .update({
        name: name || meal?.name,
        description: description || meal?.description,
        is_part_of_diet,
        updated_at: new Date().toISOString(),
      })

    return reply.status(201).send()
  })
}
