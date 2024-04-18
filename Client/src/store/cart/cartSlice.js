import { createSlice } from '@reduxjs/toolkit';
import { addProductToCart } from '../../apis';
import * as actions from '../cart/asyncActions'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        getCart: (state, action) => {
            console.log("action:::::::", action);
            state.cart = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(actions.getCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(actions.getCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.cart = action.payload;
            })
            .addCase(actions.getCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { getCart } = cartSlice.actions;
export default cartSlice.reducer;
