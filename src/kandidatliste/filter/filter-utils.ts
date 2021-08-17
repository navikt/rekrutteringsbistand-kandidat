import { Kandidat, Kandidatstatus } from '../domene/Kandidat';
import { Kandidatlistefilter } from '../reducer/kandidatlisteReducer';
import {
    Hendelse,
    hentKandidatensSisteHendelse,
} from '../kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';

const QUERY_PARAM_SEPARATOR = '-';

export const matchNavn = (navnefilter: string) => (kandidat: Kandidat) => {
    const trimmet = navnefilter.trim();
    if (trimmet.length === 0) return true;

    const [normalisertFilter, normalisertFornavn, normalisertEtternavn] = [
        trimmet,
        kandidat.fornavn,
        kandidat.etternavn,
    ].map((s) => s.toLowerCase());

    const navn = normalisertFornavn + ' ' + normalisertEtternavn;
    return navn.includes(normalisertFilter);
};

export const filtrerKandidater = (
    kandidater: Kandidat[],
    forespørslerOmDelingAvCv: Nettressurs<Kandidatforespørsler>,
    filter?: Kandidatlistefilter
) => {
    if (!filter) {
        return kandidater.map((kandidat) => kandidat.kandidatnr);
    }

    const statusfilterErValgt = new Set(Object.values(filter.status)).size > 1;
    const hendelsefilterErValgt = new Set(Object.values(filter.hendelse)).size > 1;

    return kandidater
        .filter((kandidat) => kandidat.arkivert === filter.visArkiverte)
        .filter(matchNavn(filter.navn))
        .filter((kandidat) => !statusfilterErValgt || filter.status[kandidat.status])
        .filter(
            (kandidat) =>
                !hendelsefilterErValgt ||
                filter.hendelse[
                    hentKandidatensSisteHendelse(
                        kandidat.utfall,
                        forespørslerOmDelingAvCv.kind === Nettstatus.Suksess
                            ? forespørslerOmDelingAvCv.data[kandidat.aktørid!]
                            : undefined // TODO: riktig nullsjekk?
                    )
                ]
        )
        .map((kandidat) => kandidat.kandidatnr);
};

export const lagTomtStatusfilter = (): Record<Kandidatstatus, boolean> => {
    const statusfilter: Record<string, boolean> = {};
    Object.values(Kandidatstatus).forEach((status) => {
        statusfilter[status] = false;
    });

    return statusfilter;
};

export const lagTomtHendelsefilter = (): Record<Hendelse, boolean> => {
    const hendelsefilter: Record<string, boolean> = {};
    Object.values(Hendelse).forEach((utfall) => {
        hendelsefilter[utfall] = false;
    });

    return hendelsefilter;
};

export const queryParamsTilFilter = (queryParams: URLSearchParams): Kandidatlistefilter => {
    const status = lagTomtStatusfilter();
    const hendelse = lagTomtHendelsefilter();

    const statusParams = queryParams.get('status');
    if (statusParams) {
        statusParams.split(QUERY_PARAM_SEPARATOR).forEach((param) => {
            status[param] = true;
        });
    }

    // TODO: endre til "hendelse" her
    const utfallsParams = queryParams.get('utfall');
    if (utfallsParams) {
        utfallsParams.split(QUERY_PARAM_SEPARATOR).forEach((param) => {
            hendelse[param] = true;
        });
    }

    return {
        status,
        hendelse,
        navn: '',
        visArkiverte: queryParams.get('visArkiverte') === 'true',
    };
};

const getTrueKeys = (obj: Record<string, boolean>) =>
    Object.entries(obj)
        .filter(([key, value]) => value)
        .map(([key, value]) => key);

export const filterTilQueryParams = (filter?: Kandidatlistefilter): URLSearchParams => {
    let queryParams = new URLSearchParams();
    if (!filter) {
        return queryParams;
    }

    const statusfiltre = getTrueKeys(filter.status);
    if (statusfiltre.length > 0) {
        queryParams.set('status', statusfiltre.join(QUERY_PARAM_SEPARATOR));
    }

    const utfallsfiltre = getTrueKeys(filter.hendelse);
    if (utfallsfiltre.length > 0) {
        queryParams.set('utfall', utfallsfiltre.join(QUERY_PARAM_SEPARATOR));
    }

    if (filter.visArkiverte) {
        queryParams.set('visArkiverte', 'true');
    }

    return queryParams;
};
