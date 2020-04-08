import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'pam-frontend-knapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import './MidlertidigUtilgjengelig.less';
import Chevron from 'nav-frontend-chevron';
import { Normaltekst, Systemtittel, Element, Undertittel } from 'nav-frontend-typografi';
import useFeatureToggle from '../../result/useFeatureToggle';

const MidlertidigUtilgjengelig: FunctionComponent = () => {
    const [anker, setAnker] = useState<any>(undefined);
    const erToggletPå = useFeatureToggle('vis-midlertidig-utilgjengelig');

    if (!erToggletPå) {
        return null;
    }

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
                avstandTilAnker={16}
            >
                <div className="midlertidig-utilgjengelig__popup-innhold">
                    <Undertittel tag="h2">Registrer som midlertidig utilgjengelig</Undertittel>
                    <Normaltekst>
                        Avklar tilgjengeligheten. Gi beskjed til kandidaten hvis du registrerer
                        «midlertidig utilgjengelig».
                    </Normaltekst>
                    <div className="midlertidig-utilgjengelig__datovelger">
                        <Element>Hvor lenge er kandidaten utilgjengelig?</Element>
                        <Normaltekst>Du kan velge maks én måned frem i tid.</Normaltekst>
                    </div>
                    <Knapp type="hoved">Lagre</Knapp>
                    <Knapp
                        type="flat"
                        className="midlertidig-utilgjengelig__avbryt"
                        onClick={() => setAnker(undefined)}
                    >
                        Avbryt
                    </Knapp>
                </div>
            </Popover>
        </div>
    );
};

export default MidlertidigUtilgjengelig;
