import React, {FunctionComponent, useState} from 'react';
import {Element, Normaltekst} from 'nav-frontend-typografi';
import '../kandidatrad/Kandidatrad.less';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import NavFrontendChevron from 'nav-frontend-chevron';

interface Props {
    beskrivelse: string;
}

const Beskrivelse: FunctionComponent<Props> = ({ beskrivelse }) => {
    const [skalViseHele, setSkalViseHele] = useState(false);
    const antTegnSomAlltidVises = 250;

    return (
        <>
            <Element className="side-header__beskrivelse-tittel">Beskrivelse</Element>
            <Normaltekst className="side-header__beskrivelse">
                {beskrivelse.length <= antTegnSomAlltidVises || skalViseHele
                    ? beskrivelse
                    : beskrivelse.substr(0, antTegnSomAlltidVises) + ' ...'}
                {beskrivelse.length > antTegnSomAlltidVises && (
                    <span className="Lenkeknapp__les-mer">
                        <Lenkeknapp onClick={() => setSkalViseHele(!skalViseHele)}>
                            {skalViseHele ? 'Skjul beskrivelse' : 'Les mer'}
                            <NavFrontendChevron type={skalViseHele ? 'opp' : 'ned'} />
                        </Lenkeknapp>
                    </span>
                )}
            </Normaltekst>
        </>
    );
};

export default Beskrivelse;
