import { KONSEPTTYPE } from '../../felles/konstanter';

export function toUrlParams(query) {
    return Object.keys(query)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&')
        .replace(/%20/g, '+')
        .replace(/%2C/g, ',');
}

export function getHashFromString(string) {
    let hash = 0;
    let i;
    let chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i += 1) {
        chr = string.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = (hash << 5) - hash + chr;
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

const kategoriserKonsepter = (konsepter, konsepttypeFunksjon) =>
    konsepter.reduce(
        (dict, obj) => {
            const konsepttype = konsepttypeFunksjon(obj);
            if (konsepttype === KONSEPTTYPE.UTDANNING) {
                return { ...dict, utdanning: [...dict.utdanning, obj] };
            } else if (konsepttype === KONSEPTTYPE.YRKE) {
                if (obj.c2branch === KONSEPTTYPE.KOMPETANSE) {
                    return { ...dict, kompetanse: [...dict.kompetanse, obj] };
                }
                return { ...dict, yrker: [...dict.yrker, obj] };
            } else if (konsepttype === KONSEPTTYPE.KOMPETANSE) {
                return { ...dict, kompetanse: [...dict.kompetanse, obj] };
            } else if (konsepttype === KONSEPTTYPE.ERFARING) {
                return { ...dict, erfaring: [...dict.erfaring, obj] };
            } else if (konsepttype === KONSEPTTYPE.SERTIFIKAT) {
                return { ...dict, sertifikat: [...dict.sertifikat, obj] };
            } else if (konsepttype === KONSEPTTYPE.SOFT_SKILL) {
                return { ...dict, softSkills: [...dict.softSkills, obj] };
            } else if (konsepttype === KONSEPTTYPE.SPRAK) {
                return { ...dict, sprak: [...dict.sprak, obj] };
            }
            return { ...dict, andre: [...dict.andre, obj] };
        },
        {
            utdanning: [],
            yrker: [],
            kompetanse: [],
            erfaring: [],
            sertifikat: [],
            softSkills: [],
            sprak: [],
            andre: [],
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
    default: 'Annen utdanning',
};

const mapUtdanning = leveltekst => utdanningtekst[leveltekst] || utdanningtekst.default;

export const capitalizeFirstLetter = inputString => {
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

export const capitalizePoststed = poststed =>
    poststed
        .split(' ')
        .map(ord =>
            ['I', 'PÅ'].includes(ord.toUpperCase()) ? ord.toLowerCase() : capitalizeFirstLetter(ord)
        )
        .join(' ');

export const formatterStedsnavn = inputString =>
    inputString
        .split(' ')
        .map(s => (s !== 'i' ? s.charAt(0).toUpperCase() + s.substring(1) : s))
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

export const capitalizeEmployerName = employerName => {
    const separators = [' ', '-', '(', '/'];

    const lowerCaseOrd = ['i', 'og', 'for', 'på', 'avd', 'av'];

    const upperCaseOrd = ['as', 'ab', 'asa', 'ba', 'sa'];

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

export const formatterInt = number => Intl.NumberFormat('nb-NO').format(number);
