import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';

import {
    FETCH_FEATURE_TOGGLES_BEGIN,
    FJERN_ERROR,
    LUKK_ALLE_SOKEPANEL,
    SET_STATE,
} from './sok/searchReducer';
import { sendEvent } from './amplitude/amplitude';
import Application from './application/Application';
import ErrorSide from './sok/error/ErrorSide';
import AppState from './AppState';
import { NavKontorActionTypes } from './navKontor/navKontorReducer';

type Props = {
    error: {
        status: number;
    };
    fetchFeatureToggles: () => void;
    fjernError: () => void;
    navKontor: string | null;
    velgNavKontor: (navKontor: string | null) => void;
};

const RekrutteringsbistandKandidat: FunctionComponent<Props> = (props) => {
    const { error, fetchFeatureToggles, fjernError, navKontor, velgNavKontor } = props;

    useEffect(() => {
        fetchFeatureToggles();
        sendEvent('app', 'åpne', {
            skjermbredde: window.screen.width,
        });
    }, []);

    useEffect(() => {
        if (navKontor) {
            velgNavKontor(navKontor);
        }
    }, [navKontor, velgNavKontor]);

    if (error) {
        return (
            <div>
                <ErrorSide error={error} fjernError={fjernError} />
            </div>
        );
    }

    return <Application />;
};

const mapStateToProps = (state: AppState) => ({
    error: state.søk.error,
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureToggles: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    fjernError: () => dispatch({ type: FJERN_ERROR }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
    velgNavKontor: (valgtNavKontor: string) =>
        dispatch({ type: NavKontorActionTypes.VelgNavKontor, valgtNavKontor }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RekrutteringsbistandKandidat);
