/** @format */

export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class AccountLockedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AccountLockedError";
    }
}
