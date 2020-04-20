import React, { FunctionComponent, useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper/dist';
import classNames from 'classnames';
import './RegistrerMidlertidigUtilgjengelig.less';
import MidlertidigUtilgjengeligDatovelger from '../midlertidig-utilgjengelig-datovelger/MidlertidigUtilgjengeligDatovelger';
import { RemoteData } from '../../../../felles/common/remoteData';
import { MidlertidigUtilgjengeligResponse } from '../midlertidigUtilgjengeligReducer';

interface Props {
    onAvbryt: () => void;
    className?: string;
    registrerMidlertidigUtilgjengelig: (tilOgMedDato: string) => void;
}

const RegistrerMidlertidigUtilgjengelig: FunctionComponent<Props> = props => {
    const [dato, setDato] = useState<string | undefined>(undefined);
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);

    const onLagre = () => {
        if (dato !== undefined) {
            props.registrerMidlertidigUtilgjengelig(dato);
            setFeilmelding(undefined);
        } else {
            setFeilmelding('Du må fylle inn en dato');
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
                setDato={setDato}
                feilmelding={feilmelding}
            />
            <Knapp type="hoved" onClick={onLagre}>
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
