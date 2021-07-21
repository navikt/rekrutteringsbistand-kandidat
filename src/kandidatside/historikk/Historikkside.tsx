import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KandidatlisteForKandidat, KandidatlisterForKandidatActionType } from './historikkReducer';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { useLocation, useRouteMatch } from 'react-router-dom';
import AppState from '../../AppState';
import { Ingress } from 'nav-frontend-typografi';
import { Historikktabell } from './historikktabell/Historikktabell';
import { KandidatQueryParam } from '../Kandidatside';
import { sendEvent } from '../../amplitude/amplitude';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Cv from '../cv/reducer/cv-typer';
import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import 'nav-frontend-tabell-style';
import './Historikkside.less';

const Historikkside: FunctionComponent = () => {
    const dispatch = useDispatch();

    const { search } = useLocation();
    const { params } = useRouteMatch<{ kandidatnr: string }>();
    const queryParams = new URLSearchParams(search);
    const kandidatnr = params.kandidatnr;
    const kandidatlisteId = queryParams.get(KandidatQueryParam.KandidatlisteId);

    const historikk = useSelector((state: AppState) => state.historikk);
    const cv = useSelector((state: AppState) => state.cv.cv);
    const kandidatStatus = useSelector(hentStatus(kandidatnr));

    const lagreKandidatIKandidatlisteStatus = useSelector(
        (state: AppState) => state.kandidatliste.lagreKandidatIKandidatlisteStatus
    );

    useEffect(() => {
        dispatch({
            type: KandidatlisterForKandidatActionType.Fetch,
            kandidatnr,
        });
    }, [kandidatnr, kandidatStatus, dispatch]);

    useEffect(() => {
        if (lagreKandidatIKandidatlisteStatus === Nettstatus.Suksess) {
            dispatch({
                type: KandidatlisterForKandidatActionType.Fetch,
                kandidatnr,
            });
        }
    }, [kandidatnr, lagreKandidatIKandidatlisteStatus, dispatch]);

    useEffect(() => {
        if (historikk.kandidatlisterForKandidat.kind === Nettstatus.Suksess) {
            sendEvent('historikk', 'hentet', {
                antallLister: historikk.kandidatlisterForKandidat.data.length,
            });
        }
    }, [kandidatnr, historikk.kandidatlisterForKandidat]);

    if (
        historikk.kandidatlisterForKandidat.kind === Nettstatus.IkkeLastet ||
        historikk.kandidatlisterForKandidat.kind === Nettstatus.LasterInn
    ) {
        return (
            <div className="text-center">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }

    if (historikk.kandidatlisterForKandidat.kind === Nettstatus.Suksess) {
        const kandidatlister = sorterPåDato(historikk.kandidatlisterForKandidat.data);
        const navn = hentKandidatensNavnFraCvEllerKandidatlister(cv, kandidatlister);

        return (
            <div className="historikkside">
                <Ingress className="blokk-m">
                    <b>{navn}</b> er lagt til i <b>{kandidatlister.length}</b> kandidatlister
                </Ingress>
                <Historikktabell
                    kandidatlister={kandidatlister}
                    aktivKandidatlisteId={kandidatlisteId}
                />
            </div>
        );
    }

    return null;
};

const formaterNavn = (fornavn: string, etternavn: string) => {
    const formatertFornavn = capitalizeFirstLetter(fornavn);
    const formatertEtternavn = capitalizeFirstLetter(etternavn);

    return `${formatertFornavn} ${formatertEtternavn}`;
};

export const hentKandidatensNavnFraCvEllerKandidatlister = (
    cv: Nettressurs<Cv>,
    kandidatlister: KandidatlisteForKandidat[]
) => {
    if (cv.kind === Nettstatus.Suksess) {
        return formaterNavn(cv.data.fornavn, cv.data.etternavn);
    }

    if (kandidatlister.length > 0) {
        const kandidatliste = kandidatlister[0];
        return formaterNavn(kandidatliste.fornavn, kandidatliste.etternavn);
    }

    return null;
};

const hentStatus = (kandidatnr: string) => (state: AppState) => {
    const kandidatliste = state.kandidatliste.kandidatliste;

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
