import React, { ChangeEvent } from 'react';
import Modal from '../../../komponenter/modal/Modal';
import { Notat } from '../../domene/Kandidatressurser';
import { Button, Heading, Textarea } from '@navikt/ds-react';
import css from './Modal.module.css';

type Props = {
    notat: Notat;
    onClose: () => void;
    onSave: (notatId: string, notatTekst: string) => void;
};

class RedigerNotatModal extends React.Component<Props> {
    state: {
        notatTekst: string;
        feilmelding?: string;
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            notatTekst: props.notat.tekst,
            feilmelding: undefined,
        };
    }

    onTekstChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
            <Modal open aria-label="Rediger notat" onClose={onClose}>
                <div className="RedigerNotatModal">
                    <Heading spacing level="2" size="medium" className="overskrift">
                        Rediger notat
                    </Heading>
                    <Textarea
                        autoFocus
                        label="Notat"
                        value={notatTekst}
                        onChange={this.onTekstChange}
                        error={feilmelding}
                    />
                    <div className={css.knapper}>
                        <Button onClick={this.onLagreKlikk}>Lagre</Button>
                        <Button variant="secondary" className="modalknapp" onClick={onClose}>
                            Avbryt
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default RedigerNotatModal;
