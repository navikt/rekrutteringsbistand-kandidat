import { useReducer } from 'react';

export enum AlertStripeType {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    LUKKET = 'LUKKET'
}

interface State {
    feilmelding: AlertStripeState,
    nextId: number,
    callbackIds?: {
        callback1: number,
        callback2: number
    }
}

const reducer: (State, any) => State = (state, action) => {
    switch (action.type) {
        case 'SET_SUKSESS':
            return {
                ...state,
                feilmelding: {
                    innhold: action.innhold,
                    kind: AlertStripeType.SUCCESS,
                    synlig: true,
                    id: action.id
                },
                nextId: state.nextId + 1
            };
        case 'SET_FAILURE':
            return {
                ...state,
                feilmelding: {
                    innhold: action.innhold,
                    kind: AlertStripeType.FAILURE,
                    synlig: true,
                    id: action.id
                },
                nextId: state.nextId + 1
            };
        case 'HIDE':
            if (state.feilmelding && state.feilmelding.id === action.id) {
                return {
                    ...state,
                    feilmelding: {
                        ...state.feilmelding,
                        synlig: false
                    }
                };
            }
            return state;

        case 'CLEAR':
            if (state.feilmelding && state.feilmelding.id === action.id) {
                return {
                    ...state,
                    feilmelding: {
                        kind: AlertStripeType.LUKKET
                    }
                };
            }
            return state;
        case 'SET_CALLBACK_IDS':
            if (state.callbackIds) {
                clearTimeout(state.callbackIds.callback1);
                clearTimeout(state.callbackIds.callback2);
            }
            return {
                ...state,
                callbackIds: action.callbackIds
            };

        case 'CLEAR_TIMEOUTS':
            if (state.callbackIds) {
                clearTimeout(state.callbackIds.callback1);
                clearTimeout(state.callbackIds.callback2);
            }
            return state;

        default:
            return state;

    }
};

interface ApenAlertStripeState {
    kind: AlertStripeType.SUCCESS | AlertStripeType.FAILURE
    innhold: string;
    synlig: boolean;
}

interface LukketAlertStripeState {
    kind: AlertStripeType.LUKKET
}

export type AlertStripeState = ApenAlertStripeState | LukketAlertStripeState

export const useTimeoutState: () => [AlertStripeState, () => void, (string) => void, (string) => void] = () => {
    const [state, dispatch] = useReducer(reducer, {
        feilmelding: {
            kind: AlertStripeType.LUKKET
        },
        nextId: 0,
        callbackIds: undefined
    });

    const timeoutMillis = 5000;

    const setMelding = (innhold: string, type: string) => {
        dispatch({ type, innhold, id: state.nextId });
        const callback1 = setTimeout(() => {
            dispatch({ type: 'HIDE', id: state.nextId });
        }, timeoutMillis);
        const callback2 = setTimeout(() => {
            dispatch({ type: 'CLEAR', id: state.nextId });
        }, timeoutMillis + 1000);
        dispatch({ type: 'SET_CALLBACK_IDS', callbackIds: { callback1, callback2 } });
    };

    const setSuccessMelding = (innhold: string) => {
        setMelding(innhold, 'SET_SUKSESS');
    };

    const setFailureMelding = (innhold: string) => {
        setMelding(innhold, 'SET_FAILURE');
    };

    const clearTimouts = () => {
        dispatch({ type: 'CLEAR_TIMEOUTS' });
    };
    return [state.feilmelding, clearTimouts, setSuccessMelding, setFailureMelding];
};
