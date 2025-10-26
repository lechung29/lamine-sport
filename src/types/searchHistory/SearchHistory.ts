/** @format */

export interface ISearchHistoryInfo {
    _id: string;
    userId?: string;
    searchValue: string;
    isHidden: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITopSearchInfo {
    createdAt: Date;
    searchCount: number;
    searchValue: string;
}
