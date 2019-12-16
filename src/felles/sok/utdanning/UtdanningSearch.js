import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import SokekriteriePanel from '../../common/sokekriteriePanel/SokekriteriePanel';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE, UTDANNING } from '../../../felles/konstanter';
import './Utdanning.less';
// TODO: Kommenter inn når søk på geografi blir tatt inn igjen
// import { Element, Normaltekst } from 'nav-frontend-typografi';
// import { Knapp } from 'pam-frontend-knapper';
// import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';

class UtdanningSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.utdanningsnivaKategorier = Object.keys(UTDANNING).map((key) => UTDANNING[key]);
    }

    onUtdanningsnivaChange = (e) => {
        if (e.target.checked) {
            this.props.checkUtdanningsniva(e.target.value);
        } else {
            this.props.uncheckUtdanningsniva(e.target.value);
        }
        this.props.search();
    };

    onTypeAheadUtdanningChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadUtdanningSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadUtdanning();
            this.setState({
                typeAheadValue: ''
            });
            this.props.search();
        }
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (e) => {
        this.props.removeUtdanning(e.target.value);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadUtdanning();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadUtdanningSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulUtdanning) {
            return null;
        }
        return (
            <SokekriteriePanel
                id="Utdanning__SokekriteriePanel"
                tittel="Utdanning"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}

            >
                <SkjemaGruppe title="Velg et eller flere utdanningsnivå">
                    <div className="sokekriterier--kriterier sokekriterier--margin-top-large">
                        {this.utdanningsnivaKategorier.map((utdanning) => (
                            <Checkbox
                                className="checkbox--utdanningsniva skjemaelement--pink"
                                id={`utdanningsniva-${utdanning.key.toLowerCase()}-checkbox`}
                                label={utdanning.label}
                                key={utdanning.key}
                                value={utdanning.key}
                                checked={this.props.utdanningsniva.includes(utdanning.key)}
                                onChange={this.onUtdanningsnivaChange}
                            />
                        ))}
                    </div>
                </SkjemaGruppe>
                {this.props.visManglendeArbeidserfaringBoks && (
                    <Checkbox
                        label="Arbeidserfaring kan veie opp for manglende utdanning"
                        className="checkbox--manglende--arbeidserfaring"
                    />
                )}
                {/* TODO: Kommenter inn når søk på geografi blir tatt med igjen */}
                {/* <Element className="sokekriterier--margin-top-extra-large">Hvilken utdanning eller fagområde skal kandidaten ha?</Element>
                <Normaltekst>
                    For eksempel: pedagogikk, reiseliv, økonomi, skogbruk
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadUtdanningSelect}
                                onChange={this.onTypeAheadUtdanningChange}
                                label=""
                                name="utdanning"
                                placeholder="Skriv inn utdanning/fagområde"
                                suggestions={this.props.typeAheadSuggestionsUtdanning}
                                value={this.state.typeAheadValue}
                                id="yrke"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-fagfelt-knapp"
                                mini
                            >
                                +Legg til utdanning/fagområde
                            </Knapp>
                        )}
                    </div>
                    {this.props.utdanninger.map((utdanning) => (
                        <button
                            onClick={this.onFjernClick}
                            className="etikett--sokekriterier kryssicon--sokekriterier"
                            key={utdanning}
                            value={utdanning}
                        >
                            {utdanning}
                        </button>
                    ))}{this.props.visIngenUtdanning && (
                        <div className="Checkbox--ingen-utdanning">
                            <Checkbox
                                id={'utdanningsniva-ingen-utdanning-checkbox'}
                                className={this.props.utdanningsniva.includes('Ingen') ?
                                    'checkbox--checked' :
                                    'checkbox--unchecked'}
                                label="Jeg ønsker treff på kandidater som ikke har utdanning"
                                key="Ingen"
                                value="Ingen"
                                checked={this.props.utdanningsniva.includes('Ingen')}
                                onChange={this.onUtdanningsnivaChange}
                            />
                        </div>
                    )}
                </div> */}
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.UTDANNING && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </SokekriteriePanel>
        );
    }
}

UtdanningSearch.defaultProps = {
    visManglendeArbeidserfaringBoks: false
};

UtdanningSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeUtdanning: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    checkUtdanningsniva: PropTypes.func.isRequired,
    uncheckUtdanningsniva: PropTypes.func.isRequired,
    utdanningsniva: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadUtdanning: PropTypes.func.isRequired,
    visManglendeArbeidserfaringBoks: PropTypes.bool,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulUtdanning: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired
    // TODO: Kommenter inn når søk på geografi blir tatt inn igjen
    // utdanninger: PropTypes.arrayOf(PropTypes.string).isRequired,
    // typeAheadSuggestionsUtdanning: PropTypes.arrayOf(PropTypes.string).isRequired,
    // visIngenUtdanning: PropTypes.bool.isRequired
};

export default UtdanningSearch;
