export function toUrlParams(query) {
    return Object.keys(query)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&')
        .replace(/%20/g, '+');
}

export function getUrlParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function leggMerInfoTilKandidaterOgSorter(kandidater, kandidaterMedInfo) {
    const kandidaterMedAlleFelter = kandidater.map((kandidat) => {
        const kandidatMedInfo = kandidaterMedInfo.find((k) => k.id === kandidat.id);
        if (kandidatMedInfo) {
            return {
                ...kandidat,
                ...kandidatMedInfo
            };
        }
        return kandidat;
    });

    return kandidaterMedAlleFelter.sort((a, b) => a.score - b.score);
}
