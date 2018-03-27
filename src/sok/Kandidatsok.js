import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { Container, Row, Column } from 'nav-frontend-grid';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';
import { SEARCH } from './domene';
import Resultat from './Resultat';

class Kandidatsok extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yrke: '',
            utdanninger: '',
            kompetanser: ''
        };
    }

    onSubmit = (e) => {
        e.preventDefault();
        const utdanningListe = this.state.utdanninger.split(' | ');
        const kompetanseListe = this.state.kompetanser.split(' | ');
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
                                value={this.state.utdanninger}
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
    search: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    kandidater: state.kandidatResultat.kandidater,
    treff: state.kandidatResultat.total,
    isSearching: state.isSearching
});

const mapDispatchToProps = (dispatch) => ({
    search: (query) => dispatch({ type: SEARCH, query })
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatsok);
