import path from "./path"

export const navigation = [
    {
        id: 0,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 1,
        value: 'PRODUCT',
        path: `/${path.PRODUCTS}`
    },
    {
        id: 2,
        value: 'BLOGS',
        path: `/${path.BLOGS}`
    },
    {
        id: 3,
        value: 'OUR SERVICES',
        path: `/${path.SERVICES}`
    },
    {
        id: 4,
        value: 'FAQs',
        path: `/${path.FAQS}`
    }
]

export const productInforTabs = [
    {
        id: 1,
        name: 'DISCRIPTION',
        content: 'sdfsd'
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: 'sdfs'
    },
    {
        id: 3,
        name: 'DELIVERY',
        content: 'asdasd'
    },
    {
        id: 4,
        name: 'PAYMENT',
        content: 'asdqww'
    },

]
export const colors = [
    'black',
    'brown',
    'white',
    'pink',
    'yellow',
    'orange',
    'green',
    'blue'
]
export const sorts = [

    {
        id: 1,
        value: '-sold',
        text: 'Best selling'
    },
    {
        id: 2,
        value: '-title',
        text: 'Alphabetically, A-Z'
    },
    {
        id: 3,
        value: 'title',
        text: 'Alphabetically, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Price, high to low'
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, low to high'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Date, new to old'
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Date, old to new'
    },
]
export const voteOptions = [
    {
        id: 1,
        text: 'Terrible'
    },
    {
        id: 2,
        text: 'Bad'
    },
    {
        id: 3,
        text: 'Neutral'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 5,
        text: 'Perfect'
    },
]
export const adminSideBar = [

    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage Users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Manage Products',
        submenu: [
            {
                text: 'Create product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`
            },
            {
                text: 'Manage Product',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`
            },
        ]
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage Order',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`
    },
]
export const roles = [
    {
        code: 0,
        value: 'admin'
    },
    {
        code: 1,
        value: 'user'
    }
]
export const blockStatus = [
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    }
]