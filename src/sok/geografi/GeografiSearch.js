import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../common/typeahead/Typeahead';
import { SEARCH } from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_GEOGRAFI,
    SELECT_TYPE_AHEAD_VALUE_GEOGRAFI,
    TOGGLE_GEOGRAFI_PANEL_OPEN
} from './geografiReducer';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE, BRANCHNAVN } from '../../konstanter';
import './Geografi.less';

class GeografiSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    onTypeAheadGeografiChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadGeografiSelect = (value) => {
        if (value !== '') {
            const geografi = this.props.typeAheadSuggestionsGeografiKomplett.find((k) => k.geografiKodeTekst.toLowerCase() === value.toLowerCase());
            if (geografi !== undefined) {
                this.props.selectTypeAheadValue(geografi);
                this.props.clearTypeAheadGeografi();
                this.setState({
                    typeAheadValue: ''
                });
                this.props.search();
            }
        }
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (e) => {
        this.props.removeGeografi(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadGeografi();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadGeografiSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulSted) {
            return null;
        }
        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier heading--geografi"
                tittel="Stillingens geografiske plassering"
                tittelProps="systemtittel"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>
                    Legg til fylke eller kommune
                </Element>
                <div className="sokekriterier--kriterier">
                    <div className="sokefelt--wrapper--geografi">
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadGeografiSelect}
                                onChange={this.onTypeAheadGeografiChange}
                                label=""
                                name="geografi"
                                placeholder="Skriv inn sted"
                                suggestions={this.props.typeAheadSuggestionsGeografi}
                                value={this.state.typeAheadValue}
                                id="typeahead-geografi"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp"
                                id="leggtil-sted-knapp"
                            >
                                +Legg til sted
                            </Knapp>
                        )}
                    </div>
                    {this.props.geografiListKomplett && this.props.geografiListKomplett.map((geo) => (
                        <button
                            onClick={this.onFjernClick}
                            className="etikett--sokekriterier kryssicon--sokekriterier"
                            key={geo.geografiKodeTekst}
                            value={geo.geografiKode}
                        >
                            {geo.geografiKodeTekst}
                        </button>
                    ))}
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.GEOGRAFI && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </Ekspanderbartpanel>
        );
    }
}

GeografiSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeGeografi: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    geografiListKomplett: PropTypes.arrayOf(PropTypes.shape({
        geografiKodeTekst: PropTypes.string,
        geografiKode: PropTypes.string
    })).isRequired,
    typeAheadSuggestionsGeografi: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsGeografiKomplett: PropTypes.arrayOf(PropTypes.shape({
        geografiKodeTekst: PropTypes.string,
        geografiKode: PropTypes.string
    })).isRequired,
    clearTypeAheadGeografi: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulSted: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    geografiList: state.geografi.geografiList,
    geografiListKomplett: state.geografi.geografiListKomplett,
    typeAheadSuggestionsGeografi: state.typeahead.geografi.suggestions,
    typeAheadSuggestionsGeografiKomplett: state.typeahead.geografiKomplett.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulSted: state.search.featureToggles['skjul-sted'],
    panelOpen: state.geografi.geografiPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.GEOGRAFI }),
    clearTypeAheadGeografi: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.GEOGRAFI }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.GEOGRAFI, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_GEOGRAFI, value }),
    removeGeografi: (value) => dispatch({ type: REMOVE_SELECTED_GEOGRAFI, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_GEOGRAFI_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(GeografiSearch);
