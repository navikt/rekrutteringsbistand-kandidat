import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    REMOVE_SELECTED_FORERKORT,
    SELECT_TYPE_AHEAD_VALUE_FORERKORT,
    TOGGLE_FORERKORT_PANEL_OPEN,
} from './forerkortReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Merkelapp } from 'pam-frontend-merkelapper';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import { erGyldigForerkort } from './forerkort';
import './Forerkort.less';
import { KandidatsøkActionType } from '../../reducer/searchActions';
import { TypeaheadActionType } from '../../../common/typeahead/typeaheadReducer';

const ForerkortSearch = ({ ...props }) => {
    const {
        search,
        removeForerkort,
        fetchTypeAheadSuggestionsForerkort,
        selectTypeAheadValueForerkort,
        forerkortList,
        typeAheadSuggestionsForerkort,
        clearTypeAheadForerkort,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        togglePanelOpen,
    } = props;

    const [typeaheadValue, setTypeaheadValue] = useState('');
    const [feil, setFeil] = useState(false);
    const typeahead = useRef(null);

    const onTypeAheadForerkortChange = (value) => {
        fetchTypeAheadSuggestionsForerkort(value);
        setTypeaheadValue(value);
        setFeil(false);
    };

    const onTypeAheadForerkortSelect = (value) => {
        if (erGyldigForerkort(value)) {
            selectTypeAheadValueForerkort(value);
            clearTypeAheadForerkort();
            setTypeaheadValue('');
            search();
            setFeil(false);
        } else {
            setFeil(true);
        }
    };

    const onFjernForerkortClick = (forerkort) => {
        removeForerkort(forerkort);
        search();
    };

    const onSubmitForerkort = (e) => {
        e.preventDefault();
        onTypeAheadForerkortSelect(typeaheadValue);
        typeahead.current?.input.focus();
    };

    const onTypeAheadBlur = () => {
        setTypeaheadValue('');
        setFeil(false);
        clearTypeAheadForerkort();
    };

    return (
        <SokekriteriePanel
            id="Forerkort__SokekriteriePanel"
            fane="førerkort"
            tittel="Førerkort"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Element>Krav til førerkort</Element>
            <Normaltekst>For eksempel: B - Personbil</Normaltekst>
            <div className="sokekriterier--kriterier">
                <>
                    <Typeahead
                        ref={(typeAheadRef) => {
                            typeahead.current = typeAheadRef;
                        }}
                        onSelect={onTypeAheadForerkortSelect}
                        onChange={onTypeAheadForerkortChange}
                        label=""
                        name="forerkort"
                        placeholder="Skriv inn førerkort"
                        suggestions={typeAheadSuggestionsForerkort}
                        value={typeaheadValue}
                        id="typeahead-forerkort"
                        onSubmit={onSubmitForerkort}
                        onTypeAheadBlur={onTypeAheadBlur}
                    />
                    {feil && (
                        <Normaltekst className="skjemaelement__feilmelding">
                            Ordet du har skrevet inn gir ingen treff
                        </Normaltekst>
                    )}
                </>
                <div className="Merkelapp__wrapper">
                    {forerkortList.map((forerkort) => (
                        <Merkelapp
                            onRemove={onFjernForerkortClick}
                            key={forerkort}
                            value={forerkort}
                        >
                            {forerkort}
                        </Merkelapp>
                    ))}
                </div>
            </div>
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.FORERKORT && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

export const førerkortProptypes = {
    search: PropTypes.func.isRequired,
    removeForerkort: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsForerkort: PropTypes.func.isRequired,
    selectTypeAheadValueForerkort: PropTypes.func.isRequired,
    forerkortList: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsForerkort: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadForerkort: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired,
};

ForerkortSearch.propTypes = førerkortProptypes;

const mapStateToProps = (state) => ({
    forerkortList: state.søkefilter.forerkort.forerkortList,
    typeAheadSuggestionsForerkort: state.søkefilter.typeahead.forerkort.suggestions,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.forerkort.forerkortPanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: KandidatsøkActionType.Search, alertType: ALERTTYPE.FORERKORT }),
    clearTypeAheadForerkort: () =>
        dispatch({
            type: TypeaheadActionType.ClearTypeAheadSuggestions,
            branch: BRANCHNAVN.FORERKORT,
        }),
    fetchTypeAheadSuggestionsForerkort: (value) =>
        dispatch({
            type: TypeaheadActionType.FetchTypeAheadSuggestions,
            branch: BRANCHNAVN.FORERKORT,
            value,
        }),
    selectTypeAheadValueForerkort: (value) =>
        dispatch({ type: SELECT_TYPE_AHEAD_VALUE_FORERKORT, value }),
    removeForerkort: (value) => dispatch({ type: REMOVE_SELECTED_FORERKORT, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_FORERKORT_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForerkortSearch);
