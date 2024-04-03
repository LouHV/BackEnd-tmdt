const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    REGISTER: 'register',
    PRODUCTS__CATEGORY: ':category', //products
    BLOGS: 'blogs',
    SERVICES: 'services',
    FAQS: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    DETAIL_BLOG__BID__TITLE: 'blogs/:bid/:title',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    DETAIL_CART: 'my-cart',
    CHECKOUT: "checkout",
    PRODUCTS: 'products',
    SEARCH: 'search',

    //admin
    ADMIN: 'admin',
    DASHBOARD: 'dasboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCTS: 'create-products',
    COUPON: 'coupon',
    CREATE_COUPON: 'create-coupon',
    //member
    MEMBER: 'member',
    PERSONAL: 'personnal',
    MY_CART: 'my-cart',
    HISTORY: 'buy-history',
    WISHLIST: 'wishlist',
}

export default path