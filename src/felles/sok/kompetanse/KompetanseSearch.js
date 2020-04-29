import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper';
import { Merkelapp } from 'pam-frontend-merkelapper';
import SokekriteriePanel from '../../common/sokekriteriePanel/SokekriteriePanel';
import Typeahead from '../../../veileder/sok/typeahead/Typeahead';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';
import './Kompetanse.less';
import LeggtilKnapp from '../../common/leggtilKnapp/LeggtilKnapp';

class KompetanseSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAheadKompetanse: false,
            typeAheadValueKompetanse: '',
            antallKompetanser: 4,
        };
    }

    onTypeAheadKompetanseChange = (value) => {
        this.props.fetchTypeAheadSuggestionsKompetanse(value);
        this.setState({
            typeAheadValueKompetanse: value,
        });
    };

    onTypeAheadKompetanseSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValueKompetanse(value);
            this.props.clearTypeAheadKompetanse();
            this.setState({
                typeAheadValueKompetanse: '',
            });
            this.props.search();
        }
    };

    onLeggTilKompetanseClick = () => {
        this.setState(
            {
                showTypeAheadKompetanse: true,
            },
            () => this.typeAhead.input.focus()
        );
    };

    onFjernKompetanseClick = (kompetanse) => {
        this.props.removeKompetanse(kompetanse);
        this.props.search();
    };

    onSubmitKompetanse = (e) => {
        e.preventDefault();
        this.onTypeAheadKompetanseSelect(this.state.typeAheadValueKompetanse);
        this.typeAhead.input.focus();
    };

    onKompetanseSuggestionsClick = (kompetanse) => () => {
        this.props.selectTypeAheadValueKompetanse(kompetanse);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValueKompetanse: '',
            showTypeAheadKompetanse: false,
        });
        this.props.clearTypeAheadKompetanse();
    };

    onLeggTilFlereClick = () => {
        this.setState({
            antallKompetanser: this.state.antallKompetanser + 4,
        });
    };

    render() {
        if (this.props.skjulKompetanse) {
            return null;
        }
        const kompetanseSuggestions = this.props.kompetanseSuggestions.filter(
            (k) => !this.props.kompetanser.includes(k.feltnavn)
        );
        return (
            <SokekriteriePanel
                id="Kompetanse__SokekriteriePanel"
                tittel="Kompetanse"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>Krav til kompetanse</Element>
                <Normaltekst>{this.props.kompetanseExamples}</Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
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
                                allowOnlyTypeaheadSuggestions={
                                    this.props.allowOnlyTypeaheadSuggestions
                                }
                                selectedSuggestions={this.props.kompetanser}
                            />
                        ) : (
                            <LeggtilKnapp
                                onClick={this.onLeggTilKompetanseClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-kompetanse-knapp"
                                mini
                            >
                                +Legg til kompetanse
                            </LeggtilKnapp>
                        )}
                    </div>
                    <div className="Merkelapp__wrapper">
                        {this.props.kompetanser.map((kompetanse) => (
                            <Merkelapp
                                onRemove={this.onFjernKompetanseClick}
                                key={kompetanse}
                                value={kompetanse}
                            >
                                {kompetanse}
                            </Merkelapp>
                        ))}
                    </div>
                </div>
                {kompetanseSuggestions.length > 0 && (
                    <div className="KompetanseSearch__suggestions">
                        <div className="blokk-s border--bottom--thin" />
                        <Element>
                            Forslag til kompetanse knyttet til valgt stilling. Klikk for å legge til
                        </Element>
                        <div className="Kompetanseforslag__wrapper">
                            {kompetanseSuggestions
                                .slice(0, this.state.antallKompetanser)
                                .map((suggestedKompetanse) => (
                                    <button
                                        onClick={this.onKompetanseSuggestionsClick(
                                            suggestedKompetanse.feltnavn
                                        )}
                                        className="KompetanseSearch__etikett"
                                        key={suggestedKompetanse.feltnavn}
                                    >
                                        <div className="KompetanseSearch__etikett__text">
                                            {suggestedKompetanse.feltnavn}
                                        </div>
                                        <i className="KompetanseSearch__etikett__icon" />
                                    </button>
                                ))}
                            {this.state.antallKompetanser < kompetanseSuggestions.length && (
                                <Knapp
                                    onClick={this.onLeggTilFlereClick}
                                    className="se-flere-forslag"
                                    mini
                                >
                                    {`Se flere (${
                                        kompetanseSuggestions.length - this.state.antallKompetanser
                                    })`}
                                </Knapp>
                            )}
                        </div>
                    </div>
                )}
                {this.props.totaltAntallTreff <= 10 &&
                    this.props.visAlertFaKandidater === ALERTTYPE.KOMPETANSE && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
            </SokekriteriePanel>
        );
    }
}

KompetanseSearch.defaultProps = {
    kompetanseExamples: 'For eksempel: fagbrev, kurs, sertifisering, ferdigheter, programmer',
    allowOnlyTypeaheadSuggestions: false,
};

KompetanseSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeKompetanse: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsKompetanse: PropTypes.func.isRequired,
    selectTypeAheadValueKompetanse: PropTypes.func.isRequired,
    kompetanser: PropTypes.arrayOf(PropTypes.string).isRequired,
    kompetanseSuggestions: PropTypes.arrayOf(
        PropTypes.shape({
            feltnavn: PropTypes.string,
            antall: PropTypes.number,
            subfelt: PropTypes.array,
        })
    ).isRequired,
    typeAheadSuggestionsKompetanse: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadKompetanse: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulKompetanse: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    kompetanseExamples: PropTypes.string,
    allowOnlyTypeaheadSuggestions: PropTypes.bool,
};

export default KompetanseSearch;
