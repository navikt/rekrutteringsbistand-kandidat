import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { ALERTTYPE } from '../../konstanter';
import AlertStripeInfo from '../../common/AlertStripeInfo';
import './Hovedmal.less';

const HovedmalEnum = {
    SKAFFE_ARBEID: 'SKAFFEA',
    BEHOLDE_ARBEID: 'BEHOLDEA',
    OKE_DELTAKELSE: 'OKEDELT'
};

class HovedmalSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTypeAhead: false,
            typeAheadValue: ''
        };
        this.hovedmal = [
            { label: 'Skaffe arbeid', value: HovedmalEnum.SKAFFE_ARBEID },
            { label: 'Beholde arbeid', value: HovedmalEnum.BEHOLDE_ARBEID },
            { label: 'Øke deltakelse', value: HovedmalEnum.OKE_DELTAKELSE }
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

    render() {
        const { skjulHovedmal, togglePanelOpen, panelOpen, totaltHovedmal, totaltAntallTreff, visAlertFaKandidater } = this.props;
        if (skjulHovedmal) {
            return null;
        }

        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Hovedmål"
                onClick={togglePanelOpen}
                apen={panelOpen}
            >
                <div>
                    {this.hovedmal.map((h) => (
                        <Checkbox
                            className="checkbox--hovedmal skjemaelement--pink"
                            id={`hovedmal-${h.value.toLowerCase()}-checkbox`}
                            label={h.label}
                            key={h.value}
                            value={h.value}
                            checked={totaltHovedmal.includes(h.value)}
                            onChange={this.onTotalHovedmalChange}
                        />
                    ))}
                </div>
                { totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.HOVEDMAL && (
                    <AlertStripeInfo totaltAntallTreff={totaltAntallTreff} />
                ) }
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
