import dotenv from "dotenv";

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack)
    const statusCode = err.statusCode || 500;
    const message = err.message || "Erreur interne du serveur"

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "developpement" && {stack: err.stack}),
    });
}

export default errorMiddleware;