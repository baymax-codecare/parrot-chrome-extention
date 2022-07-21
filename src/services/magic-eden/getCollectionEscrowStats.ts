import { axios } from "@/lib/axios";
import { useQuery } from "react-query";

export const getEscrowStats = ({
  collectionSymbol,
}: {
  collectionSymbol: string;
}): Promise<any> => {
  return axios.get(
    `https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/${collectionSymbol}?edge_cache=true&from_extension=true`
  );
};

export const useGetEscrowStats = ({
  collectionSymbol,
}: {
  collectionSymbol: string;
}) => {
  return useQuery({
    queryKey: ["getEscrowStats", collectionSymbol],
    queryFn: () => getEscrowStats({ collectionSymbol }),
  });
};
