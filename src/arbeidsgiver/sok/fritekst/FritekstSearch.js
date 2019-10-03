import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SEARCH } from '../../../arbeidsgiver/sok/searchReducer';
import { SET_FRITEKST_SOKEORD } from '../../../arbeidsgiver/sok/fritekst/fritekstReducer';
import FritekstSearchFelles from '../../../felles/sok/fritekst/FritekstSearch';
import './Fritekst.less';

const FritekstSearch = ({ fritekstSokeord, search, setFritekstSokeord }) => (
    <FritekstSearchFelles
        setFritekstSokeord={setFritekstSokeord}
        fritekstSokeord={fritekstSokeord}
        search={search}
        placeholderTekst="Skriv inn søkeord"
    />
);

FritekstSearch.propTypes = {
    search: PropTypes.func.isRequired,
    fritekstSokeord: PropTypes.string.isRequired,
    setFritekstSokeord: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    fritekstSokeord: state.fritekst.fritekst
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setFritekstSokeord: (fritekstSokeord) => dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSokeord })
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
