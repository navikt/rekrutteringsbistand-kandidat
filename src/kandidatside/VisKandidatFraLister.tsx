import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { filterTilQueryParams } from '../kandidatliste/filter/filter-utils';
import { CvActionType, CvAction } from './cv/reducer/cvReducer';
import { lenkeTilCv, lenkeTilKandidatliste } from '../app/paths';
import { MidlertidigUtilgjengeligResponse } from './midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { Nettressurs, Nettstatus } from '../api/remoteData';
import {
    erKobletTilStilling,
    Kandidatliste,
    Kandidatlistefilter,
    Kandidatlistestatus,
    Kandidatstatus,
    Kandidattilstander,
} from '../kandidatliste/kandidatlistetyper';
import AppState from '../AppState';
import Cv from './cv/reducer/cv-typer';
import ForrigeNeste from './header/forrige-neste/ForrigeNeste';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Kandidatheader from './header/Kandidatheader';
import KandidatlisteAction from '../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import StatusOgHendelser from '../kandidatliste/kandidatrad/status-og-hendelser/StatusOgHendelser';
import '../common/ikoner.less';

type Props = ConnectedProps & {
    kandidatnr: string;
    children?: ReactNode;
    kandidatlisteId: string;
};

type ConnectedProps = {
    cv: Cv;
    hentStatus: Nettstatus;
    hentCvForKandidat: (kandidatnr: string) => void;
    hentKandidatliste: (kandidatlisteId: string) => void;
    kandidatliste: Nettressurs<Kandidatliste>;
    filtrerteKandidatnumre?: string[];
    settValgtKandidat: (kandidatlisteId: string, kandidatnr: string) => void;
    kandidatlistefilter?: Kandidatlistefilter;
    kandidattilstander: Kandidattilstander;
    midlertidigUtilgjengelig?: Nettressurs<MidlertidigUtilgjengeligResponse>;
    endreStatusKandidat: (
        status: Kandidatstatus,
        kandidatlisteId: string,
        kandidatnr: string
    ) => void;
};

class VisKandidatFraLister extends React.Component<Props> {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.hentCvForKandidat(this.props.kandidatnr);
        this.props.hentKandidatliste(this.props.kandidatlisteId);
        this.props.settValgtKandidat(this.props.kandidatlisteId, this.props.kandidatnr);
    }

    componentDidUpdate(prevProps: Props) {
        const harNavigertTilNyKandidat =
            prevProps.kandidatnr !== this.props.kandidatnr && this.props.kandidatnr !== undefined;

        if (harNavigertTilNyKandidat) {
            window.scrollTo(0, 0);
            this.props.hentCvForKandidat(this.props.kandidatnr);
            this.props.settValgtKandidat(this.props.kandidatlisteId, this.props.kandidatnr);
        }
    }

    onKandidatStatusChange = (status: Kandidatstatus) => {
        this.props.endreStatusKandidat(
            status,
            this.props.kandidatlisteId,
            this.props.cv.kandidatnummer
        );
    };

    hentGjeldendeKandidat = () =>
        this.props.kandidatliste.kind === Nettstatus.Suksess
            ? this.props.kandidatliste.data.kandidater.find(
                  (kandidat) => kandidat.kandidatnr === this.props.kandidatnr
              )
            : undefined;

    hentLenkeTilKandidat = (kandidatnummer: string) =>
        kandidatnummer
            ? lenkeTilCv(kandidatnummer, this.props.kandidatlisteId, undefined, true)
            : undefined;

    render() {
        const {
            cv,
            kandidatnr,
            kandidatlisteId,
            kandidatliste,
            hentStatus,
            midlertidigUtilgjengelig,
            kandidatlistefilter,
            kandidattilstander,
        } = this.props;

        const filtrerteKandidatnumre = (kandidatliste.kind === Nettstatus.Suksess
            ? kandidatliste.data.kandidater
            : []
        )
            .map((kandidat) => kandidat.kandidatnr)
            .filter((kandidatnr) => {
                const tilstand = kandidattilstander[kandidatnr];
                return !tilstand || !tilstand.filtrertBort;
            });

        const gjeldendeKandidatIndex = filtrerteKandidatnumre.indexOf(kandidatnr);
        if (hentStatus === Nettstatus.LasterInn || gjeldendeKandidatIndex === -1) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        const nesteKandidatNummer = filtrerteKandidatnumre[gjeldendeKandidatIndex + 1];
        const forrigeKandidatNummer = filtrerteKandidatnumre[gjeldendeKandidatIndex - 1];

        const forrigeKandidatLink = this.hentLenkeTilKandidat(forrigeKandidatNummer);
        const nesteKandidatLink = this.hentLenkeTilKandidat(nesteKandidatNummer);

        const gjeldendeKandidat = this.hentGjeldendeKandidat();

        return (
            <div>
                <Kandidatheader
                    cv={cv}
                    tilbakeLink={lenkeTilKandidatliste(
                        kandidatlisteId,
                        filterTilQueryParams(kandidatlistefilter)
                    )}
                    antallKandidater={filtrerteKandidatnumre.length}
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
                                        onStatusChange={this.onKandidatStatusChange}
                                        kandidatlistenErKobletTilStilling={
                                            kandidatliste.kind === Nettstatus.Suksess &&
                                            erKobletTilStilling(kandidatliste.data)
                                        }
                                    />
                                </div>
                            )}
                        </Kandidatmeny>
                        {this.props.children}
                        <div className="vis-kandidat__forrige-neste-wrapper">
                            <ForrigeNeste
                                lenkeClass="vis-kandidat__forrige-neste-lenke"
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
                                gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                                antallKandidater={filtrerteKandidatnumre.length}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    kandidatliste: state.kandidatliste.kandidatliste,
    hentStatus: state.cv.hentStatus,
    cv: state.cv.cv,
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
    kandidatlistefilter: state.kandidatliste.filter,
    kandidattilstander: state.kandidatliste.kandidattilstander,
});

const mapDispatchToProps = (dispatch: Dispatch<CvAction | KandidatlisteAction>) => ({
    hentCvForKandidat: (arenaKandidatnr: string) =>
        dispatch({ type: CvActionType.FetchCv, arenaKandidatnr }),
    hentKandidatliste: (kandidatlisteId: string) =>
        dispatch({
            type: KandidatlisteActionType.HentKandidatlisteMedKandidatlisteId,
            kandidatlisteId,
        }),
    settValgtKandidat: (kandidatlisteId: string, kandidatnr: string) =>
        dispatch({
            type: KandidatlisteActionType.VelgKandidat,
            kandidatlisteId,
            kandidatnr,
        }),
    endreStatusKandidat: (status: Kandidatstatus, kandidatlisteId: string, kandidatnr: string) =>
        dispatch({
            type: KandidatlisteActionType.EndreStatusKandidat,
            status,
            kandidatlisteId,
            kandidatnr,
        }),
    settKandidatlistefilter: (filter: Kandidatlistefilter) =>
        dispatch({
            type: KandidatlisteActionType.EndreKandidatlisteFilter,
            filter,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
