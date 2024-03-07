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