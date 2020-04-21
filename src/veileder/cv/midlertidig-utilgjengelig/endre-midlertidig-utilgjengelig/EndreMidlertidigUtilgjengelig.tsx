import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper/dist';
import './EndreMidlertidigUtilgjengelig.less';
import { Radio } from 'nav-frontend-skjema';
import MidlertidigUtilgjengeligDatovelger from '../midlertidig-utilgjengelig-datovelger/MidlertidigUtilgjengeligDatovelger';
import { MidlertidigUtilgjengeligResponse } from '../midlertidigUtilgjengeligReducer';
import moment, { Moment } from 'moment';
import { validerDatoOgReturnerFeilmelding } from '../midlertidig-utilgjengelig-utils';

interface Props {
    onAvbryt: () => void;
    className?: string;
    endreMidlertidigUtilgjengelig: (tilOgMedDato: string) => void;
    slettMidlertidigUtilgjengelig: () => void;
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligResponse;
}

const formaterDato = (dato: Date | Moment) => moment(dato).format('DD.MM.YYYY');

const EndreMidlertidigUtilgjengelig: FunctionComponent<Props> = (props) => {
    const [hvaSkalEndres, setHvaSkalEndres] = useState<string | undefined>(undefined);
    const [dato, setDato] = useState<string | undefined>(undefined);
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);

    const onHvaSkalEndresChange = (event: ChangeEvent<HTMLInputElement>) =>
        setHvaSkalEndres(event.target.value);

    const onAvbryt = () => {
        setDato(undefined);
        setFeilmelding(undefined);
        setHvaSkalEndres(undefined);
        props.onAvbryt();
    };

    const onLagre = () => {
        if (hvaSkalEndres === 'fjernMarkering') {
            props.slettMidlertidigUtilgjengelig();
        } else if (hvaSkalEndres === 'endreDato') {
            const valideringsfeil = validerDatoOgReturnerFeilmelding(dato);
            if (valideringsfeil) {
                setFeilmelding(valideringsfeil);
            } else {
                props.endreMidlertidigUtilgjengelig(dato!);
                setFeilmelding(undefined);
            }
        }
    };

    const {
        tilDato,
        registrertAvIdent,
        registrertAvNavn,
        fraDato,
    } = props.midlertidigUtilgjengelig;

    const tilgjengeligDato = moment(tilDato).add(1, 'days');

    return (
        <div
            className={classNames(
                'endre-midlertidig-utilgjengelig',
                'skjemaelement--pink',
                props.className
            )}
        >
            <Undertittel tag="h2" className="endre-midlertidig-utilgjengelig__tittel">
                Kandidaten er midlertidig utilgjengelig
            </Undertittel>
            <Normaltekst>
                Tilgjengelig om:{' '}
                <Element tag="span">
                    {moment(tilgjengeligDato).diff(moment(fraDato), 'days') + 1} dager
                </Element>{' '}
                ({formaterDato(tilgjengeligDato)})
            </Normaltekst>
            <Normaltekst>
                Registrert av: {registrertAvNavn} ({registrertAvIdent})
            </Normaltekst>
            <Normaltekst>Registrert: {formaterDato(fraDato)}</Normaltekst>

            <fieldset className="endre-midlertidig-utilgjengelig__fieldset">
                <Element tag="legend" className="endre-midlertidig-utilgjengelig__legend">
                    Endre
                </Element>
                <Radio
                    label="Fjern markeringen som utilgjengelig"
                    name="endreMidlertidigUtilgjengelig"
                    value="fjernMarkering"
                    checked={hvaSkalEndres === 'fjernMarkering'}
                    onChange={onHvaSkalEndresChange}
                    className="endre-midlertidig-utilgjengelig__radio"
                />
                <Radio
                    label="Endre dato"
                    name="endreMidlertidigUtilgjengelig"
                    value="endreDato"
                    checked={hvaSkalEndres === 'endreDato'}
                    onChange={onHvaSkalEndresChange}
                    className="endre-midlertidig-utilgjengelig__radio"
                />
            </fieldset>
            {hvaSkalEndres === 'endreDato' && (
                <MidlertidigUtilgjengeligDatovelger
                    dato={dato}
                    setDato={setDato}
                    className="endre-midlertidig-utilgjengelig__datovelger"
                    feilmelding={feilmelding}
                />
            )}
            <Knapp type="hoved" onClick={onLagre}>
                Lagre
            </Knapp>
            <Knapp
                type="flat"
                className="endre-midlertidig-utilgjengelig__avbryt"
                onClick={onAvbryt}
            >
                Avbryt
            </Knapp>
        </div>
    );
};

export default EndreMidlertidigUtilgjengelig;
