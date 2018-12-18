import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import { SEARCH } from '../searchReducer';
import { SET_FRITEKST_SOKEORD } from './fritekstReducer';
import './Fritekst.less';

class FritekstSearch extends React.Component {
    onKeyDown = (e) => {
        switch (e.keyCode) {
            case 13: // Enter
                e.preventDefault();
                this.onSearch();
                break;
            default:
                break;
        }
    };

    onInnsatsgruppeChange = (e) => {
        this.props.setFritekstSokeord(e.target.value);
    };

    onSearch = () => {
        this.props.search();
    };

    render() {
        const { fritekstSokeord } = this.props;
        return (
            <div className="fritekst__search">
                <input
                    id={'sok-etter-stilling-input'}
                    value={fritekstSokeord}
                    onChange={this.onInnsatsgruppeChange}
                    onKeyDown={this.onKeyDown}
                    className="skjemaelement__input"
                    placeholder="Søk"
                />
                <Knapp
                    aria-label="søk"
                    className="search-button"
                    id="sok-etter-stilling-knapp"
                    onClick={this.onSearch}
                >
                    <i className="search-button__icon" />
                </Knapp>
            </div>
        );
    }
}

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
