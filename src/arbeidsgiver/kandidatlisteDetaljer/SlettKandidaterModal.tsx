import * as React from 'react';
import { FunctionComponent } from 'react';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import { Flatknapp, Hovedknapp } from 'pam-frontend-knapper';
import { Kandidat } from './kandidatlisteReducer';
import { fornavnOgEtternavnFraKandidat } from '../../felles/sok/utils';
import { AlertStripeState } from '../../felles/common/hooks/useTimeoutState';
import { FadingAlertStripeLiten } from '../../felles/common/HjelpetekstFading';

interface Props {
    isOpen: boolean,
    sletterKandidater: boolean,
    lukkModal: () => void,
    valgteKandidater: Array<Kandidat>,
    alertState: AlertStripeState,
    onDeleteClick: () => void
}

const SlettKandidaterModal: FunctionComponent<Props> = ({ isOpen, sletterKandidater, lukkModal, valgteKandidater = [], alertState, onDeleteClick }) => (
    <Modal
        className="KandidatlisteDetalj__modal"
        isOpen={isOpen}
        onRequestClose={() => {
            if (!sletterKandidater) {
                lukkModal();
            }
        }}
        closeButton
        contentLabel={valgteKandidater.length === 1 ? 'Slett kandidat' : 'Slett kandidatene'}
    >
        <FadingAlertStripeLiten alertStripeState={alertState} />
        <Sidetittel
            className="overskrift"
        >{valgteKandidater.length === 1 ? 'Slett kandidat' : 'Slett kandidatene'}</Sidetittel>
        <Normaltekst>{valgteKandidater.length === 1
            ? `Er du sikker på at du ønsker å slette ${fornavnOgEtternavnFraKandidat(valgteKandidater[0])} fra listen?`
            : 'Er du sikker på at du ønsker å slette kandidatene fra listen?'
        }
        </Normaltekst>
        <div className="knapperad">
            <Hovedknapp
                onClick={onDeleteClick}
                spinner={sletterKandidater}
                disabled={sletterKandidater}
            >
                Slett
            </Hovedknapp>
            <Flatknapp onClick={lukkModal} disabled={sletterKandidater}>Avbryt</Flatknapp>
        </div>
    </Modal>
);

export default SlettKandidaterModal;
