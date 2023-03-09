import React, { FunctionComponent, useState } from 'react';
import { BodyLong, Button, Heading, Loader } from '@navikt/ds-react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { postKandidatTilKandidatliste } from '../../api/api';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import ModalMedKandidatScope from '../../common/modal/ModalMedKandidatScope';
import css from './LagreKandidatIKandidatlisteModal.module.css';

type Props = {
    vis: boolean;
    onClose: () => void;
    onLagre: (kandidatliste: Kandidatliste) => void;
    kandidatnr: string;
    kandidatliste: Nettressurs<Kandidatliste>;
};

const LagreKandidatIKandidatlisteModal: FunctionComponent<Props> = ({
    vis,
    onClose,
    onLagre,
    kandidatnr,
    kandidatliste,
}) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const [lagreKandidatStatus, setLagreKandidatStatus] = useState<Nettstatus>(
        Nettstatus.IkkeLastet
    );

    const handleBekreftClick = (kandidatlisteId: string) => async () => {
        setLagreKandidatStatus(Nettstatus.SenderInn);

        try {
            const oppdatertKandidatliste = await postKandidatTilKandidatliste(
                kandidatlisteId,
                kandidatnr
            );

            console.log('Ja?:', kandidatlisteId, kandidatnr, ':', oppdatertKandidatliste);

            if (oppdatertKandidatliste.kind === Nettstatus.Suksess) {
                oppdaterKandidatlisteMedKandidat(oppdatertKandidatliste.data);
                onLagre(oppdatertKandidatliste.data);
                onClose();
            } else {
                setLagreKandidatStatus(Nettstatus.Feil);
            }
        } catch (e) {
            setLagreKandidatStatus(Nettstatus.Feil);
        }
    };

    const oppdaterKandidatlisteMedKandidat = (kandidatliste: Kandidatliste) => {
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
            {kandidatliste.kind === Nettstatus.LasterInn && <Loader />}
            {kandidatliste.kind === Nettstatus.Suksess && (
                <>
                    <BodyLong className={css.beskrivelse}>
                        Ønsker du å lagre kandidaten i kandidatlisten til stillingen «
                        {kandidatliste.data.tittel}»?
                    </BodyLong>
                    <div className={css.knapper}>
                        <Button onClick={handleBekreftClick(kandidatliste.data.kandidatlisteId)}>
                            Lagre
                        </Button>
                        <Button
                            variant="tertiary"
                            loading={lagreKandidatStatus === Nettstatus.SenderInn}
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
