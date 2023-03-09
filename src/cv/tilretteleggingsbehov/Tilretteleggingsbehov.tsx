import * as React from 'react';
import { useState } from 'react';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { sendEvent } from '../../amplitude/amplitude';
import './Tilretteleggingsbehov.less';
import useMiljøvariabler from '../../common/useMiljøvariabler';

interface Props {
    fnr: string;
}

const Tilretteleggingsbehov = ({ fnr }: Props) => {
    const [apen, toggleApen] = useState<boolean>(true);
    const { arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <div className="kandidat-tilretteleggingsbehov">
            <EkspanderbartpanelBase
                apen={apen}
                onClick={() => toggleApen(!apen)}
                tittel={<Systemtittel>Tilretteleggingsbehov</Systemtittel>}
            >
                <div className="kandidat-tilretteleggingsbehov__innhold">
                    <Normaltekst>Kandidaten trenger tilrettelegging</Normaltekst>
                    <a
                        href={`${arbeidsrettetOppfølgingUrl}/${fnr}?#visDetaljer&apneTilretteleggingsbehov`}
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
