import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KandidatlisteForKandidat, KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettstatus } from '../../../felles/common/remoteData';
import { useLocation, useRouteMatch } from 'react-router-dom';
import AppState from '../../AppState';
import 'nav-frontend-tabell-style';
import './Historikkside.less';
import { capitalizeFirstLetter } from '../../../felles/sok/utils';
import { Ingress } from 'nav-frontend-typografi';
import { Historikktabell } from './historikktabell/Historikktabell';
import { KandidatQueryParam } from '../Kandidatside';

const Historikkside: FunctionComponent = () => {
    const { params } = useRouteMatch<{ kandidatnr: string }>();
    const kandidatnr = params.kandidatnr;
    const historikk = useSelector((state: AppState) => state.historikk);
    const cv = useSelector((state: AppState) => state.cv);
    const dispatch = useDispatch();

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId);
    const kandidatStatus = useSelector(hentStatus(kandidatnr));

    useEffect(() => {
        dispatch({
            type: KandidatlisterForKandidatActionType.Fetch,
            kandidatnr,
        });
    }, [kandidatnr, kandidatStatus, dispatch]);

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

const hentStatus = (kandidatnr: string) => (state: AppState) => {
    const kandidatliste = state.kandidatlister.detaljer.kandidatliste;
    if (kandidatliste.kind !== Nettstatus.Suksess) return;
    const kandidat = kandidatliste.data.kandidater.find((k) => k.kandidatnr === kandidatnr);
    return kandidat?.status;
};

const sorterPåDato = (kandidatlister: KandidatlisteForKandidat[]) => {
    return kandidatlister.sort(
        (a, b) => new Date(b.lagtTilTidspunkt).getTime() - new Date(a.lagtTilTidspunkt).getTime()
    );
};

export default Historikkside;
