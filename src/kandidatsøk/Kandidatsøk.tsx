import React, { FunctionComponent, ReactElement } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import ViktigeYrker from './viktigeyrker/ViktigeYrker';
import { Flatknapp } from 'nav-frontend-knapper';
import KandidaterVisning from './KandidaterVisning';
import FantFåKandidater from './fant-få-kandidater/FantFåKandidater';
import { Column, Container } from 'nav-frontend-grid';
import Søkefiltre from './søkefiltre/Søkefiltre';

interface Props {
    visFantFåKandidater?: boolean;
    kandidatlisteId?: string;
    stillingsId?: string;
    visSpinner: boolean;
    suksessmeldingLagreKandidatVises?: boolean;
    header?: ReactElement;
    onRemoveCriteriaClick: () => void;
}

export const Kandidatsøk: FunctionComponent<Props> = ({
    visFantFåKandidater,
    kandidatlisteId,
    stillingsId,
    visSpinner,
    header,
    onRemoveCriteriaClick,
}) => {
    return (
        <>
            {header || null}
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
                                    onClick={onRemoveCriteriaClick}
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
                                <FantFåKandidater onRemoveCriteriaClick={onRemoveCriteriaClick} />
                            )}
                        </div>
                    </Column>
                </Container>
            )}
        </>
    );
};
