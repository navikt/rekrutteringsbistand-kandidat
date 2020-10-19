export enum Miljø {
    DevFss = 'dev-fss',
    ProdFss = 'prod-fss',
    LabsGcp = 'labs-gcp',
    Lokalt = 'local',
}

export const getMiljø = (): Miljø => {
    const { hostname } = window.location;

    if (hostname.includes('nais.adeo.no')) {
        return Miljø.ProdFss;
    } else if (hostname.includes('nais.preprod.local') || hostname.includes('dev.adeo.no')) {
        return Miljø.DevFss;
    } else if (hostname.includes('labs.nais.io')) {
        return Miljø.LabsGcp;
    } else {
        return Miljø.Lokalt;
    }
};
