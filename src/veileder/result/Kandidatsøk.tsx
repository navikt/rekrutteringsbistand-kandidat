import React, { FunctionComponent, ReactElement } from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import ViktigeYrker from './viktigeyrker/ViktigeYrker';
import { Flatknapp } from 'nav-frontend-knapper';
import FritekstSearch from '../sok/fritekst/FritekstSearch';
import StillingSearch from '../sok/stilling/StillingSearch';
import GeografiSearch from '../sok/geografi/GeografiSearch';
import PermitteringSearch from '../sok/permittering/PermitteringSearch';
import TilgjengelighetSearch from '../sok/tilgjengelighet/TilgjengelighetSearch';
import UtdanningSearch from '../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../sok/arbeidserfaring/ArbeidserfaringSearch';
import SprakSearch from '../sok/sprak/SprakSearch';
import ForerkortSearch from '../sok/forerkort/ForerkortSearch';
import KompetanseSearch from '../sok/kompetanse/KompetanseSearch';
import NavkontorSearch from '../sok/navkontor/NavkontorSearch';
import HovedmalSearch from '../sok/hovedmal/HovedmalSearch';
import InnsatsgruppeSearch from '../sok/innsatsgruppe/InnsatsgruppeSearch';
import TilretteleggingsbehovSearch from '../sok/tilretteleggingsbehov/TilretteleggingsbehovSearch';
import KandidaterVisning from './KandidaterVisning';
import FantFåKandidater from './fant-få-kandidater/FantFåKandidater';
import { Column, Container } from 'nav-frontend-grid';
import { AlderSearch } from '../sok/alder/AlderSearch';

interface Props {
    visFantFåKandidater?: boolean;
    kandidatlisteId?: string;
    stillingsId?: string;
    visSpinner: boolean;
    suksessmeldingLagreKandidatVises?: boolean;
    header: ReactElement;
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
        <div>
            <div className="ResultatVisning--hovedside--header">{header}</div>
            {visSpinner ? (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            ) : (
                <div>
                    <Container className="blokk-l">
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
                                <div className="resultatvisning--sokekriterier">
                                    <FritekstSearch />
                                    <StillingSearch stillingsId={stillingsId} />
                                    <GeografiSearch stillingsId={stillingsId} />
                                    <PermitteringSearch />
                                    <TilgjengelighetSearch />
                                    <UtdanningSearch />
                                    <ArbeidserfaringSearch />
                                    <SprakSearch />
                                    <ForerkortSearch />
                                    <KompetanseSearch />
                                    <NavkontorSearch />
                                    <HovedmalSearch />
                                    <InnsatsgruppeSearch />
                                    {/*<AlderSearch />*/}
                                    <TilretteleggingsbehovSearch />
                                </div>
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
                                        onRemoveCriteriaClick={onRemoveCriteriaClick}
                                    />
                                )}
                            </div>
                        </Column>
                    </Container>
                </div>
            )}
        </div>
    );
};
