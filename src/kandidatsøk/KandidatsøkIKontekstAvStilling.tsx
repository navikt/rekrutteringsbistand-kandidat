import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import { KandidatsøkActionType } from './reducer/searchReducer';
import { harUrlParametere } from './reducer/searchQuery';
import { KandidaterErLagretSuksessmelding } from './kandidater-er-lagret-suksessmelding/KandidaterErLagretSuksessmelding';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';
import { Kandidatsøk } from './Kandidatsøk';
import { Nettstatus } from '../api/remoteData';
import AppState from '../AppState';
import useKandidatliste from './useKandidatliste';

type Props = RouteChildrenProps<{ stillingsId: string }>;

const KandidatsøkIKontekstAvStilling: FunctionComponent<Props> = ({ match }) => {
    const stillingsIdFraUrl = match?.params.stillingsId;

    const dispatch = useDispatch();
    const maksAntallTreff = useSelector((state: AppState) => state.søk.maksAntallTreff);
    const kandidatliste = useSelector((state: AppState) =>
        state.kandidatliste.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.kandidatliste.data
            : undefined
    );
    const kandidatlisteIdFraApi = kandidatliste?.kandidatlisteId;

    useKandidatliste(stillingsIdFraUrl);

    useEffect(() => {
        const oppdaterStateFraUrlOgSøk = (href: string, kandidatlisteId?: string) => {
            dispatch({ type: KandidatsøkActionType.SøkMedUrlParametere, href, kandidatlisteId });
        };

        const hentStillingOgOppdaterStateOgSøk = (
            stillingsId?: string,
            kandidatlisteId?: string
        ) => {
            dispatch({
                type: KandidatsøkActionType.SøkMedInfoFraStilling,
                stillingsId,
                kandidatlisteId,
            });
        };

        if (kandidatlisteIdFraApi) {
            if (harUrlParametere(window.location.href)) {
                oppdaterStateFraUrlOgSøk(window.location.href, kandidatlisteIdFraApi);
            } else {
                hentStillingOgOppdaterStateOgSøk(stillingsIdFraUrl, kandidatlisteIdFraApi);
            }
        }
    }, [dispatch, stillingsIdFraUrl, kandidatlisteIdFraApi]);

    return (
        <>
            <KandidaterErLagretSuksessmelding />
            <Kandidatsøk
                visFantFåKandidater={maksAntallTreff < 5}
                stillingsId={stillingsIdFraUrl}
                header={
                    <KandidatlisteHeader
                        kandidatliste={kandidatliste}
                        stillingsId={stillingsIdFraUrl}
                    />
                }
            />
        </>
    );
};

export default KandidatsøkIKontekstAvStilling;
