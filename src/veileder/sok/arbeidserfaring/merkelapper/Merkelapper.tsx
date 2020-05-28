import React, { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Typeahead from '../../typeahead/Typeahead';
import { Merkelapp } from 'pam-frontend-merkelapper';
import { SEARCH } from '../../searchReducer';
import { ALERTTYPE, BRANCHNAVN } from '../../../../felles/konstanter';
import {
    CLEAR_TYPE_AHEAD_SUGGESTIONS,
    FETCH_TYPE_AHEAD_SUGGESTIONS,
} from '../../../common/typeahead/typeaheadReducer';
import {
    REMOVE_SELECTED_ARBEIDSERFARING,
    SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING,
} from '../arbeidserfaringReducer';
import { connect } from 'react-redux';
import AppState from '../../../AppState';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    search: () => void;
    arbeidserfaringer: string[];
    typeAheadSuggestionsArbeidserfaring: string[];
    fetchTypeAheadSuggestions: (value: string) => void;
    selectTypeAheadValue: (value: string) => void;
    clearTypeAheadArbeidserfaring: () => void;
    removeArbeidserfaring: (erfaring: string) => void;
}

const Merkelapper: FunctionComponent<Props> = (props) => {
    const [showTypeAhead, setShowTypeAhead] = useState<boolean>(false);
    const [typeAheadValue, setTypeAheadValue] = useState<string>('');
    const [typeAheadRef, setTypeAheadRef] = useState<any>();

    useEffect(() => {
        if (showTypeAhead && typeAheadRef) {
            typeAheadRef.input.focus();
        }
    }, [showTypeAhead, typeAheadRef]);

    const onTypeAheadArbeidserfaringChange = (value: string) => {
        props.fetchTypeAheadSuggestions(value);
        setTypeAheadValue(value);
    };

    const onTypeAheadArbeidserfaringSelect = (value: string) => {
        if (value !== '') {
            props.selectTypeAheadValue(value);
            props.clearTypeAheadArbeidserfaring();
            setTypeAheadValue('');
            props.search();
        }
    };

    const onLeggTilClick = () => {
        setShowTypeAhead(true);
    };

    const onFjernClick = (erfaring: string) => {
        props.removeArbeidserfaring(erfaring);
        props.search();
    };

    const onTypeAheadBlur = () => {
        setTypeAheadValue('');
        setShowTypeAhead(false);
        props.clearTypeAheadArbeidserfaring();
    };

    const onSubmit = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        onTypeAheadArbeidserfaringSelect(typeAheadValue);
        typeAheadRef.input.focus();
    };

    return (
        <>
            <Element className="blokk-xxxs">Hvilken erfaring skal kandidaten ha?</Element>
            <Normaltekst>For eksempel: barnehagelærer</Normaltekst>
            <div className="sokekriterier--kriterier">
                <div>
                    {showTypeAhead ? (
                        <Typeahead
                            ref={setTypeAheadRef}
                            onSelect={onTypeAheadArbeidserfaringSelect}
                            onChange={onTypeAheadArbeidserfaringChange}
                            label=""
                            name="arbeidserfaring"
                            placeholder="Skriv inn arbeidserfaring"
                            suggestions={props.typeAheadSuggestionsArbeidserfaring}
                            value={typeAheadValue}
                            id="typeahead-arbeidserfaring"
                            onSubmit={onSubmit}
                            onTypeAheadBlur={onTypeAheadBlur}
                        />
                    ) : (
                        <Knapp
                            kompakt
                            onClick={onLeggTilClick}
                            id="leggtil-arbeidserfaring-knapp"
                            className="filterknapp"
                        >
                            + Legg til arbeidserfaring
                        </Knapp>
                    )}
                </div>
                <div className="Merkelapp__wrapper">
                    {props.arbeidserfaringer.map((arbeidserfaring) => (
                        <Merkelapp
                            onRemove={onFjernClick}
                            key={arbeidserfaring}
                            value={arbeidserfaring}
                        >
                            {arbeidserfaring}
                        </Merkelapp>
                    ))}
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state: AppState) => {
    return {
        arbeidserfaringer: state.arbeidserfaring.arbeidserfaringer,
        typeAheadSuggestionsArbeidserfaring: (state as any).typeahead.arbeidserfaring.suggestions,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    search: () => dispatch({ type: SEARCH, alertType: ALERTTYPE.ARBEIDSERFARING }),
    clearTypeAheadArbeidserfaring: () =>
        dispatch({ type: CLEAR_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.ARBEIDSERFARING }),
    fetchTypeAheadSuggestions: (value: string) =>
        dispatch({ type: FETCH_TYPE_AHEAD_SUGGESTIONS, branch: BRANCHNAVN.ARBEIDSERFARING, value }),
    selectTypeAheadValue: (value: string) =>
        dispatch({ type: SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, value }),
    removeArbeidserfaring: (value: string) =>
        dispatch({ type: REMOVE_SELECTED_ARBEIDSERFARING, value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Merkelapper);
