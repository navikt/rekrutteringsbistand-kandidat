import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import cvPropTypes from '../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../felles/result/visKandidat/VisKandidatJobbprofil';
import '../../felles/common/ikoner/ikoner.less';
import VisKandidatForrigeNeste from '../../felles/result/visKandidat/VisKandidatForrigeNeste';
import { KandidatlisteTypes } from './kandidatlisteReducer.ts';
import { RemoteDataTypes } from '../../felles/common/remoteData.ts';
import { LAST_NED_CV_URL } from '../common/fasitProperties';
import StatusSelect from './statusSelect/StatusSelect';

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

    gjeldendeKandidatIListen = kandidatnummer => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            element => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    forrigeKandidatnummerIListen = kandidatnummer => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            element => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex - 1].kandidatnr;
    };

    nesteKandidatnummerIListen = kandidatnummer => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex(
            element => element.kandidatnr === kandidatnummer
        );
        if (gjeldendeIndex === this.props.kandidatliste.kandidater.length - 1) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex + 1].kandidatnr;
    };

    render() {
        const { cv, match, kandidatlisteId, kandidatliste, hentStatus } = this.props;
        const gjeldendeKandidat = this.gjeldendeKandidatIListen(match.params.kandidatNr);
        const forrigeKandidat = this.forrigeKandidatnummerIListen(match.params.kandidatNr);
        const nesteKandidat = this.nesteKandidatnummerIListen(match.params.kandidatNr);
        const forrigeKandidatLink = forrigeKandidat
            ? `/kandidater/lister/detaljer/${kandidatlisteId}/cv/${forrigeKandidat}`
            : undefined;
        const nesteKandidatLink = nesteKandidat
            ? `/kandidater/lister/detaljer/${kandidatlisteId}/cv/${nesteKandidat}`
            : undefined;

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
                    gjeldendeKandidat={gjeldendeKandidat}
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
                        <div className="VisKandidat-knapperad">
                            <div className="content">
                                <div className="lenker">
                                    <a
                                        className="frittstaende-lenke ForlateSiden link"
                                        href={`https://app.adeo.no/veilarbpersonflatefs/${cv.fodselsnummer}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="link">Se aktivitetsplan</span>
                                        <i className="ForlateSiden__icon" />
                                    </a>
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
                                {gjeldendeKandidat && (
                                    <StatusSelect
                                        kanEditere={kandidatliste.kanEditere}
                                        value={kandidatliste.kandidater[gjeldendeKandidat].status}
                                        onChange={status => {
                                            console.log('Status endret til:', status);
                                        }}
                                    />
                                )}
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
                                    gjeldendeKandidat={gjeldendeKandidat}
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
            type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
