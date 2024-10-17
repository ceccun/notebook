export type ErrorLayout = {
	error: string;
	transaction: number;
};

export enum AuthenticationErrors {
	FIELDS_MISSING,
	EMAIL_IN_USE,
	// USER_NOT_FOUND DEPRECATED TO ENHANCE SECURITY
	USER_NOT_FOUND,
	AUTHENTICATION_FAILURE,
	TOKEN_MISSING,
}

export enum CryptographyErrors {
	KEYS_MISSING,
}

export enum NotebookErrors {
	FIELDS_MISSING,
	GENERIC_ERROR,
	NOTEBOOK_NOT_FOUND,
	USER_NOT_ALLOWED,
}
