import { Hovedknapp } from 'nav-frontend-knapper';
import React, { FunctionComponent, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { sendEvent } from '../../amplitude/amplitude';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
import { lenkeTilKandidatliste, lenkeTilKandidatsøk } from '../../app/paths';
import AppState from '../../AppState';
import HjelpetekstFading from '../../common/varsling/HjelpetekstFading';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import LagreKandidaterModal from '../../kandidatsøk/modaler/LagreKandidaterModal';
import LagreKandidaterTilStillingModal from '../../kandidatsøk/modaler/LagreKandidaterTilStillingModal';
import { toUrlQuery } from '../../kandidatsøk/reducer/searchQuery';
import Cv from '../cv/reducer/cv-typer';
import ForrigeNeste from '../header/forrige-neste/ForrigeNeste';
import Kandidatheader from '../header/Kandidatheader';
import Kandidatmeny from '../meny/Kandidatmeny';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';

type Props = {
    kandidatnr: string;
    fraKandidatmatch: boolean;
    kandidatlisteKontekst?: {
        stillingsId?: string;
        kandidatlisteId?: string;
        kandidatliste: Nettressurs<Kandidatliste>;
    };
};

const KandidatsideFraSøkInner: FunctionComponent<Props> = ({
    kandidatnr,
    fraKandidatmatch,
    kandidatlisteKontekst,
    children,
}) => {
    const dispatch: Dispatch<KandidatlisteAction> = useDispatch();
    const leggTilKandidatStatus = useSelector(
        (state: AppState) => state.kandidatliste.lagreKandidatIKandidatlisteStatus
    );
    const cv = useSelector((state: AppState) => state.cv.cv);
    const søkeparametre = useSelector((state: AppState) => toUrlQuery(state));

    const lenkeTilKandidatsøket = lenkeTilKandidatsøk(
        søkeparametre,
        kandidatlisteKontekst?.stillingsId,
        kandidatlisteKontekst?.kandidatlisteId
    );

    const [visLeggTilKandidatModal, setVisLeggTilKandidatModal] = useState<boolean>(false);
    const [visKandidatenErLagtTil, setVisKandidatenErLagtTil] = useState<boolean>(false);

    const { aktivKandidat, lenkeTilForrige, lenkeTilNeste, antallKandidater } =
        useNavigerbareKandidaterFraSøk(
            kandidatnr,
            kandidatlisteKontekst?.kandidatlisteId,
            kandidatlisteKontekst?.stillingsId
        );

    useEffect(() => {
        if (kandidatlisteKontekst && leggTilKandidatStatus === Nettstatus.Suksess) {
            setVisKandidatenErLagtTil(true);
            setVisLeggTilKandidatModal(false);

            const timeout = setTimeout(() => {
                setVisKandidatenErLagtTil(false);
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [kandidatlisteKontekst, leggTilKandidatStatus]);

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

    return (
        <>
            <Kandidatheader
                cv={cv}
                tilbakeLink={lenkeTilKandidatsøket}
                antallKandidater={antallKandidater}
                gjeldendeKandidatIndex={aktivKandidat}
                nesteKandidat={lenkeTilNeste}
                forrigeKandidat={lenkeTilForrige}
                fraKandidatmatch={fraKandidatmatch}
            />
            <Kandidatmeny cv={cv}>
                {kandidatlisteKontekst &&
                kandidatlisteKontekst.kandidatliste.kind === Nettstatus.Suksess &&
                kandidatlisteKontekst.kandidatliste.data.kandidater.some(
                    (kandidat) => kandidat.kandidatnr === kandidatnr
                ) ? (
                    <>
                        Kandidaten er lagret i&nbsp;
                        <Link
                            to={lenkeTilKandidatliste(
                                kandidatlisteKontekst.kandidatliste.data.kandidatlisteId
                            )}
                            className="lenke"
                        >
                            kandidatlisten
                        </Link>
                    </>
                ) : (
                    <Hovedknapp
                        className="kandidatside__lagreknapp"
                        onClick={() => setVisLeggTilKandidatModal(true)}
                    >
                        Lagre kandidat i kandidatliste
                    </Hovedknapp>
                )}
            </Kandidatmeny>
            {children}
            {!fraKandidatmatch && (
                <div className="kandidatside__forrige-neste-wrapper">
                    <ForrigeNeste
                        lenkeClass="kandidatside__forrige-neste-lenke"
                        forrigeKandidat={lenkeTilForrige}
                        nesteKandidat={lenkeTilNeste}
                        antallKandidater={antallKandidater}
                        gjeldendeKandidatIndex={aktivKandidat}
                    />
                </div>
            )}
            {kandidatlisteKontekst?.kandidatliste.kind === Nettstatus.Suksess && (
                <HjelpetekstFading
                    id="hjelpetekstfading"
                    type="suksess"
                    synlig={visKandidatenErLagtTil}
                    innhold={`${'Kandidaten'} er lagret i kandidatlisten «${
                        kandidatlisteKontekst.kandidatliste.data.tittel
                    }»`}
                />
            )}
            {visLeggTilKandidatModal && cv.kind === Nettstatus.Suksess && (
                <>
                    {kandidatlisteKontekst ? (
                        <>
                            {kandidatlisteKontekst.kandidatliste.kind === Nettstatus.Suksess && (
                                <LagreKandidaterTilStillingModal
                                    antallMarkerteKandidater={1}
                                    vis={visLeggTilKandidatModal}
                                    onRequestClose={() => setVisLeggTilKandidatModal(false)}
                                    onLagre={onLeggTilKandidat(cv.data)}
                                    kandidatliste={kandidatlisteKontekst.kandidatliste.data}
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

export default KandidatsideFraSøkInner;
