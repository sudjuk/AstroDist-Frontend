/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { handler_profileUpdateDTO } from '../models/handler_profileUpdateDTO';
import type { repository_PublicUser } from '../models/repository_PublicUser';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * Get current user
     * Get information about currently authenticated user
     * @returns repository_PublicUser OK
     * @throws ApiError
     */
    public static getApiMe(): CancelablePromise<repository_PublicUser> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/me',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update current user profile
     * Update current user's login and/or password
     * @returns void
     * @throws ApiError
     */
    public static putApiMe({
        request,
    }: {
        /**
         * Profile update data
         */
        request: handler_profileUpdateDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/me',
            body: request,
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
}
