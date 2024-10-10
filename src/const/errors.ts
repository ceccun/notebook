export type ErrorLayout = {
    error: string;
    transaction: number;
}

export enum AuthenticationErrors {
    FIELDS_MISSING,
    EMAIL_IN_USE,
    // USER_NOT_FOUND DEPRECATED TO ENHANCE SECURITY
    USER_NOT_FOUND,
    AUTHENTICATION_FAILURE
}

export enum CryptographyErrors {
    KEYS_MISSING
}