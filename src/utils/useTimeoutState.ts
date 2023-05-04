import { useReducer } from 'react';
import * as React from 'react';

export enum AlertStripeType {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    LUKKET = 'LUKKET',
}

interface State {
    feilmelding: AlertStripeState;
    nextId: number;
    callbackIdHide?: number;
    callbackIdClear?: number;
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
                    id: action.id,
                },
                nextId: state.nextId + 1,
            };
        case 'SET_FAILURE':
            return {
                ...state,
                feilmelding: {
                    innhold: action.innhold,
                    kind: AlertStripeType.FAILURE,
                    synlig: true,
                    id: action.id,
                },
                nextId: state.nextId + 1,
            };

        case 'HIDE':
            if (state.feilmelding.id === action.id) {
                return {
                    ...state,
                    feilmelding: {
                        ...state.feilmelding,
                        synlig: false,
                    },
                };
            }
            return state;

        case 'CLEAR':
            if (state.feilmelding && state.feilmelding.id === action.id) {
                return {
                    ...state,
                    feilmelding: {
                        kind: AlertStripeType.LUKKET,
                    },
                };
            }
            return state;

        case 'SET_CALLBACK_ID_HIDE':
            if (state.callbackIdHide) {
                clearTimeout(state.callbackIdHide);
            }
            return {
                ...state,
                callbackIdHide: action.callbackId,
            };

        case 'SET_CALLBACK_ID_CLEAR':
            if (state.callbackIdClear) {
                clearTimeout(state.callbackIdClear);
            }
            return {
                ...state,
                callbackIdClear: action.callbackId,
            };

        case 'CLEAR_ALL':
            clearTimeout(state.callbackIdHide);
            clearTimeout(state.callbackIdClear);

            return {
                ...state,
                feilmelding: {
                    kind: AlertStripeType.LUKKET,
                },
            };

        default:
            return state;
    }
};

interface ApenAlertStripeState {
    kind: AlertStripeType.SUCCESS | AlertStripeType.FAILURE;
    innhold: string | React.ReactNode;
    synlig: boolean;
    id: number;
}

interface LukketAlertStripeState {
    kind: AlertStripeType.LUKKET;
}

export type AlertStripeState = ApenAlertStripeState | LukketAlertStripeState;

export const useTimeoutState: (
    timeoutMillis?: number
) => [AlertStripeState, () => void, (StringOrNode) => void, (StringOrNode) => void] = (
    timeoutMillis = 5000
) => {
    const [state, dispatch] = useReducer(reducer, {
        feilmelding: {
            kind: AlertStripeType.LUKKET,
        },
        nextId: 0,
        callbackIdHide: undefined,
        callbackIdClear: undefined,
    });

    const setMelding = (innhold: string, type: string) => {
        dispatch({ type, innhold, id: state.nextId });
        const callbackIdHide = setTimeout(() => {
            dispatch({ type: 'HIDE', id: state.nextId });
        }, timeoutMillis);
        dispatch({ type: 'SET_CALLBACK_ID_HIDE', callbackId: callbackIdHide });
        const callbackIdClear = setTimeout(() => {
            dispatch({ type: 'CLEAR', id: state.nextId });
        }, timeoutMillis + 1000);
        dispatch({ type: 'SET_CALLBACK_ID_CLEAR', callbackId: callbackIdClear });
    };

    const setSuccessMelding = (innhold: string) => {
        setMelding(innhold, 'SET_SUKSESS');
    };

    const setFailureMelding = (innhold: string) => {
        setMelding(innhold, 'SET_FAILURE');
    };

    const clearTimoutsAndState = () => {
        dispatch({ type: 'CLEAR_ALL' });
    };

    return [state.feilmelding, clearTimoutsAndState, setSuccessMelding, setFailureMelding];
};
