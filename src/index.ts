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
.get("/all", ()=> {
  return { data }
})
.listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
