import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';
import NavFrontendSpinner from 'nav-frontend-spinner';
import cvPropTypes from '../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../felles/result/visKandidat/VisKandidatJobbprofil';
import '../../felles/common/ikoner/ikoner.less';
import VisKandidatForrigeNeste from '../../felles/result/visKandidat/VisKandidatForrigeNeste';
import { HENT_KANDIDATLISTE } from './kandidatlisteReducer';

class VisKandidatFraLister extends React.Component {
    componentDidMount() {
        this.props.hentCvForKandidat(this.props.match.params.kandidatNr, this.props.cv.profilId);
        this.props.hentKandidatliste(this.props.stillingsId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.kandidatNr !== this.props.match.params.kandidatNr && this.props.match.params.kandidatNr !== undefined) {
            this.props.hentCvForKandidat(this.props.match.params.kandidatNr);
        }
    }

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
        const { cv, match, stillingsId, kandidatliste, hentStatus } = this.props;
        const gjeldendeKandidat = this.gjeldendeKandidatIListen(match.params.kandidatNr);
        const forrigeKandidat = this.forrigeKandidatnummerIListen(match.params.kandidatNr);
        const nesteKandidat = this.nesteKandidatnummerIListen(match.params.kandidatNr);
        const forrigeKandidatLink = forrigeKandidat ? `/kandidater/lister/detaljer/${stillingsId}/cv/${forrigeKandidat}` : undefined;
        const nesteKandidatLink = nesteKandidat ? `/kandidater/lister/detaljer/${stillingsId}/cv/${nesteKandidat}` : undefined;

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
                    stillingsId={stillingsId}
                    contextRoot="kandidater/lister"
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
                            <Undertittel className="tekst">
                                Du kan ikke se mer informasjon om kandidaten nå.
                                Årsaken kan være at kandidaten har skiftet status, eller tekniske problemer i søk.
                            </Undertittel>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="VisKandidat-knapperad">
                            <div className="content">
                                <Lenke className="frittstaende-lenke ForlateSiden" href={`https://app.adeo.no/veilarbpersonflatefs/${cv.fodselsnummer}`} target="_blank">
                                    <span className="lenke">Se aktivitetsplan</span>
                                    <i className="ForlateSiden__icon" />
                                </Lenke>
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
        kandidater: []
    }
};

VisKandidatFraLister.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            kandidatNr: PropTypes.string
        })
    }).isRequired,
    cv: cvPropTypes.isRequired,
    hentStatus: PropTypes.string.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    hentKandidatliste: PropTypes.func.isRequired,
    stillingsId: PropTypes.string.isRequired,
    kandidatliste: PropTypes.shape({
        kandidater: PropTypes.arrayOf(
            PropTypes.shape({
                kandidatnr: PropTypes.string
            })
        )
    })
};

const mapStateToProps = (state, props) => ({
    stillingsId: props.match.params.listeid,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
    hentStatus: state.cvReducer.hentStatus,
    cv: state.cvReducer.cv
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId) => dispatch({ type: FETCH_CV, arenaKandidatnr, profilId }),
    hentKandidatliste: (stillingsId) => dispatch({ type: HENT_KANDIDATLISTE, stillingsnummer: stillingsId })
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
