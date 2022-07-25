import { createSlice } from "@reduxjs/toolkit";

type ListingNotification = {
  id: string;
  collectionName: string;
  comparedPrice: number;
  floorPrice: number;
  traits?: string;
};

type FPNotification = {
  id: string;
  collectionName: string;
  comparedPrice: number;
  floorPrice: number;
  isGreatOrLess: string;
  traits?: string;
};

const initialState: {
  listingNotifications: Array<ListingNotification>;
  floorPriceNotifications: Array<FPNotification>;
} = {
  listingNotifications: [],
  floorPriceNotifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addListingNotification: (state, action) => ({
      ...state,
      listingNotifications: [...state.listingNotifications, action.payload],
    }),
    addFPNotification: (state, action) => ({
      ...state,
      floorPriceNotifications: [
        ...state.floorPriceNotifications,
        action.payload,
      ],
    }),
    removeListingNotifications: (state, action) => ({
      ...initialState,
      listingNotifications: [],
    }),
    removeFPNotifications: (state, action) => ({
      ...initialState,
      floorPriceNotifications: [],
    }),
    removeAllNotifications: (state) => ({
      ...initialState,
      floorPriceNotifications: [],
      listingNotifications: [],
    }),
    removeOneListingNotification: (state, action) => {
      const newListingNotifications = state.listingNotifications.filter(
        (notification) => notification.id !== action.payload
      );

      return {
        ...state,
        listingNotifications: newListingNotifications,
      };
    },
    removeOneFPListingNotification: (state, action) => {
      const newFPNotifications = state.floorPriceNotifications.filter(
        (notification) => notification.id !== action.payload
      );

      return {
        ...state,
        floorPriceNotifications: newFPNotifications,
      };
    },
  },
});

const { reducer, actions } = notificationSlice;

export const {
  addListingNotification,
  addFPNotification,
  removeListingNotifications,
  removeFPNotifications,
  removeAllNotifications,
  removeOneListingNotification,
  removeOneFPListingNotification,
} = actions;

export default reducer;
