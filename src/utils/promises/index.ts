/** @format */

import { delay, tail } from "lodash";

export async function getDataWithDelay<T extends unknown[]>(promises: [...{ [K in keyof T]: Promise<T[K]> }], waitTime: number): Promise<T> {
    const delayPromise = new Promise<void>((resolve) => delay(resolve, waitTime));
    return Promise.all([delayPromise, ...promises]).then(([, ...results]) => tail(results) as T);
}

export const delayTime = (time: number = 1000) => {
    return new Promise((resolve) => delay(resolve, time));
};
