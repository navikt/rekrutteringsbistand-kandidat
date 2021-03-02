import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteChildrenProps } from 'react-router-dom';
import { SEARCH, SØK_MED_URL_PARAMETERE } from './reducer/searchReducer';
import { harUrlParametere } from './reducer/searchQuery';
import { Kandidatsøk } from './Kandidatsøk';
import { KandidaterErLagretSuksessmelding } from './kandidater-er-lagret-suksessmelding/KandidaterErLagretSuksessmelding';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';
import { Nettstatus } from '../api/remoteData';
import AppState from '../AppState';
import useKandidatliste from './useKandidatliste';

type Props = RouteChildrenProps<{
    kandidatlisteId: string;
}>;

const KandidatsøkIKontekstAvKandidatliste: FunctionComponent<Props> = ({ match }) => {
    const dispatch = useDispatch();
    const kandidatlisteIdFraUrl = match?.params.kandidatlisteId;

    useKandidatliste(undefined, kandidatlisteIdFraUrl);

    const kandidatlisteIdFraForrigeSøk = useSelector(
        (state: AppState) => state.søk.kandidatlisteId
    );

    const kandidatlisteNettressurs = useSelector(
        (state: AppState) => state.kandidatliste.kandidatliste
    );

    useEffect(() => {
        const oppdaterStateFraUrlOgSøk = (href: string, kandidatlisteId?: string) => {
            dispatch({ type: SØK_MED_URL_PARAMETERE, href, kandidatlisteId });
        };

        const oppdaterUrlFraStateOgSøk = () => {
            dispatch({ type: SEARCH });
        };

        const søkestateKommerFraDenneKandidatlisten =
            kandidatlisteIdFraForrigeSøk === kandidatlisteIdFraUrl;

        if (søkestateKommerFraDenneKandidatlisten && !harUrlParametere(window.location.href)) {
            oppdaterUrlFraStateOgSøk();
        } else {
            oppdaterStateFraUrlOgSøk(window.location.href, kandidatlisteIdFraUrl);
        }
    }, [dispatch, kandidatlisteIdFraUrl, kandidatlisteIdFraForrigeSøk]);

    return (
        <>
            <KandidaterErLagretSuksessmelding />
            <Kandidatsøk
                kandidatlisteId={kandidatlisteIdFraUrl}
                header={
                    <KandidatlisteHeader
                        kandidatliste={
                            kandidatlisteNettressurs.kind === Nettstatus.Suksess
                                ? kandidatlisteNettressurs.data
                                : undefined
                        }
                    />
                }
            />
        </>
    );
};

export default KandidatsøkIKontekstAvKandidatliste;
