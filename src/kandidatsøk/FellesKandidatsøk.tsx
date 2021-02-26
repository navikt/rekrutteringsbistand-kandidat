import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { match } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Column, Container } from 'nav-frontend-grid';
import { Flatknapp } from 'nav-frontend-knapper';
import { KandidatlisteHeader } from './headers/KandidatlisteHeader';
import { Nettstatus } from '../api/remoteData';
import AppState from '../AppState';
import FantFåKandidater from './fant-få-kandidater/FantFåKandidater';
import KandidaterVisning from './KandidaterVisning';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Søkefiltre from './søkefiltre/Søkefiltre';
import ViktigeYrker from './viktigeyrker/ViktigeYrker';
import { KandidaterErLagretSuksessmelding } from './KandidaterErLagretSuksessmelding';
import { hentQueryUtenKriterier } from './DefaultKandidatsøk';
import {
    LUKK_ALLE_SOKEPANEL,
    SEARCH,
    SET_STATE,
    SØK_MED_INFO_FRA_STILLING,
    SØK_MED_URL_PARAMETERE,
} from './reducer/searchReducer';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';
import { harUrlParametere } from './reducer/searchQuery';
import useKandidatliste from './useKandidatliste';

export type FellesKandidatsøkProps = {
    resetQuery: (query: any) => void;
    leggUrlParametereIStateOgSøk: (href: string) => void;
    search: () => void;
    removeKompetanseSuggestions: () => void;
    isInitialSearch: boolean;
    harHentetStilling: boolean;
    resetKandidatlisterSokekriterier: () => void;
    lukkAlleSokepanel: () => void;
};

type Props = {
    match: match<{
        kandidatlisteId?: string;
        stillingsId?: string;
    }>;
};

const FellesKandidatsøk: FunctionComponent<Props> = ({ match }) => {
    const { kandidatlisteId: kandidatlisteIdFraUrl, stillingsId } = match.params;
    const kandidatlistNetteressurs = useSelector(
        (state: AppState) => state.kandidatliste.kandidatliste
    );

    const kandidatliste =
        kandidatlistNetteressurs.kind === Nettstatus.Suksess
            ? kandidatlistNetteressurs.data
            : undefined;

    const kandidatlisteId = kandidatlisteIdFraUrl || kandidatliste?.kandidatlisteId;
    const maksAntallTreff = useSelector((state: AppState) => state.søk.maksAntallTreff);

    const dispatch = useDispatch();

    const iKontekstAvKandidatliste = !!kandidatlisteIdFraUrl;
    const iKontekstAvStilling = !!stillingsId;

    useKandidatliste(
        iKontekstAvStilling ? stillingsId : undefined,
        iKontekstAvKandidatliste ? kandidatlisteId : undefined
    );

    useNullstillKandidatlisteState();

    useEffect(() => {
        const nullstillKandidaterErLagretIKandidatlisteAlert = () => {
            dispatch({
                type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET,
            });
        };

        nullstillKandidaterErLagretIKandidatlisteAlert();
    });

    const oppdaterUrlFraStateOgSøk = useCallback(() => {
        dispatch({ type: SEARCH });
    }, [dispatch]);

    const oppdaterStateFraUrlOgSøk = useCallback(
        (href: string) => {
            dispatch({ type: SØK_MED_URL_PARAMETERE, href });
        },
        [dispatch]
    );

    const hentStillingOgOppdaterStateOgSøk = useCallback(
        (stillingsId: string, kandidatlisteId: string) => {
            dispatch({ type: SØK_MED_INFO_FRA_STILLING, stillingsId, kandidatlisteId });
        },
        [dispatch]
    );

    useEffect(() => {
        if (!iKontekstAvKandidatliste && !iKontekstAvStilling) {
            if (harUrlParametere(window.location.href)) {
                oppdaterStateFraUrlOgSøk(window.location.href);
            } else {
                oppdaterUrlFraStateOgSøk();
            }
        }
    }, [
        iKontekstAvKandidatliste,
        iKontekstAvStilling,
        oppdaterStateFraUrlOgSøk,
        oppdaterUrlFraStateOgSøk,
    ]);

    useEffect(() => {
        if (iKontekstAvStilling && stillingsId && kandidatlisteId) {
            if (harUrlParametere(window.location.href)) {
                oppdaterUrlFraStateOgSøk();
            } else {
                hentStillingOgOppdaterStateOgSøk(stillingsId, kandidatlisteId);
            }
        }
    }, [
        stillingsId,
        iKontekstAvStilling,
        kandidatlisteId,
        oppdaterUrlFraStateOgSøk,
        hentStillingOgOppdaterStateOgSøk,
    ]);

    const nullstillSøkestate = () => {
        dispatch({
            type: SET_STATE,
            query: hentQueryUtenKriterier(
                false, // TODO: harHentetStilling
                kandidatlisteId
            ),
        });
    };

    const lukkAlleSøkepanel = () => {
        dispatch({ type: LUKK_ALLE_SOKEPANEL });
    };

    const onSlettAlleKriterierKlikk = () => {
        lukkAlleSøkepanel();
        nullstillSøkestate();
        oppdaterUrlFraStateOgSøk();
    };

    const visSpinner = false; // TODO: Vis spinner ved første søk? initialSearch
    const visFantFåKandidater = iKontekstAvStilling && maksAntallTreff < 5;

    return (
        <>
            {(iKontekstAvKandidatliste || iKontekstAvStilling) && (
                <KandidatlisteHeader kandidatliste={kandidatliste} stillingsId={stillingsId} />
            )}
            {visSpinner ? (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            ) : (
                <Container fluid className="resultatvisning--container blokk-l">
                    <ViktigeYrker />
                    <Column xs="12" sm="4">
                        <div className="sokekriterier--column" id="sokekriterier">
                            <div className="knapp-wrapper">
                                <Flatknapp
                                    mini
                                    id="slett-alle-kriterier-lenke"
                                    onClick={onSlettAlleKriterierKlikk}
                                >
                                    Slett alle kriterier
                                </Flatknapp>
                            </div>
                            <Søkefiltre stillingsId={stillingsId} />
                        </div>
                    </Column>
                    <Column xs="12" sm="8">
                        <div className="kandidatervisning--column" id="sokeresultat">
                            <KandidaterVisning
                                ikkeHentKandidatliste
                                skjulPaginering={visFantFåKandidater}
                                kandidatlisteId={kandidatlisteId || kandidatliste?.kandidatlisteId}
                                stillingsId={stillingsId}
                            />
                            {visFantFåKandidater && (
                                <FantFåKandidater
                                    onRemoveCriteriaClick={onSlettAlleKriterierKlikk}
                                />
                            )}
                        </div>
                    </Column>
                </Container>
            )}
            <KandidaterErLagretSuksessmelding />
        </>
    );
};

export default FellesKandidatsøk;
