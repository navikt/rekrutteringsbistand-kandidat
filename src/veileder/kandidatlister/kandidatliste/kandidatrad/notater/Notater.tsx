import React, { ChangeEvent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Hovedknapp, Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Nettressurs } from '../../../../../felles/common/remoteData';
import { Notat } from '../../../kandidatlistetyper';
import { Textarea } from 'nav-frontend-skjema';
import InfoUnderKandidat from '../info-under-kandidat/InfoUnderKandidat';
import Notatliste from './Notatliste';
import RedigerNotatModal from './RedigerNotatModal';
import Slettemodal from './Slettemodal';
import './Notater.less';

const initialState = {
    nyttNotatVises: false,
    nyttNotatTekst: '',
    nyttNotatFeil: false,
    notatSomRedigeres: undefined,
    notatSomSlettes: undefined,
};

type NotaterProps = {
    antallNotater?: number;
    notater: Nettressurs<Array<Notat>>;
    onOpprettNotat: (tekst: string) => void;
    onEndreNotat: (notatId: string, tekst: string) => void;
    onSlettNotat: (notatId: string) => void;
};

class Notater extends React.Component<NotaterProps> {
    state: {
        nyttNotatVises: boolean;
        nyttNotatTekst: string;
        nyttNotatFeil: boolean;
        notatSomRedigeres?: Notat;
        notatSomSlettes?: Notat;
    };

    constructor(props: NotaterProps) {
        super(props);
        this.state = initialState;
    }

    componentDidUpdate(nextProps: NotaterProps) {
        if (nextProps.notater !== this.props.notater) {
            this.setState(initialState);
        }
    }

    onOpenRedigeringsModal = (notat: Notat) => {
        this.setState({
            notatSomRedigeres: notat,
        });
    };

    onCloseNotatModal = () => {
        this.setState({
            notatSomRedigeres: undefined,
        });
    };

    onOpenSletteModal = (notat: Notat) => {
        this.setState({
            notatSomSlettes: notat,
        });
    };

    onCloseSletteModal = () => {
        this.setState({
            notatSomSlettes: undefined,
        });
    };

    toggleNyttNotatVises = () => {
        this.setState({
            nyttNotatVises: !this.state.nyttNotatVises,
            nyttNotatTekst: '',
            nyttNotatFeil: false,
        });
    };

    oppdaterNyttNotatTekst = (e: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            nyttNotatTekst: e.target.value,
            nyttNotatFeil: false,
        });
    };

    lagreNyttNotat = () => {
        if (this.state.nyttNotatTekst.trim().length === 0) {
            this.setState({
                nyttNotatFeil: true,
            });
        } else {
            this.props.onOpprettNotat(this.state.nyttNotatTekst);
        }
    };

    render() {
        const { notater, antallNotater, onEndreNotat, onSlettNotat } = this.props;

        return (
            <InfoUnderKandidat>
                {this.state.notatSomRedigeres && (
                    <RedigerNotatModal
                        notat={this.state.notatSomRedigeres}
                        onClose={this.onCloseNotatModal}
                        onSave={onEndreNotat}
                    />
                )}
                {this.state.notatSomSlettes && (
                    <Slettemodal
                        notat={this.state.notatSomSlettes}
                        onSlettNotat={onSlettNotat}
                        onCloseSletteModal={this.onCloseSletteModal}
                    />
                )}

                <Element>Notater ({antallNotater})</Element>
                <Normaltekst className="notater__avsnitt">
                    Her skal du kun skrive korte meldinger og statusoppdateringer. Sensitive
                    opplysninger skrives <strong>ikke</strong> her. Ta direkte kontakt med veileder
                    hvis du har spørsmål om en kandidat. Notatene følger ikke brukeren og er bare
                    tilgjengelig via stillingen.
                </Normaltekst>
                <Normaltekst className="notater__avsnitt">
                    Notatene vil være synlige for alle veiledere.
                </Normaltekst>
                <div className="notater__nytt-notat-form">
                    {this.state.nyttNotatVises ? (
                        <div>
                            <Textarea
                                label="Skriv inn notat"
                                textareaClass="notater__nytt-notat-tekst"
                                value={this.state.nyttNotatTekst}
                                onChange={this.oppdaterNyttNotatTekst}
                                autoFocus
                                feil={
                                    this.state.nyttNotatFeil
                                        ? 'Tekstfeltet kan ikke være tomt'
                                        : undefined
                                }
                            />
                            <div className="notater__nytt-notat-knapperad">
                                <Hovedknapp mini onClick={this.lagreNyttNotat}>
                                    Lagre
                                </Hovedknapp>
                                <Flatknapp mini onClick={this.toggleNyttNotatVises}>
                                    Avbryt
                                </Flatknapp>
                            </div>
                        </div>
                    ) : (
                        <Knapp mini onClick={this.toggleNyttNotatVises}>
                            Skriv notat
                        </Knapp>
                    )}
                </div>
                <Notatliste
                    notater={notater}
                    onOpenRedigeringsModal={this.onOpenRedigeringsModal}
                    onOpenSletteModal={this.onOpenSletteModal}
                />
            </InfoUnderKandidat>
        );
    }
}

export default Notater;
