import { Hovedknapp } from 'nav-frontend-knapper';
import React, { FunctionComponent, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import { sendEvent } from '../../amplitude/amplitude';
import { Nettressurs, Nettstatus } from '../../api/Nettressurs';
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
import Cv from '../cv/reducer/cv-typer';
import ForrigeNeste from '../header/forrige-neste/ForrigeNeste';
import Kandidatheader from '../header/Kandidatheader';
import Kandidatmeny from '../meny/Kandidatmeny';
import { Søkekontekst } from '../søkekontekst';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';

type Props = {
    kandidatnr: string;
    kontekst: Søkekontekst;
    kandidatliste: Nettressurs<Kandidatliste>;
};

const KandidatsideFraSøkInner: FunctionComponent<Props> = ({
    kandidatnr,
    kandidatliste,
    kontekst,
    children,
}) => {
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

    return (
        <>
            <Kandidatheader
                cv={cv}
                tilbakelenke={lenkeTilKandidatsøket}
                kandidatnavigering={kandidatnavigering}
            />
            <Kandidatmeny cv={cv}>
                {kandidatliste.kind === Nettstatus.Suksess &&
                kandidatliste.data.kandidater.some(
                    (kandidat) => kandidat.kandidatnr === kandidatnr
                ) ? (
                    <>
                        Kandidaten er lagret i&nbsp;
                        <Link
                            to={lenkeTilKandidatliste(kandidatliste.data.kandidatlisteId)}
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
            {kandidatnavigering && (
                <div className="kandidatside__forrige-neste-wrapper">
                    <ForrigeNeste
                        lenkeClass="kandidatside__forrige-neste-lenke"
                        kandidatnavigering={kandidatnavigering}
                    />
                </div>
            )}
            {kandidatliste.kind === Nettstatus.Suksess && (
                <HjelpetekstFading
                    id="hjelpetekstfading"
                    type="suksess"
                    synlig={visKandidatenErLagtTil}
                    innhold={`${'Kandidaten'} er lagret i kandidatlisten «${
                        kandidatliste.data.tittel
                    }»`}
                />
            )}
            {visLeggTilKandidatModal && cv.kind === Nettstatus.Suksess && (
                <>
                    {kandidatliste.kind !== Nettstatus.IkkeLastet ? (
                        <>
                            {kandidatliste.kind === Nettstatus.Suksess && (
                                <LagreKandidaterTilStillingModal
                                    antallMarkerteKandidater={1}
                                    vis={visLeggTilKandidatModal}
                                    onRequestClose={() => setVisLeggTilKandidatModal(false)}
                                    onLagre={onLeggTilKandidat(cv.data)}
                                    kandidatliste={kandidatliste.data}
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
