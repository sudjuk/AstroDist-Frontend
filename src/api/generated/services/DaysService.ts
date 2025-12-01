/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { handler_serviceCreateDTO } from '../models/handler_serviceCreateDTO';
import type { handler_serviceUpdateDTO } from '../models/handler_serviceUpdateDTO';
import type { repository_Day } from '../models/repository_Day';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DaysService {
    /**
     * List days
     * Get list of astronomy days with optional name filter
     * @returns any OK
     * @throws ApiError
     */
    public static getApiDays({
        name,
    }: {
        /**
         * Filter by day name
         */
        name?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/days',
            query: {
                'name': name,
            },
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Create new day
     * Create new astronomy day (moderator only)
     * @returns number Created
     * @throws ApiError
     */
    public static postApiDays({
        request,
    }: {
        /**
         * Day data
         */
        request: handler_serviceCreateDTO,
    }): CancelablePromise<Record<string, number>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/days',
            body: request,
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete day
     * Soft delete astronomy day (moderator only)
     * @returns void
     * @throws ApiError
     */
    public static deleteApiDays({
        id,
    }: {
        /**
         * Day ID
         */
        id: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/days/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get day by ID
     * Get astronomy day details by ID
     * @returns repository_Day OK
     * @throws ApiError
     */
    public static getApiDays1({
        id,
    }: {
        /**
         * Day ID
         */
        id: number,
    }): CancelablePromise<repository_Day> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/days/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Update day
     * Update astronomy day (moderator only)
     * @returns void
     * @throws ApiError
     */
    public static putApiDays({
        id,
        request,
    }: {
        /**
         * Day ID
         */
        id: number,
        /**
         * Update data
         */
        request: handler_serviceUpdateDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/days/{id}',
            path: {
                'id': id,
            },
            body: request,
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Add day to draft
     * Add day to current user's draft asteroid request
     * @returns void
     * @throws ApiError
     */
    public static postApiDaysAddToDraft({
        id,
    }: {
        /**
         * Day ID
         */
        id: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/days/{id}/add-to-draft',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Upload day image
     * Upload image for astronomy day (moderator only)
     * @returns string OK
     * @throws ApiError
     */
    public static postApiDaysImage({
        id,
        file,
    }: {
        /**
         * Day ID
         */
        id: number,
        /**
         * Image file
         */
        file: Blob,
    }): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/days/{id}/image',
            path: {
                'id': id,
            },
            formData: {
                'file': file,
            },
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
                500: `Internal Server Error`,
            },
        });
    }
}
