import React, { FunctionComponent } from 'react';
import Modal from 'nav-frontend-modal';
import { KandidatIKandidatliste } from '../kandidatlistetyper';

type Props = {
    vis: boolean;
    onClose: () => void;
    kandidater: KandidatIKandidatliste[];
};

const SendSmsModal: FunctionComponent<Props> = ({ vis, onClose, kandidater }) => {
    return (
        <Modal
            isOpen={vis}
            onRequestClose={onClose}
            contentLabel={`Send SMS til ${kandidater.length} kandidater`}
            closeButton
        >
            Send SMS
        </Modal>
    );
};

export default SendSmsModal;
