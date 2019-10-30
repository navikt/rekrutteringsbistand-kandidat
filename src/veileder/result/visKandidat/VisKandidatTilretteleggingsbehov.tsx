import * as React from 'react';
import { EkspanderbartpanelBasePure } from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { FINN_KANDIDAT_URL } from '../../common/fasitProperties';
import './VisKandidatTilretteleggingsbehov.less';

interface VisKandidatTilretteleggingsbehovProps {
    aktorId: string;
}

const VisKandidatTilretteleggingsbehov = ({ aktorId }: VisKandidatTilretteleggingsbehovProps) => {
    const [apen, toggleApen] = React.useState<boolean>(true);

    const lenkeTilFinnKandidat = `${FINN_KANDIDAT_URL}/kandidat/${aktorId}`;

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
                    <Normaltekst className="panel--tilretteleggingsbehov__informasjon">
                        Kandidaten trenger tilrettelegging
                    </Normaltekst>
                    <Normaltekst className="panel--tilretteleggingsbehov__lenkeWrapper">
                        <a
                            href={lenkeTilFinnKandidat}
                            className="frittstaende-lenke ForlateSiden link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="link">Se behov for tilrettelegging</span>
                            <i className="ForlateSiden__icon" />
                        </a>
                    </Normaltekst>
                </div>
            </EkspanderbartpanelBasePure>
        </div>
    );
};

export default VisKandidatTilretteleggingsbehov;
