import * as React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { sendEvent } from '../../amplitude/amplitude';
import useMiljøvariabler from '../../common/useMiljøvariabler';
import Informasjonspanel from '../Informasjonspanel';
import './Tilretteleggingsbehov.less';

interface Props {
    fnr: string;
}

const Tilretteleggingsbehov = ({ fnr }: Props) => {
    const { arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <Informasjonspanel tittel="Tilretteleggingsbehov">
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
        </Informasjonspanel>
    );
};

export default Tilretteleggingsbehov;
