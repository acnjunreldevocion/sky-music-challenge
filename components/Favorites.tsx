import { StarIcon } from "lucide-react"
import { Button } from "./ui/button"

const Favorites = () => {
  return (
    <Button type="button" size="sm" className="cursor-pointer">
      Favorites
      <StarIcon size={12} />
    </Button>
  )
}

export default Favorites