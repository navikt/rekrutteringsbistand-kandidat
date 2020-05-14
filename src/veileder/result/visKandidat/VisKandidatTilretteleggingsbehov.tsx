import * as React from 'react';
import { useState } from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './VisKandidatTilretteleggingsbehov.less';
import { ARBEIDSRETTET_OPPFOLGING_URL } from '../../common/fasitProperties';
import { logEvent } from '../../amplitude/amplitude';

interface VisKandidatTilretteleggingsbehovProps {
    fnr: string;
}

const VisKandidatTilretteleggingsbehov = ({ fnr }: VisKandidatTilretteleggingsbehovProps) => {
    const [apen, toggleApen] = useState<boolean>(true);
    const arbeidsrettetOppfølgingUrl = `${ARBEIDSRETTET_OPPFOLGING_URL}/${fnr}?#visDetaljer&apneTilretteleggingsbehov`;

    return (
        <div className="panel--tilretteleggingsbehov">
            <EkspanderbartpanelBase
                apen={apen}
                onClick={() => toggleApen(!apen)}
                tittel={<Systemtittel>Tilretteleggingsbehov</Systemtittel>}
            >
                <div className="panel--tilretteleggingsbehov__innhold">
                    <Normaltekst>Kandidaten trenger tilrettelegging</Normaltekst>
                    <a
                        href={arbeidsrettetOppfølgingUrl}
                        className="panel--tilretteleggingsbehov__lenke ForlateSiden lenke"
                        target="_blank"
                        onClick={() => logEvent('cv_tilretteleggingsbehov_lenke', 'klikk')}
                        rel="noopener noreferrer"
                    >
                        <span>Se behov for tilrettelegging.</span>
                        <i className="ForlateSiden__icon" />
                    </a>
                </div>
            </EkspanderbartpanelBase>
        </div>
    );
};

export default VisKandidatTilretteleggingsbehov;
