import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import EtikettBase from 'nav-frontend-etiketter';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import { FETCH_TYPE_AHEAD_SUGGESTIONS, REMOVE_SELECTED_YRKE, SEARCH, SELECT_TYPE_AHEAD_VALUE_YRKE, SET_TYPE_AHEAD_VALUE } from '../domene';

class YrkeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    onTypeAheadYrkeChange = (value) => {
        this.props.setSearchString(value);
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadYrkeSelect = (value) => {
        this.props.setSearchString(value);
        this.props.selectTypeAheadValue();
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.search();
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (e) => {
        if (e.target.value) {
            this.props.removeYrke(e.target.value);
        } else {
            console.log(e.target);
        }
        this.props.search();
    };

    render() {
        return (
            <div>
                <Undertittel>Yrke/stilling</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Legg til yrke eller stilling
                    </Element>
                    <div className="sokekriterier--yrke">
                        {this.props.query.yrkeserfaringer.map((yrkeserfaring) => (
                            <button
                                onClick={this.onFjernClick}
                                className="etikett--sokekriterier etikett etikett--suksess"
                                key={yrkeserfaring}
                                value={yrkeserfaring}
                                icon={<div className="kryssicon--sokekriterier" />}
                            >
                                {yrkeserfaring}
                                <div
                                    className="kryssicon--sokekriterier"
                                />
                            </button>
                        ))}
                        {this.state.showTypeAhead ? (
                            <div className="leggtil--sokekriterier">
                                <Typeahead
                                    ref={(typeAhead) => {
                                        this.typeAhead = typeAhead;
                                    }}
                                    onSelect={this.onTypeAheadYrkeSelect}
                                    onChange={this.onTypeAheadYrkeChange}
                                    label=""
                                    name="yrkeserfaring"
                                    placeholder="Skriv inn yrke"
                                    suggestions={this.props.typeAheadSuggestionsYrke}
                                    value={this.state.typeAheadValue}
                                    id="yrke"
                                />
                            </div>
                        ) : (
                            <LeggTilKnapp
                                ref={(leggTilKnapp) => {
                                    this.leggTilKnapp = leggTilKnapp;
                                }}
                                onClick={this.onLeggTilClick}
                                className="lenke dashed leggtil--sokekriterier--knapp"
                            >
                                Legg til yrke
                            </LeggTilKnapp>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

YrkeSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeYrke: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    setSearchString: PropTypes.func.isRequired,
    query: PropTypes.shape({
        yrkeserfaring: PropTypes.string,
        yrkeserfaringer: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    typeAheadSuggestionsYrke: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    typeAheadSuggestionsYrke: state.typeAheadSuggestionsyrkeserfaring
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestions: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'yrkeserfaring', value }),
    selectTypeAheadValue: () => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_YRKE }),
    setSearchString: (value) => dispatch({ type: SET_TYPE_AHEAD_VALUE, name: 'yrkeserfaring', value }),
    removeYrke: (value) => dispatch({ type: REMOVE_SELECTED_YRKE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(YrkeSearch);
