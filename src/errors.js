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

export class InternalError extends Error {
    constructor(message) {
        super();
        this.name = 'InternalError';
        this.message = message;
    }
}

export class RequestError extends Error {
    constructor(message) {
        super();
        this.name = 'RequestError';
        this.message = message;
    }
}
