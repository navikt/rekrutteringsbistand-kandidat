import React from 'react';
import { Loader } from '@navikt/ds-react';
import css from './Sidelaster.module.css';
import classNames from 'classnames';

const Sidelaster = ({ className }: { className?: string }) => (
    <div className={classNames(css.wrapper, className)}>
        <Loader size="2xlarge" />
    </div>
);

export default Sidelaster;
