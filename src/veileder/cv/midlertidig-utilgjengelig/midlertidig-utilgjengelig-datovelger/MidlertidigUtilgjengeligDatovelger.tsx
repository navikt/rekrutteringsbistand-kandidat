import React, { FunctionComponent } from 'react';
import { Datovelger } from 'nav-datovelger';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import classNames from 'classnames';
import './MidlertidigUtilgjengeligDatovelger.less';
import {
    maksDatoMidlertidigUtilgjengelig,
    minDatoMidlertidigUtilgjengelig,
} from '../validering';

interface Props {
    dato: string | undefined;
    setDato: (dato: string | undefined) => void;
    className?: string;
    feilmelding?: string;
}

const MidlertidigUtilgjengeligDatovelger: FunctionComponent<Props> = (props) => {
    const { dato, setDato, feilmelding } = props;

    return (
        <div className={classNames('midlertidig-utilgjengelig-datovelger', props.className)}>
            <label
                className="midlertidig-utilgjengelig-datovelger__label"
                htmlFor="midlertidig-utilgjengelig-datovelger__input"
            >
                <Element tag="span">Hvor lenge er kandidaten utilgjengelig?</Element>
                <Normaltekst tag="span">Du kan velge maks en måned frem i tid.</Normaltekst>
            </label>
            <Datovelger
                input={{
                    id: 'midlertidig-utilgjengelig-datovelger__input',
                    name: 'applicationDue',
                    placeholder: 'dd.mm.åååå',
                    ariaLabel: 'Sett søknadsfrist',
                    onChange: setDato,
                }}
                onChange={setDato}
                valgtDato={dato}
                avgrensninger={{
                    minDato: minDatoMidlertidigUtilgjengelig().format(),
                    maksDato: maksDatoMidlertidigUtilgjengelig().format(),
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
