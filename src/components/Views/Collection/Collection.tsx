import { Spinner } from "@/components/Elements/Spinner";
import { useGetCollectionDetail } from "@/services/magic-eden/getCollectionDetail";
import { useAppSelector } from "@/stores/hook"

export const Collection = () => {
  let { collectionSymbol } = useAppSelector((state) => state.chrome)

  const getCollectionDetail = useGetCollectionDetail({ collectionSymbol });

  if (getCollectionDetail.isLoading) {
    return <div className="flex">
      <Spinner /> <span className="ml-2"> Loading...</span>
    </div>
  }

  if (getCollectionDetail.isError) {
    return <div> Oops! Something went wrong</div>
  }

  const CollectionInfo = () => {
    if (getCollectionDetail.isSuccess) {
      const data = getCollectionDetail.data;

      const { image, name } = data;
      return (
        <div className="flex flex-row items-center">
          <img src={image} alt={name} className="w-16 h-16 mr-4 rounded-full" />

          <div className="font-bold text-teal-800 text-lg">
            {name}
          </div>
        </div>
      )
    }
    return <></>
  }

  return <><CollectionInfo /></>
}