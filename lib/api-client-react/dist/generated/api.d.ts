import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AddToCartInput, AdminStats, Cart, Category, CheckoutInput, ContactBody, CreateProductBody, CreateReviewBody, HealthStatus, ListProductsParams, LoginInput, MeResponse, Order, Product, RegisterInput, Review, SuccessMessage, UpdateCartItemInput, UpdateOrderStatusBody, UpdateProductBody, User } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new account
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerInput: RegisterInput, options?: RequestInit) => Promise<User>;
export declare const getRegisterMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterInput>;
export type RegisterMutationError = ErrorType<unknown>;
/**
 * @summary Create a new account
 */
export declare const useRegister: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterInput>;
}, TContext>;
/**
 * @summary Sign in
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginInput: LoginInput, options?: RequestInit) => Promise<User>;
export declare const getLoginMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginInput>;
export type LoginMutationError = ErrorType<unknown>;
/**
 * @summary Sign in
 */
export declare const useLogin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginInput>;
}, TContext>;
/**
 * @summary Sign out
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<SuccessMessage>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Sign out
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Get the current authenticated user (or null)
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<MeResponse>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<unknown>;
/**
 * @summary Get the current authenticated user (or null)
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List products with filters and sorting
 */
export declare const getListProductsUrl: (params?: ListProductsParams) => string;
export declare const listProducts: (params?: ListProductsParams, options?: RequestInit) => Promise<Product[]>;
export declare const getListProductsQueryKey: (params?: ListProductsParams) => readonly ["/api/products", ...ListProductsParams[]];
export declare const getListProductsQueryOptions: <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>;
export type ListProductsQueryError = ErrorType<unknown>;
/**
 * @summary List products with filters and sorting
 */
export declare function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Top featured products for homepage
 */
export declare const getListFeaturedProductsUrl: () => string;
export declare const listFeaturedProducts: (options?: RequestInit) => Promise<Product[]>;
export declare const getListFeaturedProductsQueryKey: () => readonly ["/api/products/featured"];
export declare const getListFeaturedProductsQueryOptions: <TData = Awaited<ReturnType<typeof listFeaturedProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFeaturedProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listFeaturedProducts>>>;
export type ListFeaturedProductsQueryError = ErrorType<unknown>;
/**
 * @summary Top featured products for homepage
 */
export declare function useListFeaturedProducts<TData = Awaited<ReturnType<typeof listFeaturedProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get product details
 */
export declare const getGetProductUrl: (id: number) => string;
export declare const getProduct: (id: number, options?: RequestInit) => Promise<Product>;
export declare const getGetProductQueryKey: (id: number) => readonly [`/api/products/${number}`];
export declare const getGetProductQueryOptions: <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
export type GetProductQueryError = ErrorType<unknown>;
/**
 * @summary Get product details
 */
export declare function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List product categories with counts
 */
export declare const getListCategoriesUrl: () => string;
export declare const listCategories: (options?: RequestInit) => Promise<Category[]>;
export declare const getListCategoriesQueryKey: () => readonly ["/api/categories"];
export declare const getListCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listCategories>>>;
export type ListCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary List product categories with counts
 */
export declare function useListCategories<TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List reviews for a product
 */
export declare const getListProductReviewsUrl: (id: number) => string;
export declare const listProductReviews: (id: number, options?: RequestInit) => Promise<Review[]>;
export declare const getListProductReviewsQueryKey: (id: number) => readonly [`/api/products/${number}/reviews`];
export declare const getListProductReviewsQueryOptions: <TData = Awaited<ReturnType<typeof listProductReviews>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProductReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProductReviews>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductReviewsQueryResult = NonNullable<Awaited<ReturnType<typeof listProductReviews>>>;
export type ListProductReviewsQueryError = ErrorType<unknown>;
/**
 * @summary List reviews for a product
 */
