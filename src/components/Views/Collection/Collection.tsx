import { useAppSelector } from "@/stores/hook"

export const Collection = () => {
  const { collectionSymbol } = useAppSelector((state) => state.chrome)

  return (
    <>
      Collection Here
      {collectionSymbol}
    </>
  )
}