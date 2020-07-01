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
import KandidatlisteActionType from '../kandidatlister/reducer/KandidatlisteActionType';
import Kandidatmeny from './meny/Kandidatmeny';
import MidlertidigUtilgjengelig from './midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import StatusSelect from '../kandidatlister/kandidatliste/kandidatrad/statusSelect/StatusSelect';
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
        if (prevProps.kandidatNr !== this.props.kandidatNr && this.props.kandidatNr !== undefined) {
            window.scrollTo(0, 0);
            this.props.hentCvForKandidat(this.props.kandidatNr);
            this.props.settValgtKandidat(this.props.kandidatlisteId, this.props.kandidatNr);
        }
    }

    hentGjeldendeKandidatIndex = (kandidatnummer) => {
        const gjeldendeIndex = this.props.filtrerteKandidatnumre.indexOf(kandidatnummer);
        return gjeldendeIndex === -1 ? undefined : gjeldendeIndex;
    };

    hentForrigeKandidatNummer = (gjeldendeIndex) => {
        if (gjeldendeIndex === undefined) return undefined;

        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }

        return this.props.filtrerteKandidatnumre[gjeldendeIndex - 1];
    };

    hentNesteKandidatNummer = (gjeldendeIndex) => {
        if (gjeldendeIndex === undefined) return undefined;
        return this.props.filtrerteKandidatnumre[gjeldendeIndex + 1];
    };

    onKandidatStatusChange = (status) => {
        this.props.endreStatusKandidat(
            status,
            this.props.kandidatlisteId,
            this.props.cv.kandidatnummer
        );
    };

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
        } = this.props;
        const gjeldendeKandidatIndex = this.hentGjeldendeKandidatIndex(kandidatNr);
        const nesteKandidatNummer = this.hentNesteKandidatNummer(gjeldendeKandidatIndex);
        const forrigeKandidatNummer = this.hentForrigeKandidatNummer(gjeldendeKandidatIndex);
        const forrigeKandidatLink = this.hentLenkeTilKandidat(forrigeKandidatNummer);
        const nesteKandidatLink = this.hentLenkeTilKandidat(nesteKandidatNummer);

        console.log('filtrerte', this.props.filtrerteKandidatnumre);
        console.log('gjeldendeKandidatIndex', gjeldendeKandidatIndex);
        console.log('nesteKandidatNummer', nesteKandidatNummer);
        console.log('forrigeKandidatNummer', forrigeKandidatNummer);

        const gjeldendeKandidat = this.props.kandidatliste.kandidater.find(
            (kandidat) => kandidat.kandidatnr === kandidatNr
        );

        if (hentStatus === HentCvStatus.Loading) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }

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
        state.kandidatlister.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
    hentStatus: state.cv.hentStatus,
    cv: state.cv.cv,
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
    kandidatlisteFilterQuery: state.kandidatlister.filterQuery,
    filtrerteKandidatnumre: state.kandidatlister.filtrerteKandidatnumre,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
