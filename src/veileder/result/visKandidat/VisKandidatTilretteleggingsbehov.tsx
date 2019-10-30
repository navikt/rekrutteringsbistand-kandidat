import * as React from 'react';
import { EkspanderbartpanelBasePure } from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import './VisKandidatTilretteleggingsbehov.less';

interface VisKandidatTilretteleggingsbehovProps {
    aktorId: string;
}

const VisKandidatTilretteleggingsbehov = ({ aktorId }: VisKandidatTilretteleggingsbehovProps) => {
    const [apen, toggleApen] = React.useState<boolean>(true);

    const lenkeTilFinnKandidat = `/kandidater/finn-kandidat/kandidat/${aktorId}`;

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
                        href={lenkeTilFinnKandidat}
                        className="panel--tilretteleggingsbehov__lenke ForlateSiden link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="link">Se behov for tilrettelegging</span>
                        <i className="ForlateSiden__icon" />
                    </a>
                </div>
            </EkspanderbartpanelBasePure>
        </div>
    );
};

export default VisKandidatTilretteleggingsbehov;
