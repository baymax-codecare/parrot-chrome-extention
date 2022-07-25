import { SOL_MAGIC_NUMBER } from "@/config";

export type NotificationProp = {
  id: string;
  collectionName: string;
  comparedPrice: number;
  isGreatOrLess?: string;
  floorPrice: number;
  onDelete: (id: string) => void
}
export const Notification = (data: NotificationProp) => {
  const { id, collectionName, comparedPrice, isGreatOrLess = -1, floorPrice, onDelete } = data
  return <div className="flex flex-col bg-teal-800 relative items-center mb-2 rounded-md">
    <button type="button" className="bg-transparent cursor-pointer appearance-none text-white absolute top-1 left-1"
      onClick={() => { onDelete(id) }}
    >
      X
    </button>
    <div className="grid grid-cols-1 divide-y divide-green-400 text-center w-full rounded-md">
      <div className="flex flex-col text-white">
        <div>{collectionName}</div>
        <div>{collectionName} {isGreatOrLess === "1" ? '>' : '<'} {comparedPrice}</div>
      </div>
      <div className="my-2">
        <div className="text-white">
          Collection FP: {floorPrice / SOL_MAGIC_NUMBER} SOL
        </div>
      </div>
    </div>
  </div>
}
