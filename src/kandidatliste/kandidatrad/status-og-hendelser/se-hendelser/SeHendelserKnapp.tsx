import React, { FunctionComponent, MouseEvent } from 'react';
import { Eye } from '@navikt/aksel-icons';
import Lenkeknapp from '../../../../common/lenkeknapp/Lenkeknapp';

type Props = {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const SeHendelserKnapp: FunctionComponent<Props> = ({ onClick }) => {
    return (
        <Lenkeknapp onClick={onClick} className="status-og-hendelser__knapp" tittel="Se hendelser">
            <Eye width={20} height={20} />
        </Lenkeknapp>
    );
};

export default SeHendelserKnapp;
