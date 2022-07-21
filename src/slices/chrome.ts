import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collectionSymbol: "",
  collectionName: "",
  url: "",
  traits: "",
  image: "",
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
