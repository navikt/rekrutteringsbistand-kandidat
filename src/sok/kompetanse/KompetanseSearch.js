import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    SEARCH
} from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import { REMOVE_SELECTED_KOMPETANSE, SELECT_TYPE_AHEAD_VALUE_KOMPETANSE } from './kompetanseReducer';
import './Kompetanse.less';

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
            this.props.clearTypeAheadKompetanse('suggestionskompetanse');
            this.setState({
                typeAheadValueKompetanse: ''
            });
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
        this.onTypeAheadKompetanseSelect(this.state.typeAheadValueKompetanse);
        this.typeAhead.input.focus();
    };

    onKompetanseSuggestionsClick = (e) => {
        this.props.selectTypeAheadValueKompetanse(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValueKompetanse: '',
            showTypeAheadKompetanse: false
        });
        this.props.clearTypeAheadKompetanse('suggestionskompetanse');
    };

    onLeggTilFlereClick = () => {
        this.setState({
            antallKompetanser: this.state.antallKompetanser + 4
        });
    };

    render() {
        const kompetanseSuggestions = this.props.kompetanseSuggestions.filter((k) => !this.props.kompetanser.includes(k.feltnavn));
        return (
            <div>
                <Systemtittel>Kompetanse</Systemtittel>
                <Normaltekst>Sertifikater, kurs, sertifisering, programmer og ferdigheter</Normaltekst>
                <div className="panel panel--sokekriterier">
                    <Element>
                        Legg til kompetansen du ønsker at en kandidat skal ha
                    </Element>
                    <Normaltekst className="text--italic">
                        For eksempel førerkort klasse B, ledelse eller Excel
                    </Normaltekst>
                    <div className="sokekriterier--kriterier">
                        <div className="sokefelt--wrapper--kompetanse">
                            {this.state.showTypeAheadKompetanse ? (
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
                                    id="typeahead-kompetanse"
                                    onSubmit={this.onSubmitKompetanse}
                                    onTypeAheadBlur={this.onTypeAheadBlur}
                                />
                            ) : (
                                <Knapp
                                    onClick={this.onLeggTilKompetanseClick}
                                    className="leggtil--sokekriterier--knapp"
                                    id="leggtil-kompetanse-knapp"
                                >
                                    +Legg til kompetanse
                                </Knapp>
                            )}
                        </div>
                        {this.props.kompetanser.map((kompetanse) => (
                            <button
                                onClick={this.onFjernKompetanseClick}
                                className="etikett--sokekriterier kryssicon--sokekriterier"
                                key={kompetanse}
                                value={kompetanse}
                            >
                                {kompetanse}
                            </button>
                        ))}
                    </div>
                    {kompetanseSuggestions.length > 0 && (
                        <div>
                            <div className="border--bottom--thin border--bottom--thin--margin" />
                            <Element>
                                Forslag til kompetanse knyttet til valgt stilling. Klikk for å legge til
                            </Element>
                            <div className="sokekriterier--kriterier">
                                {kompetanseSuggestions.slice(0, this.state.antallKompetanser).map((suggestedKompetanse) => (
                                    <button
                                        onClick={this.onKompetanseSuggestionsClick}
                                        className="etikett--forslag--kompetanse"
                                        value={suggestedKompetanse.feltnavn}
                                        key={suggestedKompetanse.feltnavn}
                                    >
                                        {suggestedKompetanse.feltnavn}
                                    </button>
                                ))}
                                {this.state.antallKompetanser < kompetanseSuggestions.length && (
                                    <Knapp
                                        onClick={this.onLeggTilFlereClick}
                                        className="se--flere--forslag"
                                    >
                                        {`Se flere (${kompetanseSuggestions.length - this.state.antallKompetanser})`}
                                    </Knapp>
                                )}
                            </div>
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
    kompetanser: PropTypes.arrayOf(PropTypes.string).isRequired,
    kompetanseSuggestions: PropTypes.arrayOf(PropTypes.shape({
        feltnavn: PropTypes.string,
        antall: PropTypes.number,
        subfelt: PropTypes.array
    })).isRequired,
    typeAheadSuggestionsKompetanse: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadKompetanse: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    kompetanser: state.kompetanse.kompetanser,
    kompetanseSuggestions: state.search.searchResultat.kompetanseSuggestions,
    typeAheadSuggestionsKompetanse: state.typeahead.suggestionskompetanse
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    clearTypeAheadKompetanse: (name) => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, name }),
    fetchTypeAheadSuggestionsKompetanse: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, name: 'kompetanse', value }),
    selectTypeAheadValueKompetanse: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_KOMPETANSE, value }),
    removeKompetanse: (value) => dispatch({ type: REMOVE_SELECTED_KOMPETANSE, value })
});

export default connect(mapStateToProps, mapDispatchToProps)(KompetanseSearch);
