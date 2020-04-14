import React, { FunctionComponent, useState } from 'react';
import { Knapp } from 'pam-frontend-knapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import './MidlertidigUtilgjengelig.less';
import Chevron from 'nav-frontend-chevron';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import useFeatureToggle from '../../result/useFeatureToggle';
import { Datovelger } from 'nav-datovelger';
import 'nav-datovelger/lib/styles/datovelger.less';
import moment from 'moment';
import TilgjengelighetIkon, { Tilgjengelighet } from './tilgjengelighet-ikon/TilgjengelighetIkon';

const MidlertidigUtilgjengelig: FunctionComponent = () => {
    const [anker, setAnker] = useState<any>(undefined);
    const [dato, setDato] = useState<string | undefined>(undefined);
    const erToggletPå = useFeatureToggle('vis-midlertidig-utilgjengelig');

    if (!erToggletPå) {
        return null;
    }

    return (
        <div className="midlertidig-utilgjengelig">
            <Knapp type="flat" onClick={e => setAnker(anker ? undefined : e.currentTarget)}>
                <TilgjengelighetIkon
                    tilgjengelighet={Tilgjengelighet.UTILGJENGELIG}
                    className="midlertidig-utilgjengelig__ikon"
                />
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
                        <label
                            className="midlertidig-utilgjengelig__datovelger-label"
                            htmlFor="midlertidig-utilgjengelig__input"
                        >
                            <Element tag="span">Hvor lenge er kandidaten utilgjengelig?</Element>
                        </label>
                        <Datovelger
                            input={{
                                id: 'midlertidig-utilgjengelig__input',
                                name: 'applicationDue',
                                placeholder: 'dd.mm.åååå',
                                ariaLabel: 'Sett søknadsfrist',
                                onChange: setDato, // TODO Ikke heldig håndtering av keyboard-input.. Feilmelding fx?
                            }}
                            onChange={setDato}
                            valgtDato={dato}
                            avgrensninger={{
                                minDato: moment(moment.now()).format(),
                                maksDato: moment(moment.now())
                                    .add(30, 'days')
                                    .format(),
                            }}
                            id="midlertidig-utilgjengelig__datovelger"
                        />
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
