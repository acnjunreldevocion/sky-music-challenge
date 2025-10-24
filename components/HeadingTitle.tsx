
import { slugify } from "@/lib/helper"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

const HeadingTitle = ({ title }: { title: string }) => {
  const path = slugify(title)
  return (
    <>
      <Link href={`/section/${path}`} className="flex items-center gap-2" aria-label={title}>
        <h1 className="font-bold text-2xl text-white">{title}</h1>
        <ChevronRightIcon className="text-white" />
      </Link>
    </>
  )
}
export default HeadingTitle