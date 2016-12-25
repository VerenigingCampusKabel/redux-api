export class InvalidConfigError extends Error {
    constructor(message) {
        super();
        this.name = 'InvalidConfigError';
        this.message = 'Invalid API configuration';
        if (message) {
            this.message += ': ' + message;
        }
    }
};

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
