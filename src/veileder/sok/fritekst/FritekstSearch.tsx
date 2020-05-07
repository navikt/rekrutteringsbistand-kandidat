import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import { Knapp } from 'pam-frontend-knapper';

interface Props {
    search: () => void;
    fritekstSøkeord: string;
    setFritekstSøkeord: (søkeord) => void;
}

const FritekstSearch: FunctionComponent<Props> = ({
    search,
    fritekstSøkeord,
    setFritekstSøkeord,
}) => {
    const onFritekstChange = (e) => {
        setFritekstSøkeord(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        search();
    };

    return (
        <form className="fritekst__search" onSubmit={onSubmit}>
            <input
                id={'fritekstsok-input'}
                value={fritekstSøkeord}
                onChange={onFritekstChange}
                className="skjemaelement__input"
                placeholder="Fritekstsøk"
            />
            <Knapp
                aria-label="fritekstsøk"
                className="search-button"
                id="fritekstsok-knapp"
                htmlType="submit"
                title="Søk"
            >
                <i className="search-button__icon" />
            </Knapp>
        </form>
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
