import { KONSEPTTYPE } from '../../felles/konstanter';

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

const kategoriserKonsepter = (konsepter, konsepttypeFunksjon) =>
    konsepter.reduce(
        (dict, obj) => {
            const konsepttype = konsepttypeFunksjon(obj);
            if (konsepttype === KONSEPTTYPE.UTDANNING) {
                return { ...dict, utdanning: [...dict.utdanning, obj] };
            } else if (konsepttype === KONSEPTTYPE.YRKE) {
                return { ...dict, yrker: [...dict.yrker, obj] };
            } else if (konsepttype === KONSEPTTYPE.KOMPETANSE) {
                return { ...dict, kompetanse: [...dict.kompetanse, obj] };
            } else if (konsepttype === KONSEPTTYPE.ERFARING) {
                return { ...dict, erfaring: [...dict.erfaring, obj] };
            } else if (konsepttype === KONSEPTTYPE.AUTORISASJON) {
                return { ...dict, autorisasjon: [...dict.autorisasjon, obj] };
            } else if (konsepttype === KONSEPTTYPE.SOFT_SKILL) {
                return { ...dict, softSkills: [...dict.softSkills, obj] };
            }
            return { ...dict, andre: [...dict.andre, obj] };
        },
        {
            utdanning: [],
            yrker: [],
            kompetanse: [],
            erfaring: [],
            autorisasjon: [],
            softSkills: [],
            andre: []
        }
    );

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

export const kategoriserMatchKonsepter = (matchforklaring) => ({
    score: {
        snitt: Math.floor((matchforklaring.score12 + matchforklaring.score21) * (100 / 2)),
        match: Math.floor(matchforklaring.score12 * 100),
        revertertMatch: Math.floor(matchforklaring.score21 * 100)
    },
    matchedeKonsepter: kategoriserKonsepter(matchforklaring.concepts_matched, (obj) => obj.c1branch),
    stillingskonsepterUtenMatch: kategoriserKonsepter(matchforklaring.j1_not_matched, (obj) => obj.branch),
    kandidatkonsepterUtenMatch: kategoriserKonsepter(matchforklaring.j2_not_matched, (obj) => obj.branch)
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

export const capitalizeFirstLetter = (inputString) => {
    const separators = [' ', '-'];

    if (inputString) {
        let capitalized = inputString.toLowerCase();

        for (let i = 0; i < separators.length; i += 1) {
            const fragments = capitalized.split(separators[i]);

            for (let j = 0; j < fragments.length; j += 1) {
                fragments[j] = fragments[j].charAt(0).toUpperCase() + fragments[j].substr(1);
            }
            capitalized = fragments.join(separators[i]);
        }
        return capitalized;
    }
    return inputString;
};

export const capitalizePoststed = (poststed) => (
    poststed
        .split(' ')
        .map((ord) => (
            ['I', 'PÅ'].includes(ord.toUpperCase())
                ? ord.toLowerCase()
                : capitalizeFirstLetter(ord)
        ))
        .join(' ')
);

export const fornavnOgEtternavnFraKandidat = (cv) => (cv.fornavn && cv.etternavn
    ? `${capitalizeFirstLetter(cv.fornavn)} ${capitalizeFirstLetter(cv.etternavn)}`
    : cv.kandidatnr);

export const formatterStedsnavn = (inputString) => inputString
    .split(' ')
    .map((s) => (s !== 'i' ? s.charAt(0).toUpperCase() + s.substring(1) : s))
    .join(' ');


export const ordToCorrectCase = (ord, listeMedUpperCaseOrd, listeMedLowerCaseOrd) => {
    if (listeMedUpperCaseOrd.includes(ord)) {
        return ord.toUpperCase();
    } else if (!listeMedLowerCaseOrd.includes(ord)) {
        if (ord[0] !== undefined) {
            return ord[0].toUpperCase() + ord.substr(1);
        }
    }
    return ord;
};

export const capitalizeEmployerName = (employerName) => {
    const separators = [' ', '-', '(', '/'];

    const lowerCaseOrd = [
        'i', 'og', 'for', 'på', 'avd', 'av'
    ];

    const upperCaseOrd = [
        'as', 'ab', 'asa', 'ba', 'sa'
    ];

    if (employerName) {
        let text = employerName.toLowerCase();

        for (let i = 0; i < separators.length; i += 1) {
            const fragments = text.split(separators[i]);
            for (let j = 0; j < fragments.length; j += 1) {
                fragments[j] = ordToCorrectCase(fragments[j], upperCaseOrd, lowerCaseOrd);
            }
            text = fragments.join(separators[i]);
        }

        return text;
    }
    return employerName;
};
