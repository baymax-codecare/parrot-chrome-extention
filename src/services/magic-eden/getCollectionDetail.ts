import { axios } from "@/lib/axios";
import { useQuery } from "react-query";

export const getCollectionDetail = ({
  collectionSymbol,
}: {
  collectionSymbol: string | undefined;
}): Promise<any> => {
  if (!collectionSymbol) return new Promise((resolve) => resolve({}));

  return axios.get(
    `https://api-mainnet.magiceden.io/collections/${collectionSymbol}?edge_cache=true&from_extension=true`
  );
};

export const useGetCollectionDetail = ({
  collectionSymbol,
}: {
  collectionSymbol: string | undefined;
}) => {
  return useQuery({
    queryKey: ["getCollectionDetail", collectionSymbol],
    queryFn: () => getCollectionDetail({ collectionSymbol }),
  });
};
