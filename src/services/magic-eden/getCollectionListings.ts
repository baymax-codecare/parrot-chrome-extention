import { axios } from "@/lib/axios";
import { useQuery } from "react-query";

export const getCollectionListings = ({
  collectionSymbol,
}: {
  collectionSymbol: string | undefined;
}): Promise<any> => {
  if (!collectionSymbol) return new Promise((resolve) => resolve({}));

  return axios.get(
    `https://api-mainnet.magiceden.io/v2/collections/${collectionSymbol}/listings?edge_cache=true&from_extension=true`
  );
};

export const useGetCollectionListings = ({
  collectionSymbol,
}: {
  collectionSymbol: string | undefined;
}) => {
  return useQuery({
    queryKey: ["getCollectionListings", collectionSymbol],
    queryFn: () => getCollectionListings({ collectionSymbol }),
    cacheTime: 0,
  });
};
