import { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

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
import AppState from '../state/AppState';
import Filter from './filter/Filter';
import FormidlingAvUsynligKandidatrad from './formidling-av-usynlig-kandidatrad/FormidlingAvUsynligKandidatrad';
import IngenKandidater from './ingen-kandidater/IngenKandidater';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import Kandidatrad from './kandidatrad/Kandidatrad';
import KnappeRad from './knappe-rad/KnappeRad';
import ListeHeader from './liste-header/ListeHeader';
import Meny from './meny/Meny';
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
import { Search } from '@navikt/ds-react';
import css from './Kandidatliste.module.css';

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
    const navigate = useNavigate();
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
    }, [dispatch, location.search, antallFilterTreffJSON]);

    const setFilterIUrl = (filter: Kandidatlistefilter) => {
        const query = filterTilQueryParams(filter).toString();
        navigate(
            {
                search: query,
            },
            {
                replace: true,
            }
        );
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
        <>
            <SideHeader kandidatliste={kandidatliste} />
            {listenInneholderKandidater ? (
                <>
                    {kandidatlistenErÅpen && (
                        <Meny
                            border
                            kandidatlisteId={kandidatliste.kandidatlisteId}
                            stillingId={kandidatliste.stillingId}
                            onLeggTilKandidat={onLeggTilKandidat}
                        />
                    )}
                    <div className={css.grid}>
                        <div className={css.knapperad}>
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
                                <Search
                                    label="Søk alle NAV sine sider"
                                    variant="simple"
                                    onChange={(e) => setNavnefilter(e)}
                                    title="Søk etter navn i listen"
                                />
                            </KnappeRad>
                        </div>
                        <Filter
                            className={css.filter}
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
                        <div role="table" aria-label="Kandidater" className={css.liste}>
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
                        <Meny
                            kandidatlisteId={kandidatliste.kandidatlisteId}
                            stillingId={kandidatliste.stillingId}
                            onLeggTilKandidat={onLeggTilKandidat}
                        />
                    )}
                </TomListe>
            )}
        </>
    );
};

export default Kandidatliste;
