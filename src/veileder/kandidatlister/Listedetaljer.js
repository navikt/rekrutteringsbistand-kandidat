import React from 'react';
import { connect } from 'react-redux';
import './Listedetaljer.less';
import ListedetaljerView from './ListedetaljerView';
import { HENT_KANDIDATLISTE } from './kandidatlisteReducer';

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

    onToggleKandidat = (kandidatnummer) => {
        this.setState({
            alleMarkert: false,
            kandidater: this.state.kandidater.map((kandidat) => {
                if (kandidat.kandidatnummer === kandidatnummer) {
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
            return <span>Spinner</span>;
        }

        const { tittel, oppdragsgiver, opprettetAv, stillingsId } = this.props.kandidatliste;
        const { kandidater, alleMarkert } = this.state;
        return (
            <ListedetaljerView
                tittel={tittel}
                oppdragsgiver={oppdragsgiver}
                opprettetAv={opprettetAv}
                stillingsId={stillingsId}
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

const mapStateToProps = (state) => ({
    fetching: state.kandidatlister.detaljer.fetching,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste
});

const mapDispatchToProps = (dispatch) => ({
    hentKandidatliste: (stillingsnummer) => { dispatch({ type: HENT_KANDIDATLISTE, stillingsnummer }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Listedetaljer);

