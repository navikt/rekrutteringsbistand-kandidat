import React, { FunctionComponent } from 'react';
import Etikett from 'nav-frontend-etiketter';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { statusToDisplayName } from '../statusSelect/StatusSelect';
import './StatusOgHendelser.less';
import { Utfall } from '../utfall-med-endre-ikon/UtfallMedEndreIkon';
import MedPopover from '../../../common/med-popover/MedPopover';
import Lenkeknapp from '../../../common/lenkeknapp/Lenkeknapp';
import EndreStatusOgHendelser from './EndreStatusOgHendelser';
import SeHendelser from './SeHendelser';

type Props = {
    kandidat: KandidatIKandidatliste;
    kanEditere: boolean;
};

const StatusOgHendelser: FunctionComponent<Props> = ({ kandidat, kanEditere }) => {
    const etikettClassName = `status-og-hendelser__status status-og-hendelser__status--${kandidat.status.toLowerCase()}`;

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
                <MedPopover
                    hjelpetekst={
                        <EndreStatusOgHendelser status={kandidat.status} utfall={kandidat.utfall} />
                    }
                >
                    <Lenkeknapp
                        className="status-og-hendelser__knapp"
                        tittel="Endre status eller hendelser"
                    >
                        <i className="status-og-hendelser__knappeikon status-og-hendelser__knappeikon--endre" />
                    </Lenkeknapp>
                </MedPopover>
            ) : (
                <MedPopover hjelpetekst={<SeHendelser utfall={kandidat.utfall} />}>
                    <Lenkeknapp className="status-og-hendelser__knapp" tittel="Se hendelser">
                        <i className="status-og-hendelser__knappeikon status-og-hendelser__knappeikon--se" />
                    </Lenkeknapp>
                </MedPopover>
            )}
        </div>
    );
};

export default StatusOgHendelser;
