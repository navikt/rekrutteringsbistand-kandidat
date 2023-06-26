import { Label } from '@navikt/ds-react';
import { FunctionComponent } from 'react';
import css from './IngenKandidater.module.css';

const IngenKandidater: FunctionComponent = ({ children }) => {
    return (
        <Label size="small" className={css.ingenKandidater}>
            {children}
        </Label>
    );
};

export default IngenKandidater;
