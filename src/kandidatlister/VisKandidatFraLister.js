import React from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';
import cvPropTypes from '../PropTypes';
import { FETCH_CV } from '../sok/cv/cvReducer';
import { getUrlParameterByName } from '../sok/utils';
import VisKandidatPersonalia from '../result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../result/visKandidat/VisKandidatJobbprofil';
import './VisKandidatFraLister.less';

class VisKandidatFraLister extends React.Component {
    componentDidMount() {
        const kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.props.hentCvForKandidat(kandidatnummer);
    }

    render() {
        const { cv, kandidatListeId, isFetchingCv } = this.props;

        if (isFetchingCv) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                <VisKandidatPersonalia cv={cv} kandidatListe={kandidatListeId} />
                <div className="viskandidat-container">
                    <VisKandidatJobbprofil cv={cv} />
                    <VisKandidatCv cv={cv} />
                </div>
            </div>
        );
    }
}

VisKandidatFraLister.defaultProps = {
    matchforklaring: undefined
};

VisKandidatFraLister.propTypes = {
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    kandidatListeId: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => ({
    kandidatListeId: props.match.params.listeid,
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
