import { Spinner } from "@/components/Elements/Spinner";
import { useGetCollectionDetail } from "@/services/magic-eden/getCollectionDetail";
import { setCollectionFP, setCollectionName } from "@/slices/chrome";
import { useAppDispatch, useAppSelector } from "@/stores/hook";
import { ExclamationIcon } from "@heroicons/react/outline";
import { useEffect } from "react";

export const Collection = () => {
  let collectionSymbol = useAppSelector(
    (state) => state.chrome.collectionSymbol
  );

  const dispatch = useAppDispatch();
  const getCollectionDetail = useGetCollectionDetail({ collectionSymbol });

  useEffect(() => {
    if (!getCollectionDetail.data) return;

    dispatch(setCollectionName(getCollectionDetail.data.project.display_name));
    dispatch(setCollectionFP(getCollectionDetail.data.flood_price));
  }, [getCollectionDetail, dispatch]);

  if (getCollectionDetail.isLoading) {
    return (
      <div className="flex">
        <Spinner /> <span className="ml-2"> Loading...</span>
      </div>
    );
  }

  if (getCollectionDetail.isError) {
    return <div> Oops! Something went wrong</div>;
  }

  const CollectionInfo = () => {
    if (getCollectionDetail.isSuccess) {
      const data = getCollectionDetail.data;

      if (data) {
        const {
          project: { img_url: image, display_name: name },
        } = data;
        if (image && name) {
          return (
            <div className="flex flex-row items-center">
              <img
                src={image}
                alt={name}
                className="w-16 h-16 mr-4 rounded-full"
              />

              <div className="font-bold text-teal-800 text-lg">{name}</div>
            </div>
          );
        }
      }
      // No data to show -> need to visit Magic Eden website
      return (
        <div className="flex flex-row items-center">
          <ExclamationIcon className="text-red-400 mr-2 w-16 h-16" />

          <div className="font-bold text-red-400 text-xs">
            Please visit a collection on Hyperspace to get started
          </div>
        </div>
      );
    }
    return <></>;
  };

  return (
    <>
      <CollectionInfo />
    </>
  );
};
