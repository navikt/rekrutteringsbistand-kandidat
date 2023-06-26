import { FunctionComponent } from 'react';
import css from './ManglerTilgang.module.css';

const ManglerTilgang: FunctionComponent = () => {
    return (
        <p className={css.manglerTilgang} aria-live="assertive">
            Du mangler tilgang til å se denne delen av Rekrutteringsbistand
        </p>
    );
};

export default ManglerTilgang;
