import { axios } from "@/lib/axios";
import { useQuery } from "react-query";

export type CollectionDetail = {
  image: string;
  name: string;
};

export const getCollectionDetail = ({
  collectionSymbol,
}: {
  collectionSymbol: string;
}): Promise<CollectionDetail> => {
  return axios.get(
    `https://api-mainnet.magiceden.io/collections/${collectionSymbol}?edge_cache=true&from_extension=true`
  );
};

export const useGetCollectionDetail = ({
  collectionSymbol,
}: {
  collectionSymbol: string;
}) => {
  return useQuery({
    queryKey: ["getCollectionDetail", collectionSymbol],
    queryFn: () => getCollectionDetail({ collectionSymbol }),
  });
};
