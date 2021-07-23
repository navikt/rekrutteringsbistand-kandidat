import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';
import { Knapp, Flatknapp } from 'nav-frontend-knapper';
import { Systemtittel, Normaltekst, Ingress, Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import { FadingAlertStripeLiten } from '../../common/varsling/HjelpetekstFading';
import { Kandidat } from '../domene/Kandidat';
import { useTimeoutState } from '../../common/useTimeoutState';
import ModalMedKandidatScope from '../../common/ModalMedKandidatScope';
import './KopierEpostModal.less';

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
        // clearTimouts som dep gir evig løkke
        // eslint-disable-next-line
    }, [vis]);
    const kandidaterMedEpost = kandidater.filter((kandidat) => kandidat.epost);
    const onKopierEpostadresser = () => {
        const epostStreng = kandidaterMedEpost.map((kandidat) => `${kandidat.epost}`).join(';');
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
        <ModalMedKandidatScope
            contentLabel="E-postadressene er kopiert"
            onRequestClose={onClose}
            className="KopierEpostModal"
            isOpen={vis}
        >
            <Systemtittel className="KopierEpostModal-overskrift">
                Kopier e-postadresser
            </Systemtittel>
            <FadingAlertStripeLiten alertStripeState={alertState} />
            <Ingress className="KopierEpostModal-ingress">
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
                    {kandidater.map((kandidat) => (
                        <div
                            className={`kandidat-tabell-rad ${
                                kandidat.epost ? '' : 'kandidat-tabell-rad__inaktiv'
                            }`}
                            key={kandidat.kandidatnr}
                        >
                            <div className="kandidat-tabell-rad-navn">
                                <Normaltekst>{`${
                                    kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : ''
                                } ${
                                    kandidat.etternavn
                                        ? capitalizeFirstLetter(kandidat.etternavn)
                                        : ''
                                }`}</Normaltekst>
                            </div>
                            <div className="kandidat-tabell-rad-epost">
                                {kandidat.epost ? (
                                    <Lenke className="lenke" href={`mailto:${kandidat.epost}`}>
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
            <div className="KopierEpostModal--knapperad">
                <Knapp onClick={onKopierEpostadresser} disabled={kandidaterMedEpost.length === 0}>
                    Kopier e-postadresser
                </Knapp>
                <Flatknapp onClick={onClose}>Lukk</Flatknapp>
            </div>
        </ModalMedKandidatScope>
    );
};

export default KopierEpostModal;
