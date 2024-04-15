import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetCart } from '../../apis';

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiGetCart();
            console.log("XXX:::", data);
            return data?.cart;
        } catch (err) {
            console.error("Error fetching cart:", err);
            return rejectWithValue(err.message);
        }
    });

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
