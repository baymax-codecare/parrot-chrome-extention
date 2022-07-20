import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collectionSymbol: null,
  collectionName: null,
  url: null,
  traits: null,
  image: null,
};

const chromeSlice = createSlice({
  name: "chrome",
  initialState,
  reducers: {
    setCollectionSymbol: (state, action) => {
      console.log("SET COLLECTION SYMBAL CALLED");
      return {
        ...state,
        collectionSymbol: action.payload,
      };
    },
  },
});

const { reducer, actions } = chromeSlice;

export const { setCollectionSymbol } = actions;

export default reducer;
