import parsePath from "parse-path";
import storage from "./chrome-storage";
import { HYPER_SPACE_DOMAINS } from "./consts";

export type HyperSpaceAttributes = {
  name: string,
  type: string,
  values: string[]
}[]

export type HyperSpaceCollection = {
  project_id: string;
  attributes?: HyperSpaceAttributes
};

/**
 * @description get collectionSymbol and traits from a collection
 */
export async function getAllInfo(
  url: string | undefined
): Promise<HyperSpaceCollection | null> {
  if (!url) return null;

  const parsedUrl = parsePath(url);
  //
  // if not magic eden return
  //
  if (!HYPER_SPACE_DOMAINS.includes(parsedUrl.resource)) return null;

  const pathnames = parsedUrl.pathname.split("/");
  // if not magic eden market place
  if (pathnames[1] !== "collection") return null;

  const project_id = pathnames[2];

  const condition = await storage.getHSCondition()
  if (!condition) return { project_id }

  try {
    if (condition.project_id === project_id) return condition
  } catch (e) { }

  return {
    project_id,
  };
}

export const getCollectionName = (url: string): string => {
  return url;
};
