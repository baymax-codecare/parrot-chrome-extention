import { HyperSpaceAttributes } from "@/chrome/hyperspace";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  collectionSymbol: string | undefined;
  collectionName: string | undefined;
  url: string | undefined;
  traits: HyperSpaceAttributes | undefined;
  image: string | undefined;
  floorPrice: string | undefined;
  refreshInterval?: string;
};

const initialState: InitialStateType = {
  collectionSymbol: undefined,
  collectionName: undefined,
  url: undefined,
  traits: undefined,
  image: undefined,
  floorPrice: undefined,
  refreshInterval: undefined,
};

const chromeSlice = createSlice({
  name: "chrome",
  initialState,
  reducers: {
    setCollectionSymbol: (state, action) => {
      return {
        ...state,
        collectionSymbol: action.payload,
      };
    },

    setCollectionTraits: (state, action) => {
      return {
        ...state,
        traits: action.payload,
      };
    },
    setCollectionFP: (state, action) => ({
      ...state,
      floorPrice: action.payload,
    }),
    setCollectionName: (state, action) => ({
      ...state,
      collectionName: action.payload,
    }),
    setRefreshInterval: (state, action) => ({
      ...state,
      refreshInterval: action.payload,
    }),
  },
});

const { reducer, actions } = chromeSlice;

export const {
  setCollectionSymbol,
  setCollectionTraits,
  setCollectionFP,
  setCollectionName,
  setRefreshInterval,
} = actions;

export default reducer;
