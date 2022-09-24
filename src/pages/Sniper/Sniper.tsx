import { Footer } from "@/components/Views/Footer"
import { Collection } from "@/components/Views/Collection"
import { FloorPriceNotification } from "./FloorPriceNotification"
import { NewListingNotification } from "./NewListingNotification"

export const Sniper = () => {

  return <div className="flex flex-col flex-1 h-full">
    <div className="px-3 w-full">
      <Collection />
    </div>
    <div className="flex-1 grid grid-cols-2 divide-x divide-teal-800">
      <div>
        <NewListingNotification />
      </div>
      <div>
        <FloorPriceNotification />
      </div>
    </div>
    <Footer />
  </div>
}