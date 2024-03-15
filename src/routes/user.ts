import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
      email: z.string().email(),
      password: z
        .string()
        .min(6, 'Password must contain at least 6 characters'),
      confirmPassword: z
        .string()
        .min(6, 'Password must contain at least 6 characters.'),
    })

    const user = createUserBodySchema.parse(request.body)

    const { username, email, password, confirmPassword } = user

    if (password !== confirmPassword) throw new Error('Passwords do not match.')

    const encryptedPassword = await hash(password, 8)

    await knex('users').insert({
      id: randomUUID(),
      name: username,
      email,
      password: encryptedPassword,
    })

    return reply.status(201).send()
  })
}
