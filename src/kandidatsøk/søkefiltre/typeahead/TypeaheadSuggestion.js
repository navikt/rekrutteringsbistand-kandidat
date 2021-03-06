/* eslint-disable react/no-array-index-key */

import React from 'react';
import PropTypes from 'prop-types';

export default class TypeaheadSuggestion extends React.Component {
    constructor(props) {
        super();
        this.value = props.value;
    }

    onClick = () => {
        this.props.onClick(this.value);
    };

    highlightSuggestion = () => {
        this.props.highlightSuggestion(this.props.index);
    };

    render() {
        const matchIndex = this.value.toLowerCase().indexOf(this.props.match.toLowerCase());
        return (
            <li
                id={this.props.id}
                ref={(node) => {
                    this.node = node;
                }}
                role="option"
                aria-selected={this.props.active}
                onClick={this.onClick}
                onMouseOver={this.highlightSuggestion}
                onFocus={this.props.avoidBlur}
                onMouseDown={this.props.avoidBlur}
                onKeyDown={this.props.avoidBlur}
            >
                {matchIndex !== -1 && this.props.match !== '' ? (
                    <span className={`typetext ${this.props.active && 'active'}`}>
                        {this.value.split('').map((c, i) => {
                            if (
                                i === matchIndex ||
                                (i > matchIndex && i < matchIndex + this.props.match.length)
                            ) {
                                return (
                                    <span className="typeahead-substring" key={`${c}-${i}`}>
                                        {c}
                                    </span>
                                );
                            }
                            return <span key={`${c}-${i}`}>{c}</span>;
                        })}
                    </span>
                ) : (
                    <span
                        className={`typetext typeahead-substring ${this.props.active && 'active'}`}
                    >
                        {this.value}
                    </span>
                )}
            </li>
        );
    }
}

TypeaheadSuggestion.propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    match: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    highlightSuggestion: PropTypes.func.isRequired,
    avoidBlur: PropTypes.func.isRequired,
};
