/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { checkUserExists } from '../middlewares/checkUserExists'

export async function mealRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserExists] }, async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_part_of_diet: z.boolean(),
      user_id: z.string().uuid(),
    })

    const meal = createMealBodySchema.parse(request.body)

    const { name, description, is_part_of_diet, user_id } = meal

    await knex('meals').insert({
      id: randomUUID(),
      name,
      user_id,
      description,
      is_part_of_diet,
    })

    return reply.status(201).send()
  })

  app.put('/:id', { preHandler: [checkUserExists] }, async (request, reply) => {
    const createRequestParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const createUpdateMealBodySchema = z.object({
      name: z.string().nullable().default(null),
      description: z.string().nullable().default(null),
      is_part_of_diet: z.boolean(),
      user_id: z.string().uuid(),
    })

    const { name, description, is_part_of_diet, user_id } =
      createUpdateMealBodySchema.parse(request.body)
    const { id } = createRequestParamsSchema.parse(request.params)

    const meal = await knex('meals').where('id', id).first()

    if (!meal) throw new Error()

    await knex('meals')
      .where({ user_id, id })
      .update({
        name: name || meal?.name,
        description: description || meal?.description,
        is_part_of_diet,
        updated_at: new Date().toISOString(),
      })

    return reply.status(200).send()
  })

  app.delete(
    '/:id',
    { preHandler: [checkUserExists] },
    async (request, reply) => {
      const createRequestParamsSchema = z.object({
        id: z.string(),
      })

      const createMealBodySchema = z.object({
        user_id: z.string().uuid(),
      })

      const { id } = createRequestParamsSchema.parse(request.params)
      const { user_id } = createMealBodySchema.parse(request.body)

      await knex('meals').where({ user_id, id }).first().delete()

      return reply.status(200).send()
    },
  )

  app.get('/', { preHandler: [checkUserExists] }, async (request, reply) => {
    const createMealBodySchema = z.object({
      user_id: z.string().uuid(),
    })

    const { user_id } = createMealBodySchema.parse(request.body)

    const meals = await knex('meals').where({ user_id })

    return reply.status(200).send({ meals })
  })

  app.get('/:id', { preHandler: [checkUserExists] }, async (request, reply) => {
    const createMealBodySchema = z.object({
      user_id: z.string().uuid(),
    })

    const createRequestParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { user_id } = createMealBodySchema.parse(request.body)
    const { id } = createRequestParamsSchema.parse(request.params)

    const meal = await knex('meals').where({ id, user_id }).first()

    return reply.send(meal)
  })
}
