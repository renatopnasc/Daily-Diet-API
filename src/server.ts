import fastify from 'fastify'
import { userRoutes } from './routes/user'
import { env } from './env'
import { mealRoutes } from './routes/meal'
const app = fastify()

app.register(userRoutes, {
  prefix: 'users',
})

app.register(mealRoutes, { prefix: 'meal/:user_id' })

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server!')
  })
