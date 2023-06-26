import { FunctionComponent, useRef, useState } from 'react';
import { Button, Popover } from '@navikt/ds-react';
import { EyeIcon, PencilIcon, XMarkIcon } from '@navikt/aksel-icons';

import { ForespørslerForKandidatForStilling } from '../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Kandidat, Kandidatstatus } from '../../domene/Kandidat';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import EndreStatusOgHendelser from './endre-status-og-hendelser/EndreStatusOgHendelser';
import SeHendelser from './se-hendelser/SeHendelser';
import StatusEtikett from './etiketter/StatusEtikett';
import Hendelsesetikett from './etiketter/Hendelsesetikett';
import { erKobletTilStilling, Kandidatliste } from '../../domene/Kandidatliste';
import { Sms } from '../../domene/Kandidatressurser';
import css from './StatusOgHendelser.module.css';
import classNames from 'classnames';

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
    const popoverRef = useRef<HTMLButtonElement | null>(null);
    const [visPopover, setVisPopover] = useState<boolean>(false);

    const endreStatusOgLukkPopover = (status: Kandidatstatus) => {
        onStatusChange(status);
        setVisPopover(false);
    };

    const kandidatlistenErKobletTilStilling = erKobletTilStilling(kandidatliste);
    const kanEndreStatusOgHendelser = kanEditere || kandidatlistenErKobletTilStilling;

    return (
        <div id={id} className={css.statusOgHendelser}>
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
            {kanEndreStatusOgHendelser && (
                <Button
                    size="small"
                    variant="tertiary"
                    ref={popoverRef}
                    onClick={() => setVisPopover(!visPopover)}
                    icon={kanEditere ? <PencilIcon /> : <EyeIcon />}
                    aria-label={
                        kanEditere ? 'Endre status eller hendelser' : 'Se status eller hendelser'
                    }
                />
            )}
            <Popover
                open={visPopover}
                anchorEl={popoverRef.current}
                onClose={() => setVisPopover(false)}
            >
                <Popover.Content
                    className={classNames(css.popover, {
                        [css.popoverBred]: kanEditere,
                    })}
                >
                    {kanEditere ? (
                        <EndreStatusOgHendelser
                            kandidat={kandidat}
                            kandidatliste={kandidatliste}
                            forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                            onStatusChange={endreStatusOgLukkPopover}
                            sms={sms}
                        />
                    ) : (
                        <SeHendelser
                            kandidat={kandidat}
                            kandidatlisteId={kandidatliste.kandidatlisteId}
                            forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                            stillingskategori={kandidatliste.stillingskategori}
                            sms={sms}
                        />
                    )}
                    <Button
                        variant="secondary"
                        className={css.lukkPopoverKnapp}
                        onClick={() => setVisPopover(false)}
                        icon={<XMarkIcon />}
                        size="small"
                    ></Button>
                </Popover.Content>
            </Popover>
        </div>
    );
};

export default StatusOgHendelser;
