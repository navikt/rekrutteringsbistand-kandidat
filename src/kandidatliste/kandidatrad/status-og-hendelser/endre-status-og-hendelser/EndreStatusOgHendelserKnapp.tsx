import React, { FunctionComponent, MouseEvent } from 'react';
import Lenkeknapp from '../../../../common/lenkeknapp/Lenkeknapp';

type Props = {
    onClick: (event: MouseEvent<HTMLElement>) => void;
};

const EndreStatusOgHendelserKnapp: FunctionComponent<Props> = ({ onClick }) => {
    return (
        <Lenkeknapp
            onClick={onClick}
            className="status-og-hendelser__knapp"
            tittel="Endre status eller hendelser"
        >
            <i className="status-og-hendelser__knappeikon status-og-hendelser__knappeikon--endre" />
        </Lenkeknapp>
    );
};

export default EndreStatusOgHendelserKnapp;
