/**
 * Sorterer items etter dato. Sorterer først på tildato. Er disse like eller er en av disse
 * null sorteres det på fradato
 * @param items
 * @returns {Array.<T>}
 */
export default function sortByDato(items) {
    return items.concat().sort((a, b) => {
        if (isValidISOString(a.tilDato) && isValidISOString(b.tilDato)) {
            if (toDate(a.tilDato).getTime() > toDate(b.tilDato).getTime()) {
                return -1;
            } else if (toDate(a.tilDato).getTime() < toDate(b.tilDato).getTime()) {
                return 1;
            }
            return 0;
        } else if (!isValidISOString(a.tilDato) && !isValidISOString(b.tilDato)) {
            if (a.fraDato > b.fraDato) {
                return -1;
            } else if (a.fraDato < b.fraDato) {
                return 1;
            }
            return 0;
        } else if (!isValidISOString(a.tilDato) || !isValidISOString(b.tilDato)) {
            if (isValidISOString(a.tilDato)) {
                return 1;
            } else if (isValidISOString(b.tilDato)) {
                return -1;
            } else if (toDate(a.fraDato).getTime() > toDate(b.fraDato).getTime()) {
                return -1;
            } else if (toDate(a.fraDato).getTime() < toDate(b.fraDato).getTime()) {
                return 1;
            }
            return -1;
        } else if (toDate(a.tilDato).getTime() > toDate(b.tilDato).getTime()) {
            return -1;
        } else if (toDate(a.tilDato).getTime() < toDate(b.tilDato).getTime()) {
            return 1;
        }
        return 0;
    });
}

const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d\d\d)|Z)?)?)?)?$/i;

function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function toDate(isoString) {
    if (!isValidISOString(isoString)) {
        throw Error(`${isoString} is not a valid ISO 8601 date`);
    }
    return new Date(isoString);
}
