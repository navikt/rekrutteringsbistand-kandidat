import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SEARCH } from '../../reducer/searchReducer';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_KOMPETANSE,
    SELECT_TYPE_AHEAD_VALUE_KOMPETANSE,
    TOGGLE_KOMPETANSE_PANEL_OPEN,
} from './kompetanseReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../common/konstanter';
import SokekriteriePanel from '../sokekriteriePanel/SokekriteriePanel';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Typeahead from '../typeahead/Typeahead';
import { Knapp } from 'nav-frontend-knapper';
import { Merkelapp } from 'pam-frontend-merkelapper';
import FåKandidaterAlert from '../få-kandidater-alert/FåKandidaterAlert';
import './Kompetanse.less';

const KompetanseSearch = ({ ...props }) => {
    const {
        search,
        removeKompetanse,
        fetchTypeAheadSuggestionsKompetanse,
        selectTypeAheadValueKompetanse,
        kompetanser,
        kompetanseSuggestions,
        typeAheadSuggestionsKompetanse,
        allowOnlyTypeaheadSuggestions,
        kompetanseExamples,
        clearTypeAheadKompetanse,
        totaltAntallTreff,
        visAlertFaKandidater,
        panelOpen,
        togglePanelOpen,
    } = props;

    const [typeAheadValueKompetanse, setTypeAheadValueKompetanse] = useState('');
    const [antallKompetanser, setAntallKompetanser] = useState(4);
    const typeAhead = useRef(null);

    const onTypeAheadKompetanseChange = (value) => {
        fetchTypeAheadSuggestionsKompetanse(value);
        setTypeAheadValueKompetanse(value);
    };

    const onTypeAheadKompetanseSelect = (value) => {
        if (value !== '') {
            selectTypeAheadValueKompetanse(value);
            clearTypeAheadKompetanse();
            setTypeAheadValueKompetanse('');
            search();
        }
    };

    const onFjernKompetanseClick = (kompetanse) => {
        removeKompetanse(kompetanse);
        search();
    };

    const onSubmitKompetanse = (e) => {
        e.preventDefault();
        onTypeAheadKompetanseSelect(typeAheadValueKompetanse);
        typeAhead.current?.input.focus();
    };

    const onKompetanseSuggestionsClick = (kompetanse) => () => {
        selectTypeAheadValueKompetanse(kompetanse);
        search();
    };

    const onTypeAheadBlur = () => {
        setTypeAheadValueKompetanse('');
        clearTypeAheadKompetanse();
    };

    const onLeggTilFlereClick = () => {
        setAntallKompetanser(antallKompetanser + 4);
    };

    const filtrerteKompetanseSuggestions = kompetanseSuggestions.filter(
        (k) => !kompetanser.includes(k.feltnavn)
    );

    return (
        <SokekriteriePanel
            id="Kompetanse__SokekriteriePanel"
            fane="kompetanse"
            tittel="Kompetanse"
            onClick={togglePanelOpen}
            apen={panelOpen}
        >
            <Element>Krav til kompetanse</Element>
            <Normaltekst>{kompetanseExamples}</Normaltekst>
            <div className="sokekriterier--kriterier">
                <Typeahead
                    ref={(typeAheadRef) => {
                        typeAhead.current = typeAheadRef;
                    }}
                    onSelect={onTypeAheadKompetanseSelect}
                    onChange={onTypeAheadKompetanseChange}
                    label=""
                    name="kompetanse"
                    placeholder="Skriv inn kompetanse"
                    suggestions={typeAheadSuggestionsKompetanse}
                    value={typeAheadValueKompetanse}
                    id="typeahead-kompetanse"
                    onSubmit={onSubmitKompetanse}
                    onTypeAheadBlur={onTypeAheadBlur}
                    allowOnlyTypeaheadSuggestions={allowOnlyTypeaheadSuggestions}
                    selectedSuggestions={kompetanser}
                />
                <div className="Merkelapp__wrapper">
                    {kompetanser.map((kompetanse) => (
                        <Merkelapp
                            onRemove={onFjernKompetanseClick}
                            key={kompetanse}
                            value={kompetanse}
                        >
                            {kompetanse}
                        </Merkelapp>
                    ))}
                </div>
            </div>
            {filtrerteKompetanseSuggestions.length > 0 && (
                <div className="KompetanseSearch__suggestions">
                    <div className="blokk-s border--bottom--thin" />
                    <Element>
                        Forslag til kompetanse knyttet til valgt stilling. Klikk for å legge til
                    </Element>
                    <div className="Kompetanseforslag__wrapper">
                        {filtrerteKompetanseSuggestions
                            .slice(0, antallKompetanser)
                            .map((suggestedKompetanse) => (
                                <button
                                    onClick={onKompetanseSuggestionsClick(
                                        suggestedKompetanse.feltnavn
                                    )}
                                    className="KompetanseSearch__etikett"
                                    key={suggestedKompetanse.feltnavn}
                                >
                                    <div className="KompetanseSearch__etikett__text">
                                        {suggestedKompetanse.feltnavn}
                                    </div>
                                    <i className="KompetanseSearch__etikett__icon" />
                                </button>
                            ))}
                        {antallKompetanser < filtrerteKompetanseSuggestions.length && (
                            <Knapp onClick={onLeggTilFlereClick} className="se-flere-forslag" mini>
                                {`Se flere (${
                                    filtrerteKompetanseSuggestions.length - antallKompetanser
                                })`}
                            </Knapp>
                        )}
                    </div>
                </div>
            )}
            {totaltAntallTreff <= 10 && visAlertFaKandidater === ALERTTYPE.KOMPETANSE && (
                <FåKandidaterAlert totaltAntallTreff={totaltAntallTreff} />
            )}
        </SokekriteriePanel>
    );
};

