import React, { ChangeEvent, FunctionComponent, useState } from 'react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { resendForespørselOmDelingAvCv } from '../../../../api/forespørselOmDelingAvCvApi';
import {
    ForespørselOmDelingAvCv,
    ResendForespørselOutboundDto,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import VelgSvarfrist, {
    lagSvarfristPåSekundet,
    Svarfrist,
} from '../../../knappe-rad/forespørsel-om-deling-av-cv/VelgSvarfrist';
import Hendelse, { Hendelsesstatus } from './Hendelse';

type Props = {
    forespørselOmDelingAvCv: ForespørselOmDelingAvCv;
    onLukk: () => void;
};

const DelStillingMedKandidatPåNytt: FunctionComponent<Props> = ({
    forespørselOmDelingAvCv,
    onLukk,
}) => {
    const [svarfrist, setSvarfrist] = useState<Svarfrist>(Svarfrist.ToDager);
    const [egenvalgtFrist, setEgenvalgtFrist] = useState<string | undefined>();
    const [egenvalgtFristFeilmelding, setEgenvalgtFristFeilmelding] = useState<
        string | undefined
    >();

    const onDelPåNyttClick = async () => {
        if (egenvalgtFristFeilmelding) {
            return;
        }

        const { stillingsId, aktørId } = forespørselOmDelingAvCv;
        const outboundDto: ResendForespørselOutboundDto = {
            stillingsId,
            svarfrist: lagSvarfristPåSekundet(svarfrist, egenvalgtFrist),
        };

        const response = await resendForespørselOmDelingAvCv(aktørId, outboundDto);

        console.log('Resend:', response);
    };

    const onSvarfristChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSvarfrist(event.target.value as Svarfrist);
    };

    const onEgenvalgtFristChange = (dato?: string) => {
        setEgenvalgtFrist(dato);
    };

    const onEgenvalgtFristFeilmeldingChange = (feilmelding?: string) => {
        setEgenvalgtFristFeilmelding(feilmelding);
    };

    return (
        <Hendelse
            renderChildrenBelowContent
            status={Hendelsesstatus.Hvit}
            tittel="Del stillingen med kandidaten på nytt"
            beskrivelse="Fristen er utløpt, og kandidaten har ikke svart. Du bør kontakte kandidaten før du deler på nytt."
        >
            <VelgSvarfrist
                tittel="Ny frist for svar"
                svarfrist={svarfrist}
                egenvalgtFrist={egenvalgtFrist}
                onSvarfristChange={onSvarfristChange}
                onEgenvalgtFristChange={onEgenvalgtFristChange}
                onEgenvalgtFristFeilmeldingChange={onEgenvalgtFristFeilmeldingChange}
            />
            <div className="endre-status-og-hendelser__del-på-nytt-knapper">
                <Hovedknapp
                    className="endre-status-og-hendelser__del-på-nytt-knapp"
                    mini
                    onClick={onDelPåNyttClick}
                >
                    Del på nytt
                </Hovedknapp>
                <Knapp mini onClick={onLukk}>
                    Avbryt
                </Knapp>
            </div>
        </Hendelse>
    );
};

export default DelStillingMedKandidatPåNytt;
