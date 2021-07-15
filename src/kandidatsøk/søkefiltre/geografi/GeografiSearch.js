import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    REMOVE_SELECTED_GEOGRAFI,
    SELECT_TYPE_AHEAD_VALUE_GEOGRAFI,
    TOGGLE_GEOGRAFI_PANEL_OPEN,
    TOGGLE_MA_BO_INNENFOR_GEOGRAFI,
} from './geografiReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Normaltekst } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Merkelapp } from 'pam-frontend-merkelapper';
import CheckboxMedHjelpetekst from './checkboxMedHjelpetekst/CheckboxMedHjelpetekst';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import { KandidatsøkActionType } from '../../reducer/searchActions';
import './Geografi.less';
import { TypeaheadActionType } from '../../../common/typeahead/typeaheadReducer';

const GeografiSearch = ({ ...props }) => {
    const {
        geografiListKomplett,
        typeAheadSuggestionsGeografi,
        typeAheadSuggestionsGeografiKomplett,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        onDisabledChange,
        maaBoInnenforGeografi,
        search,
        removeGeografi,
        fetchTypeAheadSuggestions,
        selectTypeAheadValue,
        clearTypeAheadGeografi,
        togglePanelOpen,
        toggleMaBoPaGeografi,
        stillingsId,
    } = props;
    const [typeAheadValue, setTypeAheadValue] = useState('');
    const typeAhead = useRef(null);

    useEffect(() => {
        if (panelOpen === undefined && stillingsId) {
            togglePanelOpen();
        }
    });

    const onToggleMaBoPaGeografi = () => {
        toggleMaBoPaGeografi();
        search();
    };

    const onClickedDisabledCheckbox = (event) => {
        if (onDisabledChange !== undefined) {
            onDisabledChange();
        }
        event.preventDefault();
    };

    const onTypeAheadGeografiChange = (value) => {
        fetchTypeAheadSuggestions(value);
        setTypeAheadValue(value);
    };

    const onTypeAheadGeografiSelect = (value) => {
        if (value !== '') {
            const geografi = typeAheadSuggestionsGeografiKomplett.find(
                (k) => k.geografiKodeTekst.toLowerCase() === value.toLowerCase()
            );
            if (geografi !== undefined) {
                selectTypeAheadValue(geografi);
                clearTypeAheadGeografi();
                setTypeAheadValue('');
                search();
            }
        }
    };

    const onFjernClick = (geografi) => {
        if (geografiListKomplett && geografiListKomplett.length === 1 && maaBoInnenforGeografi) {
            toggleMaBoPaGeografi();
        }
        removeGeografi(geografi);
        search();
    };

    const onTypeAheadBlur = () => {
        setTypeAheadValue('');
        clearTypeAheadGeografi();
    };

    const onSubmit = (e) => {
        e.preventDefault();
        onTypeAheadGeografiSelect(typeAheadValue);
        typeAhead.current?.input.focus();
    };

    return (
        <SokekriteriePanel
            id="Geografi__SokekriteriePanel"
            fane="fylke-kommune"
            tittel="Fylke/kommune"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Normaltekst>Vis bare kandidater som ønsker å jobbe i dette området</Normaltekst>
            <div className="sokekriterier--kriterier">
                <div className="sokefelt--wrapper--geografi">
                    <Typeahead
                        ref={(typeAheadRef) => {
                            typeAhead.current = typeAheadRef;
                        }}
                        onSelect={onTypeAheadGeografiSelect}
                        onChange={onTypeAheadGeografiChange}
                        label=""
                        name="geografi"
                        placeholder="Skriv inn fylke/kommune"
                        suggestions={typeAheadSuggestionsGeografi}
                        value={typeAheadValue}
                        id="typeahead-geografi"
                        onSubmit={onSubmit}
                        onTypeAheadBlur={onTypeAheadBlur}
                    />
                    <div className="Merkelapp__wrapper">
                        {geografiListKomplett &&
                            geografiListKomplett.map((geo) => (
                                <Merkelapp
                                    onRemove={onFjernClick}
                                    key={geo.geografiKodeTekst}
                                    value={geo.geografiKode}
                                >
                                    {geo.geografiKodeTekst}
                                </Merkelapp>
                            ))}
                    </div>
                    <CheckboxMedHjelpetekst
                        id="toggle-ma-bo-pa-geografi"
                        label="Vis bare kandidater som bor i området"
                        checked={maaBoInnenforGeografi}
                        value="geografiCheckbox"
                        onChange={onToggleMaBoPaGeografi}
                        disabled={geografiListKomplett && geografiListKomplett.length === 0}
                        onDisabledChange={(event) => onClickedDisabledCheckbox(event)}
                        tittel="Vis bare kandidater som bor i området"
                    />
                </div>
            </div>
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.GEOGRAFI && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

GeografiSearch.defaultProps = {
    panelOpen: undefined,
    onDisabledChange: undefined,
    stillingsId: undefined,
};

GeografiSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeGeografi: PropTypes.func.isRequired,
    fetchTypeAheadSuggestions: PropTypes.func.isRequired,
    selectTypeAheadValue: PropTypes.func.isRequired,
    geografiListKomplett: PropTypes.arrayOf(
        PropTypes.shape({
            geografiKodeTekst: PropTypes.string,
            geografiKode: PropTypes.string,
        })
    ).isRequired,
    typeAheadSuggestionsGeografi: PropTypes.arrayOf(PropTypes.string).isRequired,
    typeAheadSuggestionsGeografiKomplett: PropTypes.arrayOf(
        PropTypes.shape({
            geografiKodeTekst: PropTypes.string,
            geografiKode: PropTypes.string,
        })
    ).isRequired,
    clearTypeAheadGeografi: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    maaBoInnenforGeografi: PropTypes.bool.isRequired,
    toggleMaBoPaGeografi: PropTypes.func.isRequired,
    onDisabledChange: PropTypes.func,
    stillingsId: PropTypes.string,
};

const mapStateToProps = (state) => ({
    geografiListKomplett: state.søkefilter.geografi.geografiListKomplett,
    typeAheadSuggestionsGeografi: state.søkefilter.typeahead.geografi.suggestions,
    typeAheadSuggestionsGeografiKomplett: state.søkefilter.typeahead.geografiKomplett.suggestions,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.geografi.geografiPanelOpen,
    maaBoInnenforGeografi: state.søkefilter.geografi.maaBoInnenforGeografi,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: KandidatsøkActionType.Search, alertType: ALERTTYPE.GEOGRAFI }),
    clearTypeAheadGeografi: () =>
        dispatch({
            type: TypeaheadActionType.ClearTypeAheadSuggestions,
            branch: BRANCHNAVN.GEOGRAFI,
        }),
    fetchTypeAheadSuggestions: (value) =>
        dispatch({
            type: TypeaheadActionType.FetchTypeAheadSuggestions,
            branch: BRANCHNAVN.GEOGRAFI,
            value,
        }),
    selectTypeAheadValue: (value) => dispatch({ type: SELECT_TYPE_AHEAD_VALUE_GEOGRAFI, value }),
    removeGeografi: (value) => dispatch({ type: REMOVE_SELECTED_GEOGRAFI, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_GEOGRAFI_PANEL_OPEN }),
    toggleMaBoPaGeografi: () => dispatch({ type: TOGGLE_MA_BO_INNENFOR_GEOGRAFI }),
});

export default connect(mapStateToProps, mapDispatchToProps)(GeografiSearch);
