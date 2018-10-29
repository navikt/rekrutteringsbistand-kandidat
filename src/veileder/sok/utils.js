import { KONSEPTTYPE } from '../konstanter';

export function toUrlParams(query) {
    return Object.keys(query)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&')
        .replace(/%20/g, '+');
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
    score: Math.floor(matchforklaring.score12 * 100),
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
