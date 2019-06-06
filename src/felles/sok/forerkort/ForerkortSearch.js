import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Merkelapp } from 'pam-frontend-merkelapper';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';
import './Forerkort.less';
import alleForerkort, { allePAMForerkort } from './forerkort';
import LeggtilKnapp from '../../common/leggtilKnapp/LeggtilKnapp';


const forerkortHeading = (
    <div className="heading--forerkort ekspanderbartPanel__heading">
        <Undertittel>Førerkort</Undertittel>
    </div>
);

const matcherLignendeTekst = (typeaheadVerdi, tekst) => {
    if (typeaheadVerdi === tekst) {
        return true;
    }
    const tV = typeaheadVerdi.includes('(') ? [...typeaheadVerdi.split('(').shift().split(/[:|;|.|,|\s]/).map((v) => v.split(''))].flatten() :
        [...typeaheadVerdi.split(/[:|;|.|,|\s]/).map((v) => v.split(''))].flatten();
    return JSON.stringify(tV) === JSON.stringify(tekst.split(/[:|;|.|,|\s]/).map((t) => t.split('')).flatten());
};

class ForerkortSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAheadForerkort: false,
            typeAheadValueForerkort: '',
            antallForerkort: 4,
            feil: false
        };
    }

    onTypeAheadForerkortChange = (value) => {
        this.props.fetchTypeAheadSuggestionsForerkort(value);
        this.setState({
            typeAheadValueForerkort: value,
            feil: false
        });
    };

    onTypeAheadForerkortSelect = (value) => {
        if (value !== '') {
            const alleForerkortListe = this.props.nyKildeForerkort ? allePAMForerkort : alleForerkort;
            const forerkort = alleForerkortListe.find((fk) => matcherLignendeTekst(fk.toLowerCase(), value.toLowerCase()));
            if (forerkort !== undefined) {
                this.props.selectTypeAheadValueForerkort(forerkort);
                this.props.clearTypeAheadForerkort();
                this.setState({
                    typeAheadValueForerkort: ''
                });
                this.props.search();
                this.setState({
                    feil: false
                });
            } else {
                this.setState({
                    feil: true
                });
            }
        }
    };

    onLeggTilForerkortClick = () => {
        this.setState({
            showTypeAheadForerkort: true
        }, () => this.typeAhead.input.focus());
    };

    onFjernForerkortClick = (forerkort) => {
        this.props.removeForerkort(forerkort);
        this.props.search();
    };

    onSubmitForerkort = (e) => {
        e.preventDefault();
        this.onTypeAheadForerkortSelect(this.state.typeAheadValueForerkort);
        this.typeAhead.input.focus();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValueForerkort: '',
            showTypeAheadForerkort: false,
            feil: false
        });
        this.props.clearTypeAheadForerkort();
    };

    render() {
        return (
            <EkspanderbartpanelBase
                heading={forerkortHeading}
                className="panel--sokekriterier"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
                ariaTittel="Panel førerkort"
            >
                <Element>Krav til førerkort</Element>
                <Normaltekst>
                    For eksempel: Førerkort: Kl. B
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAheadForerkort ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadForerkortSelect}
                                onChange={this.onTypeAheadForerkortChange}
                                label=""
                                name="forerkort"
                                placeholder="Skriv inn førerkort"
                                suggestions={this.props.typeAheadSuggestionsForerkort}
                                value={this.state.typeAheadValueForerkort}
                                id="typeahead-forerkort"
                                onSubmit={this.onSubmitForerkort}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <LeggtilKnapp
                                onClick={this.onLeggTilForerkortClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-forerkort-knapp"
                                mini
                            >
                                +Legg til førerkort
                            </LeggtilKnapp>
                        )}
                        {this.state.feil &&
                        <Normaltekst className="skjemaelement__feilmelding">
                            Ordet du har skrevet inn gir ingen treff
                        </Normaltekst>
                        }
                    </div>
                    <div className="Merkelapp__wrapper">
                        {this.props.forerkortList.map((forerkort) => (
                            <Merkelapp
                                onRemove={this.onFjernForerkortClick}
                                key={forerkort}
                                value={forerkort}
                            >
                                {forerkort}
                            </Merkelapp>
                        ))}
                    </div>
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.FORERKORT && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </EkspanderbartpanelBase>
        );
    }
}

ForerkortSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeForerkort: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsForerkort: PropTypes.func.isRequired,
    selectTypeAheadValueForerkort: PropTypes.func.isRequired,
    forerkortList: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsForerkort: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadForerkort: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    nyKildeForerkort: PropTypes.bool.isRequired
};

export default ForerkortSearch;
