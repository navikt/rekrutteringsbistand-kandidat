import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'pam-frontend-knapper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Merkelapp } from 'pam-frontend-merkelapper';
import Typeahead from '../../../arbeidsgiver/common/typeahead/Typeahead';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE } from '../../../felles/konstanter';
import './Geografi.less';
import CheckboxMedDisabledFunksjon from '../../common/CheckboxMedDisabledFunksjon';

class GeografiSearch extends React.Component {
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
    }

    onToggleMaBoPaGeografi = () => {
        this.props.toggleMaBoPaGeografi();
        this.props.search();
    };

    onClickedDisabledCheckbox = (event) => {
        if (this.props.onDisabledChange !== undefined) {
            this.props.onDisabledChange();
        }
        event.preventDefault();
    };

    onTypeAheadGeografiChange = (value) => {
        this.props.fetchTypeAheadSuggestions(value);
        this.setState({
            typeAheadValue: value
        });
    };

    onTypeAheadGeografiSelect = (value) => {
        if (value !== '') {
            const geografi = this.props.typeAheadSuggestionsGeografiKomplett.find((k) => k.geografiKodeTekst.toLowerCase() === value.toLowerCase());
            if (geografi !== undefined) {
                this.props.selectTypeAheadValue(geografi);
                this.props.clearTypeAheadGeografi();
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

    onFjernClick = (geografi) => {
        if (this.props.geografiListKomplett && this.props.geografiListKomplett.length === 1 && this.props.maaBoInnenforGeografi) {
            this.props.toggleMaBoPaGeografi();
        }
        this.props.removeGeografi(geografi);
        this.props.search();
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false
        });
        this.props.clearTypeAheadGeografi();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadGeografiSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        if (this.props.skjulSted) {
            return null;
        }
        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier heading--geografi"
                tittel="Fylke/kommune"
                tittelProps="undertittel"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen === undefined && this.props.stillingsId ? true : this.props.panelOpen}
            >
                <Normaltekst>
                    Vis bare kandidater som ønsker å jobbe i dette området
                </Normaltekst>
                <div className="sokekriterier--kriterier">
                    <div className="sokefelt--wrapper--geografi">
                        {this.state.showTypeAhead ? (
                            <Typeahead
                                ref={(typeAhead) => {
                                    this.typeAhead = typeAhead;
                                }}
                                onSelect={this.onTypeAheadGeografiSelect}
                                onChange={this.onTypeAheadGeografiChange}
                                label=""
                                name="geografi"
                                placeholder="Skriv inn fylke/kommune"
                                suggestions={this.props.typeAheadSuggestionsGeografi}
                                value={this.state.typeAheadValue}
                                id="typeahead-geografi"
                                onSubmit={this.onSubmit}
                                onTypeAheadBlur={this.onTypeAheadBlur}
                            />
                        ) : (
                            <Knapp
                                onClick={this.onLeggTilClick}
                                className="leggtil--sokekriterier--knapp knapp--sokekriterier"
                                id="leggtil-sted-knapp"
                                mini
                            >
                                +Legg til fylke/kommune
                            </Knapp>
                        )}
                        <CheckboxMedDisabledFunksjon
                            id="toggle-ma-bo-pa-geografi"
                            label="Vis bare kandidater som bor i området"
                            checked={this.props.maaBoInnenforGeografi}
                            value="geografiCheckbox"
                            onChange={this.onToggleMaBoPaGeografi}
                            disabled={this.props.geografiListKomplett && this.props.geografiListKomplett.length === 0}
                            onDisabledChange={(event) => this.onClickedDisabledCheckbox(event)}
                        />

                    </div>
                    {this.props.geografiListKomplett && this.props.geografiListKomplett.map((geo) => (
                        <Merkelapp
                            onRemove={this.onFjernClick}
                            key={geo.geografiKodeTekst}
                            value={geo.geografiKode}
                        >
                            {geo.geografiKodeTekst}
                        </Merkelapp>
                    ))}
                </div>
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.GEOGRAFI && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </Ekspanderbartpanel>
        );
    }
}

GeografiSearch.defaultProps = {
    panelOpen: undefined,
    onDisabledChange: undefined,
    stillingsId: undefined
};

GeografiSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeGeografi: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    geografiListKomplett: PropTypes.arrayOf(PropTypes.shape({
        geografiKodeTekst: PropTypes.string,
        geografiKode: PropTypes.string
    })).isRequired,
    typeAheadSuggestionsGeografi: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsGeografiKomplett: PropTypes.arrayOf(PropTypes.shape({
        geografiKodeTekst: PropTypes.string,
        geografiKode: PropTypes.string
    })).isRequired,
    clearTypeAheadGeografi: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulSted: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool,
    togglePanelOpen: PropTypes.func.isRequired,
    maaBoInnenforGeografi: PropTypes.bool.isRequired,
    toggleMaBoPaGeografi: PropTypes.func.isRequired,
    onDisabledChange: PropTypes.func,
    stillingsId: PropTypes.string
};

export default GeografiSearch;
