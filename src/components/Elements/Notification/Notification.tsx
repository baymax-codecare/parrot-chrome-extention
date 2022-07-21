export type NotificationProp = {
  name: string;
  price: number;
  isGreatOrLess: number;
  floorPrice: number;
}
export const Notification = (data: NotificationProp) => {
  const { name, price, isGreatOrLess, floorPrice } = data
  return <div className="flex flex-col bg-teal-800 relative items-center mb-5 rounded-md">
    <button type="button" className="bg-transparent cursor-pointer appearance-none text-white absolute top-1 left-1">
      X
    </button>
    <div className="grid grid-cols-1 divide-y divide-green-400 text-center w-full rounded-md">
      <div className="flex flex-col text-white">
        <div>{name}</div>
        <div>{name} {isGreatOrLess === 1 ? '>' : '<'} {price}</div>
      </div>
      <div className="my-2">
        <div className="text-white">
          Collection FP:{floorPrice} SOL
        </div>
      </div>
    </div>
  </div>
}
