import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPaymentUserInformation: {},
};

const paymentSlice = createSlice({
    name: "paymentUser",
    initialState,
    reducers: {
        setSelectedPaymentUserInformation(state, action) {
            state.selectedPaymentUserInformation = action.payload;
        },
    },
});

export const { setSelectedPaymentUserInformation } = paymentSlice.actions;
export default paymentSlice.reducer;
