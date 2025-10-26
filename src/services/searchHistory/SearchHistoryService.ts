/** @format */

import instance from "@/config/axios/axios";
import { API_ROUTE } from "@/constants";
import { IResponseAdvance, IResponseBase, ISearchHistoryInfo, ITopSearchInfo } from "@/types";

class SearchHistoryService {
    public static getRecentlySearch(userId: string): Promise<IResponseAdvance<ISearchHistoryInfo[]>> {
        return instance.get(`${API_ROUTE.GET_RECENTLY_SEARCH}/${userId}`);
    }

    public static getTopSearch(): Promise<IResponseAdvance<ITopSearchInfo[]>> {
        return instance.get(API_ROUTE.GET_TOP_SEARCH);
    }

    public static removeSearchHistory(searchValue: string, userId: string): Promise<IResponseBase> {
        return instance.put(API_ROUTE.REMOVE_SEARCH_HISTORY, { searchValue, userId });
    }
}

export { SearchHistoryService };
