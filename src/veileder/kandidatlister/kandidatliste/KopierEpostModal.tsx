import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';
import { Knapp, Flatknapp } from 'pam-frontend-knapper';
import { Systemtittel, Normaltekst, Ingress, Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import NavFrontendModal from 'nav-frontend-modal';

import { capitalizeFirstLetter } from '../../../felles/sok/utils';
import { FadingAlertStripeLiten } from '../../../felles/common/HjelpetekstFading';
import { Kandidat } from '../kandidatlistetyper';
import { useTimeoutState } from '../../../felles/common/hooks/useTimeoutState';

NavFrontendModal.setAppElement('#app');

interface Props {
    vis?: boolean;
    onClose: () => void;
    kandidater: Array<Kandidat>;
}

function copyToClipboard(text) {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
}

const KopierEpostModal: FunctionComponent<Props> = ({ vis = true, onClose, kandidater }) => {
    const [alertState, clearTimouts, setSuccessMelding] = useTimeoutState(10000);
    useEffect(() => {
        if (!vis) {
            clearTimouts();
        }
    }, [vis]);
    const kandidaterMedEpost = kandidater.filter(kandidat => kandidat.epost);
    const onKopierEpostadresser = () => {
        const epostStreng = kandidaterMedEpost.map(kandidat => `${kandidat.epost}`).join(';');
        copyToClipboard(epostStreng);
        setSuccessMelding(
            <div>
                <Element>E-postadressene er kopiert</Element>
                <Normaltekst>
                    Lim inn adressene i mailprogrammet, og bruk blindkopi (Bcc) feltet. De som
                    mottar e-posten vil da kun se sin egen adresse.
                </Normaltekst>
            </div>
        );
    };
    return (
        <NavFrontendModal
            contentLabel="E-postadressene er kopiert"
            onRequestClose={onClose}
            className="SendEpostModal"
            isOpen={vis}
        >
            <Systemtittel className="SendEpostModal-overskrift">Kopier e-postadresser</Systemtittel>
            <FadingAlertStripeLiten alertStripeState={alertState} />
            <Ingress className="SendEpostModal-ingress">
                <span className="bold">{kandidaterMedEpost.length} </span> av{' '}
                <span className="bold">{kandidater.length}</span> markerte kandidater har registrert
                e-postadresse
            </Ingress>
            <div className="kandidat-tabell">
                <div className="kandidat-tabell-rad">
                    <Element tag="div" className="kandidat-tabell-rad-navn">
                        Navn
                    </Element>
                    <Element tag="div" className="kandidat-tabell-rad-epost">
                        E-postadresse
                    </Element>
                </div>
                <div className="kandidat-tabell-innhold">
                    {kandidater.map(kandidat => (
                        <div
                            className={`kandidat-tabell-rad ${
                                kandidat.epost ? '' : 'kandidat-tabell-rad__inaktiv'
                            }`}
                            key={kandidat.kandidatId}
                        >
                            <div className="kandidat-tabell-rad-navn">
                                <span>{`${
                                    kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : ''
                                } ${
                                    kandidat.etternavn
                                        ? capitalizeFirstLetter(kandidat.etternavn)
                                        : ''
                                }`}</span>
                            </div>
                            <div className="kandidat-tabell-rad-epost">
                                {kandidat.epost ? (
                                    <Lenke className="link" href={`mailto:${kandidat.epost}`}>
                                        {kandidat.epost}
                                    </Lenke>
                                ) : (
                                    <span>&ndash;</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="SendEpostModal--knapperad">
                <Knapp onClick={onKopierEpostadresser} disabled={kandidaterMedEpost.length === 0}>
                    Kopier e-postadresser
                </Knapp>
                <Flatknapp onClick={onClose}>Lukk</Flatknapp>
            </div>
        </NavFrontendModal>
    );
};

export default KopierEpostModal;
