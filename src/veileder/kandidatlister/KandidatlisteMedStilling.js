/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KandidatlisteActionType from './reducer/KandidatlisteActionType.ts';
import Kandidatlisteside from './kandidatliste/Kandidatlisteside.tsx';
import { Kandidatliste as KandidatlistePropType } from './PropTypes';

class KandidatlisteMedStilling extends React.Component {
    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.hentKandidatliste(id);
    }

    render() {
        const { kandidatliste, fetching } = this.props;
        return (
            <div>
                <Kandidatlisteside kandidatliste={kandidatliste} fetching={fetching} />
            </div>
        );
    }
}

KandidatlisteMedStilling.defaultProps = {
    kandidatliste: undefined,
};

KandidatlisteMedStilling.propTypes = {
    fetching: PropTypes.bool.isRequired,
    kandidatliste: PropTypes.shape(KandidatlistePropType),
    hentKandidatliste: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }),
    }).isRequired,
};

const mapStateToProps = state => ({
    fetching: state.kandidatlister.detaljer.fetching,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste,
});

const mapDispatchToProps = dispatch => ({
    hentKandidatliste: stillingsId => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_STILLINGS_ID,
            stillingsId,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteMedStilling);
