import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Datovelger } from 'nav-datovelger';
import moment from 'moment';
import './MidlertidigUtilgjengeligDatovelger.less';
import classNames from 'classnames';

interface Props {
    dato: string | undefined;
    setDato: (dato: string | undefined) => void;
    className?: string;
    feilmelding?: string;
}

const MidlertidigUtilgjengeligDatovelger: FunctionComponent<Props> = props => {
    const { dato, setDato, className, feilmelding } = props;
    return (
        <div className={classNames('midlertidig-utilgjengelig-datovelger', props.className)}>
            <label
                className="midlertidig-utilgjengelig-datovelger__label"
                htmlFor="midlertidig-utilgjengelig-datovelger__input"
            >
                <Element tag="span">Hvor lenge er kandidaten utilgjengelig?</Element>
                <Normaltekst tag="span">Du kan velge maks en måned frem it tid.</Normaltekst>
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
            {feilmelding && (
                <Element
                    className="midlertidig-utilgjengelig-datovelger__feilmelding"
                    aria-live="polite"
                >
                    {feilmelding}
                </Element>
            )}
        </div>
    );
};

export default MidlertidigUtilgjengeligDatovelger;
