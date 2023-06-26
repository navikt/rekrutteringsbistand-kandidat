import { Modal as DsModal, ModalProps } from '@navikt/ds-react';
import css from './Modal.module.css';
import classNames from 'classnames';

const Modal = ({ children, ...props }: ModalProps) => (
    <DsModal {...props} className={classNames(css.modal, props.className)}>
        <DsModal.Content className={css.innhold}>{children}</DsModal.Content>
    </DsModal>
);

export default Modal;
