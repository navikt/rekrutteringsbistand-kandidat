import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { KandidatIKandidatliste, Kandidatstatus } from '../../kandidatlistetyper';
import { statusToDisplayName } from '../statusSelect/StatusSelect';
import './StatusOgHendelser.less';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import EndreStatusOgHendelser from './EndreStatusOgHendelser';
import SeHendelser from './SeHendelser';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { useState } from 'react';
import { MouseEvent } from 'react';

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
            {kandidat.utfall === Utfall.Presentert && (
                <Etikett
                    mini
                    type="info"
                    className="status-og-hendelser__hendelse status-og-hendelser__hendelse--presentert"
                >
                    CV delt
                </Etikett>
            )}
            {kandidat.utfall === Utfall.FåttJobben && (
                <Etikett
                    mini
                    type="info"
                    className="status-og-hendelser__hendelse status-og-hendelser__hendelse--fatt-jobben"
                >
                    Fått jobben
                </Etikett>
            )}
            {kanEditere ? (
                <Lenkeknapp
                    onClick={togglePopover}
                    className="status-og-hendelser__knapp"
                    tittel="Endre status eller hendelser"
                >
                    <i className="status-og-hendelser__knappeikon status-og-hendelser__knappeikon--endre" />
                </Lenkeknapp>
            ) : (
                <Lenkeknapp
                    onClick={togglePopover}
                    className="status-og-hendelser__knapp"
                    tittel="Se hendelser"
                >
                    <i className="status-og-hendelser__knappeikon status-og-hendelser__knappeikon--se" />
                </Lenkeknapp>
            )}
            <Popover
                orientering={PopoverOrientering.Under}
                ankerEl={popoverAnker}
                onRequestClose={lukkPopover}
            >
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
            </Popover>
        </div>
    );
};

export default StatusOgHendelser;
