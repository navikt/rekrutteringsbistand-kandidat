import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    Kandidatliste as Kandidatlistetype,
    Kandidatlistefilter,
    Kandidatstatus,
    Kandidatlistestatus,
    erInaktiv,
} from './kandidatlistetyper';
import { queryParamsTilFilter, filterTilQueryParams } from './filter/filter-utils';
import { useHistory, useLocation } from 'react-router-dom';
import Filter from './filter/Filter';
import FinnKandidaterLenke from './meny/FinnKandidaterLenke';
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
import useErAlleMarkerte from './hooks/useErAlleMarkerte';
import useAntallFiltertreff from './hooks/useAntallFiltertreff';
import FormidlingAvUsynligKandidatrad from './formidling-av-usynlig-kandidatrad/FormidlingAvUsynligKandidatrad';
import { sorteringsalgoritmer, KandidatSorteringsfelt } from './kandidatsortering';
import '../common/ikoner.less';
import useMaskerFødselsnumre from '../app/useMaskerFødselsnumre';
import { Retning } from '../common/sorterbarKolonneheader/Retning';
import useHentSendteMeldinger from './hooks/useHentSendteMeldinger';
import { Utfall } from './kandidatrad/status-og-hendelser/etiketter/UtfallEtikett';
import useHentForespørslerOmDelingAvCv from './hooks/useHentForespørslerOmDelingAvCv';
import AppState from '../AppState';
import { Nettstatus } from '../api/Nettressurs';

export enum Visningsstatus {
    SkjulPanel = 'SKJUL_PANEL',
    VisNotater = 'VIS_NOTATER',
    VisMerInfo = 'VIS_MER_INFO',
}

export type Kandidatsortering = null | {
    felt: KandidatSorteringsfelt;
    retning: Retning | null;
};

type Props = {
    kandidatliste: Kandidatlistetype;
    onToggleMarkert: (kandidatnr: string) => void;
    onFjernAllMarkering: () => void;
    onMarkerKandidater: (kandidatnumre: string[]) => void;
    onKandidatStatusChange: any;
    onKandidatShare: any;
    onEmailKandidater: any;
    onKandidaterAngreArkivering: any;
    onSendSmsClick: any;
    onLeggTilKandidat: any;
    onVisningChange: any;
    onToggleArkivert: any;
};

const Kandidatliste: FunctionComponent<Props> = ({
    kandidatliste,
    onFjernAllMarkering,
    onMarkerKandidater,
    onLeggTilKandidat,
    onEmailKandidater,
    onSendSmsClick,
    onKandidatShare,
    onKandidaterAngreArkivering,
    onKandidatStatusChange,
    onToggleMarkert,
    onVisningChange,
    onToggleArkivert,
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { filter, kandidattilstander, sms } = useSelector(
        (state: AppState) => state.kandidatliste
    );
    const { sendteMeldinger } = sms;

    useMaskerFødselsnumre();
    useHentSendteMeldinger(kandidatliste.kandidatlisteId);
    useHentForespørslerOmDelingAvCv(kandidatliste.stillingId);

    const [sortering, setSortering] = useState<Kandidatsortering>(null);

    const antallFiltertreff = useAntallFiltertreff(kandidatliste.kandidater);
    const antallFilterTreffJSON = JSON.stringify(antallFiltertreff);

    useEffect(() => {
        const filter = queryParamsTilFilter(new URLSearchParams(location.search));
        dispatch({
            type: KandidatlisteActionType.EndreKandidatlisteFilter,
            filter,
        });
    }, [dispatch, history, location.search, antallFilterTreffJSON]);

    const filtrerteKandidater = kandidatliste.kandidater.filter(
        (kandidat) => !kandidattilstander[kandidat.kandidatnr].filtrertBort
    );
    const alleFiltrerteErMarkerte = useErAlleMarkerte(filtrerteKandidater);

    const sorterteKandidater =
        sortering === null || sortering.retning === null
            ? filtrerteKandidater
            : filtrerteKandidater.sort(sorteringsalgoritmer[sortering.felt][sortering.retning]);

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

    const onToggleUtfall = (utfall: Utfall) => {
        setFilterIUrl({
            ...filter,
            utfall: {
                ...filter.utfall,
                [utfall]: !filter.utfall[utfall],
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
                            <KnappeRad
                                kandidatliste={kandidatliste}
                                onEmailKandidater={onEmailKandidater}
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
                            utfallsfilter={kandidatliste.stillingId ? filter.utfall : undefined}
                            onToggleArkiverte={toggleVisArkiverteOgFjernMarkering}
                            onToggleStatus={onToggleStatus}
                            onToggleUtfall={onToggleUtfall}
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
                                        erEierAvKandidatlisten={kandidatliste.kanEditere}
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
                                        onVisningChange={onVisningChange}
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