export declare function useListProductReviews<TData = Awaited<ReturnType<typeof listProductReviews>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProductReviews>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a review
 */
export declare const getCreateProductReviewUrl: (id: number) => string;
export declare const createProductReview: (id: number, createReviewBody: CreateReviewBody, options?: RequestInit) => Promise<Review>;
export declare const getCreateProductReviewMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProductReview>>, TError, {
        id: number;
        data: BodyType<CreateReviewBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProductReview>>, TError, {
    id: number;
    data: BodyType<CreateReviewBody>;
}, TContext>;
export type CreateProductReviewMutationResult = NonNullable<Awaited<ReturnType<typeof createProductReview>>>;
export type CreateProductReviewMutationBody = BodyType<CreateReviewBody>;
export type CreateProductReviewMutationError = ErrorType<unknown>;
/**
 * @summary Submit a review
 */
export declare const useCreateProductReview: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProductReview>>, TError, {
        id: number;
        data: BodyType<CreateReviewBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createProductReview>>, TError, {
    id: number;
    data: BodyType<CreateReviewBody>;
}, TContext>;
/**
 * @summary Get the current user's cart
 */
export declare const getGetCartUrl: () => string;
export declare const getCart: (options?: RequestInit) => Promise<Cart>;
export declare const getGetCartQueryKey: () => readonly ["/api/cart"];
export declare const getGetCartQueryOptions: <TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCartQueryResult = NonNullable<Awaited<ReturnType<typeof getCart>>>;
export type GetCartQueryError = ErrorType<unknown>;
/**
 * @summary Get the current user's cart
 */
export declare function useGetCart<TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a product to the cart
 */
export declare const getAddToCartUrl: () => string;
export declare const addToCart: (addToCartInput: AddToCartInput, options?: RequestInit) => Promise<Cart>;
export declare const getAddToCartMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addToCart>>, TError, {
        data: BodyType<AddToCartInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addToCart>>, TError, {
    data: BodyType<AddToCartInput>;
}, TContext>;
export type AddToCartMutationResult = NonNullable<Awaited<ReturnType<typeof addToCart>>>;
export type AddToCartMutationBody = BodyType<AddToCartInput>;
export type AddToCartMutationError = ErrorType<unknown>;
/**
 * @summary Add a product to the cart
 */
export declare const useAddToCart: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addToCart>>, TError, {
        data: BodyType<AddToCartInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addToCart>>, TError, {
    data: BodyType<AddToCartInput>;
}, TContext>;
/**
 * @summary Clear the cart
 */
export declare const getClearCartUrl: () => string;
export declare const clearCart: (options?: RequestInit) => Promise<Cart>;
export declare const getClearCartMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
export type ClearCartMutationResult = NonNullable<Awaited<ReturnType<typeof clearCart>>>;
export type ClearCartMutationError = ErrorType<unknown>;
/**
 * @summary Clear the cart
 */
export declare const useClearCart: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
/**
 * @summary Update quantity of an item in the cart
 */
export declare const getUpdateCartItemUrl: (itemId: number) => string;
export declare const updateCartItem: (itemId: number, updateCartItemInput: UpdateCartItemInput, options?: RequestInit) => Promise<Cart>;
export declare const getUpdateCartItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError, {
        itemId: number;
        data: BodyType<UpdateCartItemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError, {
    itemId: number;
    data: BodyType<UpdateCartItemInput>;
}, TContext>;
export type UpdateCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof updateCartItem>>>;
export type UpdateCartItemMutationBody = BodyType<UpdateCartItemInput>;
export type UpdateCartItemMutationError = ErrorType<unknown>;
/**
 * @summary Update quantity of an item in the cart
 */
export declare const useUpdateCartItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError, {
        itemId: number;
        data: BodyType<UpdateCartItemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCartItem>>, TError, {
    itemId: number;
    data: BodyType<UpdateCartItemInput>;
}, TContext>;
/**
 * @summary Remove an item from the cart
 */
export declare const getRemoveCartItemUrl: (itemId: number) => string;
export declare const removeCartItem: (itemId: number, options?: RequestInit) => Promise<Cart>;
export declare const getRemoveCartItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError, {
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError, {
    itemId: number;
}, TContext>;
export type RemoveCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof removeCartItem>>>;
export type RemoveCartItemMutationError = ErrorType<unknown>;
/**
 * @summary Remove an item from the cart
 */
export declare const useRemoveCartItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError, {
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeCartItem>>, TError, {
    itemId: number;
}, TContext>;
/**
 * @summary List the current user's orders
 */
export declare const getListMyOrdersUrl: () => string;
export declare const listMyOrders: (options?: RequestInit) => Promise<Order[]>;
export declare const getListMyOrdersQueryKey: () => readonly ["/api/orders"];
export declare const getListMyOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listMyOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMyOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMyOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listMyOrders>>>;
export type ListMyOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List the current user's orders
 */
export declare function useListMyOrders<TData = Awaited<ReturnType<typeof listMyOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create an order from the current cart
 */
export declare const getCheckoutUrl: () => string;
export declare const checkout: (checkoutInput: CheckoutInput, options?: RequestInit) => Promise<Order>;
export declare const getCheckoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof checkout>>, TError, {
        data: BodyType<CheckoutInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof checkout>>, TError, {
    data: BodyType<CheckoutInput>;
}, TContext>;
export type CheckoutMutationResult = NonNullable<Awaited<ReturnType<typeof checkout>>>;
export type CheckoutMutationBody = BodyType<CheckoutInput>;
export type CheckoutMutationError = ErrorType<unknown>;
/**
 * @summary Create an order from the current cart
 */
export declare const useCheckout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof checkout>>, TError, {
        data: BodyType<CheckoutInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof checkout>>, TError, {
    data: BodyType<CheckoutInput>;
}, TContext>;
/**
 * @summary Get an order
 */
export declare const getGetOrderUrl: (id: number) => string;
export declare const getOrder: (id: number, options?: RequestInit) => Promise<Order>;
export declare const getGetOrderQueryKey: (id: number) => readonly [`/api/orders/${number}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<unknown>;
/**
 * @summary Get an order
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a contact message
 */
export declare const getSubmitContactMessageUrl: () => string;
export declare const submitContactMessage: (contactBody: ContactBody, options?: RequestInit) => Promise<SuccessMessage>;
export declare const getSubmitContactMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContactMessage>>, TError, {
        data: BodyType<ContactBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitContactMessage>>, TError, {
    data: BodyType<ContactBody>;
}, TContext>;
export type SubmitContactMessageMutationResult = NonNullable<Awaited<ReturnType<typeof submitContactMessage>>>;
export type SubmitContactMessageMutationBody = BodyType<ContactBody>;
export type SubmitContactMessageMutationError = ErrorType<unknown>;
/**
 * @summary Submit a contact message
 */
export declare const useSubmitContactMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitContactMessage>>, TError, {
        data: BodyType<ContactBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitContactMessage>>, TError, {
    data: BodyType<ContactBody>;
}, TContext>;
/**
 * @summary Admin overview metrics
 */
export declare const getGetAdminStatsUrl: () => string;
export declare const getAdminStats: (options?: RequestInit) => Promise<AdminStats>;
export declare const getGetAdminStatsQueryKey: () => readonly ["/api/admin/stats"];
export declare const getGetAdminStatsQueryOptions: <TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminStats>>>;
export type GetAdminStatsQueryError = ErrorType<unknown>;
/**
 * @summary Admin overview metrics
 */
export declare function useGetAdminStats<TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a product (admin)
 */
export declare const getCreateAdminProductUrl: () => string;
export declare const createAdminProduct: (createProductBody: CreateProductBody, options?: RequestInit) => Promise<Product>;
export declare const getCreateAdminProductMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminProduct>>, TError, {
        data: BodyType<CreateProductBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdminProduct>>, TError, {
    data: BodyType<CreateProductBody>;
}, TContext>;
export type CreateAdminProductMutationResult = NonNullable<Awaited<ReturnType<typeof createAdminProduct>>>;
export type CreateAdminProductMutationBody = BodyType<CreateProductBody>;
export type CreateAdminProductMutationError = ErrorType<unknown>;
/**
 * @summary Create a product (admin)
 */
export declare const useCreateAdminProduct: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminProduct>>, TError, {
        data: BodyType<CreateProductBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdminProduct>>, TError, {
    data: BodyType<CreateProductBody>;
}, TContext>;
/**
 * @summary Update a product (admin)
 */
export declare const getUpdateAdminProductUrl: (id: number) => string;
export declare const updateAdminProduct: (id: number, updateProductBody: UpdateProductBody, options?: RequestInit) => Promise<Product>;
export declare const getUpdateAdminProductMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminProduct>>, TError, {
        id: number;
        data: BodyType<UpdateProductBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminProduct>>, TError, {
    id: number;
    data: BodyType<UpdateProductBody>;
}, TContext>;
export type UpdateAdminProductMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminProduct>>>;
export type UpdateAdminProductMutationBody = BodyType<UpdateProductBody>;
export type UpdateAdminProductMutationError = ErrorType<unknown>;
/**
 * @summary Update a product (admin)
 */
export declare const useUpdateAdminProduct: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminProduct>>, TError, {
        id: number;
        data: BodyType<UpdateProductBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminProduct>>, TError, {
    id: number;
    data: BodyType<UpdateProductBody>;
}, TContext>;
/**
 * @summary Delete a product (admin)
 */
export declare const getDeleteAdminProductUrl: (id: number) => string;
export declare const deleteAdminProduct: (id: number, options?: RequestInit) => Promise<SuccessMessage>;
export declare const getDeleteAdminProductMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminProduct>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAdminProduct>>, TError, {
    id: number;
}, TContext>;
export type DeleteAdminProductMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAdminProduct>>>;
export type DeleteAdminProductMutationError = ErrorType<unknown>;
/**
 * @summary Delete a product (admin)
 */
export declare const useDeleteAdminProduct: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminProduct>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAdminProduct>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all orders (admin)
 */
export declare const getListAdminOrdersUrl: () => string;
export declare const listAdminOrders: (options?: RequestInit) => Promise<Order[]>;
export declare const getListAdminOrdersQueryKey: () => readonly ["/api/admin/orders"];
export declare const getListAdminOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listAdminOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminOrders>>>;
export type ListAdminOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List all orders (admin)
 */
export declare function useListAdminOrders<TData = Awaited<ReturnType<typeof listAdminOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update order status (admin)
 */
export declare const getUpdateAdminOrderStatusUrl: (id: number) => string;
export declare const updateAdminOrderStatus: (id: number, updateOrderStatusBody: UpdateOrderStatusBody, options?: RequestInit) => Promise<Order>;
export declare const getUpdateAdminOrderStatusMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrderStatus>>, TError, {
        id: number;
        data: BodyType<UpdateOrderStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrderStatus>>, TError, {
    id: number;
    data: BodyType<UpdateOrderStatusBody>;
}, TContext>;
export type UpdateAdminOrderStatusMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminOrderStatus>>>;
export type UpdateAdminOrderStatusMutationBody = BodyType<UpdateOrderStatusBody>;
export type UpdateAdminOrderStatusMutationError = ErrorType<unknown>;
/**
 * @summary Update order status (admin)
 */
export declare const useUpdateAdminOrderStatus: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrderStatus>>, TError, {
        id: number;
        data: BodyType<UpdateOrderStatusBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminOrderStatus>>, TError, {
    id: number;
    data: BodyType<UpdateOrderStatusBody>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map