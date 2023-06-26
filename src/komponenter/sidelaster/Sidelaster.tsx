import { Loader, LoaderProps } from '@navikt/ds-react';
import css from './Sidelaster.module.css';
import classNames from 'classnames';

const Sidelaster = ({ size, className }: LoaderProps) => (
    <div className={classNames(css.wrapper, className)}>
        <Loader size={size ?? '2xlarge'} />
    </div>
);

export default Sidelaster;
