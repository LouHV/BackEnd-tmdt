import axios from "../axios";

export const apiGetProducts = (params) => axios({
    url: '/product/',
    method: 'GET',
    params
})

export const apiGetroduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'GET',
})

export const apiRatings = (data) => axios({
    url: '/product/ratings',
    method: 'PUT',
    data
})
export const apiCreateProduct = (data) => axios({
    url: '/product/',
    method: 'POST',
    data
})
export const apiUpdateProducts = (data, pid) => axios({
    url: '/product/' + pid,
    method: 'Put',
    data
})
export const apiDeleteProduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'Delete',

})
export const apiCreateOrder = (data) => axios({
    url: '/order/',
    method: 'Post',
    data
})
export const apiGetOrders = (params) => axios({
    url: '/order/admin/',
    method: 'Get',
    params
})
export const apiGetUserOrders = (params) => axios({
    url: '/order/',
    method: 'Get',
    params
})