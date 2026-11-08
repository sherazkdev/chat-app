class ApiError extends Error {

    constructor(
        public readonly statusCode: number,
        message: string,
        public success: boolean = false,
        public readonly code: string = "API_ERROR"
    ){
        super(message)
        this.statusCode = statusCode;
        this.name = "ApiError";
        this.success = success;
    }
};
export default ApiError;