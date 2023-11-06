export function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        return now > payload.exp;
    } catch (e) {
        console.error(e);
        return true;
    }
}
