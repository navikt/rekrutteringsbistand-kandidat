import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { KANDIDATSOK_API, SYNLIGHET_API } from '../../api/api';
import { SearchApiError, postHeaders } from '../../api/fetchUtils';
import { Synlighetsevaluering } from './kandidaten-finnes-ikke/Synlighetsevaluering';

export type Fødselsnummersøk = {
    aktørId: string;
    arenaKandidatnr: string;
    fornavn: string;
    etternavn: string;
};

export const fetchKandidatMedFnr = async (fnr: string): Promise<Nettressurs<Fødselsnummersøk>> => {
    const url = `${KANDIDATSOK_API}/veileder/kandidatsok/fnrsok`;
    const body = JSON.stringify({ fnr });

    try {
        const response = await fetch(url, {
            method: 'POST',
            body,
            mode: 'cors',
            credentials: 'include',
            headers: postHeaders(),
        });

        if (response.ok) {
            return {
                kind: Nettstatus.Suksess,
                data: await response.json(),
            };
        } else if (response.status === 404) {
            return {
                kind: Nettstatus.FinnesIkke,
            };
        } else {
            throw await response.text();
        }
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status,
        });
    }
};

export const fetchSynlighetsevaluering = async (
    fødselsnummer: string
): Promise<Nettressurs<Synlighetsevaluering>> => {
    const url = `${SYNLIGHET_API}/evaluering/${fødselsnummer}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (response.ok) {
            const body = await response.json();

            return {
                kind: Nettstatus.Suksess,
                data: body,
            };
        } else {
            throw await response.text();
        }
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status,
        });
    }
};
