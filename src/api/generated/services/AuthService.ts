/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { handler_loginDTO } from '../models/handler_loginDTO';
import type { handler_loginResponseDTO } from '../models/handler_loginResponseDTO';
import type { handler_registerDTO } from '../models/handler_registerDTO';
import type { repository_PublicUser } from '../models/repository_PublicUser';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Login user
     * Authenticate user and return JWT token
     * @returns handler_loginResponseDTO OK
     * @throws ApiError
     */
    public static postApiAuthLogin({
        request,
    }: {
        /**
         * Login credentials
         */
        request: handler_loginDTO,
    }): CancelablePromise<handler_loginResponseDTO> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: request,
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Logout user
     * Invalidate user session
     * @returns void
     * @throws ApiError
     */
    public static postApiAuthLogout(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Register new user
     * Create a new user account
     * @returns repository_PublicUser Created
     * @throws ApiError
     */
    public static postApiAuthRegister({
        request,
    }: {
        /**
         * Registration data
         */
        request: handler_registerDTO,
    }): CancelablePromise<repository_PublicUser> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: request,
            errors: {
                400: `Bad Request`,
            },
        });
    }
}
