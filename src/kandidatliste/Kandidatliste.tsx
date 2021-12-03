import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import {
    erEierAvKandidatlisten,
    erKobletTilStilling,
    kandidaterMåGodkjenneDelingAvCv,
    Kandidatliste as Kandidatlistetype,
    Kandidatlistestatus,
    Stillingskategori,
} from './domene/Kandidatliste';
import { Kandidatlistefilter } from './reducer/kandidatlisteReducer';
import { Kandidatstatus, erInaktiv } from './domene/Kandidat';
import { Nettstatus } from '../api/Nettressurs';
import { queryParamsTilFilter, filterTilQueryParams } from './filter/filter-utils';
import AppState from '../AppState';
import Filter from './filter/Filter';
import FinnKandidaterLenke from './meny/FinnKandidaterLenke';
import FormidlingAvUsynligKandidatrad from './formidling-av-usynlig-kandidatrad/FormidlingAvUsynligKandidatrad';
import IngenKandidater from './ingen-kandidater/IngenKandidater';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import Kandidatrad from './kandidatrad/Kandidatrad';
import KnappeRad from './knappe-rad/KnappeRad';
import LeggTilKandidatKnapp from './meny/LeggTilKandidatKnapp';
import ListeHeader from './liste-header/ListeHeader';
import Meny from './meny/Meny';
import Navnefilter from './navnefilter/Navnefilter';
import SideHeader from './side-header/SideHeader';
import SmsFeilAlertStripe from './smsFeilAlertStripe/SmsFeilAlertStripe';
import TomListe from './tom-liste/TomListe';
import useAntallFiltertreff from './hooks/useAntallFiltertreff';
import useErAlleMarkerte from './hooks/useErAlleMarkerte';
import useFiltrerteKandidater from './hooks/useFiltrerteKandidater';
import useHentForespørslerOmDelingAvCv from './hooks/useHentForespørslerOmDelingAvCv';
import useHentSendteMeldinger from './hooks/useHentSendteMeldinger';
import useMaskerFødselsnumre from '../app/useMaskerFødselsnumre';
import useSorterteKandidater from './hooks/useSorterteKandidater';
import { Hendelse } from './kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import FeilVedSendingAvForespørsel from './feil-ved-sending-av-forespørsel/FeilVedSendingAvForespørsel';
import '../common/ikoner.less';

type Props = {
    kandidatliste: Kandidatlistetype;
    onToggleMarkert: (kandidatnr: string) => void;
    onFjernAllMarkering: () => void;
    onMarkerKandidater: (kandidatnumre: string[]) => void;
    onKandidatStatusChange: any;
    onKandidatShare: any;
    onKandidaterAngreArkivering: any;
    onSendSmsClick: any;
    onLeggTilKandidat: any;
    onToggleArkivert: any;
};

