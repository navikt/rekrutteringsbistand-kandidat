import React, { FunctionComponent, useRef } from 'react';
import { XMarkIcon } from '@navikt/aksel-icons';
import { Knapp } from 'nav-frontend-knapper';
import Popover from 'nav-frontend-popover';

import { ForespørslerForKandidatForStilling } from '../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Kandidat, Kandidatstatus } from '../../domene/Kandidat';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import EndreStatusOgHendelser from './endre-status-og-hendelser/EndreStatusOgHendelser';
import StatusOgHendelserKnapp from './endre-status-og-hendelser/StatusOgHendelserKnapp';
import SeHendelser from './se-hendelser/SeHendelser';
import StatusEtikett from './etiketter/StatusEtikett';
import usePopoverAnker from './usePopoverAnker';
import usePopoverOrientering from './usePopoverOrientering';
import Hendelsesetikett from './etiketter/Hendelsesetikett';
import { erKobletTilStilling, Kandidatliste } from '../../domene/Kandidatliste';
import { Sms } from '../../domene/Kandidatressurser';
import './StatusOgHendelser.less';

type Props = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
    forespørselOmDelingAvCv: Nettressurs<ForespørslerForKandidatForStilling>;
    sms?: Sms;
    onStatusChange: (status: Kandidatstatus) => void;
    kanEditere: boolean;
    id?: string;
};

const StatusOgHendelser: FunctionComponent<Props> = ({
    kandidat,
    kandidatliste,
    forespørselOmDelingAvCv,
    sms,
    onStatusChange,
    kanEditere,
    id,
}) => {
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const { popoverAnker, togglePopover, lukkPopover } = usePopoverAnker(popoverRef);
    const popoverOrientering = usePopoverOrientering(popoverAnker);

    const endreStatusOgLukkPopover = (status: Kandidatstatus) => {
        onStatusChange(status);
        lukkPopover();
    };

    const kandidatlistenErKobletTilStilling = erKobletTilStilling(kandidatliste);
    const skalVisePopover = kanEditere || kandidatlistenErKobletTilStilling;

    return (
        <div id={id} className="status-og-hendelser" ref={popoverRef}>
            <StatusEtikett status={kandidat.status} />
            {kandidatlistenErKobletTilStilling && (
                <Hendelsesetikett
                    ikkeVisÅrstall
                    utfall={kandidat.utfall}
                    utfallsendringer={kandidat.utfallsendringer}
                    forespørselOmDelingAvCv={
                        forespørselOmDelingAvCv.kind === Nettstatus.Suksess
                            ? forespørselOmDelingAvCv.data.gjeldendeForespørsel
                            : undefined
                    }
                    sms={sms}
                />
            )}
            {skalVisePopover && <StatusOgHendelserKnapp onClick={togglePopover} />}
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
                                    kandidatliste={kandidatliste}
                                    forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                                    sms={sms}
                                    onStatusChange={endreStatusOgLukkPopover}
                                />
                            ) : (
                                <SeHendelser
                                    kandidat={kandidat}
                                    kandidatlisteId={kandidatliste.kandidatlisteId}
                                    forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                                    sms={sms}
                                    stillingskategori={kandidatliste.stillingskategori}
                                />
                            )}
                            <Knapp
                                mini
                                className="status-og-hendelser__lukk-popover-knapp"
                                onClick={lukkPopover}
                            >
                                <XMarkIcon />
                            </Knapp>
                        </>
                    )}
                </div>
            </Popover>
        </div>
    );
};

export default StatusOgHendelser;
