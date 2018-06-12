/* eslint-disable jsx-a11y/mouse-events-have-key-events,no-trailing-spaces */
import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import TypeaheadSuggestion from './TypeaheadSuggestion';
import './Typeahead.less';

export default class Typeahead extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: props.value,
            activeSuggestionIndex: -1,
            shouldShowSuggestions: true,
            hasFocus: false
        };
        this.shouldBlur = true;
    }

    onChange = (e) => {
        const { value } = e.target;
        this.setState({
            value,
            activeSuggestionIndex: -1,
            shouldShowSuggestions: true
        });
        this.props.onChange(value);
    };

    /**
     * Key handler for tastaturnavigasjon i suggestion-listen.
     * @param e
     */
    onKeyDown = (e) => {
        let { activeSuggestionIndex } = this.state;
        const value = this.props.suggestions[activeSuggestionIndex] ? this.props.suggestions[activeSuggestionIndex] : this.state.value;
        if (this.state.shouldShowSuggestions) {
            switch (e.keyCode) {
                case 13: // Enter
                    e.preventDefault();
                    this.selectSuggestion(value);
                    break;
                case 27: // Esc
                    if (this.state.shouldShowSuggestions) {
                        e.preventDefault();
                        this.setState({
                            shouldShowSuggestions: false
                        });
                    }
                    break;
                case 38: // Arrow up
                    e.preventDefault();
                    activeSuggestionIndex = activeSuggestionIndex - 1 === -2 ? -1 : activeSuggestionIndex - 1;
                    this.setState({ activeSuggestionIndex });
                    break;
                case 40: // Arrow down
                    e.preventDefault();
                    activeSuggestionIndex = activeSuggestionIndex + 1 === this.props.suggestions.length ? this.props.suggestions.length - 1 : activeSuggestionIndex + 1;
                    this.setState({ activeSuggestionIndex });
                    break;
                default:
                    break;
            }
        }
    };

    onFocus = () => {
        this.setState({
            hasFocus: true,
            activeSuggestionIndex: -1
        });
    };

    /**
     * Når man trykker med musen på en suggestion i listen, så vil dette museklikket
     * forårsake at det også trigges onBlur på input'en. Normalt vil onBlur skjule
     * suggestions-listen. Men når man trykker med musen (ved mousedown) på en suggestion, trenger vi
     * at suggestions ikke skjules, slik at selectSuggestion (ved onclick) også kalles.
     */
    onBlur = (e) => {
        if (this.shouldBlur) {
            // If the user clicks something other than the search-button, the parent function
            // onTypeAheadBlur is called.
            if (!e.relatedTarget || e.relatedTarget.id !== 'search-button-typeahead') {
                this.props.onTypeAheadBlur();
                this.setState({
                    hasFocus: false
                });
            }
        }
    };

    onSearchButtonBlur = (e) => {
        if (!e.relatedTarget || e.relatedTarget.id !== this.props.id) {
            this.props.onTypeAheadBlur();
        }
    };

    avoidBlur = () => {
        this.shouldBlur = false;
    };

    blur = () => {
        this.shouldBlur = true;
    };

    /**
     * Markerer en suggestion i listen når bruker trykker pil opp/ned på tastaturet,
     * eller når man bruker fører musen over en suggestion.
     * @param index
     */
    highlightSuggestion = (index) => {
        this.setState({
            activeSuggestionIndex: index
        });
        this.blur();
    };

    /**
     * Når man fjerner musen fra suggestions resettes den aktive indexen til -1.
     */
    resetHighlightingSuggestion = () => {
        this.setState({
            activeSuggestionIndex: -1
        });
    };

    /**
     * Setter valgt suggestion, og skjuler suggestion-listen.
     * @param suggestionValue
     */
    selectSuggestion = (suggestionValue) => {
        this.setState({
            value: suggestionValue,
            shouldShowSuggestions: false,
            activeSuggestionIndex: -1
        }, () => {
            this.input.focus();
        });
        this.blur();
        this.props.onSelect(suggestionValue);
    };

    render() {
        const showSuggestions = this.state.hasFocus && this.state.shouldShowSuggestions && this.props.suggestions.length > 0;
        return (
            <div className="typeahead">
                <input
                    id={this.props.id}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-controls={`${this.props.id}-suggestions`}
                    aria-owns={`${this.props.id}-suggestions`}
                    aria-expanded={showSuggestions}
                    aria-haspopup={showSuggestions}
                    aria-activedescendant={`${this.props.id}-item-${this.state.activeSuggestionIndex}`}
                    placeholder={this.props.placeholder}
                    value={this.state.value}
                    autoComplete="off"
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                    onFocus={this.onFocus}
                    ref={(input) => {
                        this.input = input;
                    }}
                    className="skjemaelement__input input--fullbredde"
                />
                <Knapp
                    aria-label="søk"
                    className="search-button"
                    id="search-button-typeahead"
                    onClick={this.props.onSubmit}
                    onBlur={this.onSearchButtonBlur}
                >
                    <i className="search-button__icon" />
                </Knapp>
                <ul
                    id={`${this.props.id}-suggestions`}
                    role="listbox"
                    className={showSuggestions ? '' : 'typeahead-suggestions-hidden'}
                    onMouseLeave={this.resetHighlightingSuggestion}
                >
                    {showSuggestions && this.props.suggestions.map((li, i) => (
                        <TypeaheadSuggestion
                            id={`${this.props.id}-item-${i}`}
                            key={li}
                            index={i}
                            value={li}
                            match={this.state.value}
                            active={i === this.state.activeSuggestionIndex}
                            onClick={this.selectSuggestion}
                            highlightSuggestion={this.highlightSuggestion}
                            avoidBlur={this.avoidBlur}
                        />
                    ))}
                </ul>
            </div>
        );
    }
}

Typeahead.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onTypeAheadBlur: PropTypes.func.isRequired
};
