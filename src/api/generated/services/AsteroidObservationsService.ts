/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { handler_asteroidRequestUpdateDTO } from '../models/handler_asteroidRequestUpdateDTO';
import type { handler_mmUpdateDTO } from '../models/handler_mmUpdateDTO';
import type { handler_moderateDTO } from '../models/handler_moderateDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AsteroidObservationsService {
    /**
     * List asteroid observations
     * Get list of asteroid observations with optional filtering
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAsteroidObservations({
        status,
        from,
        to,
    }: {
        /**
         * Filter by status
         */
        status?: string,
        /**
         * Filter from date (YYYY-MM-DD)
         */
        from?: string,
        /**
         * Filter to date (YYYY-MM-DD)
         */
        to?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/asteroid-observations',
            query: {
                'status': status,
                'from': from,
                'to': to,
            },
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete asteroid observation
     * Soft delete asteroid observation (only by creator)
     * @returns void
     * @throws ApiError
     */
    public static deleteApiAsteroidObservations({
        id,
    }: {
        /**
         * Asteroid request ID
         */
        id: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/asteroid-observations/{id}',
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
     * Get asteroid observation by ID
     * Get asteroid observation details by ID
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAsteroidObservations1({
        id,
    }: {
        /**
         * Asteroid request ID
         */
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/asteroid-observations/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update asteroid observation
     * Update asteroid observation comment (only by creator)
     * @returns void
     * @throws ApiError
     */
    public static putApiAsteroidObservations({
        id,
        request,
    }: {
        /**
         * Asteroid request ID
         */
        id: number,
        /**
         * Update data
         */
        request: handler_asteroidRequestUpdateDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/asteroid-observations/{id}',
            path: {
                'id': id,
            },
            body: request,
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Moderate asteroid observation
     * Complete or reject asteroid observation (moderator only)
     * @returns void
     * @throws ApiError
     */
    public static putApiAsteroidObservationsModerate({
        id,
        request,
    }: {
        /**
         * Asteroid request ID
         */
        id: number,
        /**
         * Moderation action
         */
        request: handler_moderateDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/asteroid-observations/{id}/moderate',
            path: {
                'id': id,
            },
            body: request,
            errors: {
                400: `Bad Request`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * Submit asteroid observation
     * Submit draft asteroid observation for moderation
     * @returns void
     * @throws ApiError
     */
    public static putApiAsteroidObservationsSubmit({
        id,
    }: {
        /**
         * Asteroid request ID
         */
        id: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/asteroid-observations/{id}/submit',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get cart icon info
     * Get draft observation ID and item count for current user
     * @returns any OK
     * @throws ApiError
     */
    public static getApiAsteroidObservationsCart(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/asteroid-observations/cart',
            errors: {
                401: `Unauthorized`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete asteroid observation item
     * Delete item from asteroid observation (only by creator)
     * @returns void
     * @throws ApiError
     */
    public static deleteApiAsteroidRequestItems({
        asteroidRequestId,
        dayId,
    }: {
        /**
         * Asteroid request ID
         */
        asteroidRequestId: number,
        /**
         * Day ID
         */
        dayId: number,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/asteroid-request-items',
            query: {
                'asteroidRequestId': asteroidRequestId,
                'dayId': dayId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
    /**
     * Update asteroid observation item
     * Update asteroid coordinates in request item (only by creator)
     * @returns void
     * @throws ApiError
     */
    public static putApiAsteroidRequestItems({
        request,
    }: {
        /**
         * Update data
         */
        request: handler_mmUpdateDTO,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/asteroid-request-items',
            body: request,
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
            },
        });
    }
}
