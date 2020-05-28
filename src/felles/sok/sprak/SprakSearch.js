import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';
import { Merkelapp } from 'pam-frontend-merkelapper';
import SokekriteriePanel from '../../common/sokekriteriePanel/SokekriteriePanel';
import Typeahead from '../../../veileder/sok/typeahead/Typeahead';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';
import { Knapp } from 'nav-frontend-knapper';

class SprakSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: '',
        };
    }

    onTypeAheadSprakChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value,
        });
    };

    onTypeAheadSprakSelect = (value) => {
        if (value !== '') {
            const sprak = this.props.typeAheadSuggestionsSprak.find(
                (s) => s.toLowerCase() === value.toLowerCase()
            );
            if (sprak !== undefined) {
                this.props.selectTypeAheadValue(sprak);
                this.props.clearTypeAheadSprak();
                this.setState({
                    typeAheadValue: '',
                });
                this.props.search();
            }
        }
    };

    onLeggTilClick = () => {
        this.setState(
            {
                showTypeAhead: true,
            },
            () => this.typeAhead.input.focus()
        );
    };

    onFjernClick = (sprak) => {
        this.props.removeSprak(sprak);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false,
        });
        this.props.clearTypeAheadSprak();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadSprakSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        return (
            <SokekriteriePanel
                id="Spraak__SokekriteriePanel"
                fane="språk"
                tittel="Språk"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>Krav til språk i jobbsituasjonen</Element>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadSprakSelect}
                                onChange={this.onTypeAheadSprakChange}
                                label=""
                                name="utdanning"
                                placeholder="Skriv inn språk"
                                suggestions={this.props.typeAheadSuggestionsSprak}
                                value={this.state.typeAheadValue}
                                id="yrke"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                id="leggtil-sprak-knapp"
                                kompakt
                                className="filterknapp"
                            >
                                + Legg til språk
                            </Knapp>
                        )}
                    </div>
                    <div className="Merkelapp__wrapper">
                        {this.props.sprak.map((sprak) => (
                            <Merkelapp onRemove={this.onFjernClick} key={sprak} value={sprak}>
                                {sprak}
                            </Merkelapp>
                        ))}
                    </div>
                </div>
                {this.props.totaltAntallTreff <= 10 &&
                    this.props.visAlertFaKandidater === ALERTTYPE.SPRAK && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
            </SokekriteriePanel>
        );
    }
}

SprakSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSprak: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadSprak: PropTypes.func.isRequired,
    sprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired,
};

export default SprakSearch;
