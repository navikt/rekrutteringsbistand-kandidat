import { Alert } from '@navikt/ds-react';
import css from './Sidefeil.module.css';

type Props = {
    feilmelding: string;
};

const Sidefeil = ({ feilmelding }: Props) => (
    <div className={css.wrapper}>
        <Alert variant="error">{feilmelding}</Alert>
    </div>
);

export default Sidefeil;
