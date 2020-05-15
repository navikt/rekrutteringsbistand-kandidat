import { capitalizePoststed } from '../../../felles/sok/utils';

export const formatMobileTelephoneNumber = (inputString) => {
    const inputStringNoWhiteSpace = inputString.replace(/\s/g, '');
    const actualNumber = inputStringNoWhiteSpace.slice(-8);
    const countryCode = inputStringNoWhiteSpace.slice(-99, -8);
    const lastString = actualNumber.slice(-3);
    const midString = actualNumber.slice(-5, -3);
    const firstString = actualNumber.slice(-8, -5);

    return `${countryCode} ${firstString} ${midString} ${lastString}`;
};

export const formatterAdresse = (gate, postnummer, poststed) => {
    const sisteDel = [postnummer, poststed ? capitalizePoststed(poststed) : null]
        .filter((string) => string)
        .join(' ');
    return [gate, sisteDel].filter((string) => string).join(', ');
};
