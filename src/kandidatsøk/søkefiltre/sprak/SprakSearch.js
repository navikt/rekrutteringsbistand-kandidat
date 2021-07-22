import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    SELECT_TYPE_AHEAD_VALUE_SPRAK,
    REMOVE_SELECTED_SPRAK,
    TOGGLE_SPRAK_PANEL_OPEN,
} from './sprakReducer';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Element } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import { KandidatsøkActionType } from '../../reducer/searchActions';
import { TypeaheadActionType, TypeaheadBranch } from '../../../common/typeahead/typeaheadReducer';
import { KandidatsøkAlert } from '../../reducer/searchReducer';
import Merkelapp from '../../../common/merkelapp/Merkelapp';

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
            {totaltAntallTreff <= 10 && visAlertFaKandidater === KandidatsøkAlert.Språk && (
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
    search: () =>
        dispatch({ type: KandidatsøkActionType.Search, alertType: KandidatsøkAlert.Språk }),
    clearTypeAheadSprak: () =>
        dispatch({
            type: TypeaheadActionType.ClearTypeAheadSuggestions,
            branch: TypeaheadBranch.Sprak,
        }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({
            type: TypeaheadActionType.FetchTypeAheadSuggestions,
            branch: TypeaheadBranch.Sprak,
            value,
        }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_SPRAK, value }),
    removeSprak: (value) => dispatch({ type: REMOVE_SELECTED_SPRAK, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_SPRAK_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SprakSearch);
