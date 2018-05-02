import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import { FETCH_TYPE_AHEAD_SUGGESTIONS, REMOVE_SELECTED_SERTIFIKAT, REMOVE_SELECTED_SPRAK, SEARCH, SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT, SELECT_TYPE_AHEAD_VALUE_SPRAK, SET_TYPE_AHEAD_VALUE } from '../domene';

class KompetanseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAheadSprak: false,
            typeAheadValueSprak: '',
            showTypeAheadSertifikat: false,
            typeAheadValueSertifikat: ''
        };
    }

    onTypeAheadSprakChange = (value) => {
        this.props.fetchTypeAheadSuggestionsSprak(value);
        this.setState({
            typeAheadValueSprak: value
        });
    };

    onTypeAheadSprakSelect = (value) => {
        this.props.selectTypeAheadValueSprak(value);
        this.setState({
            typeAheadValueSprak: '',
            showTypeAheadSprak: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.search();
    };

    onLeggTilSprakClick = () => {
        this.setState({
            showTypeAheadSprak: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernSprakClick = (e) => {
        this.props.removeSprak(e.target.value);
        this.props.search();
    };

    onTypeAheadSertifikatChange = (value) => {
        this.props.fetchTypeAheadSuggestionsSertifikat(value);
        this.setState({
            typeAheadValueSertifikat: value
        });
    };

    onTypeAheadSertifikatSelect = (value) => {
        this.props.selectTypeAheadValueSertifikat(value);
        this.setState({
            typeAheadValueSertifikat: '',
            showTypeAheadSertifikat: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.search();
    };

    onLeggTilSertifikatClick = () => {
        this.setState({
            showTypeAheadSertifikat: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernSertifikatClick = (e) => {
        this.props.removeSertifikat(e.target.value);
        this.props.search();
    };

    onSubmitSprak = (e) => {
        e.preventDefault();
        this.props.selectTypeAheadValueSprak(this.state.typeAheadValueSprak);
        this.setState({
            typeAheadValueSprak: '',
            showTypeAheadSprak: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.search();
    };

    onSubmitSertifikat = (e) => {
        e.preventDefault();
        this.props.selectTypeAheadValueSertifikat(this.state.typeAheadValueSertifikat);
        this.setState({
            typeAheadValueSertifikat: '',
            showTypeAheadSertifikat: false
        }, () => this.leggTilKnapp.button.focus());
        this.props.search();
    };

    render() {
        return (
            <div>
                <Undertittel>Kompetanse</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Krav til språk
                    </Element>
                    <div className="sokekriterier--kriterier">
                        {this.props.query.sprakList.map((sprak) => (
                            <button
                                onClick={this.onFjernSprakClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={sprak}
                                value={sprak}
                            >
                                {sprak}
                            </button>
                        ))}
                        {this.state.showTypeAheadSprak ? (
                            <div className="leggtil--sokekriterier">
                                <form
                                    onSubmit={this.onSubmitSprak}
                                >
                                    <Typeahead
                                        ref={(typeAhead) => {
                                            this.typeAhead = typeAhead;
                                        }}
                                        onSelect={this.onTypeAheadSprakSelect}
                                        onChange={this.onTypeAheadSprakChange}
                                        label=""
                                        name="sprak"
                                        placeholder="Skriv inn språk"
                                        suggestions={this.props.typeAheadSuggestionsSprak}
                                        value={this.state.typeAheadValueSprak}
                                        id="sprak"
                                    />
                                </form>
                            </div>
                        ) : (
                            <LeggTilKnapp
                                ref={(leggTilKnapp) => {
                                    this.leggTilKnapp = leggTilKnapp;
                                }}
                                onClick={this.onLeggTilSprakClick}
                                className="lenke dashed leggtil--sokekriterier--knapp"
                            >
                                Legg til Språk
                            </LeggTilKnapp>
                        )}
                    </div>
                    <Element>
                        Krav til sertifikat
                    </Element>
                    <div className="sokekriterier--kriterier">
                        {this.props.query.sertifikater.map((sertifikat) => (
                            <button
                                onClick={this.onFjernSertifikatClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={sertifikat}
                                value={sertifikat}
                            >
                                {sertifikat}
                            </button>
                        ))}
                        {this.state.showTypeAheadSertifikat ? (
                            <div className="leggtil--sokekriterier">
                                <form
                                    onSubmit={this.onSubmitSertifikat}
                                >
                                    <Typeahead
                                        ref={(typeAhead) => {
                                            this.typeAhead = typeAhead;
                                        }}
                                        onSelect={this.onTypeAheadSertifikatSelect}
                                        onChange={this.onTypeAheadSertifikatChange}
                                        label=""
                                        name="sertifikat"
                                        placeholder="Skriv inn sertifikat"
                                        suggestions={this.props.typeAheadSuggestionsSertifikat}
                                        value={this.state.typeAheadValueSertifikat}
                                        id="sertifikat"
                                    />
                                </form>
                            </div>
                        ) : (
                            <LeggTilKnapp
                                ref={(leggTilKnapp) => {
                                    this.leggTilKnapp = leggTilKnapp;
                                }}
                                onClick={this.onLeggTilSertifikatClick}
                                className="lenke dashed leggtil--sokekriterier--knapp"
                            >
                                Legg til Sertifikat
                            </LeggTilKnapp>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

KompetanseSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSprak: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsSprak: PropTypes.func.isRequired,
    selectTypeAheadValueSprak: PropTypes.func.isRequired,
    removeSertifikat: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsSertifikat: PropTypes.func.isRequired,
    selectTypeAheadValueSertifikat: PropTypes.func.isRequired,
    query: PropTypes.shape({
        sprak: PropTypes.string,
        sprakList: PropTypes.arrayOf(PropTypes.string),
        sertifikat: PropTypes.string,
        sertifikater: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    typeAheadSuggestionsSprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSertifikat: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    typeAheadSuggestionsSprak: state.typeAheadSuggestionssprak,
    typeAheadSuggestionsSertifikat: state.typeAheadSuggestionssertifikat
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestionsSprak: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'sprak', value }),
    selectTypeAheadValueSprak: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SPRAK, value }),
    removeSprak: (value) => dispatch({ type: REMOVE_SELECTED_SPRAK, value }),
    fetchTypeAheadSuggestionsSertifikat: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'sertifikat', value }),
    selectTypeAheadValueSertifikat: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SERTIFIKAT, value }),
    removeSertifikat: (value) => dispatch({ type: REMOVE_SELECTED_SERTIFIKAT, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(KompetanseSearch);
