import { Spinner } from "@/components/Elements/Spinner";
import { useGetCollectionDetail } from "@/services/magic-eden/getCollectionDetail";
import { setCollectionFP, setCollectionName } from "@/slices/chrome";
import { useAppDispatch, useAppSelector } from "@/stores/hook"
import { useEffect } from "react";

export const Collection = () => {
  let collectionSymbol = useAppSelector((state) => state.chrome.collectionSymbol);

  const dispatch = useAppDispatch();
  const getCollectionDetail = useGetCollectionDetail({ collectionSymbol });

  useEffect(() => {
    if (!getCollectionDetail.data) return;

    dispatch(setCollectionName(getCollectionDetail.data.name))
    dispatch(setCollectionFP(getCollectionDetail.data.floorPrice))
  }, [getCollectionDetail, dispatch])

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