const Kandidatliste: FunctionComponent<Props> = ({
    kandidatliste,
    onFjernAllMarkering,
    onMarkerKandidater,
    onLeggTilKandidat,
    onSendSmsClick,
    onKandidatShare,
    onKandidaterAngreArkivering,
    onKandidatStatusChange,
    onToggleMarkert,
    onToggleArkivert,
}) => {
    useMaskerFødselsnumre();
    useHentSendteMeldinger(kandidatliste.kandidatlisteId);
    useHentForespørslerOmDelingAvCv(kandidatliste.stillingId);

    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const { filter, sms, forespørslerOmDelingAvCv } = useSelector(
        (state: AppState) => state.kandidatliste
    );
    const { sendteMeldinger } = sms;

    const filtrerteKandidater = useFiltrerteKandidater(kandidatliste.kandidater);
    const alleFiltrerteErMarkerte = useErAlleMarkerte(filtrerteKandidater);
    const { sorterteKandidater, sortering, setSortering } = useSorterteKandidater(
        filtrerteKandidater,
        forespørslerOmDelingAvCv
    );

    const antallFiltertreff = useAntallFiltertreff(
        kandidatliste.kandidater,
        forespørslerOmDelingAvCv,
        filter
    );
    const antallFilterTreffJSON = JSON.stringify(antallFiltertreff);

    useEffect(() => {
        const oppdatertFilter = queryParamsTilFilter(new URLSearchParams(location.search));
        dispatch({
            type: KandidatlisteActionType.EndreKandidatlisteFilter,
            filter: oppdatertFilter,
        });
    }, [dispatch, history, location.search, antallFilterTreffJSON]);

    const setFilterIUrl = (filter: Kandidatlistefilter) => {
        const query = filterTilQueryParams(filter).toString();
        history.replace({
            pathname: history.location.pathname,
            search: query,
        });
    };

    const toggleVisArkiverteOgFjernMarkering = () => {
        setFilterIUrl({
            ...filter,
            visArkiverte: !filter.visArkiverte,
        });

        onFjernAllMarkering();
    };

    const onToggleStatus = (status: Kandidatstatus) => {
        setFilterIUrl({
            ...filter,
            status: {
                ...filter.status,
                [status]: !filter.status[status],
            },
        });
    };

    const onToggleHendelse = (hendelse: Hendelse) => {
        setFilterIUrl({
            ...filter,
            hendelse: {
                ...filter.hendelse,
                [hendelse]: !filter.hendelse[hendelse],
            },
        });
    };

    const setNavnefilter = (navn: string) => {
        dispatch({
            type: KandidatlisteActionType.EndreKandidatlisteFilter,
            filter: {
                ...filter,
                navn,
            },
        });
    };

    const onCheckAlleKandidater = () => {
        if (alleFiltrerteErMarkerte) {
            onFjernAllMarkering();
        } else {
            onMarkerKandidater(
                filtrerteKandidater
                    .filter((kandidat) => !erInaktiv(kandidat) || kandidat.arkivert)
                    .map((k) => k.kandidatnr)
            );
        }
    };

    const listenInneholderKandidater =
        kandidatliste.kandidater.length > 0 ||
        kandidatliste.formidlingerAvUsynligKandidat.length > 0;

    const kandidatlistenErÅpen = kandidatliste.status === Kandidatlistestatus.Åpen;
    const kanArkivereKandidater = !filter.visArkiverte && kandidatlistenErÅpen;

    return (
        <div className="kandidatliste">
            <SideHeader kandidatliste={kandidatliste} />
            {listenInneholderKandidater ? (
                <>
                    {kandidatlistenErÅpen && (
                        <Meny
                            kandidatlisteId={kandidatliste.kandidatlisteId}
                            stillingId={kandidatliste.stillingId}
                            onLeggTilKandidat={onLeggTilKandidat}
                        />
                    )}
                    <div className="kandidatliste__grid">
                        <div className="kandidatliste__knapperad-container">
                            {kandidatliste.kanEditere &&
                                sendteMeldinger.kind === Nettstatus.Suksess && (
                                    <SmsFeilAlertStripe
                                        kandidater={kandidatliste.kandidater}
                                        sendteMeldinger={sendteMeldinger.data}
                                    />
                                )}
                            {erKobletTilStilling(kandidatliste) &&
                                forespørslerOmDelingAvCv.kind === Nettstatus.Suksess && (
                                    <FeilVedSendingAvForespørsel
                                        forespørslerOmDelingAvCv={forespørslerOmDelingAvCv.data}
                                        kandidatliste={kandidatliste}
                                    />
                                )}
                            <KnappeRad
                                kandidatliste={kandidatliste}
                                onSendSmsClick={onSendSmsClick}
                                onKandidatShare={onKandidatShare}
                                onKandidaterAngreArkivering={onKandidaterAngreArkivering}
                                onLeggTilKandidat={onLeggTilKandidat}
                                visArkiverte={filter.visArkiverte}
                                sendteMeldinger={sendteMeldinger}
                            >
                                <Navnefilter
                                    value={filter.navn}
                                    onChange={(e) => setNavnefilter(e.currentTarget.value)}
                                    onReset={() => setNavnefilter('')}
                                />
                            </KnappeRad>
                        </div>
                        <Filter
                            antallTreff={antallFiltertreff}
                            visArkiverte={filter.visArkiverte}
                            statusfilter={filter.status}
                            hendelsefilter={
                                kandidaterMåGodkjenneDelingAvCv(kandidatliste) ||
                                kandidatliste.stillingskategori === Stillingskategori.Formidling
                                    ? filter.hendelse
                                    : undefined
                            }
                            onToggleArkiverte={toggleVisArkiverteOgFjernMarkering}
                            onToggleStatus={onToggleStatus}
                            onToggleHendelse={onToggleHendelse}
                        />
                        <div role="table" aria-label="Kandidater" className="kandidatliste__liste">
                            <ListeHeader
                                kandidatliste={kandidatliste}
                                alleMarkert={alleFiltrerteErMarkerte}
                                onCheckAlleKandidater={onCheckAlleKandidater}
                                visArkiveringskolonne={kanArkivereKandidater}
                                sortering={sortering}
                                setSortering={setSortering}
                            />
                            {kandidatliste.formidlingerAvUsynligKandidat.map(
                                (formidlingAvUsynligKandidat) => (
                                    <FormidlingAvUsynligKandidatrad
                                        kandidatlisteId={kandidatliste.kandidatlisteId}
                                        kandidatlistenErLukket={!kandidatlistenErÅpen}
                                        key={formidlingAvUsynligKandidat.lagtTilTidspunkt}
                                        formidling={formidlingAvUsynligKandidat}
                                        erEierAvKandidatlisten={erEierAvKandidatlisten(
                                            kandidatliste
                                        )}
                                    />
                                )
                            )}
                            {sorterteKandidater.length > 0 ? (
                                sorterteKandidater.map((kandidat) => (
                                    <Kandidatrad
                                        key={kandidat.kandidatnr}
                                        kandidat={kandidat}
                                        kandidatliste={kandidatliste}
                                        onKandidatStatusChange={onKandidatStatusChange}
                                        onToggleKandidat={onToggleMarkert}
                                        toggleArkivert={onToggleArkivert}
                                        visArkiveringskolonne={kanArkivereKandidater}
                                    />
                                ))
                            ) : (
                                <IngenKandidater>
                                    {filter.visArkiverte
                                        ? 'Det er ingen vanlige kandidater som passer med valgte kriterier'
                                        : 'Du har ingen vanlige kandidater i kandidatlisten'}
                                </IngenKandidater>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <TomListe kandidatlistenErLukket={!kandidatlistenErÅpen}>
                    {kandidatlistenErÅpen && (
                        <>
                            <FinnKandidaterLenke
                                kandidatlisteId={kandidatliste.kandidatlisteId}
                                stillingId={kandidatliste.stillingId}
                            />
                            <LeggTilKandidatKnapp onLeggTilKandidat={onLeggTilKandidat} />
                        </>
                    )}
                </TomListe>
            )}
        </div>
    );
};

export default Kandidatliste;
