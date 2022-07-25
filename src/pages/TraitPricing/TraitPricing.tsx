import { Spinner } from "@/components/Elements/Spinner";
import { Collection } from "@/components/Views/Collection"
import { Footer } from "@/components/Views/Footer"
import { Traits } from "@/components/Views/Traits";
import { useGetSalesActivity } from "@/services/magic-eden/getSalesActivity";
import { useAppSelector } from "@/stores/hook";
import { useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";

type TraitSaleHistoryProps = {
  name: string;
  price: number;
  blockTime: number
}

const TraitSaleHistory = (data: TraitSaleHistoryProps) => {
  const { name, price, blockTime } = data;
  return <div className="flex flex-col w-full mb-2">
    <div className="flex items-center w-full">
      <div className="flex flex-col text-gray-800 text-base font-bold mr-2">
        {name}
      </div>
      <div className="flex-grow border border-b border-gray-800">
      </div>
      <div className="flex flex-col text-gray-800 items-end text-base font-bold ml-2">
        {price} SOL
      </div>
    </div>
    <div className="flex justify-between text-gray-800">
      <div> Bought </div>
      <div>
        {new Date(blockTime * 1000).toLocaleString()}
      </div>
    </div>
  </div>
}

export const TraitPricing = () => {
  const traits = useAppSelector((state) => state.chrome.traits);
  const collectionSymbol = useAppSelector((state) => state.chrome.collectionSymbol);

  const { data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isError,
    error,
    isLoadingError
  } = useGetSalesActivity({ collectionSymbol, traits, limit: 10 });

  const observerElem = useRef(null)

  if (isError || isLoadingError) {

    const errObj: any = error;
    if (errObj.response.status === 429) {
      toast.error("You have exceeded the requests in 1 min limit! Please try again soon.")
    } else {
      const message = errObj?.response?.data?.message || errObj?.message;
      toast.error(message);
    }
  }

  const SalesHistory = () => {
    if (isSuccess) {
      const history = data?.pages.map((page) => {
        return page.salesHistoryWithTraits.map((item: any) => {
          return <TraitSaleHistory {...item} />
        })
      })

      return <div className="flex flex-col flex-1">{history}</div>
    }

    if (isLoading) {
      return <div className="flex items-center justify-center w-full"><Spinner /></div>
    }

    return <div>Oops! Something went wrong</div>
  }

  /**
   * @description Observer listener for infinite loading
   */
  const handleObserver = useCallback((entries: any) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage])

  useEffect(() => {
    const element: any = observerElem.current
    const option = {
      threshold: 0
    }
    const observer = new IntersectionObserver(handleObserver, option);
    if (element) observer.observe(element)
  })

  const InfiniteLoading = () => {
    return (
      <div ref={observerElem}>
        {isFetchingNextPage && hasNextPage ? <div className="flex space-x-2 text-teal-800 items-center justify-center"><Spinner /></div> : <div className="text-center text-teal-800 py-2"></div>}
      </div>
    )
  }

  return <div className="flex flex-col flex-1 min-h-0">
    <div className="w-10/12 mx-auto flex items-center">
      <Collection />
      <Traits isShowNoTrait={false} />
    </div>
    <div className="flex-1 flex flex-col px-8 mt-2 min-h-0 overflow-y-auto overflow-x-hidden">
      {/* {dummyDataTraitPricing.map((data) => <TraitSaleHistory {...data} />)} */}
      <div className="flex flex-col">
        <SalesHistory />
        <InfiniteLoading />
      </div>
    </div>
    <Footer />
  </div>
}