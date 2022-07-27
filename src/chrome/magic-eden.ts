import parsePath from "parse-path";
import { MAGIC_EDEN_DOMAINS } from "./consts";

export type MagicEdenCollection = {
  collectionSymbol: string;
  traits: string;
};

/**
 * @description get collectionSymbol and traits from a collection
 */
export function getAllInfo(
  url: string | undefined
): MagicEdenCollection | null {
  if (!url) return null;

  const parsedUrl = parsePath(url);
  //
  // if not magic eden return
  //
  if (!MAGIC_EDEN_DOMAINS.includes(parsedUrl.resource)) return null;

  const pathnames = parsedUrl.pathname.split("/");
  // if not magic eden market place
  if (pathnames[1] !== "marketplace") return null;

  const collectionSymbol = pathnames[2];

  const traits = parsedUrl.query?.attributes;
  return {
    collectionSymbol,
    traits,
  };
}

export const getCollectionName = (url: string): string => {
  return url;
};
