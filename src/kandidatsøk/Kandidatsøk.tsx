import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import ViktigeYrker from './viktigeyrker/ViktigeYrker';
import { Flatknapp } from 'nav-frontend-knapper';
import KandidaterVisning from './KandidaterVisning';
import FantFåKandidater from './fant-få-kandidater/FantFåKandidater';
import { Column, Container } from 'nav-frontend-grid';
import Søkefiltre from './søkefiltre/Søkefiltre';
import { useDispatch, useSelector } from 'react-redux';
import { LUKK_ALLE_SOKEPANEL, SEARCH, SET_STATE } from './reducer/searchReducer';
import AppState from '../AppState';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';

interface Props {
    visFantFåKandidater?: boolean;
    kandidatlisteId?: string;
    stillingsId?: string;
    suksessmeldingLagreKandidatVises?: boolean;
    header?: ReactElement;
}

export const Kandidatsøk: FunctionComponent<Props> = ({
    visFantFåKandidater,
    kandidatlisteId,
    stillingsId,
    header,
}) => {
    const dispatch = useDispatch();
    const { isInitialSearch, harHentetStilling } = useSelector((state: AppState) => state.søk);

    const søk = () => dispatch({ type: SEARCH });
    const lukkAlleSøkepaneler = () => dispatch({ type: LUKK_ALLE_SOKEPANEL });
    const nullstillSøkekriterier = () => {
        const queryUtenKriterier = hentQueryUtenKriterier(harHentetStilling, kandidatlisteId);
        dispatch({ type: SET_STATE, query: queryUtenKriterier });
    };

    useEffect(() => {
        const nullstillKandidaterErLagretIKandidatlisteAlert = () => {
            dispatch({
                type: KandidatlisteActionType.LEGG_TIL_KANDIDATER_RESET,
            });
        };

        nullstillKandidaterErLagretIKandidatlisteAlert();
    }, [dispatch]);

    const onSlettAlleKriterierKlikk = () => {
        lukkAlleSøkepaneler();
        nullstillSøkekriterier();
        søk();
    };

    return (
        <>
            {header || null}
            {isInitialSearch ? (
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
                                skjulPaginering={visFantFåKandidater}
                                kandidatlisteId={kandidatlisteId}
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
        </>
    );
};

export const hentQueryUtenKriterier = (
    harHentetStilling: boolean,
    kandidatlisteId: string | undefined
) => ({
    fritekst: '',
    stillinger: [],
    arbeidserfaringer: [],
    utdanninger: [],
    kompetanser: [],
    geografiList: [],
    geografiListKomplett: [],
    totalErfaring: [],
    utdanningsniva: [],
    sprak: [],
    kvalifiseringsgruppeKoder: [],
    maaBoInnenforGeografi: false,
    harHentetStilling: harHentetStilling,
    kandidatlisteId: kandidatlisteId,
});
