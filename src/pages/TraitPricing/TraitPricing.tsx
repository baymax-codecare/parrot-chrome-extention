import { Collection } from "@/components/Views/Collection"
import { Footer } from "@/components/Views/Footer"

const dummyDataTraitPricing = [
  {
    name: "Ape #1218",
    price: 3,
    status: "Sold",
    date: "June 21, 2022",
  },
  {
    name: "Ape #1219",
    price: 5,
    status: "Sold",
    date: "June 21, 2022",
  },
  {
    name: "Ape #1220",
    price: 2,
    status: "Sold",
    date: "June 20, 2022",
  },
  {
    name: "Ape #1222",
    price: 10,
    status: "Sold",
    date: "June 17, 2022",
  },
];

export const TraitPricing = () => {
  return <div className="flex flex-col flex-1 h-full">
    <div className="w-10/12 mx-auto">
      <Collection />
    </div>
    <div className="flex-1 grid grid-cols-2 divide-teal-800">
      <div>
      </div>
      <div>
      </div>
    </div>
    <Footer />
  </div>
}