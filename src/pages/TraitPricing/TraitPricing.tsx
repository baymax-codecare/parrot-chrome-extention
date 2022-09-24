import { Spinner } from "@/components/Elements/Spinner";
import { Collection } from "@/components/Views/Collection";
import { Footer } from "@/components/Views/Footer";
import { Traits } from "@/components/Views/Traits";
import { HSMarketSnapshot } from "@/services/hyperspace";
import { useGetSalesActivity } from "@/services/magic-eden/getSalesActivity";
import { useAppSelector } from "@/stores/hook";
import { useEffect, useRef, useCallback } from "react";

const TraitSaleHistory = (data: HSMarketSnapshot) => {
  const {
    name,
    thumbnail,
    market_place_state: { price },
    when,
  } = data;
  return (
    <div className="flex flex-col w-full mb-2">
      <div className="flex items-center w-full px-3 pb-2 border-b border-gray-200">
        <img
          src={thumbnail}
          alt={name}
          className="w-16 h-16 mr-4 rounded-full"
        />
        <div className="flex flex-col text-gray-800 text-base font-bold mr-2">
          {name}
        </div>
        <div className="flex flex-col text-gray-800 items-end text-base font-bold ml-2">
          {price.toFixed(2)} SOL
        </div>
        <div className="flex-1"></div>
        <div className="flex text-gray-800">{when} ago</div>
      </div>
    </div>
  );
};

export const TraitPricing = () => {
  const traits = useAppSelector((state) => state.chrome.traits);
  const collectionSymbol = useAppSelector(
    (state) => state.chrome.collectionSymbol
  );
  const tooManyRequest = useAppSelector(
    (state) => state.meApiStatus.tooManyRequest
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isError,
    // error,
    isLoadingError,
  } = useGetSalesActivity({ collectionSymbol, traits, limit: 10 });

  const observerElem = useRef(null);

  if (isError || isLoadingError) {
    // const errObj: any = error;
    // if (errObj.response.status === 429) {
    //   toast.error("You have exceeded the requests in 1 min limit! Please try again soon.")
    // } else {
    //   const message = errObj?.response?.data?.message || errObj?.message;
    //   toast.error(message);
    // }
  }

  const SalesHistory = () => {
    if (isSuccess) {
      const history = data?.pages.map((page) => {
        return page.salesHistoryWithTraits.map((item: HSMarketSnapshot) => {
          return <TraitSaleHistory {...item} />;
        });
      });

      return <div className="flex flex-col flex-1">{history}</div>;
    }

    if (isLoading) {
      return (
        <div>
          <div className="flex items-center justify-center w-full">
            <Spinner />
          </div>
        </div>
      );
    }

    return <div></div>;
  };

  /**
   * @description Observer listener for infinite loading
   */
  const handleObserver = useCallback(
    (entries: any) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element: any = observerElem.current;
    const option = {
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element);
  });

  const InfiniteLoading = () => {
    return (
      <div ref={observerElem}>
        {isFetchingNextPage && hasNextPage ? (
          <div className="flex space-x-2 text-teal-800 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="text-center text-teal-800 py-2"></div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-3 w-full flex items-center">
        <Collection />
      </div>
      <Traits isShowNoTrait={false} />

      <div className="flex-1 flex flex-col mt-2 min-h-0 overflow-y-auto overflow-x-hidden">
        {/* {dummyDataTraitPricing.map((data) => <TraitSaleHistory {...data} />)} */}
        <div className="flex flex-col">
          <SalesHistory />
          <InfiniteLoading />
        </div>
      </div>
      {/* {
        <div className="flex flex-row items-center w-10/12 mx-auto">
          <ExclamationIcon className="text-red-400 mr-2 w-16 h-16" />
          <span className="font-bold text-red-400 text-xs">
            Trait pricing is in beta and too many requests to Hyperspace API may
            cause it to fail. Please try to reload if you get a infinite
            spinner. Our apologies!
          </span>
        </div>
      } */}
      <Footer />
    </div>
  );
};
