import React, { FunctionComponent, ReactElement } from 'react';
import HjelpetekstFading from '../../felles/common/HjelpetekstFading';
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

interface Props {
    visFantFåKandidater: boolean;
    antallLagredeKandidater: number;
    lagretKandidatliste: {
        kandidatlisteId: string;
        tittel: string;
    };
    kandidatlisteId?: string;
    stillingsId?: string;
    visSpinner: boolean;
    suksessmeldingLagreKandidatVises: boolean;
    header: ReactElement;
}

export const Kandidatsøk: FunctionComponent<Props> = ({
    visFantFåKandidater,
    antallLagredeKandidater,
    lagretKandidatliste,
    kandidatlisteId,
    stillingsId,
    visSpinner,
    suksessmeldingLagreKandidatVises,
    header,
}) => {
    return (
        <div>
            <HjelpetekstFading
                synlig={suksessmeldingLagreKandidatVises}
                type="suksess"
                innhold={`${
                    antallLagredeKandidater > 1
                        ? `${antallLagredeKandidater} kandidater`
                        : 'Kandidaten'
                } er lagret i kandidatlisten «${lagretKandidatliste.tittel}»`}
                id="hjelpetekstfading"
            />
            <div className="ResultatVisning--hovedside--header">{header}</div>
            {visSpinner ? (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            ) : (
                <div>
                    <Container className="blokk-l">
                        <ViktigeYrker />
                        <Column xs="12" sm="4" id="sokekriterier">
                            <div className="sokekriterier--column">
                                <div className="knapp-wrapper">
                                    <Flatknapp
                                        mini
                                        id="slett-alle-kriterier-lenke"
                                        onClick={this.onRemoveCriteriaClick}
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
                                    <TilretteleggingsbehovSearch />
                                </div>
                            </div>
                        </Column>
                        <Column xs="12" sm="8" id="sokeresultat">
                            <div className="kandidatervisning--column">
                                <KandidaterVisning
                                    skjulPaginering={visFantFåKandidater}
                                    kandidatlisteId={kandidatlisteId}
                                    stillingsId={stillingsId}
                                />
                                {visFantFåKandidater && <FantFåKandidater />}
                            </div>
                        </Column>
                    </Container>
                </div>
            )}
        </div>
    );
};
