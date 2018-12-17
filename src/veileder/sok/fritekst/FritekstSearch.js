import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { SEARCH } from '../searchReducer';
import { ALERTTYPE } from '../../../felles/konstanter';
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
                />
                <Knapp
                    aria-label="søk"
                    className="search-button"
                    id="sok-etter-stilling-knapp"
                    onClick={this.onSearch}
                >
                    <i className="search-button__icon" />
                </Knapp>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.FRITEKST && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </div>
        );
    }
}

FritekstSearch.propTypes = {
    search: PropTypes.func.isRequired,
    fritekstSokeord: PropTypes.string.isRequired,
    setFritekstSokeord: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    fritekstSokeord: state.fritekst.fritekst,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.FRITEKST }),
    setFritekstSokeord: (fritekstSokeord) => dispatch({ type: SET_FRITEKST_SOKEORD, fritekst: fritekstSokeord })
});

export default connect(mapStateToProps, mapDispatchToProps)(FritekstSearch);
