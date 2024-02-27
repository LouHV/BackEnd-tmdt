import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null
    },
    reducers: {
        login: (state, action) => {
           
            state.isLoggedIn = action.payload.isLoggedIn
            state.current = action.payload.userData
            state.token = action.payload.token;
        }
    },
    // Code logic xử lý async action
    // extraReducers: (builder) => {
    //     // Bắt đầu thực hiện action login (Promise pending)
    //     builder.addCase(actions.getNewproducts.pending, (state) => {
    //         // Bật trạng thái loading
    //         state.isLoading = true;
    //     });

    //     // Khi thực hiện action login thành công (Promise fulfilled)
    //     builder.addCase(actions.getNewproducts.fulfilled, (state, action) => {
    //         // Tắt trạng thái loading, lưu thông tin user vào store
    //         state.isLoading = false;
    //         state.newProducts = action.payload;
    //     });

    //     // Khi thực hiện action login thất bại (Promise rejected)
    //     builder.addCase(actions.getNewproducts.rejected, (state, action) => {
    //         // Tắt trạng thái loading, lưu thông báo lỗi vào store
    //         state.isLoading = false;
    //         state.errorMessage = action.payload.message;
    //     });
    // }
})
export const { login} = userSlice.actions
export default userSlice.reducer