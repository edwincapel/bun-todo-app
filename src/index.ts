import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { databasePlugin } from 'decorators/db'

const app = new Elysia().use(cors()).use(databasePlugin)

app
  .state('version', 1)
  .get('/all', ({ dbAction, database }) => {
    const result = dbAction({
      database: database(),
      queryMethod: 'all',
      query: 'SELECT * FROM todos',
      errorMessage: 'Could not get all todo items',
    })

    return result
  })

  .get('/todo/:id', ({ params: { id }, dbAction, database }) => {
    const result = dbAction({
      database: database(),
      queryMethod: 'get',
      query: 'SELECT * FROM todos WHERE id = ?',
      params: [id],
      errorMessage: 'Could not find todo item',
    })

    return result
  })

  .post(
    '/todo',
    ({ body, dbAction, database }) => {
      const result = dbAction({
        database: database(),
        queryMethod: 'run',
        query: 'INSERT INTO todos (title, description, isComplete) VALUES (?, ?, ?)',
        params: [body.title, body.description, false],
        errorMessage: 'Could add find todo item',
      })

      return result
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
      }),
    }
  )

  // Not sure what's the best method to update a todo item
  // .put('/todo/:id', ({body, params: {id}, dbAction, database}) => {
  //   const result = dbAction({
  //     database: database(),
  //     queryMethod: 'run',
  //     query: "UPDATE todos SET title = ?, description = ?, isComplete = ? WHERE id = ?",
  //     params: [body.title, body.description, body.isComplete, id],
  //     errorMessage: "Could not update todo item",
  //   })
  // }, {
  //   body: t.Object({
  //     title: t.Optional(t.String()),
  //     description: t.Optional(t.String()),
  //     isComplete: t.Optional(t.Boolean()),
  //   })
  // })

  .delete('/todo/:id', ({ params: { id }, dbAction, database }) => {
    const result = dbAction({
      database: database(),
      queryMethod: 'run',
      query: 'DELETE FROM todos WHERE id = ?',
      params: [id],
      errorMessage: 'Could not delete todo item',
    })

    return result
  })
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
