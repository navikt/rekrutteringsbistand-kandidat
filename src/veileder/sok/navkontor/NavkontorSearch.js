import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ALERTTYPE, BRANCHNAVN } from '../../../felles/konstanter';
import { SEARCH } from '../searchReducer';
import {
    REMOVE_SELECTED_NAVKONTOR,
    SELECT_TYPE_AHEAD_VALUE_NAVKONTOR,
    TOGGLE_MINEKANDIDATER,
    TOGGLE_NAVKONTOR_PANEL_OPEN,
} from './navkontorReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../common/typeahead/typeaheadReducer';
import SokekriteriePanel from '../../../felles/common/sokekriteriePanel/SokekriteriePanel';
import { Element } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Knapp } from 'nav-frontend-knapper';
import { Merkelapp } from 'pam-frontend-merkelapper';
import { Checkbox } from 'nav-frontend-skjema';
import AlertStripeInfo from '../../../felles/common/AlertStripeInfo';
import './Navkontor.less';

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
        showMineKandidater,
    } = props;

    const [typeAheadValue, setTypeAheadValue] = useState('');
    const [showTypeAhead, setShowTypeAhead] = useState(false);
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
        setShowTypeAhead(false);
        clearTypeAheadNavkontor();
    };

    const onAddClick = () => {
        setShowTypeAhead(true);
        typeAhead.current?.input.focus();
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
                <div>
                    {showTypeAhead ? (
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
                    ) : (
                        <Knapp
                            onClick={onAddClick}
                            id="leggtil-navkontor-knapp"
                            kompakt
                            className="knapp-små-bokstaver"
                        >
                            + Legg til NAV-kontor
                        </Knapp>
                    )}
                </div>

                <div className="Merkelapp__wrapper">
                    {navkontor.map((nk) => (
                        <Merkelapp onRemove={onRemoveClick} key={nk} value={nk}>
                            {nk}
                        </Merkelapp>
                    ))}
                </div>
                {showMineKandidater ? (
                    <Checkbox
                        className="checkbox--minekandidater"
                        id="minekandidater-checkbox"
                        label="Vis bare mine brukere"
                        key="minekandidater"
                        value={minekandidater}
                        checked={minekandidater}
                        onChange={onToggleMineKandidater}
                    />
                ) : null}
            </div>
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.NAVKONTOR && (
                <AlertStripeInfo totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

NavkontorSearch.defaultProps = {
    showMineKandidater: false,
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
    showMineKandidater: PropTypes.bool,
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
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.NAVKONTOR }),
    clearTypeAheadNavkontor: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.NAVKONTOR }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.NAVKONTOR, value }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_NAVKONTOR, value }),
    removeNavkontor: (value) => dispatch({ type: REMOVE_SELECTED_NAVKONTOR, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_NAVKONTOR_PANEL_OPEN }),
    toggleMinekandidater: () => dispatch({ type: TOGGLE_MINEKANDIDATER }),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavkontorSearch);
