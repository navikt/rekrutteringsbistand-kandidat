/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { HENT_KANDIDATLISTE_MED_STILLINGS_ID } from './kandidatlisteReducer';
import Listedetaljer from './Listedetaljer';
import { Kandidatliste } from './PropTypes';
import './Listedetaljer.less';

class KandidatlisteFraStilling extends React.Component {
    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.hentKandidatliste(id);
    }

    render() {
        const { kandidatliste, fetching } = this.props;
        return (
            <div>
                <Listedetaljer kandidatliste={kandidatliste} fetching={fetching} />
            </div>
        );
    }
}

KandidatlisteFraStilling.defaultProps = {
    kandidatliste: undefined
};

KandidatlisteFraStilling.propTypes = {
    fetching: PropTypes.bool.isRequired,
    kandidatliste: PropTypes.shape(Kandidatliste),
    hentKandidatliste: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    }).isRequired
};

const mapStateToProps = (state) => ({
    fetching: state.kandidatlister.detaljer.fetching,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (stillingsId) => { dispatch({ type: HENT_KANDIDATLISTE_MED_STILLINGS_ID, stillingsId }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(KandidatlisteFraStilling);
