import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import cvPropTypes from '../../felles/PropTypes';
import { HentCvStatus, CvActionType } from '../cv/reducer/cvReducer.ts';
import CvHeader from '../cv/header/CvHeader';
import VisKandidatCv from '../cv/VisKandidatCv';
import VisKandidatJobbprofil from '../cv/VisKandidatJobbprofil';
import '../../felles/common/ikoner/ikoner.less';
import VisKandidatForrigeNeste from '../cv/VisKandidatForrigeNeste';
import KandidatlisteActionType from './reducer/KandidatlisteActionType.ts';
import { Nettstatus } from '../../felles/common/remoteData.ts';
import { LAST_NED_CV_URL } from '../common/fasitProperties';
import StatusSelect from './kandidatliste/kandidatrad/statusSelect/StatusSelect';
import CVMeny from '../cv/cv-meny/CVMeny';
import MidlertidigUtilgjengelig from '../cv/midlertidig-utilgjengelig/MidlertidigUtilgjengelig';
import { logEvent } from '../amplitude/amplitude';
import { KandidatQueryParam } from '../kandidat/Kandidatside';

class VisKandidatFraLister extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.hentCvForKandidat(this.props.kandidatNr);
        this.props.hentKandidatliste(this.props.kandidatlisteId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.kandidatNr !== this.props.kandidatNr && this.props.kandidatNr !== undefined) {
            window.scrollTo(0, 0);
            this.props.hentCvForKandidat(this.props.kandidatNr);
        }
    }

    hentGjeldendeKandidatIndex = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            (element) => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex;
    };

    hentForrigeKandidatNummer = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            (element) => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex - 1].kandidatnr;
    };

    hentNesteKandidatNummer = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            (element) => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === this.props.kandidatliste.kandidater.length - 1) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex + 1].kandidatnr;
    };

    onKandidatStatusChange = (status) => {
        this.props.endreStatusKandidat(
            status,
            this.props.kandidatlisteId,
            this.props.cv.kandidatnummer
        );
    };

    hentLenkeTilKandidat = (kandidatnummer) => {
        const queryParams = `${KandidatQueryParam.KandidatlisteId}=${this.props.kandidatlisteId}&${KandidatQueryParam.FraKandidatliste}=true`;

        return kandidatnummer
            ? `/kandidater/kandidat/${kandidatnummer}/cv?${queryParams}`
            : undefined;
    };

    render() {
        const {
            cv,
            kandidatNr,
            kandidatlisteId,
            kandidatliste,
            hentStatus,
            midlertidigUtilgjengelig,
        } = this.props;

        const gjeldendeKandidatIndex = this.hentGjeldendeKandidatIndex(kandidatNr);
        const nesteKandidatNummer = this.hentNesteKandidatNummer(kandidatNr);
        const forrigeKandidatNummer = this.hentForrigeKandidatNummer(kandidatNr);
        const forrigeKandidatLink = this.hentLenkeTilKandidat(forrigeKandidatNummer);
        const nesteKandidatLink = this.hentLenkeTilKandidat(nesteKandidatNummer);

        const gjeldendeKandidat = kandidatliste.kandidater[gjeldendeKandidatIndex];

        if (hentStatus === HentCvStatus.Loading) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                <CvHeader
                    cv={cv}
                    tilbakeLink={`/kandidater/lister/detaljer/${kandidatlisteId}`}
                    antallKandidater={kandidatliste.kandidater.length}
                    gjeldendeKandidatIndex={gjeldendeKandidatIndex}
                    nesteKandidat={nesteKandidatLink}
                    forrigeKandidat={forrigeKandidatLink}
                    fantCv={hentStatus === HentCvStatus.Success}
                />
                {hentStatus === HentCvStatus.FinnesIkke ? (
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
                            <MidlertidigUtilgjengelig
                                midlertidigUtilgjengelig={midlertidigUtilgjengelig}
                                kandidatnr={cv.kandidatnummer}
                            />
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
                                            className="LastNed lenke"
                                            href={`${LAST_NED_CV_URL}/${cv.aktorId}`}
                                            target="_blank"
                                            onClick={() => logEvent('cv_last_ned', 'klikk')}
                                            rel="noopener noreferrer"
                                        >
                                            <span>Last ned CV</span>
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
    kandidatNr: PropTypes.string,
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

const mapStateToProps = (state) => ({
    kandidatliste:
        state.kandidatlister.detaljer.kandidatliste.kind === Nettstatus.Suksess
            ? state.kandidatlister.detaljer.kandidatliste.data
            : undefined,
    hentStatus: state.cv.hentStatus,
    cv: state.cv.cv,
    midlertidigUtilgjengelig: state.midlertidigUtilgjengelig[state.cv.cv.kandidatnummer],
    visLastNedCvLenke: state.search.featureToggles['vis-last-ned-cv-lenke'],
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId) =>
        dispatch({ type: CvActionType.FETCH_CV, arenaKandidatnr, profilId }),
    hentKandidatliste: (kandidatlisteId) =>
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
