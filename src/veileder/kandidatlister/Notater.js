import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import KnappBase, { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { formatterDato, formatterTid } from '../../felles/common/dateUtils';
import { Notat } from './PropTypes';

class Notater extends React.Component {
    constructor() {
        super();
        this.state = {
            nyttNotatVises: false,
            nyttNotatTekst: '',
            nyttNotatFeil: false
        };
    }

    toggleNyttNotatVises = () => {
        this.setState({
            nyttNotatVises: !this.state.nyttNotatVises,
            nyttNotatTekst: '',
            nyttNotatFeil: false
        });
    };

    oppdaterNyttNotatTekst = (e) => {
        this.setState({
            nyttNotatTekst: e.target.value,
            nyttNotatFeil: false
        });
    };

    lagreNyttNotat = () => {
        if (this.state.nyttNotatTekst.trim().length === 0) {
            this.setState({
                nyttNotatFeil: true
            });
        } else {
            this.props.onOpprettNotat(this.state.nyttNotatTekst);
        }
    };

    render() {
        const { notater, antallNotater } = this.props;
        return (
            <div className="notater">
                <div className="notater-content">
                    <Element>Notater ({antallNotater})</Element>
                    <Normaltekst className="avsnitt">
                        Her skal du kun skrive korte meldinger og statusoppdateringer. Sensitive opplysninger skrives <strong>ikke</strong> her. Ta eventuelt direkte kontakt med aktuell veileder.
                    </Normaltekst>
                    <Normaltekst className="avsnitt">
                        Notatene blir automatisk slettet etter 3 måneder.
                    </Normaltekst>
                    <div className="nytt-notat-form">
                        {this.state.nyttNotatVises
                            ? <div>
                                <Textarea
                                    label="Skriv inn notat"
                                    textareaClass="nytt-notat-tekst"
                                    value={this.state.nyttNotatTekst}
                                    onChange={this.oppdaterNyttNotatTekst}
                                    feil={
                                        this.state.nyttNotatFeil
                                            ? { feilmelding: 'Tekstfeltet kan ikke være tomt' }
                                            : undefined
                                    }
                                />
                                <div className="nytt-notat-knapperad">
                                    <Hovedknapp mini onClick={this.lagreNyttNotat}>Lagre</Hovedknapp>
                                    <Flatknapp mini onClick={this.toggleNyttNotatVises}>Avbryt</Flatknapp>
                                </div>
                            </div>
                            : <KnappBase type="standard" mini onClick={this.toggleNyttNotatVises}>Skriv notat</KnappBase>
                        }
                    </div>
                    { notater === undefined
                        ? <div className="spinner-wrapper">
                            <NavFrontendSpinner />
                        </div>
                        : notater.length > 0 &&
                            <div className="notatliste">
                                {notater.map((notat) => (
                                    <div className="notatliste-rad" key={notat.notatId}>
                                        <div className="topprad">
                                            <div className="info">
                                                <span className="grey-tekst">{`${notat.lagtTilAv.navn} (${notat.lagtTilAv.ident})`}</span>
                                                <span className="grey-tekst">{` - ${formatterDato(new Date(notat.lagtTilTidspunkt))} kl. ${formatterTid(new Date(notat.lagtTilTidspunkt))}`}</span>
                                                {notat.lagtTilTidspunkt !== notat.sistEndretTidspunkt &&
                                                    <span>
                                                        <span className="grey-tekst"> - </span>
                                                        <span className="red-tekst">redigert</span>
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                        <Normaltekst className="notat-tekst">{notat.tekst}</Normaltekst>
                                    </div>
                                ))}
                            </div>
                    }
                </div>
            </div>
        );
    }
}

Notater.defaultProps = {
    notater: undefined
};

Notater.propTypes = {
    antallNotater: PropTypes.number.isRequired,
    notater: PropTypes.arrayOf(PropTypes.shape(Notat)),
    onOpprettNotat: PropTypes.func.isRequired
};

export default Notater;
