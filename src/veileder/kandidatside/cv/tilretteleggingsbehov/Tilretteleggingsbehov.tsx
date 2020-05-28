import * as React from 'react';
import { useState } from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { ARBEIDSRETTET_OPPFOLGING_URL } from '../../../common/fasitProperties';
import { sendEvent } from '../../../amplitude/amplitude';
import './Tilretteleggingsbehov.less';

interface Props {
    fnr: string;
}

const Tilretteleggingsbehov = ({ fnr }: Props) => {
    const [apen, toggleApen] = useState<boolean>(true);
    const arbeidsrettetOppfølgingUrl = `${ARBEIDSRETTET_OPPFOLGING_URL}/${fnr}?#visDetaljer&apneTilretteleggingsbehov`;

    return (
        <div className="kandidat-tilretteleggingsbehov cv-side__panel">
            <EkspanderbartpanelBase
                apen={apen}
                onClick={() => toggleApen(!apen)}
                tittel={<Systemtittel>Tilretteleggingsbehov</Systemtittel>}
            >
                <div className="kandidat-tilretteleggingsbehov__innhold">
                    <Normaltekst>Kandidaten trenger tilrettelegging</Normaltekst>
                    <a
                        href={arbeidsrettetOppfølgingUrl}
                        className="kandidat-tilretteleggingsbehov__lenke ForlateSiden lenke"
                        target="_blank"
                        onClick={() => sendEvent('cv_tilretteleggingsbehov_lenke', 'klikk')}
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

export default Tilretteleggingsbehov;
