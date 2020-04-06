import { SET_STATE } from '../searchReducer';

export enum PermitteringActionType {
    SET_PERMITTERT = 'SET_PERMITTERT',
}

export type PermitteringState = {
    permittert: boolean;
    ikkePermittert: boolean;
};

export type PermitteringAction = {
    type: PermitteringActionType.SET_PERMITTERT;
    permittert: boolean;
    ikkePermittert: boolean;
};

const initialState = {
    permittert: false,
    ikkePermittert: false,
};

export default function permitteringReducer(state: PermitteringState = initialState, action) {
    switch (action.type) {
        case SET_STATE: {
            return {
                permittert: action.query.permittert === true ? true : state.permittert,
                ikkePermittert: action.query.permittert === false ? false : state.ikkePermittert,
            };
        }
        case PermitteringActionType.SET_PERMITTERT:
            return {
                permittert: action.permittert,
                ikkePermittert: action.ikkePermittert,
            };
        default:
            return state;
    }
}
