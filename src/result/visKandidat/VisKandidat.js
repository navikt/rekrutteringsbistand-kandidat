import React from 'react';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';
import cvPropTypes from '../../PropTypes';
import { FETCH_CV } from '../../sok/cv/cvReducer';
import { getUrlParameterByName } from '../../sok/utils';
import VisKandidatPersonalia from './VisKandidatPersonalia';
import VisKandidatCv from './VisKandidatCv';
import VisKandidatJobbprofil from './VisKandidatJobbprofil';

class VisKandidat extends React.Component {
    componentDidMount() {
        const kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.props.hentCvForKandidat(kandidatnummer);
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
                <VisKandidatPersonalia cv={cv} />
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
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring
});

const mapDispatchToProps = (dispatch) => ({
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
