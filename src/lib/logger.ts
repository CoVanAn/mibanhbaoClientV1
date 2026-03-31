type LogMeta = unknown;

const isDevelopment = process.env.NODE_ENV !== "production";

const writeLog = (
    level: "debug" | "info" | "warn" | "error",
    message: string,
    meta?: LogMeta,
) => {
    if (!isDevelopment) {
        return;
    }

    if (meta === undefined) {
        console[level](message);
        return;
    }

    console[level](message, meta);
};

const logger = {
    debug: (message: string, meta?: LogMeta) => {
        writeLog("debug", message, meta);
    },
    info: (message: string, meta?: LogMeta) => {
        writeLog("info", message, meta);
    },
    warn: (message: string, meta?: LogMeta) => {
        writeLog("warn", message, meta);
    },
    error: (message: string, meta?: LogMeta) => {
        writeLog("error", message, meta);
    },
};

export default logger;