import Elysia from 'elysia'
import { DbAction } from 'types/database'
import Database from 'bun:sqlite'

export const databasePlugin = new Elysia()
  .decorate('database', () => {
    const database = new Database('mydb.sqlite', { create: true })
    database
      .query(
        'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, isComplete BOOLEAN)'
      )
      .run()

    return database
  })
  .decorate('dbAction', ({ database, queryMethod, query, params, errorMessage }: DbAction) => {
    const statement = database.prepare(query)
    try {
      switch (queryMethod) {
        case 'all':
          return statement.all()
        case 'get':
          return statement.get(...(params || []))
        case 'run':
        default:
          statement.run(...(params || []))
          return { message: 'success' }
      }
    } catch (error) {
      if (errorMessage) {
        throw new Error(errorMessage)
      }
    } finally {
      database.close()
    }
  })