KompetanseSearch.defaultProps = {
    kompetanseExamples: 'For eksempel: fagbrev, sertifisering, ferdigheter, programmer',
    allowOnlyTypeaheadSuggestions: false,
};

KompetanseSearch.propTypes = {
    search: PropTypes.func.isRequired,
    removeKompetanse: PropTypes.func.isRequired,
    fetchTypeAheadSuggestionsKompetanse: PropTypes.func.isRequired,
    selectTypeAheadValueKompetanse: PropTypes.func.isRequired,
    kompetanser: PropTypes.arrayOf(PropTypes.string).isRequired,
    kompetanseSuggestions: PropTypes.arrayOf(
        PropTypes.shape({
            feltnavn: PropTypes.string,
            antall: PropTypes.number,
            subfelt: PropTypes.array,
        })
    ).isRequired,
    typeAheadSuggestionsKompetanse: PropTypes.arrayOf(PropTypes.string).isRequired,
    clearTypeAheadKompetanse: PropTypes.func.isRequired,
    totaltAntallTreff: PropTypes.number.isRequired,
    visAlertFaKandidater: PropTypes.string.isRequired,
    togglePanelOpen: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    kompetanseExamples: PropTypes.string,
    allowOnlyTypeaheadSuggestions: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    kompetanser: state.søkefilter.kompetanse.kompetanser,
    kompetanseSuggestions: state.søk.searchResultat.kompetanseSuggestions,
    typeAheadSuggestionsKompetanse: state.søkefilter.typeahead.kompetanse.suggestions,
    totaltAntallTreff: state.søk.searchResultat.resultat.totaltAntallTreff,
    visAlertFaKandidater: state.søk.visAlertFaKandidater,
    panelOpen: state.søkefilter.kompetanse.kompetansePanelOpen,
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.KOMPETANSE }),
    clearTypeAheadKompetanse: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.KOMPETANSE }),
    fetchTypeAheadSuggestionsKompetanse: (value) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.KOMPETANSE, value }),
    selectTypeAheadValueKompetanse: (value) =>
        dispatch({ type: SELECT_TYPE_AHEAD_VALUE_KOMPETANSE, value }),
    removeKompetanse: (value) => dispatch({ type: REMOVE_SELECTED_KOMPETANSE, value }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_KOMPETANSE_PANEL_OPEN }),
});

export default connect(mapStateToProps, mapDispatchToProps)(KompetanseSearch);
