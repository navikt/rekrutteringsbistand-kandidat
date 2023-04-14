import React, { MouseEvent, MutableRefObject, forwardRef } from 'react';
import { EyeIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

type Props = {
    kanEndre: boolean;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const StatusOgHendelserKnapp = forwardRef(
    ({ kanEndre, onClick }: Props, ref: MutableRefObject<HTMLButtonElement>) => {
        return (
            <Button
                ref={ref}
                size="small"
                variant="tertiary"
                onClick={onClick}
                aria-label={kanEndre ? 'Endre status eller hendelser' : 'Se status eller hendelser'}
                icon={kanEndre ? <PencilIcon /> : <EyeIcon />}
            />
        );
    }
);

export default StatusOgHendelserKnapp;
