import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import cvPropTypes from '../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../sok/cv/cvReducer';
import VisKandidatPersonalia from '../cv/VisKandidatPersonalia';
import VisKandidatCv from '../cv/VisKandidatCv';
import VisKandidatJobbprofil from '../cv/VisKandidatJobbprofil';
import '../../felles/common/ikoner/ikoner.less';
import VisKandidatForrigeNeste from '../cv/VisKandidatForrigeNeste';
import KandidatlisteActionType from './reducer/KandidatlisteActionType.ts';
import { RemoteDataTypes } from '../../felles/common/remoteData.ts';
import { LAST_NED_CV_URL } from '../common/fasitProperties';
import StatusSelect from './kandidatliste/kandidatrad/statusSelect/StatusSelect';
import CVMeny from '../cv/cv-meny/CVMeny';
import MidlertidigUtilgjengelig from '../cv/midlertidig-utilgjengelig/MidlertidigUtilgjengelig';

class VisKandidatFraLister extends React.Component {
    componentDidMount() {
        this.props.hentCvForKandidat(this.props.match.params.kandidatNr, this.props.cv.profilId);
        this.props.hentKandidatliste(this.props.kandidatlisteId);
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.match.params.kandidatNr !== this.props.match.params.kandidatNr &&
            this.props.match.params.kandidatNr !== undefined
        ) {
            this.props.hentCvForKandidat(this.props.match.params.kandidatNr);
        }
    }

    hentGjeldendeKandidatIndex = kandidatnummer => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            element => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex;
    };

    hentForrigeKandidatNummer = kandidatnummer => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            element => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex - 1].kandidatnr;
    };

    hentNesteKandidatNummer = kandidatnummer => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            element => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === this.props.kandidatliste.kandidater.length - 1) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex + 1].kandidatnr;
    };

    onKandidatStatusChange = status => {
        this.props.endreStatusKandidat(
            status,
            this.props.kandidatlisteId,
            this.props.cv.kandidatnummer
        );
    };

    hentLenkeTilKandidat = kandidatnummer =>
        kandidatnummer
            ? `/kandidater/lister/detaljer/${this.props.kandidatlisteId}/cv/${kandidatnummer}`
            : undefined;

    render() {
        const { cv, match, kandidatlisteId, kandidatliste, hentStatus } = this.props;

        const gjeldendeKandidatIndex = this.hentGjeldendeKandidatIndex(match.params.kandidatNr);
        const nesteKandidatNummer = this.hentNesteKandidatNummer(match.params.kandidatNr);
        const forrigeKandidatNummer = this.hentForrigeKandidatNummer(match.params.kandidatNr);
        const forrigeKandidatLink = this.hentLenkeTilKandidat(forrigeKandidatNummer);
        const nesteKandidatLink = this.hentLenkeTilKandidat(nesteKandidatNummer);

        const gjeldendeKandidat = kandidatliste.kandidater[gjeldendeKandidatIndex];

        if (hentStatus === HENT_CV_STATUS.LOADING) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                <VisKandidatPersonalia
                    cv={cv}
                    tilbakeLink={`/kandidater/lister/detaljer/${kandidatlisteId}`}
                    appContext="veileder"
                    fantCv={hentStatus === HENT_CV_STATUS.SUCCESS}
                    forrigeKandidat={forrigeKandidatLink}
                    nesteKandidat={nesteKandidatLink}
                    gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                    antallKandidater={kandidatliste.kandidater.length}
                />
                {hentStatus === HENT_CV_STATUS.FINNES_IKKE ? (
                    <div className="cvIkkeFunnet">
                        <div className="content">
                            <Element tag="h2" className="blokk-s">
                                Kandidaten kan ikke vises
                            </Element>
                            <div>
                                <Normaltekst>Mulige årsaker:</Normaltekst>
                                <ul>
                                    <li className="blokk-xxs">
                                        <Normaltekst>Kandidaten har skiftet status</Normaltekst>
                                    </li>
                                    <li>
                                        <Normaltekst>Tekniske problemer</Normaltekst>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <CVMeny fødselsnummer={cv.fodselsnummer}>
                            <MidlertidigUtilgjengelig />
                            {gjeldendeKandidat && (
                                <div className="VisKandidat-knapperad__statusSelect">
                                    <span>Status:</span>
                                    <StatusSelect
                                        kanEditere={kandidatliste.kanEditere}
                                        value={gjeldendeKandidat.status}
                                        onChange={this.onKandidatStatusChange}
                                    />
                                </div>
                            )}
                        </CVMeny>
                        <div className="VisKandidat-knapperad">
                            <div className="content">
                                <div className="lenker">
                                    {this.props.visLastNedCvLenke && (
                                        <a
                                            className="frittstaende-lenke LastNed link"
                                            href={`${LAST_NED_CV_URL}/${cv.aktorId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="link">Last ned CV</span>
                                            <i className="LastNed__icon" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="viskandidat-container">
                            <VisKandidatJobbprofil cv={cv} />
                            <VisKandidatCv cv={cv} />
                            <div className="navigering-forrige-neste_wrapper">
                                <VisKandidatForrigeNeste
                                    lenkeClass={'header--personalia__lenke--veileder'}
                                    contextRoot={'kandidater'}
                                    forrigeKandidat={forrigeKandidatLink}
                                    nesteKandidat={nesteKandidatLink}
                                    gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                                    antallKandidater={kandidatliste.kandidater.length}
                                />
                            </div>
                        </div>
                    </div>
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
    match: PropTypes.shape({
        params: PropTypes.shape({
            kandidatNr: PropTypes.string,
        }),
    }).isRequired,
    cv: cvPropTypes.isRequired,
    hentStatus: PropTypes.string.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    hentKandidatliste: PropTypes.func.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    visLastNedCvLenke: PropTypes.bool.isRequired,
    kandidatliste: PropTypes.shape({
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                kandidatnr: PropTypes.string,
            })
        ),
    }),
    endreStatusKandidat: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    kandidatlisteId: props.match.params.listeid,
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === RemoteDataTypes.SUCCESS
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
    hentStatus: state.cvReducer.hentStatus,
    cv: state.cvReducer.cv,
    visLastNedCvLenke: state.search.featureToggles['vis-last-ned-cv-lenke'],
});

const mapDispatchToProps = dispatch => ({
    hentCvForKandidat: (arenaKandidatnr, profilId) =>
        dispatch({ type: FETCH_CV, arenaKandidatnr, profilId }),
    hentKandidatliste: kandidatlisteId =>
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
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
