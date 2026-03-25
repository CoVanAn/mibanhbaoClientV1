type ApiErrorPayload = {
    message?: string;
    errors?: string[];
};

type ErrorWithPayload = {
    payload?: ApiErrorPayload;
};

type ErrorWithResponse = {
    response?: {
        data?: ApiErrorPayload;
    };
};

export const getApiErrorMessage = (
    error: unknown,
    fallback: string,
): string => {
    if (error instanceof Error && error.message) {
        // Prefer API payload/response message when available, then fallback to Error message.
        const withResponse = error as Error & ErrorWithResponse;
        const responseMessage = withResponse.response?.data?.message;
        if (typeof responseMessage === "string" && responseMessage.trim()) {
            return responseMessage;
        }

        const withPayload = error as Error & ErrorWithPayload;
        const payloadMessage = withPayload.payload?.message;
        if (typeof payloadMessage === "string" && payloadMessage.trim()) {
            return payloadMessage;
        }

        return error.message;
    }

    if (typeof error === "object" && error !== null) {
        const withResponse = error as ErrorWithResponse;
        const responseMessage = withResponse.response?.data?.message;
        if (typeof responseMessage === "string" && responseMessage.trim()) {
            return responseMessage;
        }

        const responseErrors = withResponse.response?.data?.errors;
        if (Array.isArray(responseErrors) && responseErrors.length > 0) {
            return responseErrors.join(", ");
        }

        const withPayload = error as ErrorWithPayload;
        const payloadMessage = withPayload.payload?.message;
        if (typeof payloadMessage === "string" && payloadMessage.trim()) {
            return payloadMessage;
        }
    }

    return fallback;
};
