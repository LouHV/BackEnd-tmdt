import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from '../../apis'

export const getCurrent = createAsyncThunk('user/getcurrent', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetcurrent()

    console.log('response :>> ', response);
    if (!response.success) return rejectWithValue(response)
    return response.rs
})