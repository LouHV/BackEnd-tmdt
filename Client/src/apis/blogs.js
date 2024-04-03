import axios from "../axios";
export const apiGetBlogs = (params) => axios({
    url: '/blog/',
    method: 'GET',
    params
})
export const apiGetDetailBlog = (bid) => axios({
    url: '/blog/one/' + bid,
    method: 'GET',
})
export const apiLikeBlog = (bid) => axios({
    url: '/blog/likes/' + bid,
    method: 'PUT',
})
export const apiDislikeBlog = (bid) => axios({
    url: '/blog/dislike/' + bid,
    method: 'PUT',
})