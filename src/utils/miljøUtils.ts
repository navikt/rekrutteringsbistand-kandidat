export enum Miljø {
    DevGcp = 'dev-gcp',
    ProdGcp = 'prod-gcp',
    LabsGcp = 'labs-gcp',
    Lokalt = 'local',
}

export const getMiljø = (): Miljø => {
    const { hostname } = window.location;

    if (hostname.includes('dev.intern.nav.no')) {
        return Miljø.DevGcp;
    } else if (hostname.includes('intern.nav.no')) {
        return Miljø.ProdGcp;
    } else if (hostname.includes('labs.nais.io')) {
        return Miljø.LabsGcp;
    } else {
        return Miljø.Lokalt;
    }
};
