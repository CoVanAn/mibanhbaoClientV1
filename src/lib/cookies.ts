export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length !== 2) return null;

    return parts.pop()?.split(";").shift() || null;
};

export const deleteCookie = (name: string, path = "/"): void => {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=; Path=${path}; Max-Age=0; SameSite=Lax`;
};