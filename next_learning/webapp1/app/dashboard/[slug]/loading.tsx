import { Skeleton } from "@/components/ui/skeleton"

const loading = () => {
  return (
    <div>
        <Skeleton className="w-[500px] h-[700px] rounded" />
    </div>
  )
}

export default loading