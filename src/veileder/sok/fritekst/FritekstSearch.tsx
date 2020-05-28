import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../searchReducer';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import AppState from '../../AppState';
import './Fritekst.less';
import { Søkeknapp } from 'nav-frontend-ikonknapper';

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
            <Søkeknapp
                type="flat"
                aria-label="fritekstsøk"
                className="fritekst__search__søkeknapp"
                id="fritekstsok-knapp"
                htmlType="submit"
                title="Søk"
            />
        </form>
    );
};

const mapStateToProps = (state: AppState) => ({
    fritekstSøkeord: state.fritekst.fritekst,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    setFritekstSøkeord: (fritekstSøkeord) =>
        dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSøkeord }),
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
