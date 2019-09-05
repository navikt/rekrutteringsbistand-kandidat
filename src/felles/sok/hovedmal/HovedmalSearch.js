import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, SkjemaGruppe } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { ALERTTYPE } from '../../konstanter';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import './Hovedmal.less';

class HovedmalSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.hovedmal = [
            { label: 'Skaffe arbeid', value: 'SKAFFE_ARBEID' },
            { label: 'Beholde arbeid', value: 'BEHOLDE_ARBEID' },
            { label: 'Øke deltakelse', value: 'OKE_DELTAKELSE' }
        ];
    }

    onTotalHovedmalChange = (e) => {
        if (e.target.checked) {
            this.props.checkHovedmal(e.target.value);
        } else {
            this.props.uncheckHovedmal(e.target.value);
        }
        this.props.search();
    };

    renderHovedmal = () => (
        <SkjemaGruppe className="ar-med-hovedmal__header">
            <div className="sokekriterier--kriterier">
                {this.hovedmal.map((hovedmal) => (
                    <Checkbox
                        className="checkbox--hovedmal skjemaelement--pink"
                        id={`hovedmal-${hovedmal.value.toLowerCase()}-checkbox`}
                        label={hovedmal.label}
                        key={hovedmal.value}
                        value={hovedmal.value}
                        checked={this.props.totaltHovedmal.includes(hovedmal.value)}
                        onChange={this.onTotalHovedmalChange}
                    />
                ))}
            </div>
        </SkjemaGruppe>
    );

    render() {
        if (this.props.skjulHovedmal) {
            return null;
        }

        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Hovedmål"
                onClick={this.props.togglePanelOpen}
                apen={this.props.panelOpen}
            >
                {this.renderHovedmal()}
                {this.props.totaltAntallTreff <= 10 && this.props.visAlertFaKandidater === ALERTTYPE.HOVEDMAL && (
                    <AlertStripeInfo totaltAntallTreff={this.props.totaltAntallTreff} />
                )}
            </Ekspanderbartpanel>
        );
    }
}

HovedmalSearch.propTypes = {
    search: PropTypes.func.isRequired,
    checkHovedmal: PropTypes.func.isRequired,
    uncheckHovedmal: PropTypes.func.isRequired,
    totaltHovedmal: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    skjulHovedmal: PropTypes.bool.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

export default HovedmalSearch;
