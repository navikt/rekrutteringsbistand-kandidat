import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { BodyShort, Button, Tabs } from '@navikt/ds-react';
import { Link } from 'react-router-dom';

import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import {
    lenkeTilAutomatiskMatching,
    lenkeTilKandidatliste,
    lenkeTilNyttKandidatsøk,
} from '../../app/paths';
import { Nettstatus } from '../../api/Nettressurs';
import { NyttKandidatsøkØkt, skrivKandidatnrTilNyttKandidatsøkØkt } from '../søkekontekst';
import { sendEvent } from '../../amplitude/amplitude';
import AppState from '../../AppState';
import Cv from '../../cv/reducer/cv-typer';
import HjelpetekstFading from '../../common/varsling/HjelpetekstFading';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import LagreKandidaterTilStillingModal from '../../kandidatsøk/modaler/LagreKandidaterTilStillingModal';
import useKandidatliste from '../hooks/useKandidatliste';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../common/useScrollTilToppen';
import useCv from '../hooks/useCv';
import useFaner from '../hooks/useFaner';
import { AddPeople } from '@navikt/ds-icons';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
    kandidatlisteId: string;
    søkeøkt: NyttKandidatsøkØkt;
    fraAutomatiskMatching: boolean;
};

const FraSøkMedKandidatliste: FunctionComponent<Props> = ({
    tabs,
    kandidatnr,
    kandidatlisteId,
    søkeøkt,
    fraAutomatiskMatching,
    children,
}) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();

    useScrollTilToppen(kandidatnr);

    const [fane, setFane] = useFaner();
    const cv = useCv(kandidatnr);
    const kandidatliste = useKandidatliste(kandidatlisteId);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(
        kandidatnr,
        kandidatlisteId,
        søkeøkt,
        fraAutomatiskMatching
    );
    const lagreKandidatStatus = useSelector(
        (state: AppState) => state.kandidatliste.lagreKandidatIKandidatlisteStatus
    );

    const [visLagreKandidatModal, setVisLagreKandidatModal] = useState<boolean>(false);
    const [visKandidatenErLagret, setVisKandidatenErLagret] = useState<boolean>(false);

    useEffect(() => {
        skrivKandidatnrTilNyttKandidatsøkØkt(kandidatnr);
    }, [kandidatnr]);

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
        to: fraAutomatiskMatching
            ? lenkeTilAutomatiskMatching(
                  (kandidatliste.kind === Nettstatus.Suksess && kandidatliste.data.stillingId) || ''
              )
            : lenkeTilNyttKandidatsøk(søkeøkt?.searchParams),
        state: { scrollTilKandidat: true },
    };

    const kandidatErAlleredeLagretIListen =
        kandidatliste.kind === Nettstatus.Suksess &&
        kandidatliste.data.kandidater.some((k) => k.kandidatnr === kandidatnr);

    return (
        <>
            <Kandidatheader
                cv={cv}
                tilbakelenkeTekst={fraAutomatiskMatching ? 'Til resultatet' : 'Til finn kandidater'}
                tilbakelenke={lenkeTilFinnKandidater}
                kandidatnavigering={kandidatnavigering}
            />
            <Tabs value={fane} onChange={setFane}>
                <Kandidatmeny tabs={tabs} cv={cv}>
                    {kandidatErAlleredeLagretIListen ? (
                        <BodyShort>
                            <span>Kandidaten er lagret i </span>
                            <Link
                                to={lenkeTilKandidatliste(kandidatlisteId)}
                                className="navds-link"
                            >
                                kandidatlisten
                            </Link>
                        </BodyShort>
                    ) : (
                        <Button
                            size="small"
                            icon={<AddPeople aria-hidden />}
                            onClick={() => setVisLagreKandidatModal(true)}
                        >
                            Lagre kandidat
                        </Button>
                    )}
                </Kandidatmeny>
                <Tabs.Panel value={fane}>{children}</Tabs.Panel>
            </Tabs>

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
