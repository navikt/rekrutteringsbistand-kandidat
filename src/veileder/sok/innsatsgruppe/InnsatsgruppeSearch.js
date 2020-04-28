import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import { SEARCH } from '../searchReducer';
import { ALERTTYPE, INNSATSGRUPPER } from '../../../felles/konstanter';
import {
    CHECK_INNSATSGRUPPE,
    UNCHECK_INNSATSGRUPPE,
    TOGGLE_INNSATSGRUPPE_PANEL_OPEN,
} from './innsatsgruppeReducer';
import './Innsatsgruppe.less';

class InnsatsgruppeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.innsatsgrupper = Object.keys(INNSATSGRUPPER).map((key) => INNSATSGRUPPER[key]);
    }

    onInnsatsgruppeChange = (e) => {
        if (e.target.checked) {
            this.props.checkInnsatsgruppe(e.target.value);
        } else {
            this.props.uncheckInnsatsgruppe(e.target.value);
        }
        this.props.search();
    };

    render() {
        const {
            togglePanelOpen,
            panelOpen,
            innsatsgrupper,
            totaltAntallTreff,
            visAlertFaKandidater,
        } = this.props;
        return (
            <SokekriteriePanel
                id="Innsatsgruppe__SokekriteriePanel"
                tittel="Innsatsgruppe"
                onClick={togglePanelOpen}
                apen={panelOpen}
            >
                <div>
                    {this.innsatsgrupper.map((innsatsgruppe) => (
                        <Checkbox
                            className="checkbox--innsatsgruppe"
                            id={`utdanningsniva-${innsatsgruppe.key.toLowerCase()}-checkbox`}
                            label={innsatsgruppe.label}
                            key={innsatsgruppe.key}
                            value={innsatsgruppe.key}
                            checked={innsatsgrupper.includes(innsatsgruppe.key)}
                            onChange={this.onInnsatsgruppeChange}
                        />
                    ))}
                </div>
                {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.INNSATSGRUPPE && (
                    <AlertStripeInfo totaltAntallTreff={totaltAntallTreff} />
                )}
            </SokekriteriePanel>
        );
    }
}

InnsatsgruppeSearch.propTypes = {
    search: PropTypes.func.isRequired,
    checkInnsatsgruppe: PropTypes.func.isRequired,
    uncheckInnsatsgruppe: PropTypes.func.isRequired,
    innsatsgrupper: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    innsatsgrupper: state.innsatsgruppe.kvalifiseringsgruppeKoder,
    totaltAntallTreff: state.search.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.search.visAlertFaKandidater,
    panelOpen: state.innsatsgruppe.innsatsgruppePanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.INNSATSGRUPPE }),
    checkInnsatsgruppe: (value) => dispatch({ type: CHECK_INNSATSGRUPPE, value }),
    uncheckInnsatsgruppe: (value) => dispatch({ type: UNCHECK_INNSATSGRUPPE, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_INNSATSGRUPPE_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(InnsatsgruppeSearch);
