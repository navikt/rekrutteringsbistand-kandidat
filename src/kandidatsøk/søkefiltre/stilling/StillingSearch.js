import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { KandidatsøkActionType } from '../../reducer/searchActions';
import {
    REMOVE_SELECTED_STILLING,
    SELECT_TYPE_AHEAD_VALUE_STILLING,
    TOGGLE_STILLING_PANEL_OPEN,
} from './stillingReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Merkelapp } from 'pam-frontend-merkelapper';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import { TypeaheadActionType } from '../../../common/typeahead/typeaheadReducer';

const StillingSearch = ({ ...props }) => {
    const {
        stillinger,
        typeAheadSuggestionsStilling,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        search,
        clearTypeAheadStilling,
        fetchTypeAheadSuggestions,
        selectTypeAheadValue,
        removeStilling,
        fetchKompetanseSuggestions,
        togglePanelOpen,
        stillingsId,
        useJanzz,
        allowOnlyTypeaheadSuggestions,
    } = props;
    const [typeAheadValue, setTypeAheadValue] = useState('');
    const typeAhead = useRef(null);

    useEffect(() => {
        fetchKompetanseSuggestions();
    }, [stillinger, fetchKompetanseSuggestions]);

    const onTypeAheadStillingChange = (value) => {
        fetchTypeAheadSuggestions(value);
        setTypeAheadValue(value);
    };

    const onTypeAheadStillingSelect = (value) => {
        if (value !== '') {
            selectTypeAheadValue(value);
            clearTypeAheadStilling();
            setTypeAheadValue('');
            search();
        }
    };

    const onFjernClick = (stilling) => {
        removeStilling(stilling);
        search();
    };

    const onTypeAheadBlur = () => {
        setTypeAheadValue('');
        clearTypeAheadStilling();
    };

    const onSubmit = (e) => {
        e.preventDefault();
        onTypeAheadStillingSelect(typeAheadValue);
        typeAhead.current?.input.focus();
    };

    return (
        <SokekriteriePanel
            id="Stilling__SokekriteriePanel"
            fane="stilling-yrke"
            tittel="Stilling/yrke"
            onClick={togglePanelOpen}
            apen={panelOpen === undefined && stillingsId ? true : panelOpen}
        >
            <Element>Hva slags kandidat trenger du?</Element>
            <Normaltekst>Søker mot kandidatenes jobbønsker</Normaltekst>
            <div className="sokekriterier--kriterier">
                {/* TODO: Fjerne feature toggle */}
                {!(useJanzz && stillinger.length > 0) && (
                    <>
                        <Typeahead
                            ref={(typeAheadRef) => {
                                typeAhead.current = typeAheadRef;
                            }}
                            onSelect={onTypeAheadStillingSelect}
                            onChange={onTypeAheadStillingChange}
                            label=""
                            name="stilling"
                            placeholder="Skriv inn stilling/yrke"
                            suggestions={typeAheadSuggestionsStilling}
                            value={typeAheadValue}
                            id="typeahead-stilling"
                            onSubmit={onSubmit}
                            onTypeAheadBlur={onTypeAheadBlur}
                            allowOnlyTypeaheadSuggestions={allowOnlyTypeaheadSuggestions}
                            selectedSuggestions={stillinger}
                        />
                    </>
                )}
                <div className="Merkelapp__wrapper">
                    {stillinger.map((stilling) => (
                        <Merkelapp onRemove={onFjernClick} key={stilling} value={stilling}>
                            {stilling}
                        </Merkelapp>
                    ))}
                </div>
            </div>

            {/* TODO: Fjerne feature toggle */}
            {useJanzz && (
                <Normaltekst className="blokk-xs">
                    Du kan kun legge til én stilling/yrke
                </Normaltekst>
            )}
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.STILLING && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

StillingSearch.defaultProps = {
    panelOpen: undefined,
    stillingsId: undefined,
    useJanzz: false,
    allowOnlyTypeaheadSuggestions: false,
};

StillingSearch.propTypes = {
    fetchKompetanseSuggestions: PropTypes.func.isRequired,
    removeStilling: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    stillinger: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsStilling: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadStilling: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool,
    togglePanelOpen: PropTypes.func.isRequired,
    stillingsId: PropTypes.string,
    useJanzz: PropTypes.bool,
    allowOnlyTypeaheadSuggestions: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    stillinger: state.søkefilter.stilling.stillinger,
    typeAheadSuggestionsStilling: state.søkefilter.typeahead.stilling.suggestions,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.stilling.stillingPanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: KandidatsøkActionType.Search, alertType: ALERTTYPE.STILLING }),
    clearTypeAheadStilling: () =>
        dispatch({
            type: TypeaheadActionType.ClearTypeAheadSuggestions,
            branch: BRANCHNAVN.STILLING,
        }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({
            type: TypeaheadActionType.FetchTypeAheadSuggestions,
            branch: BRANCHNAVN.STILLING,
            value,
        }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_STILLING, value }),
    removeStilling: (value) => dispatch({ type: REMOVE_SELECTED_STILLING, value }),
    fetchKompetanseSuggestions: () =>
        dispatch({ type: KandidatsøkActionType.FetchKompetanseSuggestions }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_STILLING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StillingSearch);
