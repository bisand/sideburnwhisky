export class HttpError extends Error {
    public statusCode: number;
    public errorMessage: string;
    
    constructor(statusCode: number, message: string) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }

        this.name = 'HttpError';
        // Custom debugging information
        this.statusCode = statusCode;
        this.errorMessage = message;
    }
}
