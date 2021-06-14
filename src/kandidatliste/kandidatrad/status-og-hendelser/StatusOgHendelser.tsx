import React, { useState, MouseEvent, FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';

import { KandidatIKandidatliste, Kandidatstatus } from '../../kandidatlistetyper';
import { statusToDisplayName } from '../statusSelect/StatusSelect';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';
import CvDeltEtikett from './CvDeltEtikett';
import FåttJobbenEtikett from './FåttJobbenEtikett';
import EndreStatusOgHendelser from './endre-status-og-hendelser/EndreStatusOgHendelser';
import EndreStatusOgHendelserKnapp from './endre-status-og-hendelser/EndreStatusOgHendelserKnapp';
import SeHendelserKnapp from './se-hendelser/SeHendelserKnapp';
import SeHendelser from './se-hendelser/SeHendelser';
import './StatusOgHendelser.less';

type Props = {
    kandidat: KandidatIKandidatliste;
    kanEditere: boolean;
    onStatusChange: (status: Kandidatstatus) => void;
};

const StatusOgHendelser: FunctionComponent<Props> = ({ kandidat, kanEditere, onStatusChange }) => {
    const [popoverAnker, setPopoverAnker] = useState<HTMLElement | undefined>(undefined);
    const etikettClassName = `status-og-hendelser__status status-og-hendelser__status--${kandidat.status.toLowerCase()}`;

    const togglePopover = (event: MouseEvent<HTMLElement>) => {
        setPopoverAnker(popoverAnker ? undefined : event.currentTarget);
    };

    const lukkPopover = () => {
        setPopoverAnker(undefined);
    };

    const endreStatusOgLukkPopover = (status: Kandidatstatus) => {
        onStatusChange(status);
        lukkPopover();
    };

    return (
        <div className="status-og-hendelser">
            <Etikett mini type="info" className={etikettClassName}>
                {statusToDisplayName(kandidat.status)}
            </Etikett>
            {kandidat.utfall === Utfall.Presentert && <CvDeltEtikett />}
            {kandidat.utfall === Utfall.FåttJobben && <FåttJobbenEtikett />}
            {kanEditere ? (
                <EndreStatusOgHendelserKnapp onClick={togglePopover} />
            ) : (
                <SeHendelserKnapp onClick={togglePopover} />
            )}
            <Popover
                orientering={PopoverOrientering.Under}
                ankerEl={popoverAnker}
                onRequestClose={lukkPopover}
            >
                <div className="status-og-hendelser__popover">
                    {kanEditere ? (
                        <EndreStatusOgHendelser
                            kandidatnummer={kandidat.kandidatnr}
                            kandidatstatus={kandidat.status}
                            onStatusChange={endreStatusOgLukkPopover}
                            utfall={kandidat.utfall}
                        />
                    ) : (
                        <SeHendelser utfall={kandidat.utfall} />
                    )}
                </div>
            </Popover>
        </div>
    );
};

export default StatusOgHendelser;
