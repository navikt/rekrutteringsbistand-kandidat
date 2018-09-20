import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import HjelpetekstFading from '../common/HjelpetekstFading';
import Feedback from '../feedback/Feedback';
import './kandidatlister.less';
import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import TilbakeLenke from '../common/TilbakeLenke';
import { OPPRETT_KANDIDATLISTE } from './kandidatlisteReducer';

const tomKandidatlisteInfo = () => ({
    navn: '',
    beskrivelse: '',
    oppdragsgiver: ''
});

class OpprettKandidatliste extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feilmeldingVises: false
        };
    }

    componentWillUnmount() {
        clearTimeout(this.state.callbackId);
    }

    visFeilmelding = () => {
        clearTimeout(this.state.callbackId);
        this.setState({
            feilmeldingVises: true,
            callbackId: setTimeout(() => {
                this.setState({
                    feilmeldingVises: false
                });
            }, 5000)
        });
    };

    render() {
        const { opprettKandidatliste } = this.props;
        const { feilmeldingVises } = this.state;
        return (
            <div>
                <Feedback />
                <HjelpetekstFading synlig={feilmeldingVises} type="advarsel" tekst="Navn må være utfylt" />
                <div className="OpprettKandidatliste__container">
                    <TilbakeLenke href="/pam-kandidatsok/lister" tekst="Til kandidatlister" />
                    <Container className="OpprettKandidatliste__container-width">
                        <Sidetittel>Opprett kandidatliste</Sidetittel>
                        <div className="OpprettKandidatliste__form-wrapper">
                            <OpprettKandidatlisteForm
                                onSave={opprettKandidatliste}
                                onDisabledClick={this.visFeilmelding}
                                backLink="/pam-kandidatsok/lister"
                                kandidatlisteInfo={tomKandidatlisteInfo()}
                            />
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

OpprettKandidatliste.propTypes = {
    opprettKandidatliste: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
    opprettKandidatliste: (kandidatlisteInfo) => { dispatch({ type: OPPRETT_KANDIDATLISTE, kandidatlisteInfo }); }
});

export default connect(null, mapDispatchToProps)(OpprettKandidatliste);
