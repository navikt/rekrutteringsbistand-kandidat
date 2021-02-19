import React, { FunctionComponent } from 'react';
import FritekstSearch from '../../sok/fritekst/FritekstSearch';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import StillingSearch from '../../sok/stilling/StillingSearch';
import GeografiSearch from '../../sok/geografi/GeografiSearch';
import PermitteringSearch from '../../sok/permittering/PermitteringSearch';
import TilgjengelighetSearch from '../../sok/tilgjengelighet/TilgjengelighetSearch';
import UtdanningSearch from '../../sok/utdanning/UtdanningSearch';
import ArbeidserfaringSearch from '../../sok/arbeidserfaring/ArbeidserfaringSearch';
import SprakSearch from '../../sok/sprak/SprakSearch';
import ForerkortSearch from '../../sok/forerkort/ForerkortSearch';
import KompetanseSearch from '../../sok/kompetanse/KompetanseSearch';
import NavkontorSearch from '../../sok/navkontor/NavkontorSearch';
import HovedmalSearch from '../../sok/hovedmal/HovedmalSearch';
import InnsatsgruppeSearch from '../../sok/innsatsgruppe/InnsatsgruppeSearch';
import { AlderSearch } from '../../sok/alder/AlderSearch';
import TilretteleggingsbehovSearch from '../../sok/tilretteleggingsbehov/TilretteleggingsbehovSearch';
import './Søkefiltre.less';

type Props = {
    stillingsId: string | undefined;
};

const Søkefiltre: FunctionComponent<Props> = ({ stillingsId }) => {
    return (
        <div className="søkefiltre">
            <FritekstSearch />

            <SkjemaGruppe legend={<Element>Beskriv jobben</Element>}>
                <StillingSearch stillingsId={stillingsId} />
                <GeografiSearch stillingsId={stillingsId} />
            </SkjemaGruppe>

            <SkjemaGruppe legend={<Element>Krav til jobben</Element>}>
                <KompetanseSearch />
                <ArbeidserfaringSearch />
                <UtdanningSearch />
                <ForerkortSearch />
                <SprakSearch />
            </SkjemaGruppe>

            <SkjemaGruppe legend={<Element>Om kandidaten</Element>}>
                <NavkontorSearch />
                <PermitteringSearch />
                <InnsatsgruppeSearch />
                <HovedmalSearch />
                <TilgjengelighetSearch />
                <AlderSearch />
            </SkjemaGruppe>

            <SkjemaGruppe legend={<Element>Behov for inkludering</Element>}>
                <TilretteleggingsbehovSearch />
            </SkjemaGruppe>
        </div>
    );
};

export default Søkefiltre;
