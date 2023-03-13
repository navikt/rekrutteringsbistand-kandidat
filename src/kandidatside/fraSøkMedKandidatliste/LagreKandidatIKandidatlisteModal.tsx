import React, { FunctionComponent, useEffect, useState } from 'react';
import { BodyLong, Button, Heading } from '@navikt/ds-react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { postKandidatTilKandidatliste } from '../../api/api';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import { VarslingAction, VarslingActionType } from '../../common/varsling/varslingReducer';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import css from './LagreKandidatIKandidatlisteModal.module.css';
import Sidelaster from '../../common/sidelaster/Sidelaster';

type Props = {
    vis: boolean;
    onClose: () => void;
    kandidatnr: string;
    kandidatliste: Nettressurs<Kandidatliste>;
};

const LagreKandidatIKandidatlisteModal: FunctionComponent<Props> = ({
    vis,
    onClose,
    kandidatnr,
    kandidatliste,
}) => {
    const dispatch: Dispatch<KandidatlisteAction | VarslingAction> = useDispatch();
    const [lagreKandidatStatus, setLagreKandidatStatus] = useState<Nettstatus>(
        Nettstatus.IkkeLastet
    );

    useEffect(() => {
        setLagreKandidatStatus(Nettstatus.IkkeLastet);
    }, [kandidatnr]);

    const onBekreftClick = (kandidatlisteId: string) => async () => {
        if (lagreKandidatStatus === Nettstatus.SenderInn) {
            return;
        }

        setLagreKandidatStatus(Nettstatus.SenderInn);

        try {
            const oppdatertKandidatliste = await postKandidatTilKandidatliste(
                kandidatlisteId,
                kandidatnr
            );

            if (oppdatertKandidatliste.kind === Nettstatus.Suksess) {
                onSuccess(oppdatertKandidatliste.data);
                onClose();
            } else {
                setLagreKandidatStatus(Nettstatus.Feil);
            }
        } catch (e) {
            setLagreKandidatStatus(Nettstatus.Feil);
        }
    };

    const onSuccess = (kandidatliste: Kandidatliste) => {
        dispatch({
            type: VarslingActionType.VisVarsling,
            alertType: 'suksess',
            innhold: `Kandidaten er lagret i kandidatlisten «${kandidatliste.tittel}»`,
        });

        dispatch({
            type: KandidatlisteActionType.OppdaterKandidatlisteMedKandidat,
            kandidatliste,
            kandidatnr,
        });
    };

    return (
        <ModalMedKandidatScope
            className={css.modal}
            open={vis}
            onClose={onClose}
            closeButton={false}
        >
            <Heading level="1" size="medium">
                Lagre kandidaten i kandidatlisten
            </Heading>
            {kandidatliste.kind === Nettstatus.LasterInn && <Sidelaster />}
            {kandidatliste.kind === Nettstatus.Suksess && (
                <>
                    <BodyLong className={css.beskrivelse}>
                        Ønsker du å lagre kandidaten i kandidatlisten til stillingen «
                        {kandidatliste.data.tittel}»?
                    </BodyLong>
                    <div className={css.knapper}>
                        <Button
                            loading={lagreKandidatStatus === Nettstatus.SenderInn}
                            onClick={onBekreftClick(kandidatliste.data.kandidatlisteId)}
                        >
                            Lagre
                        </Button>
                        <Button
                            variant="tertiary"
                            disabled={lagreKandidatStatus === Nettstatus.SenderInn}
                            onClick={onClose}
                        >
                            Avbryt
                        </Button>
                    </div>
                </>
            )}
            {lagreKandidatStatus === Nettstatus.Feil && (
                <BodyLong>Klarte ikke å lagre kandidat</BodyLong>
            )}
        </ModalMedKandidatScope>
    );
};

export default LagreKandidatIKandidatlisteModal;
