import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KandidatlisteForKandidat, KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettressurs, Nettstatus } from '../../../felles/common/remoteData';
import { useLocation, useRouteMatch } from 'react-router-dom';
import AppState from '../../AppState';
import 'nav-frontend-tabell-style';
import './Historikkside.less';
import { capitalizeFirstLetter } from '../../../felles/sok/utils';
import { Ingress } from 'nav-frontend-typografi';
import { Historikktabell } from './historikktabell/Historikktabell';
import { KandidatQueryParam } from '../Kandidatside';
import { Kandidatliste } from '../../kandidatlister/kandidatlistetyper';

const hentKandidatStatusFraState = (
    kandidatnr: string,
    kandidatliste: Nettressurs<Kandidatliste>
) => {
    const kandidater =
        kandidatliste.kind === Nettstatus.Suksess ? kandidatliste.data.kandidater : undefined;
    const kandidat = kandidater?.find((k) => k.kandidatnr === kandidatnr);
    return kandidat?.status;
};

const sorterPåDato = (kandidatlister: KandidatlisteForKandidat[]) => {
    return kandidatlister.sort(
        (a, b) => new Date(b.lagtTilTidspunkt).getTime() - new Date(a.lagtTilTidspunkt).getTime()
    );
};

const Historikkside: FunctionComponent = () => {
    const { params } = useRouteMatch<{ kandidatnr: string }>();
    const kandidatnr = params.kandidatnr;
    const historikk = useSelector((state: AppState) => state.historikk);
    const cv = useSelector((state: AppState) => state.cv);
    const dispatch = useDispatch();

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId);

    const kandidatliste = useSelector(
        (state: AppState) => state.kandidatlister.detaljer.kandidatliste
    );
    const kandidatStatus = hentKandidatStatusFraState(kandidatnr, kandidatliste);

    useEffect(() => {
        dispatch({
            type: KandidatlisterForKandidatActionType.Fetch,
            kandidatnr,
        });
    }, [kandidatnr, dispatch, kandidatStatus]);

    if (
        historikk.kandidatlisterForKandidat.kind !== Nettstatus.Suksess ||
        cv.hentStatus !== 'SUCCESS'
    ) {
        return null;
    }

    const kandidatlister = sorterPåDato(historikk.kandidatlisterForKandidat.data);

    return (
        <div className="historikkside">
            <Ingress className="blokk-m">
                <b>
                    {capitalizeFirstLetter(cv.cv.fornavn)} {capitalizeFirstLetter(cv.cv.etternavn)}
                </b>{' '}
                er lagt til i <b>{kandidatlister.length}</b> kandidatlister
            </Ingress>
            <Historikktabell
                kandidatlister={kandidatlister}
                aktivKandidatlisteId={kandidatlisteId}
            />
        </div>
    );
};

export default Historikkside;
