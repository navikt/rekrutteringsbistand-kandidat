export const tilProsent = (desimal?: number) => {
    const prosentpoeng = tilProsentpoeng(desimal as number);
    return `${isNaN(prosentpoeng) ? 0 : prosentpoeng}%`;
};

export const tilProsentpoeng = (desimal: any) => {
    return Math.round(desimal * 100);
};

export const booleanTilTekst = (verdi: boolean) => (verdi ? 'Ja' : 'Nei');

const isNumeric = (num: string) => {
    return !isNaN(parseFloat(num)) && parseFloat(num).toString() === num;
};

export const tilDato = (dato: number | Date | number[] | string) => {
    if (dato == null) return '';
    else if (typeof dato === 'number') return new Date(dato).toDateString();
    else if (Array.isArray(dato)) return dato.join('.');
    else if (dato instanceof Date) return dato.toDateString();
    else if (isNumeric(dato)) return new Date(+dato).toDateString();
    else return new Date(dato).toDateString();
};
