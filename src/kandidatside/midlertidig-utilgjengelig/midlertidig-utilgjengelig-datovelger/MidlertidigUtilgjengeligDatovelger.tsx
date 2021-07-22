import React, { FunctionComponent } from 'react';
import { Datepicker } from 'nav-datovelger';
import classNames from 'classnames';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { maksDatoMidlertidigUtilgjengelig, minDatoMidlertidigUtilgjengelig } from '../validering';
import './MidlertidigUtilgjengeligDatovelger.less';

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
            <Datepicker
                inputId="midlertidig-utilgjengelig-datovelger__input"
                inputProps={{
                    name: 'applicationDue',
                    placeholder: 'dd.mm.åååå',
                    'aria-label': 'Sett søknadsfrist',
                    'aria-invalid': feilmelding !== undefined,
                }}
                locale="nb"
                onChange={setDato}
                value={dato}
                limitations={{
                    minDate: minDatoMidlertidigUtilgjengelig().format(),
                    maxDate: maksDatoMidlertidigUtilgjengelig().format(),
                }}
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
