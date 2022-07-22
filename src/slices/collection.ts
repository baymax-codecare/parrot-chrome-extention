import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salesHistory: [],
};

const chromeSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    // setCollectionSymbol: (state, action) => {
    //   return {
    //     ...state,
    //     collectionSymbol: action.payload,
    //   };
    // },
    // setCollectionTraits: (state, action) => {
    //   return {
    //     ...state,
    //     traits: action.payload,
    //   };
    // },
  },
});

const { reducer, actions } = chromeSlice;

// export const { setCollectionSymbol, setCollectionTraits } = actions;

export default reducer;
