import { axios } from "@/lib/axios";
import storage from "@/utils/storage";
import { useInfiniteQuery } from "react-query";
import _ from "lodash";
import { off } from "process";

export type CollectionDetail = {
  image: string;
  name: string;
};

export const getTokenMetadata = async ({
  tokenMint,
}: {
  tokenMint: string;
}) => {
  let data = storage.getCollectionMeta(tokenMint);

  // if data exists in local storage
  if (data) {
    return new Promise((resolve) => resolve(data));
  }

  try {
    data = await axios.get(
      `https://api-mainnet.magiceden.io/v2/tokens/${tokenMint}?edge_cache=true&from_extension=true`
    );
    storage.setCollectionMeta(tokenMint, data);
    return new Promise((resolve) => resolve(data));
  } catch (error) {
    return Promise.reject(error);
  }
};

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
  checkingTrait: any
) {
  if (!checkingTrait) return true;
  if (checkingTrait === []) return true;

  const checkingTraitKeys = Object.keys(checkingTrait);

  const droppedAttributes = _.filter(metaDataAttributes, function (o) {
    return checkingTraitKeys.includes(o.trait_type);
  });

  const objToCompare = _.chain(droppedAttributes)
    .keyBy("trait_type")
    .mapValues("value")
    .value();

  for (const key in objToCompare) {
    if (!checkingTrait[key].includes(objToCompare[key])) return false;
  }
  return true;
}

export const getSalesActivity = async ({
  collectionSymbol,
  traits,
  offset = 0,
  limit = 100,
}: {
  collectionSymbol: string | undefined;
  traits: string | undefined;
  offset?: number;
  limit?: number;
}): Promise<any> => {
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
    let activities: Array<any> = await axios.get(
      `https://api-mainnet.magiceden.io/v2/collections/${collectionSymbol}/activities?edge_cache=true&from_extension=true&offset=${offset}&limit=${limit}&type=buyNow`
    );

    let salesHistoryWithTraits: Array<any> = [];

    const metadata: Array<any> = await Promise.all(
      activities.map((element) =>
        getTokenMetadata({ tokenMint: element.tokenMint })
      )
    );

    const traitsObj = JSON.parse(traits ?? "{}");

    for (let i = 0; i < activities.length; i++) {
      // filter by traits
      if (!isTraitMatch(metadata[i].attributes, traitsObj)) continue;

      salesHistoryWithTraits.push({
        name: metadata[i].name,
        image: metadata[i].image,
        price: activities[i].price,
        blockTime: activities[i].blockTime,
      });
    }

    return new Promise((resolve) =>
      resolve({
        offset: offset + activities.length,
        length: activities.length,
        salesHistoryWithTraits,
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
  traits: string | undefined;
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
