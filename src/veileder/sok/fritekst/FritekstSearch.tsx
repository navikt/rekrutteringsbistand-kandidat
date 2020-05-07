import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import FritekstSearchFelles from './FritekstSearchCommon';

interface Props {
    search: () => void;
    fritekstSøkeord: string;
    setFritekstSøkeord: (søkeord) => void;
}

const FritekstSearch: FunctionComponent<Props> = (props) => {
    return (
        <FritekstSearchFelles
            setFritekstSokeord={props.setFritekstSøkeord}
            fritekstSokeord={props.fritekstSøkeord}
            search={props.search}
            placeholderTekst="Fritekstsøk"
        />
    );
};

const mapStateToProps = (state) => ({
    fritekstSøkeord: state.fritekst.fritekst,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setFritekstSøkeord: (fritekstSøkeord) =>
        dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSøkeord }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
