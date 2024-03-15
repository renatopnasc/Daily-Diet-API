import fastify from 'fastify'
import { userRoutes } from './routes/user'
import { env } from './env'
const app = fastify()

app.register(userRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server!')
  })
