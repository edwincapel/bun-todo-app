import Database from 'bun:sqlite'

export interface DbAction {
  queryMethod: QueryMethod
  query: string
  params?: QueryParams[]
  errorMessage?: string
  database: Database
}

type QueryMethod = 'run' | 'get' | 'all'

type QueryParams = string | number | boolean
