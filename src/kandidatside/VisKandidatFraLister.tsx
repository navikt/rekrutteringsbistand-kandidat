import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { CvActionType, CvAction } from './cv/reducer/cvReducer';
import { erKobletTilStilling, Kandidatlistestatus } from '../kandidatliste/domene/Kandidatliste';
import { filterTilQueryParams } from '../kandidatliste/filter/filter-utils';
import { erInaktiv, Kandidatstatus } from '../kandidatliste/domene/Kandidat';
import { lenkeTilCv, lenkeTilKandidatliste } from '../app/paths';
import { Nettstatus } from '../api/Nettressurs';
import AppState from '../AppState';
import ForrigeNeste from './header/forrige-neste/ForrigeNeste';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Kandidatheader from './header/Kandidatheader';
import KandidatlisteAction from '../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import StatusOgHendelser from '../kandidatliste/kandidatrad/status-og-hendelser/StatusOgHendelser';
import useSorterteKandidater from '../kandidatliste/hooks/useSorterteKandidater';
import '../common/ikoner.less';
import useFiltrerteKandidater from '../kandidatliste/hooks/useFiltrerteKandidater';

type Props = {
    kandidatnr: string;
    kandidatlisteId: string;
};

const VisKandidatFraLister: FunctionComponent<Props> = (props) => {
    const { kandidatnr, kandidatlisteId, children } = props;

    const dispatch: Dispatch<KandidatlisteAction | CvAction> = useDispatch();

    useEffect(() => {
        window.scrollTo(0, 0);

        const hentCvForKandidat = (arenaKandidatnr: string) => {
            dispatch({ type: CvActionType.FetchCv, arenaKandidatnr });
        };

        const hentKandidatliste = (kandidatlisteId: string) => {
            dispatch({
                type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
                kandidatlisteId,
            });
        };

        const settValgtKandidat = (kandidatlisteId: string, kandidatnr: string) => {
            dispatch({
                type: KandidatlisteActionType.VelgKandidat,
                kandidatlisteId,
                kandidatnr,
            });
        };

        hentCvForKandidat(kandidatnr);
        hentKandidatliste(kandidatlisteId);
        settValgtKandidat(kandidatlisteId, kandidatnr);
    }, [kandidatnr, kandidatlisteId, dispatch]);

    const { hentStatus, cv } = useSelector((state: AppState) => state.cv);
    const { kandidatliste, filter } = useSelector((state: AppState) => state.kandidatliste);

    // TODO: Lag hook useMidlertidigUtilgjengelig(kandidatnr);
    const midlertidigUtilgjengeligForAlle = useSelector(
        (state: AppState) => state.midlertidigUtilgjengelig
    );
    const midlertidigUtilgjengelig = midlertidigUtilgjengeligForAlle[cv.kandidatnummer];

    const onKandidatStatusChange = (status: Kandidatstatus) => {
        dispatch({
            type: KandidatlisteActionType.EndreStatusKandidat,
            status,
            kandidatlisteId,
            kandidatnr,
        });
    };

    const hentGjeldendeKandidat = () => {
        return kandidatliste.kind === Nettstatus.Suksess
            ? kandidatliste.data.kandidater.find((kandidat) => kandidat.kandidatnr === kandidatnr)
            : undefined;
    };

    const hentLenkeTilKandidat = (kandidatnummer: string) =>
        kandidatnummer ? lenkeTilCv(kandidatnummer, kandidatlisteId, undefined, true) : undefined;

    const kandidater =
        kandidatliste.kind === Nettstatus.Suksess ? kandidatliste.data.kandidater : [];
    const filtrerteKandidater = useFiltrerteKandidater(kandidater);
    const aktiveKandidater = filtrerteKandidater.filter((kandidat) => !erInaktiv(kandidat));
    const { sorterteKandidater } = useSorterteKandidater(aktiveKandidater);
    const kandidatnumre = sorterteKandidater.map((kandidat) => kandidat.kandidatnr);

    const gjeldendeKandidatIndex = kandidatnumre.indexOf(kandidatnr);

    if (hentStatus === Nettstatus.LasterInn || gjeldendeKandidatIndex === -1) {
        return (
            <div className="text-center">
                <NavFrontendSpinner type="L" />
            </div>
        );
    }

    // TODO: Her er det en bug – forrige/neste-lenkene bryr seg ikke
    // om sorteringen, altså rekkefølgen på kandidatene. Bryr seg heller ikke om
    // man navigerer til en inaktiv kandidat, siden krasjer bare.
    const nesteKandidatNummer = kandidatnumre[gjeldendeKandidatIndex + 1];
    const forrigeKandidatNummer = kandidatnumre[gjeldendeKandidatIndex - 1];

    const forrigeKandidatLink = hentLenkeTilKandidat(forrigeKandidatNummer);
    const nesteKandidatLink = hentLenkeTilKandidat(nesteKandidatNummer);

    const gjeldendeKandidat = hentGjeldendeKandidat();

    return (
        <div>
            <Kandidatheader
                cv={cv}
                tilbakeLink={lenkeTilKandidatliste(kandidatlisteId, filterTilQueryParams(filter))}
                antallKandidater={kandidatnumre.length}
                gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                nesteKandidat={nesteKandidatLink}
                forrigeKandidat={forrigeKandidatLink}
                fantCv={hentStatus === Nettstatus.Suksess}
            />
            {hentStatus === Nettstatus.FinnesIkke ? (
                <IkkeFunnet />
            ) : (
                <>
                    <Kandidatmeny fødselsnummer={cv.fodselsnummer}>
                        <MidlertidigUtilgjengelig
                            midlertidigUtilgjengelig={midlertidigUtilgjengelig}
                            kandidatnr={cv.kandidatnummer}
                        />
                        {gjeldendeKandidat && (
                            <div className="vis-kandidat__status-select">
                                <label htmlFor="cv-status-og-hendelse">
                                    {kandidatliste.kind === Nettstatus.Suksess &&
                                    erKobletTilStilling(kandidatliste.data)
                                        ? 'Status/hendelse:'
                                        : 'Status:'}
                                </label>
                                <StatusOgHendelser
                                    id="cv-status-og-hendelse"
                                    kanEditere={
                                        kandidatliste.kind === Nettstatus.Suksess &&
                                        kandidatliste.data.kanEditere &&
                                        kandidatliste.data.status === Kandidatlistestatus.Åpen
                                    }
                                    kandidat={gjeldendeKandidat}
                                    kandidatlisteId={kandidatlisteId}
                                    onStatusChange={onKandidatStatusChange}
                                    kandidatlistenErKobletTilStilling={
                                        kandidatliste.kind === Nettstatus.Suksess &&
                                        erKobletTilStilling(kandidatliste.data)
                                    }
                                />
                            </div>
                        )}
                    </Kandidatmeny>
                    {children}
                    <div className="vis-kandidat__forrige-neste-wrapper">
                        <ForrigeNeste
                            lenkeClass="vis-kandidat__forrige-neste-lenke"
                            forrigeKandidat={forrigeKandidatLink}
                            nesteKandidat={nesteKandidatLink}
                            gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                            antallKandidater={kandidatnumre.length}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default VisKandidatFraLister;
