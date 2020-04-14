import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import { Normaltekst, Undertittel, Element } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper/dist';
import './EndreMidlertidigUtilgjengelig.less';
import { Fieldset, Radio } from 'nav-frontend-skjema';
import MidlertidigUtilgjengeligDatovelger from '../midlertidig-utilgjengelig-datovelger/MidlertidigUtilgjengeligDatovelger';

interface Props {
    onAvbryt: () => void;
    className?: string;
}

const EndreMidlertidigUtilgjengelig: FunctionComponent<Props> = props => {
    const [hvaSkalEndres, setHvaSkalEndres] = useState<string | undefined>(undefined);
    const [dato, setDato] = useState<string | undefined>(undefined);

    const onHvaSkalEndresChange = (event: ChangeEvent<HTMLInputElement>) =>
        setHvaSkalEndres(event.target.value);

    const onLagre = () => {
        // TODO Dette må implementeres
        if (hvaSkalEndres === 'fjernMarkering') {
            console.log('Lagrer fjerning av markering');
        } else if (hvaSkalEndres === 'endreDato') {
            console.log('Lagrer endring av dato til: ' + dato);
        }
    };

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
            {hvaSkalEndres === 'endreDato' && (
                <MidlertidigUtilgjengeligDatovelger dato={dato} setDato={setDato} />
            )}
            <Knapp type="hoved" onClick={onLagre}>
                Lagre
            </Knapp>
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
