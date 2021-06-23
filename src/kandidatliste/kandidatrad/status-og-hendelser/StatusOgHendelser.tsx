import React, { FunctionComponent, useRef } from 'react';
import { Close } from '@navikt/ds-icons';
import { Knapp } from 'nav-frontend-knapper';
import Popover from 'nav-frontend-popover';

import { Kandidat, Kandidatstatus } from '../../kandidatlistetyper';
import UtfallEtikett, { Utfall } from './etiketter/UtfallEtikett';
import EndreStatusOgHendelser from './endre-status-og-hendelser/EndreStatusOgHendelser';
import EndreStatusOgHendelserKnapp from './endre-status-og-hendelser/EndreStatusOgHendelserKnapp';
import SeHendelserKnapp from './se-hendelser/SeHendelserKnapp';
import SeHendelser from './se-hendelser/SeHendelser';
import usePopoverOrientering from './usePopoverOrientering';
import usePopoverAnker from './usePopoverAnker';
import StatusEtikett from './etiketter/StatusEtikett';
import './StatusOgHendelser.less';

type Props = {
    kandidatlisteId: string;
    kandidat: Kandidat;
    kanEditere: boolean;
    onStatusChange: (status: Kandidatstatus) => void;
    id?: string;
};

const StatusOgHendelser: FunctionComponent<Props> = ({
    kandidatlisteId,
    kandidat,
    kanEditere,
    onStatusChange,
    id,
}) => {
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const { popoverAnker, togglePopover, lukkPopover } = usePopoverAnker(popoverRef);
    const popoverOrientering = usePopoverOrientering(popoverAnker);

    const endreStatusOgLukkPopover = (status: Kandidatstatus) => {
        onStatusChange(status);
        lukkPopover();
    };

    return (
        <div id={id} className="status-og-hendelser" ref={popoverRef}>
            <StatusEtikett status={kandidat.status} />
            {kandidat.utfall !== Utfall.IkkePresentert && (
                <UtfallEtikett utfall={kandidat.utfall} />
            )}
            {kanEditere ? (
                <EndreStatusOgHendelserKnapp onClick={togglePopover} />
            ) : (
                <SeHendelserKnapp onClick={togglePopover} />
            )}
            <Popover
                orientering={popoverOrientering}
                ankerEl={popoverAnker}
                onRequestClose={lukkPopover}
            >
                <div className="status-og-hendelser__popover">
                    {kanEditere ? (
                        <EndreStatusOgHendelser
                            kandidat={kandidat}
                            kandidatlisteId={kandidatlisteId}
                            onStatusChange={endreStatusOgLukkPopover}
                        />
                    ) : (
                        <SeHendelser kandidat={kandidat} kandidatlisteId={kandidatlisteId} />
                    )}
                    <Knapp
                        mini
                        className="status-og-hendelser__lukk-popover-knapp"
                        onClick={lukkPopover}
                    >
                        <Close />
                    </Knapp>
                </div>
            </Popover>
        </div>
    );
};

export default StatusOgHendelser;
