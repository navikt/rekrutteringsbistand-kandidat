import React, { FunctionComponent } from 'react';
import './ManglerTilgang.less';

const ManglerTilgang: FunctionComponent = () => {
    return (
        <p className="mangler-tilgang" aria-live="assertive">
            Du mangler tilgang til å se denne delen av Rekrutteringsbistand
        </p>
    );
};

export default ManglerTilgang;
