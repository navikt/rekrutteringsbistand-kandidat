import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../../common/typeahead/typeaheadReducer';
import {
    SELECT_TYPE_AHEAD_VALUE_SPRAK,
    REMOVE_SELECTED_SPRAK,
    TOGGLE_SPRAK_PANEL_OPEN,
} from './sprakReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Element } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Merkelapp } from 'pam-frontend-merkelapper';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import { KandidatsøkActionType } from '../../reducer/searchActions';

const SprakSearch = ({ ...props }) => {
    const {
        search,
        removeSprak,
        fetchTypeAheadSuggestions,
        selectTypeAheadValue,
        clearTypeAheadSprak,
        sprak,
        typeAheadSuggestionsSprak,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        togglePanelOpen,
    } = props;

    const [typeAheadValue, setTypeAheadValue] = useState('');
    const typeAhead = useRef(null);

    const onTypeAheadSprakChange = (value) => {
        fetchTypeAheadSuggestions(value);
        setTypeAheadValue(value);
    };

    const onTypeAheadSprakSelect = (value) => {
        if (value !== '') {
            const sprak = typeAheadSuggestionsSprak.find(
                (s) => s.toLowerCase() === value.toLowerCase()
            );
            if (sprak !== undefined) {
                selectTypeAheadValue(sprak);
                clearTypeAheadSprak();
                setTypeAheadValue('');
                search();
            }
        }
    };

    const onFjernClick = (sprak) => {
        removeSprak(sprak);
        search();
    };

    const onTypeAheadBlur = () => {
        setTypeAheadValue('');
        clearTypeAheadSprak();
    };

    const onSubmit = (e) => {
        e.preventDefault();
        onTypeAheadSprakSelect(typeAheadValue);
        typeAhead.current?.input.focus();
    };

    return (
        <SokekriteriePanel
            id="Spraak__SokekriteriePanel"
            fane="språk"
            tittel="Språk"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Element>Krav til språk i jobbsituasjonen</Element>
            <div className="sokekriterier--kriterier">
                <Typeahead
                    ref={(typeAheadRef) => {
                        typeAhead.current = typeAheadRef;
                    }}
                    onSelect={onTypeAheadSprakSelect}
                    onChange={onTypeAheadSprakChange}
                    label=""
                    name="utdanning"
                    placeholder="Skriv inn språk"
                    suggestions={typeAheadSuggestionsSprak}
                    value={typeAheadValue}
                    id="yrke"
                    onSubmit={onSubmit}
                    onTypeAheadBlur={onTypeAheadBlur}
                />
                <div className="Merkelapp__wrapper">
                    {sprak.map((sprak) => (
                        <Merkelapp onRemove={onFjernClick} key={sprak} value={sprak}>
                            {sprak}
                        </Merkelapp>
                    ))}
                </div>
            </div>
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.SPRAK && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

SprakSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeSprak: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadSprak: PropTypes.func.isRequired,
    sprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsSprak: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    sprak: state.søkefilter.sprakReducer.sprak,
    typeAheadSuggestionsSprak: state.søkefilter.typeahead.sprak.suggestions,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.sprakReducer.sprakPanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: KandidatsøkActionType.Search, alertType: ALERTTYPE.SPRAK }),
    clearTypeAheadSprak: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.SPRAK }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.SPRAK, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SPRAK, value }),
    removeSprak: (value) => dispatch({ type: REMOVE_SELECTED_SPRAK, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_SPRAK_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SprakSearch);
