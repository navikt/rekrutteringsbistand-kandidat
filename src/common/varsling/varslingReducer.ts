import { AlertStripeType } from 'nav-frontend-alertstriper';
import { ReactNode } from 'react';
import { takeLatest, put } from 'redux-saga/effects';

const standardVarighet = 4000;

export type VarslingState = {
    innhold: ReactNode;
    alertType: AlertStripeType;
};

const initialState: VarslingState = {
    innhold: null,
    alertType: 'info',
};

export enum VarslingActionType {
    VisVarsling = 'VIS_VARSLING',
    SkjulVarsling = 'SKJUL_VARSLING',
}

type VisVarslingAction = {
    type: VarslingActionType.VisVarsling;
    innhold: ReactNode;
    alertType?: AlertStripeType;
    varighetMs?: number;
};

type SkjulVarslingAction = {
    type: VarslingActionType.SkjulVarsling;
};

export type VarslingAction = VisVarslingAction | SkjulVarslingAction;

const varslingReducer = (
    state: VarslingState = initialState,
    action: VarslingAction
): VarslingState => {
    switch (action.type) {
        case VarslingActionType.VisVarsling:
            const { innhold, alertType = 'suksess' } = action;

            return {
                innhold,
                alertType,
            };

        case VarslingActionType.SkjulVarsling:
            return initialState;

        default:
            return state;
    }
};

function* skjulVarslingEtterGittVarighet(action: VisVarslingAction) {
    yield new Promise((resolve) => setTimeout(resolve, action.varighetMs || standardVarighet));
    yield put({
        type: VarslingActionType.SkjulVarsling,
    });
}

export function* varslingSaga() {
    yield takeLatest(VarslingActionType.VisVarsling, skjulVarslingEtterGittVarighet);
}

export default varslingReducer;
