import { COOKIE_MAX_AGE, COOKIE_TOKEN_KEY } from "@/constants";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";

export const getJwtClient = () => {
    let jwt: JWT | null = null;

    const _setTokenToCookie = (jwtToken: string | JWT) => {
        setCookie(COOKIE_TOKEN_KEY, jwtToken, {
            maxAge: COOKIE_MAX_AGE,
            path: "/"
        })
    }

    const removeJwt = () => {
        deleteCookie(COOKIE_TOKEN_KEY, {
            path: "/"
        });
    }

    if (hasCookie(COOKIE_TOKEN_KEY)) {
        // Parse the JSON twice to get the object
        const cookieValue = getCookie(COOKIE_TOKEN_KEY);
        const parsedJSON = cookieValue ? JSON.parse(cookieValue as string) : null;

        if (parsedJSON === '{}' || parsedJSON === '[]' || parsedJSON === '""') {
            removeJwt();
        } else {
            jwt = parsedJSON
        }
    }

    const setJwt = (jwtToken: JWT) => {
        switch (true) {
            case typeof jwtToken === "object":
                _setTokenToCookie(JSON.stringify(jwtToken));
                break;
            case typeof jwtToken === "string":
                _setTokenToCookie(jwtToken);
                break;
        }
    }

    return {
        jwt,
        setJwt,
        removeJwt
    }
}