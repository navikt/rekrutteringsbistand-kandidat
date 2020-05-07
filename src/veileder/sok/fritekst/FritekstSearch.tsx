import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../../sok/searchReducer';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import FritekstSearchFelles from '../../../felles/sok/fritekst/FritekstSearch';

interface Props {
    search: () => void;
    fritekstSøkeord: string;
    setFritekstSøkeord: (søkeord) => void;
}

const FritekstSearch: FunctionComponent<Props> = ({
    fritekstSøkeord,
    search,
    setFritekstSøkeord,
}) => (
    <FritekstSearchFelles
        setFritekstSokeord={setFritekstSøkeord}
        fritekstSokeord={fritekstSøkeord}
        search={search}
        placeholderTekst="Fritekstsøk"
    />
);

const mapStateToProps = (state) => ({
    fritekstSøkeord: state.fritekst.fritekst,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setFritekstSøkeord: (fritekstSøkeord) =>
        dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSøkeord }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
