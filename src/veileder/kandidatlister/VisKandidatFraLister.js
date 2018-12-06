import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import cvPropTypes from '../../felles/PropTypes';
import { FETCH_CV } from '../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../felles/result/visKandidat/VisKandidatJobbprofil';
import '../../felles/common/ikoner/ikoner.less';

class VisKandidatFraLister extends React.Component {
    componentDidMount() {
        this.props.hentCvForKandidat(this.props.match.params.kandidatNr, this.props.cv.profilId);
    }

    render() {
        const { cv, stillingsId, isFetchingCv } = this.props;
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
                    stillingsId={stillingsId}
                    contextRoot="kandidater/lister"
                    appContext="veileder"
                />
                <div className="viskandidat-container">
                    <VisKandidatJobbprofil cv={cv} />
                    <VisKandidatCv cv={cv} />
                </div>
            </div>
        );
    }
}

VisKandidatFraLister.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            kandidatNr: PropTypes.string
        })
    }).isRequired,
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired,
    stillingsId: PropTypes.string.isRequired
};

const mapStateToProps = (state, props) => ({
    stillingsId: props.match.params.listeid,
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr, profilId) => dispatch({ type: FETCH_CV, arenaKandidatnr, profilId })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidatFraLister);
