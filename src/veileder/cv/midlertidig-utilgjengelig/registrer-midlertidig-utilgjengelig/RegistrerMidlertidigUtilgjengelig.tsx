import React, { FunctionComponent, useState } from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Datovelger } from 'nav-datovelger';
import moment from 'moment';
import { Knapp } from 'pam-frontend-knapper/dist';
import classNames from 'classnames';
import './RegistrerMidlertidigUtilgjengelig.less';

interface Props {
    onAvbryt: () => void;
    className?: string;
}

const RegistrerMidlertidigUtilgjengelig: FunctionComponent<Props> = props => {
    const [dato, setDato] = useState<string | undefined>(undefined);

    return (
        <div className={classNames("registrer-midlertidig-utilgjengelig", props.className)}>
            <Undertittel tag="h2">Registrer som midlertidig utilgjengelig</Undertittel>
            <Normaltekst>
                Avklar tilgjengeligheten. Gi beskjed til kandidaten hvis du registrerer «midlertidig
                utilgjengelig».
            </Normaltekst>
            <div className="registrer-midlertidig-utilgjengelig__datovelger">
                <label
                    className="registrer-midlertidig-utilgjengelig__datovelger-label"
                    htmlFor="registrer-midlertidig-utilgjengelig__input"
                >
                    <Element tag="span">Hvor lenge er kandidaten utilgjengelig?</Element>
                </label>
                <Datovelger
                    input={{
                        id: 'registrer-midlertidig-utilgjengelig__input',
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
                    id="registrer-midlertidig-utilgjengelig__datovelger"
                />
            </div>
            <Knapp type="hoved">Lagre</Knapp>
            <Knapp
                type="flat"
                className="registrer-midlertidig-utilgjengelig__avbryt"
                onClick={props.onAvbryt}
            >
                Avbryt
            </Knapp>
        </div>
    );
};

export default RegistrerMidlertidigUtilgjengelig;
