import { axios } from "@/lib/axios";
import { useQuery } from "react-query";

export const makeQuery = ({
  collectionSymbol,
  traits,
  comparedPrice,
}: {
  collectionSymbol?: string;
  traits?: string;
  comparedPrice: number;
}) => {
  if (!collectionSymbol) return {};

  let query;
  query = {
    $sort: {
      createdAt: -1,
    },
    createdAt: -1,
    $limit: 1000,
    status: [],
  };

  let $match = {};
  //
  // Collection Symbol
  //
  $match = {
    collectionSymbol,
  };

  //
  // Take amount
  //
  $match = {
    ...$match,
    takeAmount: {
      $lte: comparedPrice,
    },
  };

  //
  // Traits
  //
  if (traits) {
    const traitsObj = JSON.parse(traits);
    let queryTraits = [];

    for (let key of Object.keys(traitsObj)) {
      const traitKey = key;
      const traitValue = traitsObj[key];

      let q: { $or: Array<any> } = {
        $or: [],
      };

      traitValue.forEach((element: string) => {
        q.$or.push({
          attributes: {
            $elemMatch: {
              trait_type: traitKey,
              value: element,
            },
          },
        });
      });
      queryTraits.push(q);
    }

    $match = {
      ...$match,
      $and: queryTraits,
    };
  }

  query = {
    ...query,
    $match,
  };

  return JSON.stringify(query);
};

export const getListedNFTsByQueryLite = ({
  collectionSymbol,
  traits,
  comparedPrice,
}: {
  collectionSymbol?: string;
  traits?: string;
  comparedPrice: number;
}): Promise<any> => {
  if (!collectionSymbol) return new Promise((resolve) => resolve({}));

  const q = makeQuery({ collectionSymbol, traits, comparedPrice });
  return axios.get(
    `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQueryLite?q=${q}`
  );
};

export const useGetListedNFTsByQueryLite = ({
  collectionSymbol,
  traits,
  comparedPrice,
}: {
  collectionSymbol?: string;
  traits?: string;
  comparedPrice: number;
}) => {
  return useQuery({
    queryKey: ["getCollectionListings", collectionSymbol],
    queryFn: () =>
      getListedNFTsByQueryLite({ collectionSymbol, traits, comparedPrice }),
    cacheTime: 0,
  });
};
