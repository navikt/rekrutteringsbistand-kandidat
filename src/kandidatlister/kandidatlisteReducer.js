import { takeLatest } from 'redux-saga/effects';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const OPPRETT_KANDIDATLISTE = 'OPPRETT_KANDIDATLISTE';
export const OPPRETT_KANDIDATLISTE_SUCCESS = 'OPPRETT_KANDIDATLISTE_SUCCESS';
export const OPPRETT_KANDIDATLISTE_FAILURE = 'OPPRETT_KANDIDATLISTE_FAILURE';

/** *********************************************************
 * REDUCER
 ********************************************************* */

const initialState = {
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}


/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */

function* opprettKandidatliste(action) {
    console.log({ action });
}

export function* kandidatlisteSaga() {
    yield takeLatest(OPPRETT_KANDIDATLISTE, opprettKandidatliste);
}

