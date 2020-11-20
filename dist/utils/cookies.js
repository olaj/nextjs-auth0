"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_1 = require("cookie");
/**
 * Parses the cookies from an API Route or from Pages and returns a key/value object containing all the cookies.
 * @param req Incoming HTTP request.
 */
function parseCookies(req) {
    const { cookies } = req;
    // For API Routes we don't need to parse the cookies.
    if (cookies) {
        return cookies;
    }
    // For pages we still need to parse the cookies.
    const cookie = req && req.headers && req.headers.cookie;
    return cookie_1.parse(cookie || '');
}
exports.parseCookies = parseCookies;
/**
 * Based on the environment and the request we know if a secure cookie can be set.
 */
function isSecureEnvironment(req) {
    if (!req || !req.headers || !req.headers.host) {
        throw new Error('The "host" request header is not available');
    }
    if (process.env.NODE_ENV !== 'production') {
        return false;
    }
    if (/^true$/i.test(process.env.AUTH0_ALLOW_INSECURE_COOKIE)) {
        return false;
    }
    const host = (req.headers.host.indexOf(':') > -1 && req.headers.host.split(':')[0]) || req.headers.host;
    if (['localhost', '127.0.0.1'].indexOf(host) > -1) {
        return false;
    }
    return true;
}
/**
 * Serialize a cookie to a string.
 * @param cookie The cookie to serialize
 * @param secure Create a secure cookie.
 */
function serializeCookie(cookie, secure) {
    return cookie_1.serialize(cookie.name, cookie.value, {
        maxAge: cookie.maxAge,
        expires: new Date(Date.now() + cookie.maxAge * 1000),
        httpOnly: true,
        secure,
        path: cookie.path ? cookie.path : '/',
        domain: cookie.domain,
        sameSite: cookie.sameSite
    });
}
/**
 * Set one or more cookies.
 * @param res The HTTP response on which the cookie will be set.
 * @returns {void}
 */
function setCookies(req, res, cookies) {
    const strCookies = cookies.map((c) => serializeCookie(c, isSecureEnvironment(req)));
    const previousCookies = res.getHeader('Set-Cookie');
    if (previousCookies) {
        if (previousCookies instanceof Array) {
            Array.prototype.push.apply(strCookies, previousCookies);
        }
        else if (typeof previousCookies === 'string') {
            strCookies.push(previousCookies);
        }
    }
    res.setHeader('Set-Cookie', strCookies);
}
exports.setCookies = setCookies;
/**
 * Set one or more cookies.
 * @param res The HTTP response on which the cookie will be set.
 * @returns {void}
 */
function setCookie(req, res, cookie) {
    setCookies(req, res, [cookie]);
}
exports.setCookie = setCookie;
//# sourceMappingURL=cookies.js.map