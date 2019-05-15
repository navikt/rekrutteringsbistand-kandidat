import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { Hovedknapp, Flatknapp, Knapp } from 'pam-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import NavFrontendModal from 'nav-frontend-modal';
import { formatterDato, formatterTid } from '../../felles/common/dateUtils';
import { RemoteDataTypes } from '../../felles/common/remoteData.ts';
import { Notat } from './PropTypes';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import RedigerNotatModal from './RedigerNotatModal';

class Notater extends React.Component {
    constructor() {
        super();
        this.state = {
            nyttNotatVises: false,
            nyttNotatTekst: '',
            nyttNotatFeil: false,
            notatSomRedigeres: undefined,
            notatSomSlettes: undefined
        };
    }

    onOpenRedigeringsModal = (notat) => () => {
        this.setState({
            notatSomRedigeres: notat
        });
    };

    onCloseNotatModal = () => {
        this.setState({
            notatSomRedigeres: undefined
        });
    };

    onOpenSletteModal = (notat) => () => {
        this.setState({
            notatSomSlettes: notat
        });
    };

    onCloseSletteModal = () => {
        this.setState({
            notatSomSlettes: undefined
        });
    };

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
        const { notater, antallNotater, onEndreNotat, onSletteNotat } = this.props;
        const NotatInfo = ({ notat }) => (
            <div className="notatinfo">
                <span className="grey-tekst">{`${notat.lagtTilAv.navn} (${notat.lagtTilAv.ident})`}</span>
                <span className="grey-tekst">{` - ${formatterDato(new Date(notat.lagtTilTidspunkt))} kl. ${formatterTid(new Date(notat.lagtTilTidspunkt))}`}</span>
                {notat.notatEndret &&
                    <span>
                        <span className="grey-tekst"> - </span>
                        <span className="red-tekst">redigert</span>
                    </span>
                }
            </div>
        );
        const SletteModal = ({ notat }) => (
            <NavFrontendModal
                isOpen
                contentLabel={'Rediger notat'}
                onRequestClose={this.onCloseSletteModal}
                className="SlettNotatModal"
                appElement={document.getElementById('app')}
            >
                <Systemtittel className="overskrift">Slett notat</Systemtittel>
                <Normaltekst className="notat-tekst">Er du sikker på at du ønsker å slette notatet?</Normaltekst>
                <div className="notat-topprad">
                    <NotatInfo notat={notat} />
                </div>
                <Normaltekst className="notat-tekst">{notat.tekst}</Normaltekst>
                <Hovedknapp onClick={() => { onSletteNotat(notat.notatId); }}>Slett</Hovedknapp>
                <Flatknapp className="avbryt--knapp" onClick={this.onCloseSletteModal}>Avbryt</Flatknapp>
            </NavFrontendModal>
        );
        const Notatliste = () => {
            switch (notater.kind) {
                case RemoteDataTypes.LOADING:
                    return (
                        <div className="spinner-wrapper">
                            <NavFrontendSpinner />
                        </div>
                    );
                case RemoteDataTypes.SUCCESS:
                    if (notater.data.length !== 0) {
                        return (
                            <div className="notatliste">
                                {notater.data.map((notat) => (
                                    <div className="notatliste-rad" key={notat.notatId}>
                                        <div className="notat-topprad">
                                            <NotatInfo notat={notat} />
                                            {notat.kanEditere &&
                                            <div className="endre-knapper">
                                                <Lenkeknapp className="Edit " onClick={() => { this.onOpenRedigeringsModal(notat); }}>
                                                    <i className="Edit__icon" />
                                                </Lenkeknapp>
                                                <Lenkeknapp className="Delete" onClick={() => { this.onOpenSletteModal(notat); }}>
                                                    <i className="Delete__icon" />
                                                </Lenkeknapp>
                                            </div>
                                            }
                                        </div>
                                        <Normaltekst className="notat-tekst">{notat.tekst}</Normaltekst>
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    return null;
                default:
                    return null;
            }
        };
        return (
            <div className="info-under-kandidat">
                { this.state.notatSomRedigeres &&
                    <RedigerNotatModal
                        notat={this.state.notatSomRedigeres}
                        onClose={this.onCloseNotatModal}
                        onSave={onEndreNotat}
                    />
                }
                { this.state.notatSomSlettes &&
                    <SletteModal notat={this.state.notatSomSlettes} />
                }
                <div className="info-under-kandidat-content">
                    <Element>Notater ({antallNotater})</Element>
                    <Normaltekst className="avsnitt">
                        Her skal du kun skrive korte meldinger og statusoppdateringer. Sensitive opplysninger skrives <strong>ikke</strong> her.
                        Ta direkte kontakt med veileder hvis du har spørsmål om en kandidat. Notatene følger ikke brukeren og er bare tilgjengelig via stillingen.
                    </Normaltekst>
                    <Normaltekst className="avsnitt">
                        Notatene vil være synlige for alle veiledere, og blir automatisk slettet etter 3 måneder.
                    </Normaltekst>
                    <div className="nytt-notat-form">
                        {this.state.nyttNotatVises
                            ? <div className="skjemaelement--pink">
                                <Textarea
                                    label="Skriv inn notat"
                                    textareaClass="nytt-notat-tekst"
                                    value={this.state.nyttNotatTekst}
                                    onChange={this.oppdaterNyttNotatTekst}
                                    autoFocus
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
                            : <Knapp mini onClick={this.toggleNyttNotatVises}>Skriv notat</Knapp>
                        }
                    </div>
                    <Notatliste />
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
    notater: PropTypes.shape({
        kind: PropTypes.string,
        data: PropTypes.arrayOf(PropTypes.shape(Notat))
    }),
    onOpprettNotat: PropTypes.func.isRequired,
    onEndreNotat: PropTypes.func.isRequired,
    onSletteNotat: PropTypes.func.isRequired
};

export default Notater;
