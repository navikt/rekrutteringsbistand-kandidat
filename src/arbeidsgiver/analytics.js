import { takeEvery } from 'redux-saga/effects';
import { SEARCH } from './sok/searchReducer';
import { REMOVE_SELECTED_FORERKORT, SELECT_TYPE_AHEAD_VALUE_FORERKORT } from './sok/forerkort/forerkortReducer';
import {
    REMOVE_SELECTED_GEOGRAFI,
    SELECT_TYPE_AHEAD_VALUE_GEOGRAFI,
    TOGGLE_MA_BO_INNENFOR_GEOGRAFI
} from './sok/geografi/geografiReducer';
import {
    CHECK_TOTAL_ERFARING,
    REMOVE_SELECTED_ARBEIDSERFARING,
    SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, UNCHECK_TOTAL_ERFARING
} from './sok/arbeidserfaring/arbeidserfaringReducer';
import { REMOVE_SELECTED_KOMPETANSE, SELECT_TYPE_AHEAD_VALUE_KOMPETANSE } from './sok/kompetanse/kompetanseReducer';
import { REMOVE_SELECTED_SPRAK, SELECT_TYPE_AHEAD_VALUE_SPRAK } from './sok/sprak/sprakReducer';
import { REMOVE_SELECTED_STILLING, SELECT_TYPE_AHEAD_VALUE_STILLING } from './sok/stilling/stillingReducer';
import { CHECK_UTDANNINGSNIVA, UNCHECK_UTDANNINGSNIVA } from './sok/utdanning/utdanningReducer';
import { SET_FRITEKST_SOKEORD } from './sok/fritekst/fritekstReducer';

const EVENT_CATEGORY_SEARCH = 'Kandidatsøk > Søk';
const ignoreFurther = [];

function track(...props) {
    if (window.ga) {
        window.ga(...props);
    }
}

export function trackOnce(...props) {
    const key = props.join();
    if (!ignoreFurther.includes(key)) {
        ignoreFurther.push(key);
        track('send', 'event', ...props);
    }
}

const analyticsSaga = function* analyticsSaga() {
    yield takeEvery(SEARCH, () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Utførte søk');
    });
    yield takeEvery([SELECT_TYPE_AHEAD_VALUE_FORERKORT, REMOVE_SELECTED_FORERKORT], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Førerkort');
    });
    yield takeEvery([SELECT_TYPE_AHEAD_VALUE_GEOGRAFI, REMOVE_SELECTED_GEOGRAFI], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Fylke/kommune');
    });
    yield takeEvery([SELECT_TYPE_AHEAD_VALUE_ARBEIDSERFARING, REMOVE_SELECTED_ARBEIDSERFARING], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Arbeidserfaring');
    });
    yield takeEvery([CHECK_TOTAL_ERFARING, UNCHECK_TOTAL_ERFARING], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Antall år med arbeidserfaring');
    });
    yield takeEvery([SELECT_TYPE_AHEAD_VALUE_KOMPETANSE, REMOVE_SELECTED_KOMPETANSE], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Kompetanse');
    });
    yield takeEvery([SELECT_TYPE_AHEAD_VALUE_SPRAK, REMOVE_SELECTED_SPRAK], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Språk');
    });
    yield takeEvery([SELECT_TYPE_AHEAD_VALUE_STILLING, REMOVE_SELECTED_STILLING], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Stilling/yrke');
    });
    yield takeEvery([CHECK_UTDANNINGSNIVA, UNCHECK_UTDANNINGSNIVA], () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Utdanningsnivå');
    });
    yield takeEvery(TOGGLE_MA_BO_INNENFOR_GEOGRAFI, () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Vis bare kandidater som bor i området');
    });
    yield takeEvery(SET_FRITEKST_SOKEORD, () => {
        trackOnce(EVENT_CATEGORY_SEARCH, 'Endret søkekriterie', 'Fritekst');
    });
};

export default analyticsSaga;
