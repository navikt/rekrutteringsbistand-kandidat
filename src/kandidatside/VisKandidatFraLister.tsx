import React from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';

import { HentCvStatus, CvActionType } from './cv/reducer/cvReducer';
import { Nettressurs, Nettstatus } from '../api/remoteData';
import ForrigeNeste from './header/forrige-neste/ForrigeNeste';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Kandidatheader from './header/Kandidatheader';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import StatusSelect from '../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import { lenkeTilCv, lenkeTilKandidatliste } from '../app/paths';
import { filterTilQueryParams } from '../kandidatliste/filter/filter-utils';
import '../common/ikoner.less';
import Cv from './cv/reducer/cv-typer';
import {
    Kandidatliste,
    Kandidatlistefilter,
    Kandidatstatus,
    Kandidattilstander,
} from '../kandidatliste/kandidatlistetyper';
import AppState from '../AppState';
import { MidlertidigUtilgjengeligResponse } from './midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { ReactNode } from 'react';

/*
    kandidatliste: state.kandidatliste.kandidatliste,
    hentStatus: state.cv.hentStatus,
    cv: state.cv.cv,
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
    kandidatlistefilter: state.kandidatliste.filter,
    kandidattilstander: state.kandidatliste.kandidattilstander,
*/
type Props = {
    kandidatNr: string;
    cv: Cv;
    hentStatus: string;
    hentCvForKandidat: (kandidatnr: string) => void;
    hentKandidatliste: (kandidatlisteId: string) => void;
    kandidatlisteId: string;
    kandidatliste: Nettressurs<Kandidatliste>;
    endreStatusKandidat: (
        status: Kandidatstatus,
        kandidatlisteId: string,
        kandidatnr: string
    ) => void;
    filtrerteKandidatnumre?: string[];
    settValgtKandidat: (kandidatlisteId: string, kandidatnr: string) => void;
    kandidatlistefilter?: Kandidatlistefilter;
    kandidattilstander: Kandidattilstander;
    midlertidigUtilgjengelig?: Nettressurs<MidlertidigUtilgjengeligResponse>;
    children?: ReactNode;
};

class VisKandidatFraLister extends React.Component<Props> {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.hentCvForKandidat(this.props.kandidatNr);
        this.props.hentKandidatliste(this.props.kandidatlisteId);
        this.props.settValgtKandidat(this.props.kandidatlisteId, this.props.kandidatNr);
    }

    componentDidUpdate(prevProps: Props) {
        const harNavigertTilNyKandidat =
            prevProps.kandidatNr !== this.props.kandidatNr && this.props.kandidatNr !== undefined;

        if (harNavigertTilNyKandidat) {
            window.scrollTo(0, 0);
            this.props.hentCvForKandidat(this.props.kandidatNr);
            this.props.settValgtKandidat(this.props.kandidatlisteId, this.props.kandidatNr);
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
                  (kandidat) => kandidat.kandidatnr === this.props.kandidatNr
              )
            : undefined;

    hentLenkeTilKandidat = (kandidatnummer: string) =>
        kandidatnummer
            ? lenkeTilCv(kandidatnummer, this.props.kandidatlisteId, undefined, true)
            : undefined;

    render() {
        const {
            cv,
            kandidatNr,
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

        const gjeldendeKandidatIndex = filtrerteKandidatnumre.indexOf(kandidatNr);
        if (hentStatus === HentCvStatus.Loading || gjeldendeKandidatIndex === -1) {
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
                    fantCv={hentStatus === HentCvStatus.Success}
                />
                {hentStatus === HentCvStatus.FinnesIkke ? (
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
                                    <span>Status:</span>
                                    <StatusSelect
                                        kanEditere={
                                            kandidatliste.kind === Nettstatus.Suksess &&
                                            kandidatliste.data.kanEditere
                                        }
                                        value={gjeldendeKandidat.status}
                                        onChange={this.onKandidatStatusChange}
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

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    hentCvForKandidat: (arenaKandidatnr: string, profilId: string) =>
        dispatch({ type: CvActionType.FETCH_CV, arenaKandidatnr, profilId }),
    hentKandidatliste: (kandidatlisteId: string) =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        }),
    settValgtKandidat: (kandidatlisteId: string, kandidatnr: string) =>
        dispatch({
            type: KandidatlisteActionType.VELG_KANDIDAT,
            kandidatlisteId,
            kandidatnr,
        }),
    endreStatusKandidat: (status: Kandidatstatus, kandidatlisteId: string, kandidatnr: string) =>
        dispatch({
            type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT,
            status,
            kandidatlisteId,
            kandidatnr,
        }),
    settKandidatlistefilter: (filter: Kandidatlistefilter) =>
        dispatch({
            type: KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER,
            filter,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
