import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  tooManyRequest: boolean;
};

const initialState: InitialStateType = {
  tooManyRequest: false,
};

const meApiStatusSlice = createSlice({
  name: "me-api-status",
  initialState,
  reducers: {
    tooManyRequestOn: (state) => ({
      ...state,
      tooManyRequest: true,
    }),
    tooManyRequestOff: (state) => ({
      ...state,
      tooManyRequest: false,
    }),
  },
});

const { reducer, actions } = meApiStatusSlice;

export const { tooManyRequestOn, tooManyRequestOff } = actions;

export default reducer;
