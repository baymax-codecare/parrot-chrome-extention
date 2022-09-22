import { useQuery } from "react-query";
import { hsClient, HSProjectStat } from "../hyperspace";

export const getCollectionDetail = async ({
  collectionSymbol,
}: {
  collectionSymbol: string | undefined;
}): Promise<HSProjectStat | null> => {
  if (!collectionSymbol) return null

  return hsClient.getProjectStats(collectionSymbol)
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
