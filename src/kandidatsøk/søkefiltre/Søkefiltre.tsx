import React, { FunctionComponent } from 'react';
import FritekstSearch from './fritekst/FritekstSearch';
import { Element } from 'nav-frontend-typografi';
import StillingSearch from './stilling/StillingSearch';
import GeografiSearch from './geografi/GeografiSearch';
import PermitteringSearch from './permittering/PermitteringSearch';
import TilgjengelighetSearch from './tilgjengelighet/TilgjengelighetSearch';
import UtdanningSearch from './utdanning/UtdanningSearch';
import ArbeidserfaringSearch from './arbeidserfaring/ArbeidserfaringSearch';
import SprakSearch from './sprak/SprakSearch';
import ForerkortSearch from './forerkort/ForerkortSearch';
import KompetanseSearch from './kompetanse/KompetanseSearch';
import NavkontorSearch from './navkontor/NavkontorSearch';
import HovedmalSearch from './hovedmal/HovedmalSearch';
import InnsatsgruppeSearch from './innsatsgruppe/InnsatsgruppeSearch';
import { AlderSearch } from './alder/AlderSearch';
import TilretteleggingsbehovSearch from './tilretteleggingsbehov/TilretteleggingsbehovSearch';
import PrioriterteMålgrupperSearch from './prioritertemålgrupper/PrioriterteMålgrupperSearch';
import './Søkefiltre.less';

type Props = {
    stillingsId: string | undefined;
};

const Søkefiltre: FunctionComponent<Props> = ({ stillingsId }) => {
    return (
        <div className="søkefiltre">
            <FritekstSearch />

            <div className="søkefiltre__gruppe">
                <Element>Beskriv jobben</Element>
                <StillingSearch stillingsId={stillingsId} />
                <GeografiSearch stillingsId={stillingsId} />
            </div>

            <div className="søkefiltre__gruppe">
                <Element>Krav til kandidaten</Element>
                <KompetanseSearch />
                <ArbeidserfaringSearch />
                <UtdanningSearch />
                <ForerkortSearch />
                <SprakSearch />
            </div>

            <div className="søkefiltre__gruppe">
                <Element>Om kandidaten</Element>
                <NavkontorSearch />
                <PermitteringSearch />
                <InnsatsgruppeSearch />
                <HovedmalSearch />
                <TilgjengelighetSearch />
                <AlderSearch />
            </div>

            <div className="søkefiltre__gruppe">
                <Element>Behov for inkludering</Element>
                <PrioriterteMålgrupperSearch />
                <TilretteleggingsbehovSearch />
            </div>
        </div>
    );
};

export default Søkefiltre;
