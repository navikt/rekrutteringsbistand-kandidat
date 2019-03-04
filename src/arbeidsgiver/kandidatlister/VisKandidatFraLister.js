import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import cvPropTypes from '../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../sok/cv/cvReducer';
import { getUrlParameterByName } from '../../felles/sok/utils';
import VisKandidatPersonalia from '../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../felles/result/visKandidat/VisKandidatJobbprofil';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import { HENT_KANDIDATLISTE, SLETT_KANDIDATER } from './kandidatlisteReducer';
import { SLETTE_STATUS } from '../../felles/konstanter';
import './VisKandidatFraLister.less';
import '../../felles/common/ikoner/ikoner.less';
import SlettKandidaterModal from '../common/SlettKandidaterModal';
import { CONTEXT_ROOT } from '../common/fasitProperties';
import VisKandidatForrigeNeste from '../../felles/result/visKandidat/VisKandidatForrigeNeste';

class VisKandidatFraLister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sletterKandidat: false,
            visSlettKandidatModal: false,
            visSlettKandidatFeilmelding: false
        };
    }

    componentDidMount() {
        this.props.hentCvForKandidat(this.props.kandidatnummer, this.props.cv.profilId);
        this.props.hentKandidatliste(this.props.kandidatlisteId);
    }

    componentDidUpdate(prevProps) {
        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        if (prevProps.kandidatnummer !== currentUrlKandidatnummer && currentUrlKandidatnummer !== undefined) {
            this.props.hentCvForKandidat(currentUrlKandidatnummer);
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.sletterKandidat) {
            const visSlettKandidatModal = (
                props.sletteStatus !== SLETTE_STATUS.SUCCESS
            );

            const visSlettKandidatFeilmelding = (
                props.sletteStatus === SLETTE_STATUS.FAILURE
            );

            return {
                ...state,
                visSlettKandidatModal,
                visSlettKandidatFeilmelding,
                sletterKandidater: false
            };
        }

        return null;
    }

    visSlettKandidatFeilmelding = () => {
        this.setState({ visSlettKandidatFeilmelding: true });
    };

    slettKandidat = () => {
        const { kandidatlisteId } = this.props;
        const kandidat = [{ kandidatnr: this.props.kandidatnummer }];
        this.props.slettKandidater(kandidatlisteId, kandidat);
        this.setState({ sletterKandidat: true });
    };

    visSlettKandidatModal = () => {
        this.setState({ visSlettKandidatModal: true });
    };

    lukkSlettModal = () => {
        this.setState({
            visSlettKandidatModal: false,
            visSlettKandidatFeilmelding: false,
            sletterKandidat: false
        });
    };

    gjeldendeKandidatIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex((element) => (element.kandidatnr === kandidatnummer));
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    forrigeKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex((element) => (element.kandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex - 1].kandidatnr;
    };

    nesteKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidatliste.kandidater.findIndex((element) => (element.kandidatnr === kandidatnummer));
        if (gjeldendeIndex === (this.props.kandidatliste.kandidater.length - 1)) {
            return undefined;
        }
        return this.props.kandidatliste.kandidater[gjeldendeIndex + 1].kandidatnr;
    };

    render() {
        const { cv, kandidatnummer, kandidatlisteId, kandidatliste, hentStatus } = this.props;
        const gjeldendeKandidat = this.gjeldendeKandidatIListen(kandidatnummer);
        const forrigeKandidat = this.forrigeKandidatnummerIListen(kandidatnummer);
        const nesteKandidat = this.nesteKandidatnummerIListen(kandidatnummer);
        const forrigeKandidatLink = forrigeKandidat ? `/${CONTEXT_ROOT}/lister/detaljer/${kandidatlisteId}/cv?kandidatNr=${forrigeKandidat}` : undefined;
        const nesteKandidatLink = nesteKandidat ? `/${CONTEXT_ROOT}/lister/detaljer/${kandidatlisteId}/cv?kandidatNr=${nesteKandidat}` : undefined;

        const Knapper = () => (
            <div className="viskandidat__knapperad">
                <Lenkeknapp onClick={this.visSlettKandidatModal} className="Delete">
                    <i className="Delete__icon" />
                    Slett
                </Lenkeknapp>
            </div>
        );

        if (this.props.sletteStatus === SLETTE_STATUS.SUCCESS) {
            return <Redirect to={`/kandidater/lister/detaljer/${kandidatlisteId}`} push />;
        }
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
                    kandidatListe={kandidatlisteId}
                    contextRoot={CONTEXT_ROOT}
                    appContext={'arbeidsgiver'}
                    forrigeKandidat={forrigeKandidatLink}
                    nesteKandidat={nesteKandidatLink}
                    gjeldendeKandidat={gjeldendeKandidat}
                    antallKandidater={kandidatliste.antallKandidater}
                    fantCv={hentStatus === HENT_CV_STATUS.SUCCESS}
                />
                {hentStatus === HENT_CV_STATUS.FINNES_IKKE ? (
                    <div className="cvIkkeFunnet">
                        <div className="content">
                            <Element tag="h3" className="blokk-s">Kandidaten kan ikke vises</Element>
                            <div>
                                <Normaltekst>Mulige årsaker:</Normaltekst>
                                <ul>
                                    <li className="blokk-xxs"><Normaltekst>Kandidaten har skiftet status</Normaltekst></li>
                                    <li><Normaltekst>Tekniske problemer</Normaltekst></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="viskandidat-container">
                        <Knapper />
                        <VisKandidatJobbprofil cv={cv} />
                        <VisKandidatCv cv={cv} />
                        <div className="navigering-forrige-neste_wrapper">
                            <VisKandidatForrigeNeste
                                lenkeClass={'header--personalia__lenke--veileder'}
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
                                gjeldendeKandidat={gjeldendeKandidat}
                                antallKandidater={kandidatliste.antallKandidater}
                            />
                        </div>
                    </div>
                )}
                <SlettKandidaterModal
                    isOpen={this.state.visSlettKandidatModal}
                    visFeilmelding={this.state.visSlettKandidatFeilmelding}
                    sletterKandidater={this.props.sletteStatus === SLETTE_STATUS.LOADING}
                    valgteKandidater={[cv]}
                    lukkModal={this.lukkSlettModal}
                    onDeleteClick={this.slettKandidat}
                />
            </div>
        );
    }
}

