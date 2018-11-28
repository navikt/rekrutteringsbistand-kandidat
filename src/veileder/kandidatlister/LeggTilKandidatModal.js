/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel, Normaltekst, Element } from 'nav-frontend-typografi';
import { Input } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import {
    HENT_STATUS,
    HENT_KANDIDAT_MED_FNR,
    HENT_KANDIDAT_MED_FNR_RESET,
    LEGG_TIL_KANDIDATER,
    SET_FODSELSNUMMER
} from './kandidatlisteReducer';
import { Kandidatliste } from './PropTypes';

class LeggTilKandidatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showFodselsnummer: false,
            showAlleredeLagtTilWarning: false,
            errorMessage: undefined
        };
    }

    componentDidMount() {
        this.props.setFodselsnummer(undefined);
        this.props.resetHentKandidatMedFnr();
    }

    componentDidUpdate(prevProps) {
        const { hentStatus } = this.props;
        if (prevProps.hentStatus !== hentStatus) {
            if (hentStatus === HENT_STATUS.SUCCESS) {
                this.setState({
                    showFodselsnummer: true,
                    errorMessage: undefined,
                    showAlleredeLagtTilWarning: this.kandidatenFinnesAllerede()
                });
            } else if (hentStatus === HENT_STATUS.FINNES_IKKE) {
                this.setState({ showFodselsnummer: false, errorMessage: 'Fødselsnummer finnes ikke' });
            }
        }
    }

    onChange = (input) => {
        const fnr = input.target.value;
        this.props.setFodselsnummer(fnr);
        if (fnr.length === 11) {
            this.props.hentKandidatMedFnr(fnr);
        } else if (fnr.length > 11) {
            this.props.resetHentKandidatMedFnr();
            this.setState({ showFodselsnummer: false, errorMessage: 'Fødselsnummeret er for langt', showAlleredeLagtTilWarning: false });
        } else {
            this.props.resetHentKandidatMedFnr();
            this.setState({ showFodselsnummer: false, errorMessage: undefined, showAlleredeLagtTilWarning: false });
        }
    };

    kandidatenFinnesAllerede = () => {
        const kandidat = this.props.kandidatliste.kandidater.filter((k) => (this.props.kandidat.arenaKandidatnr === k.kandidatnr));
        return kandidat.length > 0;
    };

    leggTilKandidat = () => {
        const { kandidat, kandidatliste, hentStatus, fodselsnummer } = this.props;
        const kandidater = [{
            kandidatnr: kandidat.arenaKandidatnr,
            sisteArbeidserfaring: kandidat.mestRelevanteYrkeserfaring ? kandidat.mestRelevanteYrkeserfaring.styrkKodeStillingstittel : ''
        }];
        if (hentStatus === HENT_STATUS.SUCCESS && !this.kandidatenFinnesAllerede()) {
            this.props.leggTilKandidatMedFnr(kandidater, [kandidatliste.kandidatlisteId]);
            this.props.onClose();
        } else {
            if (!fodselsnummer) {
                this.setState({ showFodselsnummer: false, errorMessage: 'Fødselsnummer må fylles inn' });
            } else if (fodselsnummer.length < 11) {
                this.setState({ showFodselsnummer: false, errorMessage: 'Fødselsnummeret er for kort' });
            } else if (this.kandidatenFinnesAllerede()) {
                this.setState({ errorMessage: 'Kandidaten er allerede lagt til i listen' });
            }
            this.input.focus();
        }
    };

    render() {
        const { vis, onClose, fodselsnummer, kandidat } = this.props;
        return (
            <NavFrontendModal
                contentLabel="Modal legg til kandidat"
                isOpen={vis}
                onRequestClose={onClose}
                className="LeggTilKandidatModal"
                appElement={document.getElementById('app')}
            >
                <Systemtittel className="tittel">Legg til kandidat</Systemtittel>
                <Input
                    onChange={this.onChange}
                    feil={this.state.errorMessage && { feilmelding: this.state.errorMessage }}
                    bredde="S"
                    label="Fødselsnummer på kandidaten (11 siffer)"
                    inputRef={(input) => { this.input = input; }}
                />
                {this.state.showFodselsnummer &&
                    <Normaltekst className="fodselsnummer">{`${kandidat.fornavn} ${kandidat.etternavn} (${fodselsnummer})`}</Normaltekst>
                }
                {this.state.showAlleredeLagtTilWarning &&
                    <div className="legg-til-kandidat__advarsel">
                        <Element>
                            <i className="advarsel__icon" />
                            Kandidaten er allerede lagt til i listen
                        </Element>
                    </div>
                }
                <div>
                    <Hovedknapp className="legg-til--knapp" onClick={this.leggTilKandidat}>Legg til</Hovedknapp>
                    <Flatknapp className="avbryt--knapp" onClick={onClose}>Avbryt</Flatknapp>
                </div>
            </NavFrontendModal>
        );
    }
}
LeggTilKandidatModal.defaultProps = {
    vis: true,
    fodselsnummer: undefined,
    kandidatliste: undefined
};

LeggTilKandidatModal.propTypes = {
    vis: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    fodselsnummer: PropTypes.string,
    kandidatliste: PropTypes.shape(Kandidatliste),
    setFodselsnummer: PropTypes.func.isRequired,
    hentKandidatMedFnr: PropTypes.func.isRequired,
    resetHentKandidatMedFnr: PropTypes.func.isRequired,
    leggTilKandidatMedFnr: PropTypes.func.isRequired,
    kandidat: PropTypes.shape({
        arenaKandidatnr: PropTypes.string,
        fornavn: PropTypes.string,
        etternavn: PropTypes.string,
        mestRelevanteYrkeserfaring: PropTypes.shape({
            styrkKodeStillingstittel: PropTypes.string,
            yrkeserfaringManeder: PropTypes.number
        })
    }).isRequired,
    hentStatus: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    fodselsnummer: state.kandidatlister.fodselsnummer,
    kandidat: state.kandidatlister.kandidat,
    hentStatus: state.kandidatlister.hentStatus,
    kandidatliste: state.kandidatlister.detaljer.kandidatliste
});

const mapDispatchToProps = (dispatch) => ({
    setFodselsnummer: (fodselsnummer) => { dispatch({ type: SET_FODSELSNUMMER, fodselsnummer }); },
    hentKandidatMedFnr: (fodselsnummer) => { dispatch({ type: HENT_KANDIDAT_MED_FNR, fodselsnummer }); },
    resetHentKandidatMedFnr: () => { dispatch({ type: HENT_KANDIDAT_MED_FNR_RESET }); },
    leggTilKandidatMedFnr: (kandidater, kandidatlisteIder) => { dispatch({ type: LEGG_TIL_KANDIDATER, kandidater, kandidatlisteIder }); }
});

export default connect(mapStateToProps, mapDispatchToProps)(LeggTilKandidatModal);
