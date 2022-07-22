import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  collectionSymbol: string | undefined;
  collectionName: string | undefined;
  url: string | undefined;
  traits: string | undefined;
  image: string | undefined;
};

const initialState: InitialStateType = {
  collectionSymbol: undefined,
  collectionName: undefined,
  url: undefined,
  traits: undefined,
  image: undefined,
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
  },
});

const { reducer, actions } = chromeSlice;

export const { setCollectionSymbol, setCollectionTraits } = actions;

export default reducer;
