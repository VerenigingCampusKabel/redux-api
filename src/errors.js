/**
 * Invalid configuration error
 * @extends {Error}
 */
export class InvalidConfigError extends Error {
    constructor(message) {
        super();
        this.name = 'InvalidConfigError';
        this.message = `Invalid API configuration`;
        if (message) {
            this.message += ': ' + message;
        }
    }
};

/**
 * Request error
 * @extends {Error}
 */
export class RequestError extends Error {
    constructor(err) {
        super();
        this.name = 'RequestError';
        if (err instanceof Error) {
            this.message = err.message;
            this.originalError = err;
        } else {
            this.message = err;
        }
    }
}

/**
 * Internal error
 * @extends {Error}
 */
export class InternalError extends Error {
    constructor(err) {
        super();
        this.name = 'InternalError';
        if (err instanceof Error) {
            this.message = err.message;
            this.originalError = err;
        } else {
            this.message = err;
        }
    }
}
