import * as React from 'react';
import { useState } from 'react';
import { EkspanderbartpanelBasePure } from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './VisKandidatTilretteleggingsbehov.less';
import { ARBEIDSRETTET_OPPFOLGING_URL } from '../../common/fasitProperties';

interface VisKandidatTilretteleggingsbehovProps {
    fnr: string;
}

const VisKandidatTilretteleggingsbehov = ({ fnr }: VisKandidatTilretteleggingsbehovProps) => {
    const [apen, toggleApen] = useState<boolean>(true);
    const arbeidsrettetOppfølgingUrl = `${ARBEIDSRETTET_OPPFOLGING_URL}/${fnr}?#visDetaljer&apneTilretteleggingsbehov`;

    return (
        <div className="panel--tilretteleggingsbehov">
            <EkspanderbartpanelBasePure
                apen={apen}
                onClick={() => toggleApen(!apen)}
                className="ekspanderbartPanel--green"
                heading={
                    <Systemtittel className="ekspanderbartPanel__heading">
                        Tilretteleggingsbehov
                    </Systemtittel>
                }
            >
                <div className="panel--tilretteleggingsbehov__innhold">
                    <Normaltekst>Kandidaten trenger tilrettelegging</Normaltekst>
                    <a
                        href={arbeidsrettetOppfølgingUrl}
                        className="panel--tilretteleggingsbehov__lenke ForlateSiden link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="link">
                            Se behov for tilrettelegging. Bare noen NAV-kontor vil se denne
                            informasjonen.
                        </span>
                        <i className="ForlateSiden__icon" />
                    </a>
                </div>
            </EkspanderbartpanelBasePure>
        </div>
    );
};

export default VisKandidatTilretteleggingsbehov;
