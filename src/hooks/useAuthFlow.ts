"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import authApiRequest from "@/src/apiRequests/auth";
import { getCookie } from "@/src/lib/cookies";
import logger from "@/src/lib/logger";
import { useMergeGuestCart } from "@/src/queries/useCart";
import useStore, { UserSlice } from "@/src/store/user";
import { useToast } from "@/src/components/common/toast";

export type UseAuthFlowResult = {
    shouldShowLogin: boolean;
    setShowLogin: (isOpen: boolean) => void;
};

export default function useAuthFlow(): UseAuthFlowResult {
    const [showLogin, setShowLoginState] = useState(false);
    const token = useStore((state: UserSlice) => state.token);
    const setToken = useStore((state: UserSlice) => state.setToken);
    const setInitialized = useStore((state: UserSlice) => state.setInitialized);

    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const mergeGuestCart = useMergeGuestCart();
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

        const processGoogleAuth = async () => {
            if (googleAuthStatus === "error") {
                setInitialized(true);
                toast.error("Dang nhap Google that bai. Vui long thu lai.");
                cleanupQueryParams(["googleAuth"]);
                return;
            }

            if (googleAuthStatus !== "success") {
                return;
            }

            try {
                const response = await authApiRequest.refreshToken();

                if (!response.success || !response.accessToken) {
                    setInitialized(true);
                    toast.error("Khong the khoi phuc phien dang nhap Google. Vui long thu lai.");
                    cleanupQueryParams(["googleAuth"]);
                    return;
                }

                setToken(response.accessToken);
                setInitialized(true);

                const guestToken = getCookie("guestToken");
                if (guestToken) {
                    try {
                        await mergeGuestCart.mutateAsync(guestToken);
                    } catch (mergeError) {
                        logger.warn("[useAuthFlow] Guest cart merge failed", mergeError);
                    }
                }

                await Promise.all([
                    queryClient.invalidateQueries({ queryKey: ["cart"] }),
                    queryClient.invalidateQueries({ queryKey: ["account"] }),
                ]);

                cleanupQueryParams(["googleAuth"]);
                router.replace("/account");
            } catch (error) {
                logger.warn("[useAuthFlow] Google auth flow failed", error);
                setInitialized(true);
                toast.error("Dang nhap Google that bai. Vui long thu lai.");
                cleanupQueryParams(["googleAuth"]);
            }
        };

        void processGoogleAuth();
    }, [
        cleanupQueryParams,
        googleAuthStatus,
        mergeGuestCart,
        queryClient,
        router,
        setInitialized,
        setToken,
        toast,
    ]);

    return {
        shouldShowLogin: showLogin || (isQueryLoginMode && !token),
        setShowLogin,
    };
}
