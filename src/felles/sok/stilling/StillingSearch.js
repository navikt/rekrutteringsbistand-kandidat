import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper';
import { Merkelapp } from 'pam-frontend-merkelapper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';

export default class StillingSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
    }

    componentDidMount() {
        if (this.props.panelOpen === undefined && this.props.stillingsId) {
            this.props.togglePanelOpen();
        }
        this.props.fetchKompetanseSuggestions();
    }

    onTypeAheadStillingChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadStillingSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadStilling();
            this.setState({
                typeAheadValue: ''
            });
            this.props.fetchKompetanseSuggestions();
            this.props.search();
        }
    };

    onLeggTilClick = () => {
        this.setState({
            showTypeAhead: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernClick = (stilling) => {
        this.props.removeStilling(stilling);
        this.props.fetchKompetanseSuggestions();
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadStilling();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadStillingSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulYrke) {
            return null;
        }
        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Stilling/yrke"
                tittelProps="undertittel"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen === undefined && this.props.stillingsId ? true : this.props.panelOpen}
            >
                <Element>
                    Hva slags kandidat trenger du?
                </Element>
                <Normaltekst>
                    For eksempel: pedagogisk leder
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    {/* TODO: Fjerne feature toggle */}
                    {!(this.props.useJanzz && this.props.stillinger.length > 0) &&
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadStillingSelect}
                                onChange={this.onTypeAheadStillingChange}
                                label=""
                                name="stilling"
                                placeholder="Skriv inn stilling/yrke"
                                suggestions={this.props.typeAheadSuggestionsStilling}
                                value={this.state.typeAheadValue}
                                id="typeahead-stilling"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-stilling-knapp"
                                mini
                            >
                                +Legg til stilling/yrke
                            </Knapp>
                        )}

                    </div>
                    }
                    {this.props.stillinger.map((stilling) => (
                        <Merkelapp
                            onRemove={this.onFjernClick}
                            key={stilling}
                            value={stilling}
                        >
                            {stilling}
                        </Merkelapp>
                    ))}
                </div>

                {/* TODO: Fjerne feature toggle */}
                { this.props.useJanzz &&
                <Normaltekst className="blokk-xs">Du kan kun legge til én stilling/yrke</Normaltekst>
                }
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.STILLING && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </Ekspanderbartpanel>
        );
    }
}

StillingSearch.defaultProps = {
    panelOpen: undefined,
    stillingsId: undefined,
    useJanzz: false
};

StillingSearch.propTypes = {
    fetchKompetanseSuggestions: PropTypes.func.isRequired,
    removeStilling: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    stillinger: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsStilling: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadStilling: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulYrke: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool,
    togglePanelOpen: PropTypes.func.isRequired,
    stillingsId: PropTypes.string,
    useJanzz: PropTypes.bool
};
