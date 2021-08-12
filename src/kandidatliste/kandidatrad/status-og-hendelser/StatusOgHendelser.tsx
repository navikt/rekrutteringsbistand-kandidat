import React, { FunctionComponent, useRef } from 'react';
import { Close } from '@navikt/ds-icons';
import { Knapp } from 'nav-frontend-knapper';
import Popover from 'nav-frontend-popover';

import { ForespørselOmDelingAvCv } from '../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Kandidat, Kandidatstatus } from '../../domene/Kandidat';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import EndreStatusOgHendelser from './endre-status-og-hendelser/EndreStatusOgHendelser';
import EndreStatusOgHendelserKnapp from './endre-status-og-hendelser/EndreStatusOgHendelserKnapp';
import SeHendelser from './se-hendelser/SeHendelser';
import SeHendelserKnapp from './se-hendelser/SeHendelserKnapp';
import StatusEtikett from './etiketter/StatusEtikett';
import usePopoverAnker from './usePopoverAnker';
import usePopoverOrientering from './usePopoverOrientering';
import Hendelsesetikett from './etiketter/Hendelsesetikett';
import './StatusOgHendelser.less';

type Props = {
    kandidatlisteId: string;
    kandidat: Kandidat;
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
    kanEditere: boolean;
    kandidatlistenErKobletTilStilling: boolean;
    onStatusChange: (status: Kandidatstatus) => void;
    id?: string;
};

const StatusOgHendelser: FunctionComponent<Props> = ({
    kandidatlisteId,
    kandidat,
    forespørselOmDelingAvCv,
    kanEditere,
    onStatusChange,
    kandidatlistenErKobletTilStilling,
    id,
}) => {
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const { popoverAnker, togglePopover, lukkPopover } = usePopoverAnker(popoverRef);
    const popoverOrientering = usePopoverOrientering(popoverAnker);

    const endreStatusOgLukkPopover = (status: Kandidatstatus) => {
        onStatusChange(status);
        lukkPopover();
    };

    const skalVisePopover = kanEditere || kandidatlistenErKobletTilStilling;

    return (
        <div id={id} className="status-og-hendelser" ref={popoverRef}>
            <StatusEtikett status={kandidat.status} />
            {kandidatlistenErKobletTilStilling && (
                <Hendelsesetikett
                    utfall={kandidat.utfall}
                    forespørselOmDelingAvCv={
                        forespørselOmDelingAvCv.kind === Nettstatus.Suksess
                            ? forespørselOmDelingAvCv.data
                            : undefined
                    }
                />
            )}
            {skalVisePopover && (
                <>
                    {kanEditere ? (
                        <EndreStatusOgHendelserKnapp onClick={togglePopover} />
                    ) : (
                        <SeHendelserKnapp onClick={togglePopover} />
                    )}
                </>
            )}
            <Popover
                orientering={popoverOrientering}
                ankerEl={popoverAnker}
                onRequestClose={lukkPopover}
            >
                <div className="status-og-hendelser__popover">
                    {skalVisePopover && (
                        <>
                            {kanEditere ? (
                                <EndreStatusOgHendelser
                                    kandidat={kandidat}
                                    forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                                    kandidatlisteId={kandidatlisteId}
                                    onStatusChange={endreStatusOgLukkPopover}
                                    kandidatlistenErKobletTilStilling={
                                        kandidatlistenErKobletTilStilling
                                    }
                                />
                            ) : (
                                <SeHendelser
                                    kandidat={kandidat}
                                    kandidatlisteId={kandidatlisteId}
                                />
                            )}
                            <Knapp
                                mini
                                className="status-og-hendelser__lukk-popover-knapp"
                                onClick={lukkPopover}
                            >
                                <Close />
                            </Knapp>
                        </>
                    )}
                </div>
            </Popover>
        </div>
    );
};

export default StatusOgHendelser;
