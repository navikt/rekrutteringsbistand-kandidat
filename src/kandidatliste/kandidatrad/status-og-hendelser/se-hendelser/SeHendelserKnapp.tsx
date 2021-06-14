import React, { FunctionComponent, MouseEvent } from 'react';
import Lenkeknapp from '../../../../common/lenkeknapp/Lenkeknapp';

type Props = {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
};

const SeHendelserKnapp: FunctionComponent<Props> = ({ onClick }) => {
    return (
        <Lenkeknapp onClick={onClick} className="status-og-hendelser__knapp" tittel="Se hendelser">
            <i className="status-og-hendelser__knappeikon status-og-hendelser__knappeikon--se" />
        </Lenkeknapp>
    );
};

export default SeHendelserKnapp;
