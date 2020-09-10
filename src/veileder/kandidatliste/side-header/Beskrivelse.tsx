import React, {FunctionComponent, useState} from 'react';
import {Element, Normaltekst} from 'nav-frontend-typografi';
import '../kandidatrad/Kandidatrad.less';
import Lenkeknapp from '../../../felles/common/Lenkeknapp';
import NavFrontendChevron from 'nav-frontend-chevron';

interface Props {
    beskrivelse: string;
}

const Beskrivelse: FunctionComponent<Props> = ({beskrivelse}) => {
    const [skalViseHele, setSkalViseHele] = useState(false);
    const antTegnSomAlltidVises = 250;

    return (
        <>
            <Element className="side-header__beskrivelse-tittel">Beskrivelse</Element>
            <Normaltekst className="side-header__beskrivelse">
                {beskrivelse.length <= antTegnSomAlltidVises || skalViseHele
                    ? <span className="side-header__beskrivelsestekst">{beskrivelse}</span>
                    : <span className="side-header__beskrivelsestekst">
                        {beskrivelse.substr(0, antTegnSomAlltidVises) + ' ...'}
                    </span>}
                {beskrivelse.length > antTegnSomAlltidVises && (
                    <Lenkeknapp onClick={() => setSkalViseHele(!skalViseHele)}>
                        {skalViseHele ? 'Skjul beskrivelse' : 'Les mer'}
                        <NavFrontendChevron type={skalViseHele ? 'opp' : 'ned'}/>
                    </Lenkeknapp>
                )}
            </Normaltekst>
        </>
    );
};

export default Beskrivelse;
