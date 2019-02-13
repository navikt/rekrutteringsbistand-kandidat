/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Lenke from 'nav-frontend-lenker';
import { Undertittel } from 'nav-frontend-typografi';
import cvPropTypes from '../../../felles/PropTypes';
import { FETCH_CV, HENT_CV_STATUS } from '../../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../../felles/result/visKandidat/VisKandidatJobbprofil';
import { getUrlParameterByName } from '../../../felles/sok/utils';
import { SETT_KANDIDATNUMMER, LAST_FLERE_KANDIDATER } from '../../sok/searchReducer';
import './VisKandidat.less';
import VisKandidatForrigeNeste from '../../../felles/result/visKandidat/VisKandidatForrigeNeste';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kandidatIndex: this.returnerKandidatIndex(getUrlParameterByName('kandidatNr', window.location.href)),
            forrigeKandidat: this.returnerForrigeKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href)),
            nesteKandidat: this.returnerNesteKandidatnummerIListen(getUrlParameterByName('kandidatNr', window.location.href))
        };

        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
    }

    componentDidMount() {
        this.props.hentCvForKandidat(this.kandidatnummer);
        this.props.settValgtKandidat(this.kandidatnummer);

        if (this.state.kandidatIndex === this.props.kandidater.length) {
            this.props.lastFlereKandidater();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.kandidater.length < this.props.kandidater.length) {
            this.setState({ nesteKandidat: this.returnerNesteKandidatnummerIListen(this.kandidatnummer) });
        }

        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        if (this.kandidatnummer !== currentUrlKandidatnummer && currentUrlKandidatnummer !== undefined) {
            this.kandidatnummer = currentUrlKandidatnummer;
            this.props.settValgtKandidat(this.kandidatnummer);
            this.props.hentCvForKandidat(this.kandidatnummer);
            this.setState({ kandidatIndex: this.returnerKandidatIndex(this.kandidatnummer) });
        }

        if (this.state.kandidatIndex !== prevState.kandidatIndex) {
            this.setState({ forrigeKandidat: this.returnerForrigeKandidatnummerIListen(this.kandidatnummer) });
            if (this.state.kandidatIndex === this.props.kandidater.length && this.props.kandidater.length < this.props.antallKandidater) {
                this.props.lastFlereKandidater();
            } else {
                this.setState({ nesteKandidat: this.returnerNesteKandidatnummerIListen(this.kandidatnummer) });
            }
        }
    }

    returnerKandidatIndex = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === -1) {
            return undefined;
        }
        return gjeldendeIndex + 1;
    };

    returnerForrigeKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    returnerNesteKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === (this.props.kandidater.length - 1)) {
            return undefined;
        }
        return this.props.kandidater[gjeldendeIndex + 1].arenaKandidatnr;
    };

    render() {
        const { cv, match, hentStatus, antallKandidater } = this.props;
        const stillingsId = match.params.stillingsId;
        let forrigeKandidatLink;
        let nesteKandidatLink;

        if (stillingsId) {
            forrigeKandidatLink = this.state.forrigeKandidat ? `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${this.state.forrigeKandidat}` : undefined;
            nesteKandidatLink = this.state.nesteKandidat ? `/kandidater/stilling/${stillingsId}/cv?kandidatNr=${this.state.nesteKandidat}` : undefined;
        } else {
            forrigeKandidatLink = this.state.forrigeKandidat ? `/kandidater/cv?kandidatNr=${this.state.forrigeKandidat}` : undefined;
            nesteKandidatLink = this.state.nesteKandidat ? `/kandidater/cv?kandidatNr=${this.state.nesteKandidat}` : undefined;
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
                    appContext={'veileder'}
                    contextRoot={'kandidater'}
                    stillingsId={stillingsId}
                    kandidatIndex={this.state.kandidatIndex}
                    forrigeKandidat={forrigeKandidatLink}
                    nesteKandidat={nesteKandidatLink}
                    antallKandidater={antallKandidater}
                    fantCv={hentStatus === HENT_CV_STATUS.SUCCESS}
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
                        <VisKandidatJobbprofil cv={cv} />
                        <VisKandidatCv cv={cv} />
                        <div className="navigering-forrige-neste_wrapper">
                            <VisKandidatForrigeNeste
                                lenkeClass={'header--personalia__lenke--veileder'}
                                forrigeKandidat={forrigeKandidatLink}
                                nesteKandidat={nesteKandidatLink}
                                kandidatIndex={this.state.kandidatIndex}
                                antallKandidater={antallKandidater}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    match: {
        params: {
            stillingsId: undefined
        }
    },
    antallKandidater: undefined
};

VisKandidat.propTypes = {
    cv: cvPropTypes.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    antallKandidater: PropTypes.number,
    lastFlereKandidater: PropTypes.func.isRequired,
    settValgtKandidat: PropTypes.func.isRequired,
    hentStatus: PropTypes.string.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            stillingsId: PropTypes.string
        })
    })
};

const mapStateToProps = (state) => ({
    cv: state.cvReducer.cv,
    kandidater: state.search.searchResultat.resultat.kandidater,
    antallKandidater: state.search.searchResultat.resultat.totaltAntallTreff,
    hentStatus: state.cvReducer.hentStatus
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr }),
    lastFlereKandidater: () => dispatch({ type: LAST_FLERE_KANDIDATER }),
    settValgtKandidat: (kandidatnummer) => dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer })
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
