import React, { FunctionComponent } from 'react';
import NavFrontendModal, { ModalProps } from 'nav-frontend-modal';

const ModalMedKandidatScope: FunctionComponent<ModalProps> = (props) => (
    <NavFrontendModal {...props} portalClassName="rek-kandidat"></NavFrontendModal>
);

export default ModalMedKandidatScope;
