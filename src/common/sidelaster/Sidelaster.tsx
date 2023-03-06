import React from 'react';
import { Loader } from '@navikt/ds-react';
import css from './Sidelaster.module.css';

const Sidelaster = () => (
    <div className={css.wrapper}>
        <Loader size="large" />
    </div>
);

export default Sidelaster;
