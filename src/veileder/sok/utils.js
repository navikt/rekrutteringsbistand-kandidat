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

const EducationLevelPrefix = 'education level ';

const utdanningtekst = {
    [`${EducationLevelPrefix}0`]: 'Ingen registrert utdanning',
    [`${EducationLevelPrefix}1`]: 'Grunnskole',
    [`${EducationLevelPrefix}2`]: 'Videregående skole',
    [`${EducationLevelPrefix}3`]: 'Fagbrev',
    [`${EducationLevelPrefix}4`]: 'Fagskole',
    [`${EducationLevelPrefix}5`]: 'Bachelor',
    [`${EducationLevelPrefix}6`]: 'Master',
    [`${EducationLevelPrefix}7`]: 'Doktorgrad',
    default: 'Annen utdanning'
};

const mapUtdanning = (leveltekst) => utdanningtekst[leveltekst] || utdanningtekst.default;

const mapUtdanninger = (utdanninger) =>
    utdanninger.map((u) => (u.name ? { ...u, name: mapUtdanning(u.name) } : { ...u, c1name: mapUtdanning(u.c1name), c2name: mapUtdanning(u.c2name) }));

export const oversettUtdanning = (konsepter) => ({
    ...konsepter,
    utdanning: mapUtdanninger(konsepter.utdanning)
});

export const mapExperienceLevelTilAar = (level) => {
    switch (level) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return '0-1 år';
        case 7:
        case 8:
        case 9:
            return '2-3 år';
        case 10:
        case 11:
        case 12:
            return '4-6 år';
        case 13:
        case 14:
        case 15:
            return '7-9 år';
        case 16:
        case 17:
            return 'Over 10 år';
        default:
            return 'Ikke relevant';
    }
};

export const mapExperienceLevelTilKalenderEnhet = (level) => {
    if (level <= 7) {
        switch (level) {
            case 1:
                return '1 måned';
            case 2:
                return '2 måneder';
            case 3:
                return '3 måneder';
            case 4:
                return '4 måneder';
            case 5:
                return '6 måneder';
            case 6:
                return '1 år';
            case 7:
                return '1,5 år';
            default:
                return 'Ingen erfaring';
        }
    } else if (level <= 16) {
        return `${level - 6} år`;
    }
    return 'Over 10 år';
};

export const capitalizeFirstLetter = (inputString) => inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();

export const fornavnOgEtternavnFraKandidat = (cv) => (cv.fornavn && cv.etternavn
    ? `${capitalizeFirstLetter(cv.fornavn)} ${capitalizeFirstLetter(cv.etternavn)}`
    : cv.kandidatnr);
