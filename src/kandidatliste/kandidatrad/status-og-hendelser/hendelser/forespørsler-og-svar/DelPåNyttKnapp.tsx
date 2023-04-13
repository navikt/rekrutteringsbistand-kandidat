import React, { FunctionComponent } from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

type Props = {
    onDelPåNyttClick: () => void;
};

const DelPåNyttKnapp: FunctionComponent<Props> = ({ onDelPåNyttClick }) => {
    return (
        <Button
            variant='tertiary'
            onClick={onDelPåNyttClick}
            icon={<PlusCircleIcon />}
        >
            
            Del på nytt
        </Button>
    );
};

export default DelPåNyttKnapp;
