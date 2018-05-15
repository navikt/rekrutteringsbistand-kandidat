import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Undertittel } from 'nav-frontend-typografi';
import LeggTilKnapp from '../../common/LeggTilKnapp';
import Typeahead from '../../common/Typeahead';
import {
    FETCH_TYPE_AHEAD_SUGGESTIONS, REMOVE_SELECTED_KOMPETANSE, SEARCH, SELECT_TYPE_AHEAD_VALUE_KOMPETANSE
} from '../domene';

class KompetanseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAheadKompetanse: false,
            typeAheadValueKompetanse: '',
            antallKompetanser: 4
        };
    }

    onTypeAheadKompetanseChange = (value) => {
        this.props.fetchTypeAheadSuggestionsKompetanse(value);
        this.setState({
            typeAheadValueKompetanse: value
        });
    };

    onTypeAheadKompetanseSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValueKompetanse(value);
            this.setState({
                typeAheadValueKompetanse: '',
                showTypeAheadKompetanse: false
            }, () => this.leggTilKnapp.button.focus());
            this.props.search();
        }
    };

    onLeggTilKompetanseClick = () => {
        this.setState({
            showTypeAheadKompetanse: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernKompetanseClick = (e) => {
        this.props.removeKompetanse(e.target.value);
        this.props.search();
    };

    onSubmitKompetanse = (e) => {
        e.preventDefault();
        if (this.state.typeAheadValueKompetanse !== '') {
            this.props.selectTypeAheadValueKompetanse(this.state.typeAheadValueKompetanse);
            this.setState({
                typeAheadValueKompetanse: '',
                showTypeAheadKompetanse: false
            }, () => this.leggTilKnapp.button.focus());
            this.props.search();
        }
    };

    onKompetanseSuggestionsClick = (e) => {
        this.props.selectTypeAheadValueKompetanse(e.target.value);
        this.props.search();
    };

    onLeggTilFlereClick = () => {
        this.setState({
            antallKompetanser: this.state.antallKompetanser + 4
        });
    };

    render() {
        const kompetanseSuggestions = this.props.kompetanseSuggestions.filter((k) => !this.props.query.kompetanser.includes(k.feltnavn));
        return (
            <div>
                <Undertittel>Kompetanse</Undertittel>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Krav til språk, sertifikater, kurs og sertifiseringer
                    </Element>
                    <div className="sokekriterier--kriterier">
                        {this.props.query.kompetanser.map((kompetanse) => (
                            <button
                                onClick={this.onFjernKompetanseClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={kompetanse}
                                value={kompetanse}
                            >
                                {kompetanse}
                            </button>
                        ))}
                        {this.state.showTypeAheadKompetanse ? (
                            <div className="leggtil--sokekriterier">
                                <form
                                    onSubmit={this.onSubmitKompetanse}
                                >
                                    <Typeahead
                                        ref={(typeAhead) => {
                                            this.typeAhead = typeAhead;
                                        }}
                                        onSelect={this.onTypeAheadKompetanseSelect}
                                        onChange={this.onTypeAheadKompetanseChange}
                                        label=""
                                        name="kompetanse"
                                        placeholder="Skriv inn kompetanse"
                                        suggestions={this.props.typeAheadSuggestionsKompetanse}
                                        value={this.state.typeAheadValueKompetanse}
                                        id="kompetanse"
                                    />
                                </form>
                            </div>
                        ) : (
                            <LeggTilKnapp
                                ref={(leggTilKnapp) => {
                                    this.leggTilKnapp = leggTilKnapp;
                                }}
                                onClick={this.onLeggTilKompetanseClick}
                                className="lenke dashed leggtil--sokekriterier--knapp"
                            >
                                Legg til kompetanse
                            </LeggTilKnapp>
                        )}
                    </div>
                    {kompetanseSuggestions.length > 0 && (
                        <div>
                            <div className="border--bottom--thin border--bottom--thin--margin" />
                            <Element>
                                Forslag til kompetanse knyttet til valgt stilling. Klikk for å legge til
                            </Element>
                            <div className="sokekriterier--kriterier">
                                {kompetanseSuggestions.slice(0, this.state.antallKompetanser).map((suggestedKompetanse) => (
                                    <div key={suggestedKompetanse.feltnavn} >
                                        <button
                                            onClick={this.onKompetanseSuggestionsClick}
                                            className="etikett--forslag--kompetanse"
                                            value={suggestedKompetanse.feltnavn}
                                        >
                                            {suggestedKompetanse.feltnavn}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {this.state.antallKompetanser < kompetanseSuggestions.length && (
                                <button
                                    onClick={this.onLeggTilFlereClick}
                                    className="lenke"
                                >
                                    Legg til flere
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

KompetanseSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeKompetanse: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsKompetanse: PropTypes.func.isRequired,
    selectTypeAheadValueKompetanse: PropTypes.func.isRequired,
    query: PropTypes.shape({
        kompetanse: PropTypes.string,
        kompetanser: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    kompetanseSuggestions: PropTypes.arrayOf(PropTypes.object).isRequired,
    typeAheadSuggestionsKompetanse: PropTypes.arrayOf(PropTypes.string).isRequired
};

const mapStateToProps = (state) => ({
    query: state.query,
    kompetanseSuggestions: state.elasticSearchResultat.kompetanseSuggestions,
    typeAheadSuggestionsKompetanse: state.typeAheadSuggestionskompetanse
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    fetchTypeAheadSuggestionsKompetanse: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'kompetanse', value }),
    selectTypeAheadValueKompetanse: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_KOMPETANSE, value }),
    removeKompetanse: (value) => dispatch({ type: REMOVE_SELECTED_KOMPETANSE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(KompetanseSearch);
