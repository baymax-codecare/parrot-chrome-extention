import { Notification } from "@/components/Elements/Notification"

const dummyNotifications = [{
  name: "Apple",
  price: 43,
  floorPrice: 22,
  isGreatOrLess: -1 // less
}]


export const ListingNotifications = () => {
  return <div className="flex flex-col p-4 h-full">
    <div className="text-teal-800 text-base font-bold">Listing Notification</div>
    <div className="mt-2 grid grid-cols-1">
      {dummyNotifications.map((data, index) => <Notification key={index} {...data} />)}
    </div>
  </div>
}