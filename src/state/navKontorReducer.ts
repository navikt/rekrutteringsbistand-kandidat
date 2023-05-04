export enum NavKontorActionTypes {
    VelgNavKontor = 'VELG_NAV_KONTOR',
}

export type NavKontorAction = {
    type: NavKontorActionTypes.VelgNavKontor;
    valgtNavKontor: string;
};

export type NavKontorState = {
    valgtNavKontor: string | null;
};

const initialState: NavKontorState = {
    valgtNavKontor: null,
};

const valgtNavKontorReducer = (
    state: NavKontorState = initialState,
    action: NavKontorAction
): NavKontorState => {
    switch (action.type) {
        case NavKontorActionTypes.VelgNavKontor: {
            return {
                valgtNavKontor: action.valgtNavKontor,
            };
        }

        default: {
            return state;
        }
    }
};

export default valgtNavKontorReducer;