VisKandidatFraLister.defaultProps = {
    matchforklaring: undefined,
    kandidatliste: {
        antallKandidater: undefined,
        kandidater: []
    }
};

VisKandidatFraLister.propTypes = {
    kandidatnummer: PropTypes.string.isRequired,
    cv: cvPropTypes.isRequired,
    hentStatus: PropTypes.string.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    hentKandidatliste: PropTypes.func.isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    kandidatliste: PropTypes.shape({
        antallKandidater: PropTypes.number,
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                kandidatnr: PropTypes.string
            })
        )
    }),
    slettKandidater: PropTypes.func.isRequired,
    sletteStatus: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => ({
    kandidatnummer: getUrlParameterByName('kandidatNr', window.location.href),
    kandidatlisteId: props.match.params.listeid,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    cv: state.cvReducer.cv,
    hentStatus: state.cvReducer.hentStatus,
    sletteStatus: state.kandidatlister.detaljer.sletteStatus,
    matchforklaring: state.cvReducer.matchforklaring
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId) => dispatch({ type: FETCH_CV, arenaKandidatnr, profilId }),
    hentKandidatliste: (kandidatlisteId) => dispatch({ type: HENT_KANDIDATLISTE, kandidatlisteId }),
    slettKandidater: (kandidatlisteId, kandidater) => dispatch({ type: SLETT_KANDIDATER, kandidatlisteId, kandidater })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
