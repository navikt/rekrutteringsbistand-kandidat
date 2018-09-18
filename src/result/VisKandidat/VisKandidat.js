import React from 'react';
import connect from 'react-redux/es/connect/connect';
import NavFrontendSpinner from 'nav-frontend-spinner';
import PropTypes from 'prop-types';
import cvPropTypes from '../../PropTypes';
import { MatchexplainProptypesGrouped } from '../modal/Proptypes';
import { FETCH_CV, OPEN_CV_MODAL } from '../../sok/cv/cvReducer';
import { getUrlParameterByName } from '../../sok/utils';
import VisKandidatPersonalia from './VisKandidatPersonalia';
import VisKandidatCv from './VisKandidatCv';

class VisKandidat extends React.Component {
    componentDidMount() {
        const kandidatnummer = getUrlParameterByName('kandidatNr', window.location.href);
        this.props.hentCvForKandidat(kandidatnummer);
    }

    render() {
        const { cv, isFetchingCv, matchforklaring } = this.props;


        if (isFetchingCv) {
            return (
                <div className="text-center">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }
        return (
            <div className="panel">
                <VisKandidatPersonalia cv={cv} />
                <VisKandidatCv cv={cv} matchforklaring={matchforklaring} />

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
    matchforklaring: MatchexplainProptypesGrouped,
    hentCvForKandidat: PropTypes.func.isRequired

};

const mapStateToProps = (state) => ({
    isFetchingCv: state.cvReducer.isFetchingCv,
    cv: state.cvReducer.cv,
    matchforklaring: state.cvReducer.matchforklaring
});

const mapDispatchToProps = (dispatch) => ({
    openCvModal: () => dispatch({ type: OPEN_CV_MODAL }),
    hentCvForKandidat: (arenaKandidatnr) => dispatch({ type: FETCH_CV, arenaKandidatnr })
});


export default connect(mapStateToProps, mapDispatchToProps)(VisKandidat);
