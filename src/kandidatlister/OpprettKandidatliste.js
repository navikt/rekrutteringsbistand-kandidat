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
import { OPPRETT_KANDIDATLISTE, RESET_LAGRE_STATUS } from './kandidatlisteReducer';
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
            visValideringfeilmelding: false
        };
    }

    componentWillUnmount() {
        clearTimeout(this.state.valideringsCallbackId);
    }

    visFeilmelding = () => {
        clearTimeout(this.state.valideringsCallbackId);
        this.setState({
            visValideringfeilmelding: true,
            valideringsCallbackId: setTimeout(() => {
                this.setState({
                    visValideringfeilmelding: false
                });
            }, 5000)
        });
    };

    render() {
        const { opprettKandidatliste, resetStatusTilUnsaved, lagreStatus } = this.props;
        const { visValideringfeilmelding } = this.state;
        if (lagreStatus === LAGRE_STATUS.SUCCESS) {
            return <Redirect to="/pam-kandidatsok/lister" push />;
        }
        return (
            <div>
                <Feedback />
                <HjelpetekstFading synlig={visValideringfeilmelding} type="advarsel" tekst="Navn må være utfylt" />
                <HjelpetekstFading synlig={lagreStatus === LAGRE_STATUS.FAILURE} type="advarsel" tekst="Det skjedde en feil ved lagring" />
                <div className="OpprettKandidatliste__container">
                    <TilbakeLenke href="/pam-kandidatsok/lister" tekst="Til kandidatlister" />
                    <Container className="OpprettKandidatliste__container-width">
                        <Sidetittel>Opprett kandidatliste</Sidetittel>
                        <div className="OpprettKandidatliste__form-wrapper">
                            <OpprettKandidatlisteForm
                                onSave={opprettKandidatliste}
                                onChange={resetStatusTilUnsaved}
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
    resetStatusTilUnsaved: PropTypes.func.isRequired,
    lagreStatus: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    lagreStatus: state.kandidatlister.opprett.lagreStatus
});

const mapDispatchToProps = (dispatch) => ({
    opprettKandidatliste: (kandidatlisteInfo) => { dispatch({ type: OPPRETT_KANDIDATLISTE, kandidatlisteInfo }); },
    resetStatusTilUnsaved: () => { dispatch({ type: RESET_LAGRE_STATUS }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(OpprettKandidatliste);
