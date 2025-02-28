import { COOKIE_TOKEN_KEY, COOKIE_USER_KEY } from "@/constants";
import { isEmptyObj } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function getJwtServer() {

    const cookieList = await cookies();

    let jwt;
    let user;

    if (cookieList.has(COOKIE_TOKEN_KEY)) {
        const jwtString = cookieList.get(COOKIE_TOKEN_KEY)?.value;
        if (jwtString) {
            const parsedJSON = JSON.parse(jwtString);

            if (parsedJSON === '{}' ||
                parsedJSON === '[]' ||
                (typeof parsedJSON === 'object' && Object.keys(parsedJSON).length === 0)
            ) {
                jwt = null;
            } else {
                jwt = parsedJSON;
            }
        }
    }

    if (cookieList.has(COOKIE_USER_KEY)) {
        const userString = cookieList.get(COOKIE_USER_KEY)?.value;
        if (userString) {
            user = JSON.parse(userString);
        }
    }

    const removeJwt = () => cookieList.delete(COOKIE_TOKEN_KEY);

    const setJwt = (_jwt: string | JWT) => {
        if (
            !_jwt ||
            _jwt === undefined ||
            _jwt === null ||
            isEmptyObj(_jwt) ||
            _jwt === "{}" ||
            _jwt === "[]"
        )
            return;
        switch (typeof _jwt) {
            case "string":
                cookieList.set(COOKIE_TOKEN_KEY, _jwt);
                break;
            case "object": {
                if (_jwt && _jwt.accessToken) {
                    cookieList.set(COOKIE_USER_KEY, JSON.stringify(_jwt));
                }
                break;
            }
        }
    };

    return {
        jwt,
        user,
        removeJwt,
        setJwt,
    }
}