import { Label } from '@navikt/ds-react';
import { ReactNode } from 'react';
import css from './IngenKandidater.module.css';

type Props = {
    children: ReactNode;
};

const IngenKandidater = ({ children }: Props) => {
    return (
        <Label size="small" className={css.ingenKandidater}>
            {children}
        </Label>
    );
};

export default IngenKandidater;
