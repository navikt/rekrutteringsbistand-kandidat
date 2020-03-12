export enum NavKontorActionTypes {
    VelgNavKontor = 'VELG_NAV_KONTOR',
}

export type NavKontorAction = {
    type: NavKontorActionTypes.VelgNavKontor;
    valgtKontor: string;
};

export type NavKontorState = {
    valgtKontor: string | null;
};

const initialState: NavKontorState = {
    valgtKontor: null,
};

const reducer = (state: NavKontorState = initialState, action: NavKontorAction): NavKontorState => {
    switch (action.type) {
        case NavKontorActionTypes.VelgNavKontor: {
            return {
                valgtKontor: action.valgtKontor,
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer;
