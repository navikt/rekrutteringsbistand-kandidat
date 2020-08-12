import React from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';

import { HentCvStatus, CvActionType } from './cv/reducer/cvReducer';
import { Nettstatus } from '../../felles/common/remoteData.ts';
import cvPropTypes from '../../felles/PropTypes';
import ForrigeNeste from './header/forrige-neste/ForrigeNeste.tsx';
import IkkeFunnet from './ikke-funnet/IkkeFunnet';
import Kandidatheader from './header/Kandidatheader';
import KandidatlisteActionType from '../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import StatusSelect from '../kandidatliste/kandidatrad/statusSelect/StatusSelect';
import '../../felles/common/ikoner/ikoner.less';
import { lenkeTilCv, lenkeTilKandidatliste } from '../application/paths';

class VisKandidatFraLister extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.hentCvForKandidat(this.props.kandidatNr);
        this.props.hentKandidatliste(this.props.kandidatlisteId);
        this.props.settValgtKandidat(this.props.kandidatlisteId, this.props.kandidatNr);
    }

    componentDidUpdate(prevProps) {
        const harNavigertTilNyKandidat =
            prevProps.kandidatNr !== this.props.kandidatNr && this.props.kandidatNr !== undefined;
        const harLastetInnKandidatliste =
            prevProps.kandidatliste !== this.props.kandidatliste &&
            this.props.kandidatliste.kandidater.length > 0;

        if (harNavigertTilNyKandidat) {
            window.scrollTo(0, 0);
            this.props.hentCvForKandidat(this.props.kandidatNr);
            this.props.settValgtKandidat(this.props.kandidatlisteId, this.props.kandidatNr);
        }

        if (harLastetInnKandidatliste) {
            const harIkkeAktivtKandidatlistefilter = this.props.filtrerteKandidatnumre.length === 0;
            if (harIkkeAktivtKandidatlistefilter) {
                this.settFallbackKandidatlistefilter();
            }
        }
    }

    settFallbackKandidatlistefilter = () => {
        const gjeldendeKandidat = this.hentGjeldendeKandidat();

        this.props.settKandidatlistefilter(
            this.props.kandidatliste.kandidater
                .filter((kandidat) => kandidat.arkivert === gjeldendeKandidat.arkivert)
                .map((kandidat) => kandidat.kandidatnr)
        );
    };

    onKandidatStatusChange = (status) => {
        this.props.endreStatusKandidat(
            status,
            this.props.kandidatlisteId,
            this.props.cv.kandidatnummer
        );
    };

    hentGjeldendeKandidat = () =>
        this.props.kandidatliste.kandidater.find(
            (kandidat) => kandidat.kandidatnr === this.props.kandidatNr
        );

    hentLenkeTilKandidat = (kandidatnummer) =>
        kandidatnummer ? lenkeTilCv(kandidatnummer, this.props.kandidatlisteId, true) : undefined;

    render() {
        const {
            cv,
            kandidatNr,
            kandidatlisteId,
            kandidatliste,
            hentStatus,
            midlertidigUtilgjengelig,
            kandidatlisteFilterQuery,
            filtrerteKandidatnumre,
        } = this.props;
        const gjeldendeKandidatIndex = this.props.filtrerteKandidatnumre.indexOf(kandidatNr);

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
                    tilbakeLink={lenkeTilKandidatliste(kandidatlisteId, kandidatlisteFilterQuery)}
                    antallKandidater={this.props.filtrerteKandidatnumre.length}
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
                                        kanEditere={kandidatliste.kanEditere}
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
                                antallKandidater={this.props.filtrerteKandidatnumre.length}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }
}

VisKandidatFraLister.defaultProps = {
    kandidatliste: {
        kandidater: [],
    },
};

VisKandidatFraLister.propTypes = {
    kandidatNr: PropTypes.string,
    cv: cvPropTypes.isRequired,
    hentStatus: PropTypes.string.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    hentKandidatliste: PropTypes.func.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    kandidatliste: PropTypes.shape({
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                kandidatnr: PropTypes.string,
            })
        ),
    }),
    endreStatusKandidat: PropTypes.func.isRequired,
    kandidatlisteFilterQuery: PropTypes.string,
    filtrerteKandidatnumre: PropTypes.arrayOf(PropTypes.string),
    settValgtKandidat: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    kandidatliste:
        state.kandidatliste.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatliste.detaljer.kandidatliste.data
            : undefined,
    hentStatus: state.cv.hentStatus,
    cv: state.cv.cv,
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
    kandidatlisteFilterQuery: state.kandidatliste.filterQuery,
    filtrerteKandidatnumre: state.kandidatliste.filtrerteKandidatnumre,
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId) =>
        dispatch({ type: CvActionType.FETCH_CV, arenaKandidatnr, profilId }),
    hentKandidatliste: (kandidatlisteId) =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        }),
    settValgtKandidat: (kandidatlisteId, kandidatnr) =>
        dispatch({
            type: KandidatlisteActionType.VELG_KANDIDAT,
            kandidatlisteId,
            kandidatnr,
        }),
    endreStatusKandidat: (status, kandidatlisteId, kandidatnr) =>
        dispatch({
            type: KandidatlisteActionType.ENDRE_STATUS_KANDIDAT,
            status,
            kandidatlisteId,
            kandidatnr,
        }),
    settKandidatlistefilter: (filtrerteKandidatnumre) =>
        dispatch({
            type: KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER,
            filtrerteKandidatnumre,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
