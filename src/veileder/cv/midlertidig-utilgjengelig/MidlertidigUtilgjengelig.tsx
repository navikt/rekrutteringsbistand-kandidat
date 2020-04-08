import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'pam-frontend-knapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import './MidlertidigUtilgjengelig.less';
import Chevron from 'nav-frontend-chevron';
import { Normaltekst, Systemtittel, Element } from 'nav-frontend-typografi';

interface Props {}

const MidlertidigUtilgjengelig: FunctionComponent<Props> = props => {
    const [anker, setAnker] = useState<any>(undefined);

    return (
        <div className="midlertidig-utilgjengelig">
            <Knapp type="flat" onClick={e => setAnker(anker ? undefined : e.currentTarget)}>
                Registrer som utilgjengelig
                <Chevron
                    type={anker ? 'opp' : 'ned'}
                    className="midlertidig-utilgjengelig__chevron"
                />
            </Knapp>
            <Popover
                ankerEl={anker}
                onRequestClose={() => setAnker(undefined)}
                orientering={PopoverOrientering.UnderHoyre}
            >
                <div className="midlertidig-utilgjengelig__popup-innhold">
                    <Systemtittel>Registrer som midlertidig utilgjengelig</Systemtittel>
                    <Normaltekst>
                        Avklar tilgjengeligheten. Gi beskjed til kandidaten hvis du registrerer
                        «midlertidig utilgjengelig».
                    </Normaltekst>
                    <Element>Hvor lenge er kandidaten utilgjengelig?*</Element>
                    <Normaltekst>Du kan velge maks en måned frem i tid</Normaltekst>
                    <Knapp type="hoved">Lagre</Knapp>
                    <Knapp type="flat" onClick={() => setAnker(undefined)}>
                        Avbryt
                    </Knapp>
                </div>
            </Popover>
        </div>
    );
};

export default MidlertidigUtilgjengelig;
