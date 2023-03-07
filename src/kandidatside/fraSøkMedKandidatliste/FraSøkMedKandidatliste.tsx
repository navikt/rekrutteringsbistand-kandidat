import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { Button } from '@navikt/ds-react';

import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import { lenkeTilNyttKandidatsøk } from '../../app/paths';
import { Nettstatus } from '../../api/Nettressurs';
import { NyttKandidatsøkØkt } from '../søkekontekst';
import { sendEvent } from '../../amplitude/amplitude';
import AppState from '../../AppState';
import Cv from '../../cv/reducer/cv-typer';
import HjelpetekstFading from '../../common/varsling/HjelpetekstFading';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import LagreKandidaterTilStillingModal from '../../kandidatsøk/modaler/LagreKandidaterTilStillingModal';
import useCv from './useCv';
import useKandidatliste from '../fraKandidatliste/useKandidatliste';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../common/useScrollTilToppen';

type Props = {
    kandidatnr: string;
    kandidatlisteId: string;
    søkeøkt: NyttKandidatsøkØkt;
};

const FraSøkMedKandidatliste: FunctionComponent<Props> = ({
    kandidatnr,
    kandidatlisteId,
    søkeøkt,
    children,
}) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();

    useScrollTilToppen(kandidatnr);
    const cv = useCv(kandidatnr);
    const kandidatliste = useKandidatliste(kandidatlisteId);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr, kandidatlisteId, søkeøkt);
    const lagreKandidatStatus = useSelector(
        (state: AppState) => state.kandidatliste.lagreKandidatIKandidatlisteStatus
    );

    const [visLagreKandidatModal, setVisLagreKandidatModal] = useState<boolean>(false);
    const [visKandidatenErLagret, setVisKandidatenErLagret] = useState<boolean>(false);

    useEffect(() => {
        // TODO: Bruk global komponent
        if (lagreKandidatStatus === Nettstatus.Suksess) {
            setVisLagreKandidatModal(false);
            setVisKandidatenErLagret(true);

            const timeout = setTimeout(() => {
                setVisKandidatenErLagret(false);
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [lagreKandidatStatus]);

    const onLagreKandidat = (cv: Cv) => (kandidatliste: Kandidatliste) => {
        sendEvent('cv', 'lagre_kandidat_i_kandidatliste');

        dispatch({
            type: KandidatlisteActionType.LagreKandidatIKandidatliste,
            kandidatliste,
            fodselsnummer: cv.fodselsnummer,
            kandidatnr,
        });
    };

    const lenkeTilFinnKandidater = {
        to: lenkeTilNyttKandidatsøk(søkeøkt?.searchParams),
        state: { scrollTilKandidat: true },
    };

    return (
        <>
            <Kandidatheader
                cv={cv}
                tilbakelenkeTekst="Til finn kandidater"
                tilbakelenke={lenkeTilFinnKandidater}
                kandidatnavigering={kandidatnavigering}
            />
            <Kandidatmeny cv={cv}>
                <Button variant="secondary" onClick={() => setVisLagreKandidatModal(true)}>
                    Lagre kandidat
                </Button>
            </Kandidatmeny>
            {children}

            {kandidatliste?.kind === Nettstatus.Suksess && (
                <HjelpetekstFading
                    id="hjelpetekstfading"
                    type="suksess"
                    synlig={visKandidatenErLagret}
                    innhold={`Kandidaten er lagret i kandidatlisten «${kandidatliste.data.tittel}»`}
                />
            )}

            {visLagreKandidatModal &&
                cv.kind === Nettstatus.Suksess &&
                kandidatliste.kind === Nettstatus.Suksess && (
                    /* TODO: Erstatt modaler med nye modaler fra kandidatsøket  */
                    <LagreKandidaterTilStillingModal
                        vis={visLagreKandidatModal}
                        antallMarkerteKandidater={1}
                        onRequestClose={() => setVisLagreKandidatModal(false)}
                        onLagre={onLagreKandidat(cv.data)}
                        kandidatliste={kandidatliste.data}
                        isSaving={lagreKandidatStatus === Nettstatus.SenderInn}
                    />
                )}
        </>
    );
};

export default FraSøkMedKandidatliste;
