import React, { FunctionComponent } from 'react';
import { AddCircle } from '@navikt/ds-icons';
import { Flatknapp } from 'nav-frontend-knapper';

type Props = {
    onDelPåNyttClick: () => void;
};

const DelPåNyttKnapp: FunctionComponent<Props> = ({ onDelPåNyttClick }) => {
    return (
        <Flatknapp
            onClick={onDelPåNyttClick}
            className="endre-status-og-hendelser__del-på-nytt"
            kompakt
            mini
        >
            <AddCircle />
            Del på nytt
        </Flatknapp>
    );
};

export default DelPåNyttKnapp;
