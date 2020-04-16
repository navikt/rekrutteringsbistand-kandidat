export interface ArbeidserfaringState {
    arbeidserfaringPanelOpen: boolean;
    arbeidserfaringer: string[];
    totalErfaring: string[];
}

interface Typeahead {
    value: string;
    suggestions: string[];
}

export interface TypeaheadState {
    kompetanse: Typeahead;
    stilling: Typeahead;
    arbeidserfaring: Typeahead;
    utdanning: Typeahead;
    geografi: Typeahead;
    geografiKomplett: Typeahead;
    sprak: Typeahead;
    forerkort: Typeahead;
    navkontor: Typeahead;
}
