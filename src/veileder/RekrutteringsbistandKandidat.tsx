import React from 'react';
import { connect } from 'react-redux';

import {
    FETCH_FEATURE_TOGGLES_BEGIN,
    FJERN_ERROR,
    LUKK_ALLE_SOKEPANEL,
    SET_STATE,
} from './sok/searchReducer';
import { sendEvent } from './amplitude/amplitude';
import Application from './application/Application';
import Dekoratør from './dekoratør/Dekoratør';
import ErrorSide from './sok/error/ErrorSide';
import Navigeringsmeny from './navigeringsmeny/Navigeringsmeny';
import AppState from './AppState';

type RekrutteringsbistandKandidatProps = {
    error: {
        status: number;
    };
    fetchFeatureToggles: () => void;
    fjernError: () => void;
};

class RekrutteringsbistandKandidat extends React.Component<RekrutteringsbistandKandidatProps> {
    componentDidMount() {
        this.props.fetchFeatureToggles();
        sendEvent('app', 'åpne', {
            skjermbredde: window.screen.width,
        });
    }

    render() {
        const { error, fjernError } = this.props;

        if (error) {
            return (
                <div>
                    <ErrorSide error={error} fjernError={fjernError} />
                </div>
            );
        }

        return <Application />;
    }
}

const mapStateToProps = (state: AppState) => ({
    error: state.søk.error,
});

const mapDispatchToProps = (dispatch) => ({
    fetchFeatureToggles: () => dispatch({ type: FETCH_FEATURE_TOGGLES_BEGIN }),
    fjernError: () => dispatch({ type: FJERN_ERROR }),
    lukkAlleSokepanel: () => dispatch({ type: LUKK_ALLE_SOKEPANEL }),
    resetQuery: (query) => dispatch({ type: SET_STATE, query }),
});

export default connect(mapStateToProps, mapDispatchToProps)(RekrutteringsbistandKandidat);
