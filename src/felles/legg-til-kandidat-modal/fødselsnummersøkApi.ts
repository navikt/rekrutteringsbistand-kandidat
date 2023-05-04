import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { KANDIDATSOK_API } from '../../api/api';
import { SearchApiError, postHeaders } from '../../api/fetchUtils';

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
