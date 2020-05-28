import React, { FunctionComponent, useState } from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

import { OpprettetAv } from '../../kandidatlistetyper';
import { capitalizeEmployerName } from '../../../../felles/sok/utils';
import './SideHeader.less';
import { LenkeMedChevron } from '../../../kandidatside/header/lenke-med-chevron/LenkeMedChevron';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import NavFrontendChevron from 'nav-frontend-chevron';
import { lenkeTilStilling } from '../../../application/paths';
import ListeBeskrivelse from "./ListeBeskrivelse";

type Props = {
    tittel: string;
    antallKandidater: number;
    antallAktuelleKandidater: number;
    antallPresenterteKandidater: number;
    arbeidsgiver?: string;
    opprettetAv: OpprettetAv;
    stillingsId: string | null;
    beskrivelse?: string;
};

const SideHeader: FunctionComponent<Props> = ({
    tittel,
    antallKandidater,
    antallAktuelleKandidater,
    antallPresenterteKandidater,
    arbeidsgiver,
    opprettetAv,
    stillingsId,
    beskrivelse,
}) => {
    const [beskrivelseSkalVises, setBeskrivelseSkalVises] = useState(false);
    const oppsummeringTekst = `${antallKandidater} kandidater (${antallAktuelleKandidater} er aktuelle${
        stillingsId ? ` / ${antallPresenterteKandidater} er presentert` : ''
    })`;
    return (
        <header className="side-header">
            <div className="side-header__inner">
                <div className="side-header__tilbake">
                    <LenkeMedChevron
                        to="/kandidater/lister"
                        text="Til kandidatlister"
                        type="venstre"
                    />
                </div>
                <div className="side-header__informasjon">
                    <Systemtittel className="side-header__tittel">{tittel}</Systemtittel>
                    <Element className="side-header__antall-kandidater">
                        {oppsummeringTekst}
                    </Element>
                    <div className="side-header__om-kandidatlisten">
                        {arbeidsgiver && (
                            <span>Arbeidsgiver: {capitalizeEmployerName(arbeidsgiver)}</span>
                        )}
                        <span>
                            Registrert av: {opprettetAv.navn} ({opprettetAv.ident})
                        </span>
                        {stillingsId && (
                            <span>
                                <Lenke href={lenkeTilStilling(stillingsId)}>
                                    Se stillingsannonse
                                </Lenke>
                            </span>
                        )}
                        {beskrivelse && (
                            <Lenkeknapp
                                onClick={() => setBeskrivelseSkalVises(!beskrivelseSkalVises)}
                            >
                                {beskrivelseSkalVises ? 'Skjul beskrivelse' : 'Vis beskrivelse'}
                                <NavFrontendChevron type={beskrivelseSkalVises ? 'opp' : 'ned'} />
                            </Lenkeknapp>
                        )}
                    </div>
                    {beskrivelseSkalVises && beskrivelse && (
                        <ListeBeskrivelse beskrivelse={beskrivelse}/>
                        // <>
                        //     <Element className="side-header__beskrivelse-tittel">
                        //         Beskrivelse
                        //     </Element>
                        //     <Normaltekst className="side-header__beskrivelse">
                        //         {beskrivelse}
                        //     </Normaltekst>
                        // </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default SideHeader;
