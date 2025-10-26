/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { ICreateNewProductPayload, IDiscountProgram, IGetProductListInfo, IProductCountBySportType, IProductInfo, IQueryObject, IResponseAdvance, IResponseBase, ProductGender } from "@/types";
import { createQueryString } from "@/utils";

class ProductService {
    public static createNewProduct(payload: ICreateNewProductPayload): Promise<IResponseAdvance<IProductInfo>> {
        return instance.post(API_ROUTE.CREATE_PRODUCT, payload);
    }

    public static getProduct(queryObjects: IQueryObject): Promise<IResponseAdvance<IGetProductListInfo>> {
        return instance.get(`${API_ROUTE.GET_PRODUCTS}${createQueryString(queryObjects)}`);
    }

    public static getProductById(id: string): Promise<IResponseAdvance<{ product: IProductInfo; relatedProducts: IProductInfo[] }>> {
        return instance.get(`${API_ROUTE.GET_PRODUCT_DETAILS}/${id}`);
    }

    public static updateProduct(id: string, payload: ICreateNewProductPayload): Promise<IResponseAdvance<IProductInfo>> {
        return instance.put(`${API_ROUTE.UPDATE_PRODUCT}/${id}`, payload);
    }

    public static deleteProduct(id: string): Promise<IResponseBase> {
        return instance.delete(`${API_ROUTE.DELETE_PRODUCT}/${id}`);
    }

    public static getProductCountBySportType(): Promise<IResponseAdvance<IProductCountBySportType[]>> {
        return instance.get(API_ROUTE.GET_PRODUCT_COUNT_BY_SPORT);
    }

    public static getTopSaleProduct(): Promise<IResponseAdvance<{ topSaleProducts: IProductInfo[]; currentProgramInfo: IDiscountProgram }>> {
        return instance.get(API_ROUTE.GET_TOP_SALE_PRODUCT);
    }

    public static getTopSaleProductByGender(gender: ProductGender): Promise<IResponseAdvance<IProductInfo[]>> {
        return instance.get(`${API_ROUTE.GET_TOP_SALE_PRODUCT_BY_GENDER}?gender=${gender}`);
    }

    public static getBestSellerProducts(queryObjects: IQueryObject): Promise<IResponseAdvance<IProductInfo[]>> {
        return instance.get(`${API_ROUTE.GET_BEST_SELLER}${createQueryString(queryObjects)}`);
    }

    public static addFavoriteProduct(productId: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.ADD_FAVORITE_PRODUCT, { productId });
    }

    public static removeFavoriteProduct(productId: string): Promise<IResponseBase> {
        return instance.post(API_ROUTE.REMOVE_FAVORITE_PRODUCT, { productId });
    }

    public static getFavoriteProducts(): Promise<IResponseAdvance<any[]>> {
        return instance.get(API_ROUTE.GET_FAVORITE_PRODUCTS);
    }

    public static getProductListById(ids: string[]): Promise<IResponseAdvance<IProductInfo[]>> {
        return instance.post(API_ROUTE.GET_PRODUCT_LIST_BY_ID, { productIds: ids });
    }

    public static getProductByName(search: string): Promise<IResponseAdvance<IProductInfo[]>> {
        return instance.get(`${API_ROUTE.GET_PRODUCT_BY_NAME}/${createQueryString({ search: search })}`);
    }

    public static searchProduct(queryObjects: IQueryObject, userId: string | null): Promise<IResponseAdvance<IGetProductListInfo>> {
        return instance.post(`${API_ROUTE.GET_PRODUCT_BY_SEARCH}/${createQueryString(queryObjects)}`, { userId });
    }
}

export { ProductService };
