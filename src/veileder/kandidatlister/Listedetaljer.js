import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { HENT_KANDIDATLISTE } from './kandidatlisteReducer';
import ListedetaljerView from './ListedetaljerView';
import './Listedetaljer.less';
import { Kandidatliste } from './PropTypes';

class Listedetaljer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alleMarkert: false,
            kandidater: props.kandidatliste === undefined ? undefined :
                props.kandidatliste.kandidater.map((kandidat) => ({
                    ...kandidat,
                    markert: false
                }))
        };
    }
    componentDidMount() {
        const { id } = this.props.match.params;
        this.props.hentKandidatliste(id);
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.kandidatliste) {
            return;
        }
        if ((!this.props.kandidatliste && nextProps.kandidatliste.kandidater)
            || this.props.kandidatliste.kandidater !== nextProps.kandidatliste.kandidater) {
            this.setState({
                kandidater: nextProps.kandidatliste.kandidater.map((kandidat) => ({
                    ...kandidat,
                    markert: false
                }))
            });
        }
    }

    onCheckAlleKandidater = (markert) => {
        this.setState({
            alleMarkert: markert,
            kandidater: this.state.kandidater.map((kandidat) => ({
                ...kandidat,
                markert
            }))
        });
    };

    onToggleKandidat = (kandidatnr) => {
        this.setState({
            alleMarkert: false,
            kandidater: this.state.kandidater.map((kandidat) => {
                if (kandidat.kandidatnr === kandidatnr) {
                    return {
                        ...kandidat,
                        markert: !kandidat.markert
                    };
                }
                return kandidat;
            })
        });
    };

    render() {
        if (this.props.fetching || !this.props.kandidatliste) {
            return (
                <div className="fullscreen-spinner">
                    <NavFrontendSpinner type="L" />
                </div>
            );
        }

        const { tittel, oppdragsgiver, opprettetAv, stillingId } = this.props.kandidatliste;
        const { kandidater, alleMarkert } = this.state;
        return (
            <ListedetaljerView
                tittel={tittel}
                oppdragsgiver={oppdragsgiver}
                opprettetAv={opprettetAv}
                stillingsId={stillingId}
                kandidater={kandidater}
                alleMarkert={alleMarkert}
                onToggleKandidat={this.onToggleKandidat}
                onCheckAlleKandidater={() => {
                    this.onCheckAlleKandidater(!alleMarkert);
                }}
            />
        );
    }
}

Listedetaljer.defaultProps = {
    kandidatliste: undefined
};

Listedetaljer.propTypes = {
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
    hentKandidatliste: (stillingsnummer) => { dispatch({ type: HENT_KANDIDATLISTE, stillingsnummer }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Listedetaljer);

