import React from 'react';
import PropTypes from 'prop-types';
import NavFrontendModal from 'nav-frontend-modal';
import { Systemtittel } from 'nav-frontend-typografi';
import { Textarea } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import { Notat } from '../PropTypes';

export default class RedigerNotatModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notatTekst: props.notat.tekst,
            feilmelding: undefined,
        };
    }

    onTekstChange = e => {
        this.setState({
            notatTekst: e.target.value,
        });
    };

    onLagreKlikk = () => {
        if (this.state.notatTekst.trim().length === 0) {
            this.setState({
                feilmelding: 'Notattekst må være utfylt',
            });
        } else {
            this.props.onSave(this.props.notat.notatId, this.state.notatTekst);
        }
    };

    render() {
        const { onClose } = this.props;
        const { notatTekst, feilmelding } = this.state;
        return (
            <NavFrontendModal
                isOpen
                contentLabel={'Rediger notat'}
                onRequestClose={onClose}
                appElement={document.getElementById('app')}
            >
                <div className="RedigerNotatModal">
                    <Systemtittel className="overskrift">Rediger notat</Systemtittel>
                    <div className="tekstomrade skjemaelement--pink">
                        <Textarea
                            autoFocus
                            label="Notat"
                            value={notatTekst}
                            onChange={this.onTekstChange}
                            textareaClass="tekstomrade-input"
                            feil={feilmelding ? { feilmelding } : undefined}
                        />
                    </div>
                    <Hovedknapp className="modalknapp venstre" onClick={this.onLagreKlikk}>
                        Lagre
                    </Hovedknapp>
                    <Flatknapp className="modalknapp" onClick={onClose}>
                        Avbryt
                    </Flatknapp>
                </div>
            </NavFrontendModal>
        );
    }
}

RedigerNotatModal.propTypes = {
    notat: PropTypes.shape(Notat).isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};
