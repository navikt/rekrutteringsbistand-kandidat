import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Merkelapp } from 'pam-frontend-merkelapper';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';
import LeggtilKnapp from '../../common/leggtilKnapp/LeggtilKnapp';
import SokekriteriePanel from '../../common/sokekriteriePanel/SokekriteriePanel';

class SertifikatSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: '',
        };
    }

    onTypeAheadSertifikatChange = value => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value,
        });
    };

    onTypeAheadSertifikatSelect = value => {
        if (value !== '') {
            const sertifikat = this.props.typeAheadSuggestionsSertifikat.find(
                s => s.toLowerCase() === value.toLowerCase()
            );
            if (sertifikat !== undefined) {
                this.props.selectTypeAheadValue(sertifikat);
                this.props.clearTypeAheadSertifikat();
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

    onFjernClick = sertifikat => {
        this.props.removeSertifikat(sertifikat);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false,
        });
        this.props.clearTypeAheadSertifikat();
    };

    onSubmit = e => {
        e.preventDefault();
        this.onTypeAheadSertifikatSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulSertifikat) {
            return null;
        }
        return (
            <SokekriteriePanel
                id="Sertifisering__SokekriteriePanel"
                tittel="Sertifisering"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <Element>Krav til sertifisering/sertifikat i jobbsituasjonen</Element>
                <Normaltekst>For eksempel: Truckførerbevis T1</Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div>
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={typeAhead => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadSertifikatSelect}
                                onChange={this.onTypeAheadSertifikatChange}
                                label=""
                                name="utdanning"
                                placeholder="Skriv inn sertifikat"
                                suggestions={this.props.typeAheadSuggestionsSertifikat}
                                value={this.state.typeAheadValue}
                                id="yrke"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <LeggtilKnapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-sertifikat-knapp"
                                mini
                            >
                                +Legg til sertifikat
                            </LeggtilKnapp>
                        )}
                    </div>
                    {this.props.sertifikat.map(sertifikat => (
                        <Merkelapp onRemove={this.onFjernClick} key={sertifikat} value={sertifikat}>
                            {sertifikat}
                        </Merkelapp>
                    ))}
                </div>
                {this.props.totaltAntallTreff <= 10 &&
                    this.props.visAlertFaKandidater === ALERTTYPE.SERTIFIKAT && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
            </SokekriteriePanel>
        );
    }
}

SertifikatSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSertifikat: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadSertifikat: PropTypes.func.isRequired,
    sertifikat: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSertifikat: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulSertifikat: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
};

export default SertifikatSearch;
