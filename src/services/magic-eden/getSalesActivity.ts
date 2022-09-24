import { axios } from "@/lib/axios";
import storage from "@/utils/storage";
import { useInfiniteQuery } from "react-query";
import _ from "lodash";
import humanizeDuration from "humanize-duration";
import { HyperSpaceAttributes } from "@/chrome/hyperspace";
import { hsClient, HSMarketSnapshot } from "../hyperspace";

export type CollectionDetail = {
  image: string;
  name: string;
};

// export const getTokenMetadata = async ({
//   tokenMint,
// }: {
//   tokenMint: string;
// }) => {
//   let data = storage.getCollectionMeta(tokenMint);

//   // if data exists in local storage
//   if (data) {
//     return new Promise((resolve) => resolve(data));
//   }

//   try {
//     data = await axios.get(
//       `https://api-mainnet.magiceden.io/v2/tokens/${tokenMint}?edge_cache=true&from_extension=true`
//     );
//     storage.setCollectionMeta(tokenMint, data);
//     return new Promise((resolve) => resolve(data));
//   } catch (error) {
//     return Promise.reject(error);
//   }
// };

type MetaDataAttribute = {
  trait_type: string;
  value: string;
};

/**
 *
 * @param metaDataAttributes
 * @param checkingTrait
 * @returns true if NFT match traits otherwhise false
 */
function isTraitMatch(
  metaDataAttributes: Array<MetaDataAttribute>,
  checkingTrait: HyperSpaceAttributes | undefined
) {
  if (!checkingTrait) return true;
  if (!checkingTrait || !checkingTrait.length) return true;

  const checkingTraitKeys = Object.keys(checkingTrait);

  const droppedAttributes = _.filter(metaDataAttributes, function (o) {
    return checkingTraitKeys.includes(o.trait_type);
  });

  const objToCompare = _.chain(droppedAttributes)
    .keyBy("trait_type")
    .mapValues("value")
    .value();

  // TODO
  // for (const key in objToCompare) {
  //   if (!checkingTrait[key].includes(objToCompare[key])) return false;
  // }
  return true;
}

export const getSalesActivity = async ({
  collectionSymbol,
  traits,
  offset = 0,
  limit = 100,
}: {
  collectionSymbol: string | undefined;
  traits: HyperSpaceAttributes | undefined;
  offset?: number;
  limit?: number;
}): Promise<{
  offset: number,
  length: number,
  salesHistoryWithTraits: HSMarketSnapshot[]
}> => {
  if (collectionSymbol === undefined) {
    return new Promise((resolve) =>
      resolve({
        offset: 0,
        length: 0,
        salesHistoryWithTraits: [],
      })
    );
  }

  try {
    const activities = await hsClient.getProjectHistory(collectionSymbol, traits || [], offset / limit + 1, limit)
    if (!activities) return {
      offset: 0,
      length: 0,
      salesHistoryWithTraits: [],
    }

    const now = Date.now()
    activities.forEach(activity => {
      const duration = now - activity.market_place_state.block_timestamp * 1000
      activity.when = humanizeDuration(duration, { largest: 1 })
      activity.thumbnail = `https://beta.api.solanalysis.com/images/100x100/filters:frames(,0)/${activity.meta_data_img}`
    })

    return new Promise((resolve) =>
      resolve({
        offset: offset + activities.length,
        length: activities.length,
        salesHistoryWithTraits: activities,
      })
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useGetSalesActivity = ({
  collectionSymbol,
  traits,
  limit = 10,
}: {
  collectionSymbol: string | undefined;
  traits: HyperSpaceAttributes | undefined;
  limit?: number;
}) => {
  return useInfiniteQuery(
    "getCollectionSalesActivity",
    ({ pageParam }) => {
      return getSalesActivity({
        collectionSymbol,
        traits,
        offset: pageParam,
        limit,
      });
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.length < limit) return 0;

        return lastPage.offset;
      },
      retry: 1,
    }
  );
};
