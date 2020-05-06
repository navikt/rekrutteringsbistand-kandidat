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

export const capitalizePoststed = (poststed) =>
    poststed
        .split(' ')
        .map((ord) =>
            ['I', 'PÅ'].includes(ord.toUpperCase()) ? ord.toLowerCase() : capitalizeFirstLetter(ord)
        )
        .join(' ');

export const formatterStedsnavn = (inputString) =>
    inputString
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

export const formatterInt = (number) => Intl.NumberFormat('nb-NO').format(number);
