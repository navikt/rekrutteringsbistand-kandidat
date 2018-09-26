import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container } from 'nav-frontend-grid';
import { Sidetittel } from 'nav-frontend-typografi';
import HjelpetekstFading from '../common/HjelpetekstFading';
import Feedback from '../feedback/Feedback';
import './kandidatlister.less';
import OpprettKandidatlisteForm from './OpprettKandidatlisteForm';
import TilbakeLenke from '../common/TilbakeLenke';
import { OPPRETT_KANDIDATLISTE } from './kandidatlisteReducer';
import { LAGRE_STATUS } from '../konstanter';

const tomKandidatlisteInfo = () => ({
    tittel: '',
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
        const { opprettKandidatliste, lagreStatus } = this.props;
        const { feilmeldingVises } = this.state;
        if (lagreStatus === LAGRE_STATUS.SUCCESS) {
            return <Redirect to="/pam-kandidatsok/lister" push />;
        }
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
                                saving={lagreStatus === LAGRE_STATUS.LOADING}
                            />
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

OpprettKandidatliste.propTypes = {
    opprettKandidatliste: PropTypes.func.isRequired,
    lagreStatus: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.lagreStatus
});

const mapDispatchToProps = (dispatch) => ({
    opprettKandidatliste: (kandidatlisteInfo) => { dispatch({ type: OPPRETT_KANDIDATLISTE, kandidatlisteInfo }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettKandidatliste);
