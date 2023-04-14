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

export const capitalizeLocation = (location: string) => {
    const separators = [
        ' ', // NORDRE LAND skal bli Nordre Land
        '-', // AUST-AGDER skal bli Aust-Agder
        '(', // BØ (TELEMARK) skal bli Bø (Telemark)
    ];

    const ignore = [
        'i',
        'og', // MØRE OG ROMSDAL skal bli Møre og Romsdal
    ];

    if (location) {
        try {
            let capitalized = location.toLowerCase();

            for (let i = 0, len = separators.length; i < len; i += 1) {
                const fragments = capitalized.split(separators[i]);
                for (let j = 0, x = fragments.length; j < x; j += 1) {
                    if (fragments[j] && !ignore.includes(fragments[j])) {
                        fragments[j] = fragments[j][0].toUpperCase() + fragments[j].substr(1);
                    }
                }
                capitalized = fragments.join(separators[i]);
            }

            return capitalized;
        } catch (e) {
            return location;
        }
    }
    return location;
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
