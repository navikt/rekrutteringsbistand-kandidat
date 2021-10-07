import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Knapp } from 'nav-frontend-knapper';
import { Radio } from 'nav-frontend-skjema';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import MidlertidigUtilgjengeligDatovelger from '../midlertidig-utilgjengelig-datovelger/MidlertidigUtilgjengeligDatovelger';
import { MidlertidigUtilgjengeligData } from '../midlertidigUtilgjengeligReducer';
import { antallDagerMellom, validerDatoOgReturnerFeilmelding, dagensDato } from '../validering';
import { formaterDato } from '../../../utils/dateUtils';
import './EndreMidlertidigUtilgjengelig.less';

interface Props {
    onAvbryt: () => void;
    className?: string;
    endreMidlertidigUtilgjengelig: (tilOgMedDato: string) => void;
    slettMidlertidigUtilgjengelig: () => void;
    midlertidigUtilgjengelig: MidlertidigUtilgjengeligData;
}

const EndreMidlertidigUtilgjengelig: FunctionComponent<Props> = (props) => {
    const defaultDato = formaterDato(props.midlertidigUtilgjengelig.tilDato);
    const [hvaSkalEndres, setHvaSkalEndres] = useState<string | undefined>(undefined);
    const [dato, setDato] = useState<string | undefined>(defaultDato);
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);

    const setDatoOgFjernFeilmelding = (dato: string | undefined) => {
        setDato(dato);
        setFeilmelding(undefined);
    };

    const onHvaSkalEndresChange = (event: ChangeEvent<HTMLInputElement>) =>
        setHvaSkalEndres(event.target.value);

    const onAvbryt = () => {
        setDato(defaultDato);
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
        sistEndretAvIdent,
        sistEndretAvNavn,
    } = props.midlertidigUtilgjengelig;

    const tilgjengeligDato = moment(tilDato).add(1, 'days');

    const harBlittEndretFør = !!sistEndretAvIdent;
    const registrertAvTekst = harBlittEndretFør
        ? `Sist registrert av: ${sistEndretAvNavn} (${sistEndretAvIdent})`
        : `Registrert av: ${registrertAvNavn} (${registrertAvIdent})`;

    return (
        <div className={classNames('endre-midlertidig-utilgjengelig', props.className)}>
            <Undertittel tag="h2" className="endre-midlertidig-utilgjengelig__tittel">
                Kandidaten er midlertidig utilgjengelig
            </Undertittel>
            <Element className="endre-midlertidig-utilgjengelig__tilgjengelig-om">
                Tilgjengelig om: {antallDagerMellom(dagensDato(), tilgjengeligDato)} dager (
                {formaterDato(tilgjengeligDato.toISOString())})
            </Element>
            <Normaltekst>{registrertAvTekst}</Normaltekst>
            <Normaltekst>Registrert: {formaterDato(fraDato)}</Normaltekst>

            <fieldset className="endre-midlertidig-utilgjengelig__fieldset">
                <Element tag="legend" className="endre-midlertidig-utilgjengelig__legend">
                    Endre
                </Element>
                <Radio
                    label="Endre dato"
                    name="endreMidlertidigUtilgjengelig"
                    value="endreDato"
                    checked={hvaSkalEndres === 'endreDato'}
                    onChange={onHvaSkalEndresChange}
                    className="endre-midlertidig-utilgjengelig__radio"
                />
                {hvaSkalEndres === 'endreDato' && (
                    <MidlertidigUtilgjengeligDatovelger
                        dato={dato}
                        setDato={setDatoOgFjernFeilmelding}
                        className="endre-midlertidig-utilgjengelig__datovelger"
                        feilmelding={feilmelding}
                    />
                )}
                <Radio
                    label="Fjern markeringen som utilgjengelig"
                    name="endreMidlertidigUtilgjengelig"
                    value="fjernMarkering"
                    checked={hvaSkalEndres === 'fjernMarkering'}
                    onChange={onHvaSkalEndresChange}
                    className="endre-midlertidig-utilgjengelig__radio"
                />
            </fieldset>
            <Knapp
                type="hoved"
                className="endre-midlertidig-utilgjengelig__lagre"
                onClick={onLagre}
            >
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
