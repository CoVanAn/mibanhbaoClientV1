"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useStore, { UserSlice } from "@/src/store/user";
import { useToast } from "@/src/components/common/toast";

export type UseAuthFlowResult = {
    shouldShowLogin: boolean;
    setShowLogin: (isOpen: boolean) => void;
};

export default function useAuthFlow(): UseAuthFlowResult {
    const [showLogin, setShowLoginState] = useState(false);
    const token = useStore((state: UserSlice) => state.token);
    const setInitialized = useStore((state: UserSlice) => state.setInitialized);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const toast = useToast();

    const isQueryLoginMode = searchParams.get("auth") === "login";
    const googleAuthStatus = searchParams.get("googleAuth");

    const cleanupQueryParams = useCallback(
        (keys: string[]) => {
            const params = new URLSearchParams(searchParams.toString());

            keys.forEach((key) => {
                params.delete(key);
            });

            const query = params.toString();
            const nextUrl = query ? `${pathname}?${query}` : pathname;
            router.replace(nextUrl);
        },
        [pathname, router, searchParams],
    );

    const setShowLogin = useCallback(
        (isOpen: boolean) => {
            setShowLoginState(isOpen);

            if (!isOpen && isQueryLoginMode) {
                cleanupQueryParams(["auth", "redirect"]);
            }
        },
        [cleanupQueryParams, isQueryLoginMode],
    );

    useEffect(() => {
        if (isQueryLoginMode && token) {
            cleanupQueryParams(["auth", "redirect"]);
        }
    }, [cleanupQueryParams, isQueryLoginMode, token]);

    useEffect(() => {
        if (!googleAuthStatus) {
            return;
        }

        if (googleAuthStatus === "error") {
            setInitialized(true);
            toast.error("Dang nhap Google that bai. Vui long thu lai.");
            cleanupQueryParams(["googleAuth"]);
            return;
        }

        if (googleAuthStatus === "success") {
            // Legacy query param from older OAuth flow. Just clean it silently.
            cleanupQueryParams(["googleAuth"]);
        }
    }, [
        cleanupQueryParams,
        googleAuthStatus,
        setInitialized,
        toast,
    ]);

    return {
        shouldShowLogin: showLogin || (isQueryLoginMode && !token),
        setShowLogin,
    };
}
