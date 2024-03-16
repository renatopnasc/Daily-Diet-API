/* eslint-disable camelcase */
import { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function checkUserExists(request: FastifyRequest) {
  const createRequestParamsSchema = z.object({
    user_id: z.string().uuid(),
  })

  const { user_id } = createRequestParamsSchema.parse(request.params)

  const user = await knex('users').where('id', user_id).first()

  if (!user_id) throw new Error()

  if (!user) throw new Error()

  request.body = { ...(request.body || {}), user_id }
}
