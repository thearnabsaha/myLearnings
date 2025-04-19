import axios from "axios"

const Home = async () => {
  const res= await axios.get("https://jsonplaceholder.typicode.com/todos/")
  const data=await res.data
  return (
    <div className="flex flex-wrap justify-around w-[90vw] m-auto">
      {
        data.map((e:{id:number,title:string,completed:boolean})=>{
          return(
            <div key={e.id} className="border w-48 h-48 my-5 flex flex-col items-center justify-center p-5">
              <h1>{e.id}</h1>
              <h1 className="text-center">{e.title}</h1>
              <h1>{(e.completed).toString()}</h1>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home