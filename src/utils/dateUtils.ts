enum Språk {
    Norsk = 'nb-NO',
}

export const formaterTidspunkt = (isoDato: string) => {
    const dato = formaterDato(isoDato);
    const klokkeslett = formaterKlokkeslett(isoDato);

    return `${dato} kl. ${klokkeslett}`;
};

export const formaterDato = (isoDato: string, year?: 'numeric' | '2-digit') =>
    new Date(isoDato).toLocaleDateString(Språk.Norsk, {
        day: '2-digit',
        month: '2-digit',
        year: year || '2-digit',
    });

export const formaterDatoUtenÅrstall = (isoDato: string) => {
    const day = new Date(isoDato).getDate();
    const month = new Date(isoDato).getMonth() + 1;

    return `${day}.${month}`;
};

export const formaterDatoNaturlig = (isoDato: string) =>
    new Date(isoDato).toLocaleDateString(Språk.Norsk, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

export const formaterKlokkeslett = (isoDato: string, visSekunder = false) =>
    new Date(isoDato).toLocaleTimeString(Språk.Norsk, {
        hour: 'numeric',
        minute: 'numeric',
        second: visSekunder ? 'numeric' : undefined,
    });

export const formaterDatoTilMånedOgÅr = (isoDato: string) => {
    return new Date(isoDato).toLocaleString(Språk.Norsk, {
        month: 'long',
        year: 'numeric',
    });
};

export const formaterDatoTilKortMånedOgÅr = (isoDato: string) => {
    return new Date(isoDato).toLocaleString(Språk.Norsk, {
        month: '2-digit',
        year: 'numeric',
    });
};
