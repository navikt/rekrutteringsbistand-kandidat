import React, { FunctionComponent, useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import classNames from 'classnames';
import './RegistrerMidlertidigUtilgjengelig.less';
import MidlertidigUtilgjengeligDatovelger from '../midlertidig-utilgjengelig-datovelger/MidlertidigUtilgjengeligDatovelger';
import { validerDatoOgReturnerFeilmelding } from '../validering';

interface Props {
    onAvbryt: () => void;
    className?: string;
    registrerMidlertidigUtilgjengelig: (tilOgMedDato: string) => void;
}

const RegistrerMidlertidigUtilgjengelig: FunctionComponent<Props> = (props) => {
    const [dato, setDato] = useState<string | undefined>(undefined);
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);

    const setDatoOgFjernFeilmelding = (dato: string | undefined) => {
        setDato(dato);
        setFeilmelding(undefined);
    };

    const onLagre = () => {
        const valideringsfeil = validerDatoOgReturnerFeilmelding(dato);
        if (valideringsfeil) {
            setFeilmelding(valideringsfeil);
        } else {
            props.registrerMidlertidigUtilgjengelig(dato!);
            setFeilmelding(undefined);
        }
    };

    const onAvbryt = () => {
        setDato(undefined);
        setFeilmelding(undefined);
        props.onAvbryt();
    };

    return (
        <div className={classNames('registrer-midlertidig-utilgjengelig', props.className)}>
            <Undertittel tag="h2">Registrer som midlertidig utilgjengelig</Undertittel>
            <Normaltekst className="registrer-midlertidig-utilgjengelig__forklaring">
                Avklar tilgjengeligheten. Gi beskjed til kandidaten hvis du registrerer «midlertidig
                utilgjengelig».
            </Normaltekst>
            <MidlertidigUtilgjengeligDatovelger
                dato={dato}
                setDato={setDatoOgFjernFeilmelding}
                feilmelding={feilmelding}
            />
            <Knapp
                type="hoved"
                className="registrer-midlertidig-utilgjengelig__lagre"
                onClick={onLagre}
            >
                Lagre
            </Knapp>
            <Knapp
                type="flat"
                className="registrer-midlertidig-utilgjengelig__avbryt"
                onClick={onAvbryt}
            >
                Avbryt
            </Knapp>
        </div>
    );
};

export default RegistrerMidlertidigUtilgjengelig;
