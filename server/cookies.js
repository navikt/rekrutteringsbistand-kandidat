const mapToCookies = (cookieString) =>
    cookieString
        .split(';')
        .filter((str) => !!str && str !== '')
        .map((cookieStr) => ({
            name: cookieStr.split('=')[0].trim(),
            value: cookieStr.split('=')[1].trim(),
        }));

const mapToCookieString = (cookieList) =>
    cookieList.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

const lagCookieStringUtenDobleCookies = (cookieString) => {
    const cookies = mapToCookies(cookieString);

    const cookiesUtenDuplikater = cookies.filter((cookie) => {
        const duplicates = cookies.filter((cookie2) => cookie2.name === cookie.name);
        if (duplicates.length === 1) {
            return true;
        }
        return cookie.value === duplicates[0].value;
    });

    const forskjellIAntallCookies = cookies.length - cookiesUtenDuplikater.length;
    if (forskjellIAntallCookies !== 0) {
        console.log('Fjernet ' + forskjellIAntallCookies + ' cookies');
    }

    return mapToCookieString(cookiesUtenDuplikater);
};

const fjernDobleCookies = (req, res, next) => {
    req.headers.cookie = lagCookieStringUtenDobleCookies(req.headers.cookie);
    next();
};

module.exports = fjernDobleCookies;
