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
import KandidatlisteActionType from '../../../reducer/KandidatlisteActionType';
import { useDispatch } from 'react-redux';

type Props = {
    forespørselOmDelingAvCv: ForespørselOmDelingAvCv;
    onLukk: () => void;
};

const DelStillingMedKandidatPåNytt: FunctionComponent<Props> = ({
    forespørselOmDelingAvCv,
    onLukk,
}) => {
    const dispatch = useDispatch();

    const [svarfrist, setSvarfrist] = useState<Svarfrist>(Svarfrist.ToDager);
    const [egenvalgtFrist, setEgenvalgtFrist] = useState<string | undefined>();
    const [egenvalgtFristFeilmelding, setEgenvalgtFristFeilmelding] = useState<
        string | undefined
    >();
    const [senderForespørselPåNytt, setSenderForespørselPåNytt] = useState(false)

    const onDelPåNyttClick = async () => {
        if (egenvalgtFristFeilmelding) {
            return;
        }

        const { stillingsId, aktørId } = forespørselOmDelingAvCv;
        const outboundDto: ResendForespørselOutboundDto = {
            stillingsId,
            svarfrist: lagSvarfristPåSekundet(svarfrist, egenvalgtFrist),
        };

        setSenderForespørselPåNytt(true)

        try {
            const response = await resendForespørselOmDelingAvCv(aktørId, outboundDto);

            dispatch({
                type: KandidatlisteActionType.ResendForespørselOmDelingAvCvSuccess,
                forespørslerOmDelingAvCv: response,
            });

            onLukk();
        } catch (e) {
            // TODO: Feilmelding
        } finally {
            setSenderForespørselPåNytt(false)
        }
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
                egenvalgtFristFeilmelding={egenvalgtFristFeilmelding}
            />
            <div className="endre-status-og-hendelser__del-på-nytt-knapper">
                <Hovedknapp
                    className="endre-status-og-hendelser__del-på-nytt-knapp"
                    mini
                    onClick={onDelPåNyttClick}
                    spinner={senderForespørselPåNytt}
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
