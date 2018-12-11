import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Lenke from 'nav-frontend-lenker';
import cvPropTypes from '../../../felles/PropTypes';
import { FETCH_CV } from '../../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../../felles/result/visKandidat/VisKandidatJobbprofil';
import { getUrlParameterByName } from '../../../felles/sok/utils';
import { SETT_KANDIDATNUMMER } from '../../sok/searchReducer';
import './VisKandidat.less';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.kandidater = this.props.kandidater;
    }
    componentDidMount() {
        this.props.hentCvForKandidat(this.kandidatnummer);
        this.props.settValgtKandidat(this.kandidatnummer);
    }

    componentDidUpdate() {
        const currentUrlKandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        if (this.kandidatnummer !== currentUrlKandidatnummer && currentUrlKandidatnummer !== undefined) {
            this.kandidatnummer = currentUrlKandidatnummer;
            this.props.settValgtKandidat(this.kandidatnummer);
            this.props.hentCvForKandidat(this.kandidatnummer);
        }
    }

    returnerForrigeKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === 0 || gjeldendeIndex === -1) {
            return undefined;
        }
        return this.kandidater[gjeldendeIndex - 1].arenaKandidatnr;
    };

    returnerNesteKandidatnummerIListen = (kandidatnummer) => {
        const gjeldendeIndex = this.props.kandidater.findIndex((element) => (element.arenaKandidatnr === kandidatnummer));
        if (gjeldendeIndex === (this.props.kandidater.length - 1)) {
            return undefined;
        }
        return this.kandidater[gjeldendeIndex + 1].arenaKandidatnr;
    };

    render() {
        const { cv, isFetchingCv, match } = this.props;
        const stillingsId = match.params.stillingsId;

        if (isFetchingCv) {
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
                    forrigeKandidat={this.returnerForrigeKandidatnummerIListen(this.kandidatnummer)}
                    nesteKandidat={this.returnerNesteKandidatnummerIListen(this.kandidatnummer)}
                />
                <div className="VisKandidat-knapperad">
                    <div className="content">
                        <Lenke className="frittstaende-lenke" href={`https://app.adeo.no/veilarbpersonflatefs/${cv.fodselsnummer}`}>
                            Se aktivitetsplan
                        </Lenke>
                    </div>
                </div>
                <VisKandidatJobbprofil cv={cv} />
                <VisKandidatCv cv={cv} />
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    match: {
        params: {
            stillingsId: undefined
        }
    }
};

VisKandidat.propTypes = {
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    kandidater: PropTypes.arrayOf(cvPropTypes).isRequired,
    settValgtKandidat: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            stillingsId: PropTypes.string
        })
    })
};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    kandidater: state.search.searchResultat.resultat.kandidater
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr }),
    settValgtKandidat: (kandidatnummer) => dispatch({ type: SETT_KANDIDATNUMMER, kandidatnr: kandidatnummer })
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
