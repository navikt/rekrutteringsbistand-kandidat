import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SEARCH } from '../../sok/searchReducer';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import FritekstSearchFelles from '../../../felles/sok/fritekst/FritekstSearch';

const FritekstSearch = ({ fritekstSokeord, search, setFritekstSokeord }) => (
    <FritekstSearchFelles
        setFritekstSokeord={setFritekstSokeord}
        fritekstSokeord={fritekstSokeord}
        search={search}
        placeholderTekst="Fritekstsøk"
    />
);

FritekstSearch.propTypes = {
    search: PropTypes.func.isRequired,
    fritekstSokeord: PropTypes.string.isRequired,
    setFritekstSokeord: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    fritekstSokeord: state.fritekst.fritekst,
});

const mapDispatchToProps = dispatch => ({
    search: () => dispatch({ type: SEARCH }),
    setFritekstSokeord: fritekstSokeord =>
        dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSokeord }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
