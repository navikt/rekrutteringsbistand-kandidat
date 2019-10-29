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

const TilretteleggingsbehovSearch = (props) => {
    const {
        search,
        toggleTilretteleggingsbehov,
        togglePanelOpen,
        panelOpen,
        harTilretteleggingsbehov
    } = props;

    const onTilretteleggingsbehovChange = (e) => {
        toggleTilretteleggingsbehov(e.target.checked);
        search();
    };

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
                checked={harTilretteleggingsbehov}
                onChange={onTilretteleggingsbehovChange}
            />
            <div className="tilretteleggingsbehov__informasjon">
                <Infoikon />
                <Normaltekst>
                    Denne funksjonen er under testing og foreløpig kun tilgjengelig for enkelte
                    NAV-kontorer
                </Normaltekst>
            </div>
        </Ekspanderbartpanel>
    );
};

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
