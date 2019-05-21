/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { KandidatlisteTypes } from './kandidatlisteReducer.ts';
import Listedetaljer from './Listedetaljer';
import { Kandidatliste as kandidatlisteProps } from './PropTypes';
import './Listedetaljer.less';

class Kandidatliste extends React.Component {
    componentDidMount() {
        const { listeid } = this.props.match.params;
        this.props.hentKandidatliste(listeid);
    }

    render() {
        const { kandidatliste } = this.props;
        return (
            <div>
                <Listedetaljer kandidatliste={kandidatliste} />
            </div>
        );
    }
}

Kandidatliste.defaultProps = {
    kandidatliste: undefined
};

Kandidatliste.propTypes = {
    kandidatliste: PropTypes.shape({
        kind: PropTypes.string,
        data: PropTypes.shape(kandidatlisteProps)
    }),
    hentKandidatliste: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            listeid: PropTypes.string.isRequired
        })
    }).isRequired
};

const mapStateToProps = (state) => ({
    kandidatliste: state.kandidatlister.detaljer.kandidatliste
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (kandidatlisteId) => { dispatch({ type: KandidatlisteTypes.HENT_KANDIDATLISTE_MED_KANDIDATLISTE_ID, kandidatlisteId }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatliste);
