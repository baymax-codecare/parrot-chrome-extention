import { sendChromeNotification } from "./utils";
import storage from "./chrome-storage";
import { ALARM_NAME, HYPER_SPACE_DOMAIN, SOL_MAGIC_NUMBER } from "./consts";

// !!! Everything is deprecated.

function alarmListener(alarm: any) {
  if (alarm.name === ALARM_NAME) {
    snipeMagicEden();
  }
}

export const initSetup = async (interval?: number) => {
  let refreshInterval = interval
    ? interval
    : await storage.getRefreshInterval();
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: refreshInterval,
    delayInMinutes: 0.1,
  });

  if (chrome.alarms.onAlarm.hasListener(alarmListener)) {
    chrome.alarms.onAlarm.removeListener(alarmListener);
  }

  chrome.alarms.onAlarm.addListener(alarmListener);
};

/**
 * @description Handles Listing Notification
 */
async function listingNotification() {
  const data = await storage.getListingNotifications();
  const notifications = JSON.parse(data);

  const nftNotified = await Promise.all(
    notifications.map((item: any) =>
      isNftListed({
        collectionSymbol: item.collectionSymbol,
        collectionName: item.collectionName,
        comparedPrice: item.comparedPrice,
        traits: item.traits,
      })
    )
  );

  // filter listed notifications
  const listedNotification = nftNotified.filter(
    (notify) => notify.isListed === true
  );

  if (listedNotification.length > 0) {
    const collectionToNotify = listedNotification.map(
      (notify) => notify.collectionName
    );
    const purgeDuplicate = collectionToNotify.filter((item, pos) => {
      return collectionToNotify.indexOf(item) === pos;
    });

    const message = purgeDuplicate.join(",");
    const contextMessage = `New NFT has been detected in ${message}`;
    sendChromeNotification({
      id: `${HYPER_SPACE_DOMAIN}/collection/${listedNotification[0].collectionSymbol}`,
      title: "NFT Detected",
      contextMessage,
    });
  }
}

/**
 * @description Handles Floor Price Notification
 */
async function floorPriceNotification() {
  const data = await storage.getFPNotifications();
  const notifications = JSON.parse(data);

  const nftStatus = await Promise.all(
    notifications.map((item: any) =>
      checkNFTFloorPrice({
        collectionSymbol: item.collectionSymbol,
        comparedPrice: item.comparedPrice,
        isGreatOrLess: item.isGreatOrLess,
        collectionName: item.collectionName,
      })
    )
  );

  // filter listed notifications
  const toNotifyNotification = nftStatus.filter(
    (notify) => notify.toNotify === true
  );

  if (toNotifyNotification.length > 0) {
    const contextMessage = toNotifyNotification.map((notify) => {
      if (notify.isGreatOrLess === "1")
        return `${notify.collectionName} floor price has risen to ${
          notify.comparedPrice / SOL_MAGIC_NUMBER
        }`;
      return `${notify.collectionName} floor price has dropped to ${
        notify.comparedPrice / SOL_MAGIC_NUMBER
      }`;
    });

    sendChromeNotification({
      id: `${HYPER_SPACE_DOMAIN}/collection/${toNotifyNotification[0].collectionSymbol}`,
      title: "Parrot",
      contextMessage: contextMessage.join("\n"),
    });
  }
}

/**
 * @description fetch collection infos from ME api and if match, send notification
 */
export const snipeMagicEden = async () => {
  listingNotification();
  floorPriceNotification();
  return true;
};

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
    $skip: 0,
    $limit: 20,
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
    takerAmount: {
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
    $match,
    ...query,
  };

  return JSON.stringify(query);
};

/**
 * @description check if the nft is currently listed
 * @param param0
 * @returns {collectionName, isListed : boolean}
 */
export const isNftListed = async ({
  collectionSymbol,
  collectionName,
  comparedPrice,
  traits,
}: {
  collectionSymbol?: string;
  collectionName: string;
  traits?: string;
  comparedPrice: number;
}) => {
  try {
    const query = makeQuery({
      collectionSymbol,
      comparedPrice,
      traits,
    });

    const data = await (
      await fetch(
        `https://api-mainnet.magiceden.io/rpc/getListedNFTsByQueryLite?q=${query}`
      )
    ).json();

    if (data.results && data.results.length > 0)
      return {
        collectionName,
        collectionSymbol,
        isListed: true,
      };
    return {
      collectionName,
      collectionSymbol,
      isListed: false,
    };
  } catch (err) {
    console.log(err);
  }
};

export const checkNFTFloorPrice = async ({
  collectionSymbol,
  collectionName,
  comparedPrice,
  isGreatOrLess,
}: {
  collectionSymbol?: string;
  collectionName: string;
  comparedPrice: number;
  isGreatOrLess: string;
}) => {
  try {
    const data = await (
      await fetch(
        `https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/${collectionSymbol}`
      )
    ).json();

    const floorPrice = data.results.floorPrice;

    // if matching notify condition
    if (
      (isGreatOrLess === "-1" && floorPrice < comparedPrice) ||
      (isGreatOrLess === "1" && floorPrice > comparedPrice)
    ) {
      return {
        toNotify: true,
        collectionName,
        collectionSymbol,
        comparedPrice,
        isGreatOrLess,
      };
    }

    return {
      toNotify: false,
      collectionName,
      collectionSymbol,
      comparedPrice,
      isGreatOrLess,
    };
  } catch (err) {
    console.log(err);
  }
};
