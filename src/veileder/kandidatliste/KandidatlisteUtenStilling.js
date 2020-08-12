/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KandidatlisteActionType from './reducer/KandidatlisteActionType.ts';
import Kandidatlisteside from './Kandidatlisteside.tsx';
import { Kandidatliste as KandidatlistePropType } from './PropTypes';

class KandidatlisteUtenStilling extends React.Component {
    componentDidMount() {
        const { listeid } = this.props.match.params;
        this.props.hentKandidatliste(listeid);
    }

    render() {
        const { kandidatliste } = this.props;
        return (
            <div>
                <Kandidatlisteside kandidatliste={kandidatliste} />
            </div>
        );
    }
}

KandidatlisteUtenStilling.defaultProps = {
    kandidatliste: undefined,
};

KandidatlisteUtenStilling.propTypes = {
    kandidatliste: PropTypes.shape({
        kind: PropTypes.string,
        data: PropTypes.shape(KandidatlistePropType),
    }),
    hentKandidatliste: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            listeid: PropTypes.string.isRequired,
        }),
    }).isRequired,
};

const mapStateToProps = (state) => ({
    kandidatliste: state.kandidatliste.detaljer.kandidatliste,
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (kandidatlisteId) => {
        dispatch({
            type: KandidatlisteActionType.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID,
            kandidatlisteId,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteUtenStilling);
