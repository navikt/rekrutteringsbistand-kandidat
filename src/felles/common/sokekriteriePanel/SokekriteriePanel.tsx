import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { sendEvent } from '../../../veileder/amplitude/amplitude';
import './SokekriteriePanel.less';

type Props = {
    id: string;
    tittel: any;
    fane: string;
    apen: boolean;
    onClick: () => void;
};

const SokekriteriePanel: FunctionComponent<Props> = ({
    children,
    tittel,
    fane,
    apen,
    onClick,
    id,
}) => {
    const onClickMedLogging = () => {
        if (!apen) {
            sendEvent('kandidatsøk_filterfane', 'åpne', { fane });
        }

        onClick();
    };

    return (
        <Ekspanderbartpanel
            apen={apen}
            tittel={tittel}
            className="sokekriterie-panel"
            onClick={onClickMedLogging}
        >
            <div id={`${id}-innhold`}>{children}</div>
        </Ekspanderbartpanel>
    );
};

export default SokekriteriePanel;
