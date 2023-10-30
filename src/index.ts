import { Elysia, t } from "elysia"

let data = [{
  id: 1,
  title: 'First Item',
  description: "Description for the first item",
  isComplete: false
},
{
  id: 2,
  title: 'Second Item',
  description: "Description for the second item",
  isComplete: false
},
{
  id: 3,
  title: 'Third Item',
  description: "Description for the third item",
  isComplete: false
}]

const app = new Elysia()
.state('version',1)
.decorate('getTodoById', (id: number)=> data.find(item => item.id === id))
.decorate('addNewTodoItem', (title: string, description: string) => {
  const newObject: { id: number, title: string, description: string, isComplete: boolean } = {
    id: 0,
    title,
    description,
    isComplete: false
  }

  const lastItem = data[data.length - 1]
  const newId = lastItem ? lastItem.id + 1 : 1

  newObject.id = newId

  // Add the new object to the data array
  data.push(newObject)

  // Return the modified data
  return { data }
})
.decorate('editTodoById', (id: number, updatedData: { title?: string; description?: string; isComplete?: boolean }) => {
  // Find the index of the object with the specified ID
  const todoIndex = data.findIndex(item => item.id === id);

  if (todoIndex === -1) {
    throw new Error("Could not find todo item")
  }
  // Perform the edit based on the provided properties in updatedData
  data[todoIndex] = {
    ...data[todoIndex],
    ...updatedData
  }

  return { data }
})
.decorate('deleteTodoById', (id: number)=> {
  data = data.filter(item => item.id !== id);
  return data

})
.get("/all", ()=> {
  return { data }
})
.get('/todo/:id', ({params: {id}, getTodoById})=>{
  const response = getTodoById(Number(id))
  if (!response) {
    throw new Error("Could not find todo item")
  }
  return response
})
.post("/todo", ({ body, addNewTodoItem }) => {
  const { title, description } = body
  return addNewTodoItem(title, description)
}, {
  body: t.Object({
    title: t.String(),
    description: t.String(),
  })
})
.put('/todo/:id', ({body, params: {id}, editTodoById}) => {
  return editTodoById(Number(id), {...body})
}, {
  body: t.Object({
    title: t.Optional(t.String()),
    description: t.Optional(t.String()),
    isComplete: t.Optional(t.Boolean()),
  })
})
.delete('/todo/:id', ({params: {id}, deleteTodoById, getTodoById})=>{
  const response = getTodoById(Number(id))
  if (!response) {
    throw new Error("Could not find todo item")
  }
  return deleteTodoById(Number(id))
})
.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
