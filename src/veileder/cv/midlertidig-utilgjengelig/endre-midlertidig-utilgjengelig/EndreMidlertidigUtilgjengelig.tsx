import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import { Normaltekst, Undertittel, Element } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper/dist';
import './EndreMidlertidigUtilgjengelig.less';
import { Fieldset, Radio } from 'nav-frontend-skjema';

interface Props {
    onAvbryt: () => void;
    className?: string;
}

const EndreMidlertidigUtilgjengelig: FunctionComponent<Props> = props => {
    const [hvaSkalEndres, setHvaSkalEndres] = useState<string | undefined>(undefined);
    const onHvaSkalEndresChange = (event: ChangeEvent<HTMLInputElement>) =>
        setHvaSkalEndres(event.target.value);

    return (
        <div
            className={classNames(
                'endre-midlertidig-utilgjengelig',
                'skjemaelement--pink',
                props.className
            )}
        >
            <Undertittel tag="h2">Kandidaten er midlertidig utilgjengelig</Undertittel>
            <Normaltekst>Tilgjengelig om: 19 dager</Normaltekst>
            <Normaltekst>Registrert av: Ola Nordmann</Normaltekst>
            <Normaltekst>Registrert: 25.04.2020</Normaltekst>

            <fieldset className="endre-midlertidig-utilgjengelig__fieldset">
                <Element tag="legend" className="endre-midlertidig-utilgjengelig__legend">
                    Endre
                </Element>
                <Radio
                    label="Fjern markeringen som utilgjengelig"
                    name="fjernMarkering"
                    value="fjernMarkering"
                    checked={hvaSkalEndres === 'fjernMarkering'}
                    onChange={onHvaSkalEndresChange}
                    className="endre-midlertidig-utilgjengelig__radio"
                />
                <Radio
                    label="Endre dato"
                    name="endreDato"
                    value="endreDato"
                    checked={hvaSkalEndres === 'endreDato'}
                    onChange={onHvaSkalEndresChange}
                    className="endre-midlertidig-utilgjengelig__radio"
                />
            </fieldset>

            <Knapp type="hoved">Lagre</Knapp>
            <Knapp
                type="flat"
                className="endre-midlertidig-utilgjengelig__avbryt"
                onClick={props.onAvbryt}
            >
                Avbryt
            </Knapp>
        </div>
    );
};

export default EndreMidlertidigUtilgjengelig;
