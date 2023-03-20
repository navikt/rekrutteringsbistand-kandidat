import React from 'react';
import { Modal, ModalProps } from '@navikt/ds-react';
import css from './ModalMedKandidatScope.module.css';
import appCss from '../../app/App.module.css';

type Props = ModalProps & {
    contentClass?: string;
};

const ModalMedKandidatScope = ({ children, contentClass, ...props }: Props) => (
    <Modal
        {...props}
        className={css.modal + (props.className ? ' ' + props.className : '')}
        overlayClassName={appCss.modal}
    >
        <Modal.Content className={css.innhold + (contentClass ? ' ' + contentClass : '')}>
            {children}
        </Modal.Content>
    </Modal>
);

export default ModalMedKandidatScope;
