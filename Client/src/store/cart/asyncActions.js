import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis'

// export const getCart = createAsyncThunk(
//     'cart/getCart',
//     async (_, { rejectWithValue }) => {
//         try {
//             const data = await apis.apiGetCart();
//             console.log("XXX:::", data);
//             return data?.cart;
//         } catch (err) {
//             console.error("Error fetching cart:", err);
//             return rejectWithValue(err.message);
//         }
//     });

    export const getCart = createAsyncThunk('cart/carts', async (data, { rejectWithValue }) => {
        const response = await apis.apiGetCart()
        console.log("response:::", response);
        if (!response.success) return rejectWithValue(response)
        return response?.cart
    })

// export const getCart = createAsyncThunk(
//     'cart/getCart',
//     (_, { rejectWithValue }) => {
//         return apiGetCart()
//             .then(data => {
//                 console.log("XXX:::", data);
//                 return data?.cart;
//             })
//             .catch(err => {
//                 console.log("Error fetching cart:", err);
//                 console.error("Error fetching cart:", err);
//                 return rejectWithValue(err.message);
//             });
//     });


// export const addProductToCart = createAsyncThunk(
//     'cart/addProductToCart',
//     async (product, { rejectWithValue }) => {
//         try {
//             const response = await apiGetCart(product);
//             return response.data;
//         } catch (err) {
//             return rejectWithValue(err.response.data);
//         }
//     }
// );
