import { SET_STATE } from '../searchReducer';

export type MaksAlderArbeidserfaringState = { verdi: number | undefined };

const initialState = { verdi: undefined };

export enum FerskArbeidserfaringActionType {
    SET_MAKS_ALDER_ARBEIDSERFARING = 'SET_MAKS_ALDER_ARBEIDSERFARING',
}

type Action = { type: string } & any;

const ferskArbeidserfaringReducer = (
    state: MaksAlderArbeidserfaringState = initialState,
    action: Action
) => {
    console.log(action);
    switch (action.type) {
        case FerskArbeidserfaringActionType.SET_MAKS_ALDER_ARBEIDSERFARING:
            return { verdi: action.value };
        default:
            return state;
    }
};

export default ferskArbeidserfaringReducer;
