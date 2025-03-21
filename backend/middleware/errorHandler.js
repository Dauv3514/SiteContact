import { constants } from "../constants.js";

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    let errorTitle = "";
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            errorTitle = "Validation Error";
            break;
        case constants.UNAUTHORIZED:
            errorTitle = "Unauthorized";
            break;
        case constants.FORBIDDEN:
            errorTitle = "Forbidden";
            break;
        case constants.NOT_FOUND:
            errorTitle = "Not Found";
            break;
        case constants.SERVER_ERROR:
            errorTitle = "Internal Server Error";
            break;
        default:
            errorTitle = "Unknown Error";
            break;
    }
    res.status(statusCode).json({
        title: errorTitle,
        message: err.message,
        stackTrace: err.stack
    })
}

export default errorHandler;