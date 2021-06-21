import React, { useState, MouseEvent, FunctionComponent } from 'react';
import { Close } from '@navikt/ds-icons';
import { Knapp } from 'nav-frontend-knapper';
import Etikett from 'nav-frontend-etiketter';
import Popover from 'nav-frontend-popover';

import { KandidatIKandidatliste, Kandidatstatus } from '../../kandidatlistetyper';
import { statusToDisplayName } from '../statusSelect/StatusSelect';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';
import CvDeltEtikett from './CvDeltEtikett';
import FåttJobbenEtikett from './FåttJobbenEtikett';
import EndreStatusOgHendelser from './endre-status-og-hendelser/EndreStatusOgHendelser';
import EndreStatusOgHendelserKnapp from './endre-status-og-hendelser/EndreStatusOgHendelserKnapp';
import SeHendelserKnapp from './se-hendelser/SeHendelserKnapp';
import SeHendelser from './se-hendelser/SeHendelser';
import usePopoverOrientering from './usePopoverOrientering';
import './StatusOgHendelser.less';
import { useRef } from 'react';
import usePopoverAnker from './usePopoverAnker';

type Props = {
    kandidatlisteId: string;
    kandidat: KandidatIKandidatliste;
    kanEditere: boolean;
    onStatusChange: (status: Kandidatstatus) => void;
};

const StatusOgHendelser: FunctionComponent<Props> = ({
    kandidatlisteId,
    kandidat,
    kanEditere,
    onStatusChange,
}) => {
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const { popoverAnker, togglePopover, lukkPopover } = usePopoverAnker(popoverRef);
    const popoverOrientering = usePopoverOrientering(popoverAnker);

    const endreStatusOgLukkPopover = (status: Kandidatstatus) => {
        onStatusChange(status);
        lukkPopover();
    };

    const etikettClassName = `status-og-hendelser__status status-og-hendelser__status--${kandidat.status.toLowerCase()}`;

    return (
        <div className="status-og-hendelser" ref={popoverRef}>
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
                orientering={popoverOrientering}
                ankerEl={popoverAnker}
                onRequestClose={lukkPopover}
            >
                <div className="status-og-hendelser__popover" ref={popoverRef}>
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
