import { Hovedknapp } from 'nav-frontend-knapper';
import React, { FunctionComponent, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { sendEvent } from '../../amplitude/amplitude';
import { Nettstatus } from '../../api/Nettressurs';
import {
    lenkeTilAutomatiskMatching,
    lenkeTilKandidatliste,
    lenkeTilNyttKandidatsøk,
} from '../../app/paths';
import AppState from '../../AppState';
import HjelpetekstFading from '../../common/varsling/HjelpetekstFading';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import LagreKandidaterModal from '../../kandidatsøk/modaler/LagreKandidaterModal';
import LagreKandidaterTilStillingModal from '../../kandidatsøk/modaler/LagreKandidaterTilStillingModal';
import Cv from '../../cv/reducer/cv-typer';
import ForrigeNeste from '../komponenter/header/forrige-neste/ForrigeNeste';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import { Søkekontekst } from '../søkekontekst';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';

type Props = {
    kandidatnr: string;
    kontekst: Søkekontekst;
};

const KandidatsideFraSøkInner: FunctionComponent<Props> = ({ kandidatnr, kontekst, children }) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const leggTilKandidatStatus = useSelector(
        (state: AppState) => state.kandidatliste.lagreKandidatIKandidatlisteStatus
    );
    const cv = useSelector((state: AppState) => state.cv.cv);
    const lenkeTilKandidatsøket = byggLenkeTilbakeTilKandidatsøket(kontekst);

    const [visLeggTilKandidatModal, setVisLeggTilKandidatModal] = useState<boolean>(false);
    const [visKandidatenErLagtTil, setVisKandidatenErLagtTil] = useState<boolean>(false);

    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr, kontekst);

    useEffect(() => {
        if (leggTilKandidatStatus === Nettstatus.Suksess) {
            setVisKandidatenErLagtTil(true);
            setVisLeggTilKandidatModal(false);

            const timeout = setTimeout(() => {
                setVisKandidatenErLagtTil(false);
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [leggTilKandidatStatus]);

    const onLeggTilKandidat = (cv: Cv) => (kandidatliste: Kandidatliste) => {
        sendEvent('cv', 'lagre_kandidat_i_kandidatliste');
        lagreKandidatIKandidatliste(kandidatliste, cv.fodselsnummer, cv.kandidatnummer);
    };

    const lagreKandidatIKandidatliste = (
        kandidatliste: Kandidatliste,
        fnr: string,
        kandidatnr: string
    ) => {
        dispatch({
            type: KandidatlisteActionType.LagreKandidatIKandidatliste,
            kandidatliste,
            fodselsnummer: fnr,
            kandidatnr,
        });
    };

    const kandidatlisteKontekst =
        kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk'
            ? kontekst.kandidatliste
            : undefined;

    return (
        <>
            <Kandidatheader
                cv={cv}
                søkekontekst={kontekst}
                tilbakelenke={lenkeTilKandidatsøket}
                kandidatnavigering={kandidatnavigering}
            />
            <Kandidatmeny cv={cv}>
                <Lagreknapp
                    kandidatnr={kandidatnr}
                    kontekst={kontekst}
                    onClick={() => setVisLeggTilKandidatModal(true)}
                />
            </Kandidatmeny>
            {children}
            {kandidatnavigering && (
                <div className="kandidatside__forrige-neste-wrapper">
                    <ForrigeNeste
                        lenkeClass="kandidatside__forrige-neste-lenke"
                        kandidatnavigering={kandidatnavigering}
                    />
                </div>
            )}
            {kandidatlisteKontekst?.kind === Nettstatus.Suksess && (
                <HjelpetekstFading
                    id="hjelpetekstfading"
                    type="suksess"
                    synlig={visKandidatenErLagtTil}
                    innhold={`${'Kandidaten'} er lagret i kandidatlisten «${
                        kandidatlisteKontekst.data.tittel
                    }»`}
                />
            )}
            {visLeggTilKandidatModal && cv.kind === Nettstatus.Suksess && (
                <>
                    {/* TODO: Erstatt modaler med nye modaler fra kandidatsøket  */}
                    {kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk' ? (
                        <>
                            {kontekst.kandidatliste.kind === Nettstatus.Suksess && (
                                <LagreKandidaterTilStillingModal
                                    antallMarkerteKandidater={1}
                                    vis={visLeggTilKandidatModal}
                                    onRequestClose={() => setVisLeggTilKandidatModal(false)}
                                    onLagre={onLeggTilKandidat(cv.data)}
                                    kandidatliste={kontekst.kandidatliste.data}
                                    isSaving={leggTilKandidatStatus === Nettstatus.SenderInn}
                                />
                            )}
                        </>
                    ) : (
                        <LagreKandidaterModal
                            vis={visLeggTilKandidatModal}
                            onRequestClose={() => setVisLeggTilKandidatModal(false)}
                            onLagre={onLeggTilKandidat(cv.data)}
                        />
                    )}
                </>
            )}
        </>
    );
};

const Lagreknapp = ({
    kontekst,
    kandidatnr,
    onClick,
}: {
    kontekst: Søkekontekst;
    kandidatnr: string;
    onClick: () => void;
}) => {
    if (kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk') {
        if (kontekst.kandidatliste.kind === Nettstatus.Suksess) {
            const kandidatenErAlleredePåLista = kontekst.kandidatliste.data.kandidater.some(
                (kandidat) => kandidat.kandidatnr === kandidatnr
            );

            if (kandidatenErAlleredePåLista) {
                return (
                    <>
                        Kandidaten er lagret i&nbsp;
                        <Link
                            to={lenkeTilKandidatliste(kontekst.kandidatlisteId)}
                            className="lenke"
                        >
                            kandidatlisten
                        </Link>
                    </>
                );
            }
        }
    }

    if (kontekst.kontekst === 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk') {
        return (
            <Hovedknapp className="kandidatside__lagreknapp" onClick={onClick}>
                Lagre kandidat
            </Hovedknapp>
        );
    } else {
        return (
            <Hovedknapp className="kandidatside__lagreknapp" onClick={onClick}>
                Lagre kandidat i kandidatliste
            </Hovedknapp>
        );
    }
};

const byggLenkeTilbakeTilKandidatsøket = (
    kontekst: Søkekontekst
): {
    to: string;
    state?: object;
} => {
    switch (kontekst.kontekst) {
        case 'fraAutomatiskMatching':
            return {
                to: lenkeTilAutomatiskMatching(kontekst.stillingsId),
            };

        case 'fraNyttKandidatsøk':
            return {
                to: lenkeTilNyttKandidatsøk(kontekst.økt?.searchParams),
                state: { scrollTilKandidat: true },
            };

        case 'finnKandidaterTilKandidatlisteFraNyttKandidatsøk':
            return {
                to: lenkeTilNyttKandidatsøk(kontekst.økt?.searchParams),
                state: { scrollTilKandidat: true },
            };
    }
};

export default KandidatsideFraSøkInner;
