import React from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';
import cvPropTypes from '../../../felles/PropTypes';
import { FETCH_CV } from '../../sok/cv/cvReducer';
import VisKandidatPersonalia from '../../../felles/result/visKandidat/VisKandidatPersonalia';
import VisKandidatCv from '../../../felles/result/visKandidat/VisKandidatCv';
import VisKandidatJobbprofil from '../../../felles/result/visKandidat/VisKandidatJobbprofil';
import { getUrlParameterByName } from '../../../felles/sok/utils';

class VisKandidat extends React.Component {
    constructor(props) {
        super(props);
        this.kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
    }
    componentDidMount() {
        this.props.hentCvForKandidat(this.kandidatnummer);
    }

    render() {
        const { cv, isFetchingCv } = this.props;

        if (isFetchingCv) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div>
                <VisKandidatPersonalia cv={cv} contextRoot={'kandidater'} />
                <VisKandidatJobbprofil cv={cv} />
                <VisKandidatCv cv={cv} />
            </div>
        );
    }
}

VisKandidat.defaultProps = {
    matchforklaring: undefined
};

VisKandidat.propTypes = {
    cv: cvPropTypes.isRequired,
    isFetchingCv: PropTypes.bool.isRequired,
    hentCvForKandidat: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});

export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
