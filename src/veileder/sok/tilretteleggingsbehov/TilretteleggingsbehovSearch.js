import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'nav-frontend-skjema';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { SEARCH } from '../searchReducer';
import {
    TOGGLE_TILRETTELEGGINGSBEHOV,
    TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN
} from './tilretteleggingsbehovReducer';
import Infoikon from '../../../felles/common/ikoner/Infoikon';
import './Tilretteleggingsbehov.less';

class TilretteleggingsbehovSearch extends React.Component {
    onTilretteleggingsbehovChange = (e) => {
        this.props.toggleTilretteleggingsbehov(e.target.checked);
        this.props.search();
    };

    render() {
        const { togglePanelOpen, panelOpen, harTilretteleggingsbehov } = this.props;

        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Tilretteleggingsbehov"
                tittelProps="undertittel"
                onClick={togglePanelOpen}
                apen={panelOpen}
            >
                <Checkbox
                    className="skjemaelement--pink"
                    id="tilretteleggingsbehov-checkbox"
                    label="Vis kandidater med tilretteleggingsbehov"
                    key="HAR_TILRETTELEGGINGSBEHOV"
                    value="HAR_TILRETTELEGGINGSBEHOV"
                    checked={harTilretteleggingsbehov}
                    onChange={this.onTilretteleggingsbehovChange}
                />
                <div className="tilretteleggingsbehov__informasjon">
                    <Infoikon />
                    <Normaltekst>
                        Denne funksjonen er under testing og foreløpig kun tilgjengelig for enkelte
                        NAV-kontorer.
                    </Normaltekst>
                </div>
            </Ekspanderbartpanel>
        );
    }
}

TilretteleggingsbehovSearch.propTypes = {
    search: PropTypes.func.isRequired,
    harTilretteleggingsbehov: PropTypes.bool.isRequired,
    toggleTilretteleggingsbehov: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    harTilretteleggingsbehov: state.tilretteleggingsbehov.harTilretteleggingsbehov,
    panelOpen: state.tilretteleggingsbehov.tilretteleggingsbehovPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    toggleTilretteleggingsbehov: (harTilretteleggingsbehov) =>
        dispatch({ type: TOGGLE_TILRETTELEGGINGSBEHOV, harTilretteleggingsbehov }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TilretteleggingsbehovSearch);
