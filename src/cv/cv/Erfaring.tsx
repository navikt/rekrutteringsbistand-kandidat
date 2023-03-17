import { Detail } from '@navikt/ds-react';
import Tidsperiode from './Tidsperiode';
import css from './Cv.module.css';
import { ReactNode } from 'react';

type Props = {
    fraDato: string | null;
    tilDato?: string | null;
    nåværende?: boolean;
    children: ReactNode;
};

const Erfaring = ({ fraDato, tilDato, nåværende, children }: Props) => (
    <>
        <Detail className={css.tidsperiode}>
            <Tidsperiode fradato={fraDato} tildato={tilDato} navarende={nåværende} />
        </Detail>
        <div className={css.erfaring}>{children}</div>
    </>
);

export default Erfaring;
