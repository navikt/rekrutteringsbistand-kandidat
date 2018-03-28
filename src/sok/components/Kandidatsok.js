import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Systemtittel } from 'nav-frontend-typografi';
import { Container, Row, Column } from 'nav-frontend-grid';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { INITIAL_SEARCH, SEARCH } from '../domene';
import Resultat from './Resultat';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yrke: props.query.yrke,
            utdanninger: props.query.utdanninger,
            kompetanser: props.query.kompetanser
        };
        this.props.initialSearch(props.urlParams);
    }

    componentWillReceiveProps(nextProps, props) {
        if (nextProps !== props) {
            this.setState({
                ...nextProps.query
            });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const utdanningListe = this.state.utdanninger.length > 0 ? this.state.utdanninger.split(' | ') : [];
        const kompetanseListe = this.state.kompetanser.length > 0 ? this.state.kompetanser.split(' | ') : [];
        this.props.search({ ...this.state, utdanninger: utdanningListe, kompetanser: kompetanseListe });
    };

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    render() {
        return (
            <div>
                <div className="search-page-header" />
                <Container className="search-page-margin">
                    <Systemtittel>Kandidatsøk</Systemtittel>
                </Container>
                <Container className="blokk-s">
                    <SkjemaGruppe>
                        <form onSubmit={this.onSubmit}>
                            <label htmlFor="yrke" className="skjemaelement__label">
                                Yrke/Stilling
                            </label>
                            <input
                                id="yrke"
                                name="yrke"
                                className="skjemaelement__input input--fullbredde"
                                onChange={this.handleInputChange}
                                value={this.state.yrke}
                            />
                            <label htmlFor="utdanning" className="skjemaelement__label">
                                Utdanning
                            </label>
                            <input
                                id="utdanninger"
                                name="utdanninger"
                                className="skjemaelement__input input--fullbredde"
                                onChange={this.handleInputChange}
                                value={this.state.utdanninger.join(' | ')}
                            />
                            <label htmlFor="kompetanse" className="skjemaelement__label">
                                Kompetanse
                            </label>
                            <input
                                id="kompetanser"
                                name="kompetanser"
                                className="skjemaelement__input input--fullbredde"
                                onChange={this.handleInputChange}
                                value={this.state.kompetanser}
                            />
                            <Row>&nbsp;</Row>
                            <Row>
                                <Column xs="5" md="3">
                                    <Knapp htmlType="submit" type="standard" className="knapp knapp-pam-hoved">Søk</Knapp>
                                </Column>
                            </Row>
                        </form>
                    </SkjemaGruppe>
                </Container>
                <Resultat />
            </div>
        );
    }
}

Kandidatsok.propTypes = {
    search: PropTypes.func.isRequired,
    urlParams: PropTypes.any.isRequired,
    initialSearch: PropTypes.func.isRequired,
    query: PropTypes.shape({
        yrke: PropTypes.string,
        utdanninger: PropTypes.arrayOf(PropTypes.string),
        kompetanser: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

const mapStateToProps = (state) => ({
    kandidater: state.kandidatResultat.kandidater,
    treff: state.kandidatResultat.total,
    isSearching: state.isSearching,
    query: state.query
});

const mapDispatchToProps = (dispatch) => ({
    search: (query) => dispatch({ type: SEARCH, query }),
    initialSearch: (query) => dispatch({ type: INITIAL_SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
