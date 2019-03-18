import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';

class AutorisasjonSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    onTypeAheadAutorisasjonChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadAutorisasjonSelect = (value) => {
        if (value !== '') {
            const autorisasjon = this.props.typeAheadSuggestionsAutorisasjon.find((s) => s.toLowerCase() === value.toLowerCase());
            if (autorisasjon !== undefined) {
                this.props.selectTypeAheadValue(autorisasjon);
                this.props.clearTypeAheadAutorisasjon();
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
        this.props.removeAutorisasjon(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadAutorisasjon();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadAutorisasjonSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulAutorisasjon) {
            return null;
        }
        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Autorisasjon"
                tittelProps="undertittel"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>Krav til autorisasjon i jobbsituasjonen</Element>
                <Normaltekst>
                    For eksempel: Truckførerbevis T1
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadAutorisasjonSelect}
                                onChange={this.onTypeAheadAutorisasjonChange}
                                label=""
                                name="utdanning"
                                placeholder="Skriv inn autorisasjon"
                                suggestions={this.props.typeAheadSuggestionsAutorisasjon}
                                value={this.state.typeAheadValue}
                                id="yrke"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-autorisasjon-knapp"
                                mini
                            >
                                +Legg til autorisasjon
                            </Knapp>
                        )}
                    </div>
                    {this.props.autorisasjon.map((autorisasjon) => (
                        <button
                            onClick={this.onFjernClick}
                            className="etikett--sokekriterier kryssicon--sokekriterier"
                            key={autorisasjon}
                            value={autorisasjon}
                        >
                            {autorisasjon}
                        </button>
                    ))}
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.AUTORISASJON && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </Ekspanderbartpanel>
        );
    }
}

AutorisasjonSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeAutorisasjon: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadAutorisasjon: PropTypes.func.isRequired,
    autorisasjon: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsAutorisasjon: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulAutorisasjon: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

export default AutorisasjonSearch;
