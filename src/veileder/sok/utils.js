export function toUrlParams(query) {
    return Object.keys(query)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&')
        .replace(/%20/g, '+');
}

export function getHashFromString(string) {
    let hash = 0;
    let i;
    let chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i += 1) {
        chr = string.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = ((hash << 5) - hash) + chr;
        // eslint-disable-next-line no-bitwise
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
}

export function getUrlParameterByName(name, url = window.location.href) {
    const navn = name.replace(/[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${navn}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const capitalizeFirstLetter = (inputString) => inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();

export const fornavnOgEtternavnFraKandidat = (cv) => (cv.fornavn && cv.etternavn
    ? `${capitalizeFirstLetter(cv.fornavn)} ${capitalizeFirstLetter(cv.etternavn)}`
    : cv.kandidatnr);
