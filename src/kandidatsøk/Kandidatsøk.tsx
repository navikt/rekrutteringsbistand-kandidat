import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import { Column, Container } from 'nav-frontend-grid';
import { Flatknapp } from 'nav-frontend-knapper';
import { useSelector } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';

import AppState from '../AppState';
import FantFåKandidater from './fant-få-kandidater/FantFåKandidater';
import KandidaterOgModal from './kandidater-og-modal/KandidaterOgModal';
import Søkefiltre from './søkefiltre/Søkefiltre';
import useNullstillKandidatlisteState from './useNullstillKandidatlistestate';
import useSlettAlleKriterier from './useSlettAlleKriterier';
import ViktigeYrker from './viktigeyrker/ViktigeYrker';
import { useLocation } from 'react-router-dom';
import './Kandidatsøk.less';

interface Props {
    visFantFåKandidater?: boolean;
    kandidatlisteId?: string;
    stillingsId?: string;
    header?: ReactElement;
}

type State = { fraMeny: boolean } | undefined;

export const Kandidatsøk: FunctionComponent<Props> = ({
    visFantFåKandidater,
    kandidatlisteId,
    stillingsId,
    header,
}) => {
    useNullstillKandidatlisteState();

    const { state } = useLocation();

    const onSlettAlleKriterierKlikk = useSlettAlleKriterier(kandidatlisteId);
    const venterPåFørsteSøk = useSelector((state: AppState) => state.søk.isInitialSearch);
    const scrolletFraToppen = useSelector((state: AppState) => state.søk.scrolletFraToppen);

    useEffect(() => {
        if (!venterPåFørsteSøk && !(state as State)?.fraMeny) {
            window.scrollTo(0, scrolletFraToppen);
        }
    }, [venterPåFørsteSøk, scrolletFraToppen, state]);

    return (
        <>
            {header || null}
            {venterPåFørsteSøk ? (
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
                            <KandidaterOgModal
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
