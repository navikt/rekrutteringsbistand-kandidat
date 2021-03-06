import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    REMOVE_SELECTED_NAVKONTOR,
    SELECT_TYPE_AHEAD_VALUE_NAVKONTOR,
    TOGGLE_MINEKANDIDATER,
    TOGGLE_NAVKONTOR_PANEL_OPEN,
} from './navkontorReducer';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Element } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Merkelapp } from 'pam-frontend-merkelapper';
import { Checkbox } from 'nav-frontend-skjema';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import './Navkontor.less';
import { KandidatsøkActionType } from '../../reducer/searchActions';
import { TypeaheadActionType, TypeaheadBranch } from '../../../common/typeahead/typeaheadReducer';
import { KandidatsøkAlert } from '../../reducer/searchReducer';

const NavkontorSearch = ({ ...props }) => {
    const {
        search,
        removeNavkontor,
        fetchTypeAheadSuggestions,
        selectTypeAheadValue,
        clearTypeAheadNavkontor,
        navkontor,
        typeAheadSuggestionsNavkontor,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        togglePanelOpen,
        toggleMinekandidater,
        minekandidater,
    } = props;

    const [typeAheadValue, setTypeAheadValue] = useState('');
    const typeAhead = useRef(null);

    const onTypeAheadNavkontorChange = (value) => {
        fetchTypeAheadSuggestions(value);
        setTypeAheadValue(value);
    };

    const onTypeAheadNavkontorSelect = (value) => {
        if (value !== '') {
            const navkontor = typeAheadSuggestionsNavkontor.find(
                (n) => n.toLowerCase() === value.toLowerCase()
            );
            if (navkontor !== undefined) {
                selectTypeAheadValue(navkontor);
                clearTypeAheadNavkontor();
                setTypeAheadValue('');
                search();
            }
        }
    };

    const onTypeAheadBlur = () => {
        setTypeAheadValue('');
        clearTypeAheadNavkontor();
    };

    const onRemoveClick = (navkontor) => {
        removeNavkontor(navkontor);
        search();
    };

    const onSubmit = (e) => {
        e.preventDefault();
        onTypeAheadNavkontorSelect(typeAheadValue);
        typeAhead.current?.input.focus();
    };

    const onToggleMineKandidater = () => {
        toggleMinekandidater();
        search();
    };

    return (
        <SokekriteriePanel
            id="NavKontor__SokekriteriePanel"
            fane="nav-kontor"
            tittel="NAV-kontor"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Element>Brukers NAV-kontor</Element>
            <div className="sokekriterier--kriterier">
                <Typeahead
                    ref={(typeAheadRef) => {
                        typeAhead.current = typeAheadRef;
                    }}
                    onSelect={onTypeAheadNavkontorSelect}
                    onChange={onTypeAheadNavkontorChange}
                    label=""
                    name="navkontor"
                    placeholder="Skriv inn NAV-kontor"
                    suggestions={typeAheadSuggestionsNavkontor}
                    value={typeAheadValue}
                    id="navkontor"
                    onSubmit={onSubmit}
                    onTypeAheadBlur={onTypeAheadBlur}
                />
                <div className="Merkelapp__wrapper">
                    {navkontor.map((nk) => (
                        <Merkelapp onRemove={onRemoveClick} key={nk} value={nk}>
                            {nk}
                        </Merkelapp>
                    ))}
                </div>
                <Checkbox
                    className="checkbox--minekandidater"
                    id="minekandidater-checkbox"
                    label="Vis bare mine brukere"
                    key="minekandidater"
                    value={minekandidater}
                    checked={minekandidater}
                    onChange={onToggleMineKandidater}
                />
            </div>
            {totaltAntallTreff <= 10 && visAlertFaKandidater === KandidatsøkAlert.Navkontor && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

NavkontorSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeNavkontor: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    clearTypeAheadNavkontor: PropTypes.func.isRequired,
    typeAheadSuggestionsNavkontor: PropTypes.arrayOf(PropTypes.string).isRequired,
    navkontor: PropTypes.arrayOf(PropTypes.string).isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    minekandidater: PropTypes.bool.isRequired,
    toggleMinekandidater: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    navkontor: state.søkefilter.navkontor.navkontor,
    typeAheadSuggestionsNavkontor: state.søkefilter.typeahead.navkontor.suggestions,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.navkontor.navkontorPanelOpen,
    minekandidater: state.søkefilter.navkontor.minekandidater,
});

const mapDispatchToProps = (dispatch) => ({
    search: () =>
        dispatch({ type: KandidatsøkActionType.Search, alertType: KandidatsøkAlert.Navkontor }),
    clearTypeAheadNavkontor: () =>
        dispatch({
            type: TypeaheadActionType.ClearTypeAheadSuggestions,
            branch: TypeaheadBranch.Navkontor,
        }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({
            type: TypeaheadActionType.FetchTypeAheadSuggestions,
            branch: TypeaheadBranch.Navkontor,
            value,
        }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_NAVKONTOR, value }),
    removeNavkontor: (value) => dispatch({ type: REMOVE_SELECTED_NAVKONTOR, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_NAVKONTOR_PANEL_OPEN }),
    toggleMinekandidater: () => dispatch({ type: TOGGLE_MINEKANDIDATER }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavkontorSearch);
