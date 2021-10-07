enum Språk {
    Norsk = 'nb-NO',
}

export const formaterTidspunkt = (isoDato: string) => {
    const tidspunkt = new Date(isoDato);

    const dato = formaterDato(tidspunkt);
    const klokkeslett = formaterKlokkeslett(tidspunkt);

    return `${dato} kl. ${klokkeslett}`;
};

export const formaterDato = (dato: Date) => dato.toLocaleDateString(Språk.Norsk);

export const formaterKlokkeslett = (dato: Date, visSekunder = false) =>
    dato.toLocaleTimeString(Språk.Norsk, {
        hour: 'numeric',
        minute: 'numeric',
        second: visSekunder ? 'numeric' : undefined,
    });

export const formaterDatoTilMånedOgÅr = (isoString: string) => {
    return new Date(isoString).toLocaleString(Språk.Norsk, {
        month: 'long',
        year: 'numeric',
    });
};

export function datoformatNorskLang(dato: string): string {
    return new Date(dato).toLocaleString(Språk.Norsk, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export function datoformatNorskKort(dato: string): string {
    return new Date(dato).toLocaleString(Språk.Norsk, {
        day: 'numeric',
        month: 'numeric',
    });
}
