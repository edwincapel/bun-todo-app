import { Elysia } from "elysia"

const data = [{
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
.decorate('getPostById', (id: number)=> data.find(item => item.id === id))
.get("/all", ()=> {
  return { data }
})
.get('/todo/:id', ({params: {id}, getPostById})=>{
  const response = getPostById(Number(id))
  if (!response) {
    throw new Error("Could not find todo item")
  }
  return response
})
.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
