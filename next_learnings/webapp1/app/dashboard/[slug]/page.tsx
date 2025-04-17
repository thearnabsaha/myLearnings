import axios from "axios"

export default async function Dashboard({params}: {params: Promise<{ slug: string }>}) {
  const response = await axios.get<{ id: number; title: string }[]>("https://jsonplaceholder.typicode.com/todos/")
  const { slug } = await params
  return <div>
    <h1>Your Username is : {slug}</h1>
    {
      response.data.map((e)=>{
        return(
          <h1 key={e.id}>{e.title}</h1>
        )
      })
    }
  </div>
}