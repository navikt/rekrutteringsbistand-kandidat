import React, { FunctionComponent } from 'react';
import { Element } from 'nav-frontend-typografi';
import { Datovelger } from 'nav-datovelger';
import moment from 'moment';
import './MidlertidigUtilgjengeligDatovelger.less';

interface Props {
    dato: string | undefined;
    setDato: (dato: string | undefined) => void;
}

const MidlertidigUtilgjengeligDatovelger: FunctionComponent<Props> = props => {
    const { dato, setDato } = props;
    return (
        <div className="midlertidig-utilgjengelig-datovelger">
            <label
                className="midlertidig-utilgjengelig-datovelger__label"
                htmlFor="midlertidig-utilgjengelig-datovelger__input"
            >
                <Element tag="span">Hvor lenge er kandidaten utilgjengelig?</Element>
            </label>
            <Datovelger
                input={{
                    id: 'midlertidig-utilgjengelig-datovelger__input',
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
                id="midlertidig-utilgjengelig-datovelger"
            />
        </div>
    );
};

export default MidlertidigUtilgjengeligDatovelger;
