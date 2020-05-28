import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import '../kandidatrad/Kandidatrad.less';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import NavFrontendChevron from 'nav-frontend-chevron';

interface Props {
    beskrivelse: string;
}

const ListeBeskrivelse: FunctionComponent<Props> = ({ beskrivelse }) => {
    const [skalViseHeleBeskrivelse, setSkalViseHele] = useState(false);
    const antTegnSomAlltidVises = 250;

    return (
        <>
            <Element className="side-header__beskrivelse-tittel">Beskrivelse</Element>
            <Normaltekst className="side-header__beskrivelse">
                {beskrivelse.length <= antTegnSomAlltidVises || skalViseHeleBeskrivelse
                    ? beskrivelse
                    : beskrivelse.substr(0, antTegnSomAlltidVises) + ' ...'}
                {beskrivelse.length > 12 && (
                    <Lenkeknapp onClick={() => setSkalViseHele(!skalViseHeleBeskrivelse)}>
                        {skalViseHeleBeskrivelse ? 'Skjul beskrivelse' : 'Les mer'}
                        <NavFrontendChevron type={skalViseHeleBeskrivelse ? 'opp' : 'ned'} />
                    </Lenkeknapp>
                )}
            </Normaltekst>
        </>
    );
};

export default ListeBeskrivelse;
