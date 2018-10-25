import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import Typeahead from '../../common/typeahead/Typeahead';
import {
    SEARCH
} from '../searchReducer';
import { CLEAR_TYPE_AHEAD_SUGGESTIONS, FETCH_TYPE_AHEAD_SUGGESTIONS } from '../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_KOMPETANSE,
    SELECT_TYPE_AHEAD_VALUE_KOMPETANSE,
    TOGGLE_KOMPETANSE_PANEL_OPEN
} from './kompetanseReducer';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE, BRANCHNAVN } from '../../konstanter';
import './Kompetanse.less';


const kompetanseHeading = (
    <div className="heading--kompetanse ekspanderbartPanel__heading">
        <Undertittel>Kompetanse</Undertittel>
        <Normaltekst>Sertifikater, kurs, sertifisering, programmer og ferdigheter</Normaltekst>
    </div>
);

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
            this.props.clearTypeAheadKompetanse();
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
        this.props.clearTypeAheadKompetanse();
    };

    onLeggTilFlereClick = () => {
        this.setState({
            antallKompetanser: this.state.antallKompetanser + 4
        });
    };

    render() {
        if (this.props.skjulKompetanse) {
            return null;
        }
        const kompetanseSuggestions = this.props.kompetanseSuggestions.filter((k) => !this.props.kompetanser.includes(k.feltnavn));
        return (
            <EkspanderbartpanelBase
                heading={kompetanseHeading}
                className="panel--sokekriterier"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
                ariaTittel="Panel Kompetanse"
            >
                <Element>
                    Legg til kompetansen du ønsker at en kandidat skal ha
                </Element>
                <Normaltekst className="text--italic">
                    For eksempel fagbrev, ledelse eller Excel
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
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-kompetanse-knapp"
                                mini
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
                                    className="se-flere-forslag"
                                    mini
                                >
                                    {`Se flere (${kompetanseSuggestions.length - this.state.antallKompetanser})`}
                                </Knapp>
                            )}
                        </div>
                    </div>
                )}
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.KOMPETANSE && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </EkspanderbartpanelBase>
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
    clearTypeAheadKompetanse: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulKompetanse: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    kompetanser: state.kompetanse.kompetanser,
    kompetanseSuggestions: state.search.searchResultat.kompetanseSuggestions,
    typeAheadSuggestionsKompetanse: state.typeahead.kompetanse.suggestions,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    skjulKompetanse: state.search.featureToggles['skjul-kompetanse'],
    panelOpen: state.kompetanse.kompetansePanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.KOMPETANSE }),
    clearTypeAheadKompetanse: () => dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.KOMPETANSE }),
    fetchTypeAheadSuggestionsKompetanse: (value) => dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.KOMPETANSE, value }),
    selectTypeAheadValueKompetanse: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_KOMPETANSE, value }),
    removeKompetanse: (value) => dispatch({ type: REMOVE_SELECTED_KOMPETANSE, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_KOMPETANSE_PANEL_OPEN })
});

export default connect(mapStateToProps, mapDispatchToProps)(KompetanseSearch);
