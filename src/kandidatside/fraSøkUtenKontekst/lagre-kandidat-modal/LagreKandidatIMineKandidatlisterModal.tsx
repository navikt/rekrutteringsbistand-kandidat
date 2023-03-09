import React, { ChangeEvent, Dispatch, FunctionComponent, useEffect, useState } from 'react';
import { Button, Heading } from '@navikt/ds-react';
import { useDispatch } from 'react-redux';

import { postKandidatTilKandidatliste } from '../../../api/api';
import { Nettstatus } from '../../../api/Nettressurs';
import { Kandidatliste } from '../../../kandidatliste/domene/Kandidatliste';
import { VarslingAction, VarslingActionType } from '../../../common/varsling/varslingReducer';
import KandidatlisteAction from '../../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../../kandidatliste/reducer/KandidatlisteActionType';
import SøkPåKandidatliste from './SøkPåKandidatliste';
import VelgKandidatlister from './VelgKandidatlister';
import ModalMedKandidatScope from '../../../common/modal/ModalMedKandidatScope';
import css from './LagreKandidatIMineKandidatlisterModal.module.css';

type Props = {
    vis: boolean;
    onClose: () => void;
    kandidatnr: string;
};

const LagreKandidaterIMineKandidatlisterModal: FunctionComponent<Props> = ({
    vis,
    onClose,
    kandidatnr,
}) => {
    const dispatch: Dispatch<KandidatlisteAction | VarslingAction> = useDispatch();

    const [markerteLister, setMarkerteLister] = useState<Set<string>>(new Set());
    const [lagredeLister, setLagredeLister] = useState<Set<string>>(new Set());
    const [lagreIKandidatlister, setLagreIKandidatlister] = useState<Nettstatus>(
        Nettstatus.IkkeLastet
    );

    useEffect(() => {
        setMarkerteLister(new Set());
        setLagredeLister(new Set());
        setLagreIKandidatlister(Nettstatus.IkkeLastet);
    }, [kandidatnr]);

    const onKandidatlisteMarkert = (event: ChangeEvent<HTMLInputElement>) => {
        const kandidatlisteId = event.target.value;
        const markerte = new Set(markerteLister);

        if (event.target.checked) {
            markerte.add(kandidatlisteId);
        } else {
            markerte.delete(kandidatlisteId);
        }

        setMarkerteLister(markerte);
    };

    const onLagreKandidater = async () => {
        setLagreIKandidatlister(Nettstatus.SenderInn);

        try {
            const markerteKandidatlister = Array.from(markerteLister);

            const responser = await Promise.all(
                markerteKandidatlister.map((kandidatlisteId) =>
                    postKandidatTilKandidatliste(kandidatlisteId, kandidatnr)
                )
            );

            if (responser.every((respons) => respons.kind === Nettstatus.Suksess)) {
                setLagreIKandidatlister(Nettstatus.Suksess);
                setMarkerteLister(new Set());

                responser.forEach((oppdatertKandidatliste) => {
                    if (oppdatertKandidatliste.kind === Nettstatus.Suksess) {
                        onKandidatlisteOppdatert(oppdatertKandidatliste.data, kandidatnr);
                    }
                });

                visMeldingOmLagredeKandidater(markerteKandidatlister.length);
            }

            const oppdaterteLagredeLister = new Set(lagredeLister);
            markerteKandidatlister.forEach((kandidatlisteId) => {
                oppdaterteLagredeLister.add(kandidatlisteId);
            });

            setLagredeLister(oppdaterteLagredeLister);
        } catch (e) {
            setLagreIKandidatlister(Nettstatus.Feil);
        }
    };

    const onKandidatlisteOppdatert = (kandidatliste: Kandidatliste, kandidatnr: string) => {
        dispatch({
            type: KandidatlisteActionType.OppdaterKandidatlisteMedKandidat,
            kandidatliste,
            kandidatnr,
        });
    };

    const visMeldingOmLagredeKandidater = (antallKandidatlister: number) => {
        dispatch({
            type: VarslingActionType.VisVarsling,
            alertType: 'suksess',
            innhold: `Kandidaten er lagret i ${antallKandidatlister} kandidatliste${
                antallKandidatlister > 1 ? 'r' : ''
            }`,
        });
    };

    return (
        <ModalMedKandidatScope className={css.modal} open={vis} onClose={onClose}>
            <Heading size="medium" level="1">
                Lagre kandidat i kandidatlister
            </Heading>
            <VelgKandidatlister
                markerteLister={markerteLister}
                lagredeLister={lagredeLister}
                onKandidatlisteMarkert={onKandidatlisteMarkert}
            />
            <SøkPåKandidatliste
                markerteLister={markerteLister}
                lagredeLister={lagredeLister}
                onKandidatlisteMarkert={onKandidatlisteMarkert}
            />
            <div className={css.knapper}>
                <Button
                    variant="primary"
                    onClick={onLagreKandidater}
                    disabled={markerteLister.size === 0}
                    loading={lagreIKandidatlister === Nettstatus.SenderInn}
                >
                    Lagre
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Avbryt
                </Button>
            </div>
        </ModalMedKandidatScope>
    );
};

export default LagreKandidaterIMineKandidatlisterModal;
