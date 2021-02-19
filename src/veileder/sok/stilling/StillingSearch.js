import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FETCH_KOMPETANSE_SUGGESTIONS, SEARCH } from '../searchReducer';
import {
    REMOVE_SELECTED_STILLING,
    SELECT_TYPE_AHEAD_VALUE_STILLING,
    TOGGLE_STILLING_PANEL_OPEN,
} from './stillingReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Knapp } from 'nav-frontend-knapper';
import { Merkelapp } from 'pam-frontend-merkelapper';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';

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

    const [showTypeAhead, setShowTypeAhead] = useState(false);
    const [typeAheadValue, setTypeAheadValue] = useState('');
    const typeAhead = useRef(null);

    const onTypeAheadStillingChange = (value) => {
        fetchTypeAheadSuggestions(value);
        setTypeAheadValue(value);
    };

    const onTypeAheadStillingSelect = (value) => {
        if (value !== '') {
            selectTypeAheadValue(value);
            clearTypeAheadStilling();
            setTypeAheadValue('');
            fetchKompetanseSuggestions();
            search();
        }
    };

    const onLeggTilClick = () => {
        setShowTypeAhead(true);
        typeAhead.current?.input.focus();
    };

    const onFjernClick = (stilling) => {
        removeStilling(stilling);
        fetchKompetanseSuggestions();
        search();
    };

    const onTypeAheadBlur = () => {
        setTypeAheadValue('');
        setShowTypeAhead(false);
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
            <Normaltekst>For eksempel: pedagogisk leder</Normaltekst>
            <div className="sokekriterier--kriterier">
                {/* TODO: Fjerne feature toggle */}
                {!(useJanzz && stillinger.length > 0) && (
                    <div>
                        {showTypeAhead ? (
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
                        ) : (
                            <Knapp
                                onClick={onLeggTilClick}
                                id="leggtil-stilling-knapp"
                                className="knapp-små-bokstaver"
                                kompakt
                            >
                                + Legg til stilling/yrke
                            </Knapp>
                        )}
                    </div>
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
                <AlertStripeInfo totaltAntallTreff={totaltAntallTreff} />
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
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.STILLING }),
    clearTypeAheadStilling: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.STILLING }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.STILLING, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_STILLING, value }),
    removeStilling: (value) => dispatch({ type: REMOVE_SELECTED_STILLING, value }),
    fetchKompetanseSuggestions: () => dispatch({ type: FETCH_KOMPETANSE_SUGGESTIONS }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_STILLING_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StillingSearch);
