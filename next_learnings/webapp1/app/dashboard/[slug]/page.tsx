export default async function Dashboard({params}: {params: Promise<{ slug: string }>}) {
  const { slug } = await params
  return <div>Your Username is : {slug}</div>
}