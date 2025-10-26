/** @format */

export enum DiscountApplyType {
    AllProducts = 1,
    SpecificProducts = 2,
}

export enum DiscountStatus {
    Scheduled = 1,
    Active = 2,
    Expired = 3,
    Cancelled = 4,
}

export enum ApplySetting {
    AlwaysApply = 1,
    ApplyWithCondition = 2,
}

export interface IDiscountProgram {
    _id: string;
    programName: string;
    discountPercentage: number;
    applyType: DiscountApplyType;
    productIds?: string[];
    startDate: Date;
    endDate: Date;
    status: DiscountStatus;
    createdAt?: Date;
    applySetting: ApplySetting;
}

export interface ICreateProgramPayload {
    programName: string;
    discountPercentage: number;
    applyType: DiscountApplyType;
    productIds?: string[];
    startDate: Date;
    endDate: Date;
    applySetting: ApplySetting;
}
