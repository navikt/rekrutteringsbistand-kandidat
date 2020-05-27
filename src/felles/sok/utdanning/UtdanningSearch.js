import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import SokekriteriePanel from '../../common/sokekriteriePanel/SokekriteriePanel';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import { ALERTTYPE, UTDANNING } from '../../konstanter';
import './Utdanning.less';

class UtdanningSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: '',
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

    onTypeAheadUtdanningSelect = (value) => {
        if (value !== '') {
            this.props.selectTypeAheadValue(value);
            this.props.clearTypeAheadUtdanning();
            this.setState({
                typeAheadValue: '',
            });
            this.props.search();
        }
    };

    onTypeAheadBlur = () => {
        this.setState({
            typeAheadValue: '',
            showTypeAhead: false,
        });
        this.props.clearTypeAheadUtdanning();
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.onTypeAheadUtdanningSelect(this.state.typeAheadValue);
        this.typeAhead.input.focus();
    };

    render() {
        return (
            <SokekriteriePanel
                id="Utdanning__SokekriteriePanel"
                fane="utdanning"
                tittel="Utdanning"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                <SkjemaGruppe title="Velg ett eller flere utdanningsnivå">
                    <div className="sokekriterier--kriterier sokekriterier--margin-top-large">
                        {this.utdanningsnivaKategorier.map((utdanning) => (
                            <Checkbox
                                className="checkbox--utdanningsniva"
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
                {this.props.totaltAntallTreff <= 10 &&
                    this.props.visAlertFaKandidater === ALERTTYPE.UTDANNING && (
                        <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                    )}
            </SokekriteriePanel>
        );
    }
}

UtdanningSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeUtdanning: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    checkUtdanningsniva: PropTypes.func.isRequired,
    uncheckUtdanningsniva: PropTypes.func.isRequired,
    utdanningsniva: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadUtdanning: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired,
};

export default UtdanningSearch;
