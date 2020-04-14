import React, { FunctionComponent, useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper/dist';
import classNames from 'classnames';
import './RegistrerMidlertidigUtilgjengelig.less';
import MidlertidigUtilgjengeligDatovelger from '../midlertidig-utilgjengelig-datovelger/MidlertidigUtilgjengeligDatovelger';

interface Props {
    onAvbryt: () => void;
    className?: string;
}

const RegistrerMidlertidigUtilgjengelig: FunctionComponent<Props> = props => {
    const [dato, setDato] = useState<string | undefined>(undefined);

    const onLagre = () => {
        // TODO Dette må implementeres
        console.log('Lagrer endring av dato til: ' + dato);
    };

    return (
        <div className={classNames('registrer-midlertidig-utilgjengelig', props.className)}>
            <Undertittel tag="h2">Registrer som midlertidig utilgjengelig</Undertittel>
            <Normaltekst>
                Avklar tilgjengeligheten. Gi beskjed til kandidaten hvis du registrerer «midlertidig
                utilgjengelig».
            </Normaltekst>
            <MidlertidigUtilgjengeligDatovelger dato={dato} setDato={setDato} />
            <Knapp type="hoved" onClick={onLagre}>
                Lagre
            </Knapp>
            <Knapp
                type="flat"
                className="registrer-midlertidig-utilgjengelig__avbryt"
                onClick={props.onAvbryt}
            >
                Avbryt
            </Knapp>
        </div>
    );
};

export default RegistrerMidlertidigUtilgjengelig;
