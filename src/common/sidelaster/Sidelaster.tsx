import React from 'react';
import { Loader } from '@navikt/ds-react';
import css from './Sidelaster.module.css';

const Sidelaster = () => (
    <div className={css.wrapper}>
        <Loader size="2xlarge" />
    </div>
);

export default Sidelaster;
