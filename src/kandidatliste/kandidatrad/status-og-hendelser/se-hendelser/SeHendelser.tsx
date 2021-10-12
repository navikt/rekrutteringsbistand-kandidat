import React, { FunctionComponent } from 'react';
import { Kandidat } from '../../../domene/Kandidat';
import { Undertittel } from 'nav-frontend-typografi';
import DelCvMedArbeidsgiver from '../hendelser/DelCvMedArbeidsgiver';
import HarFåttJobben from '../hendelser/HarFåttJobben';
import NyKandidat from '../hendelser/NyKandidat';
import { erIkkeProd } from '../../../../utils/featureToggleUtils';
import DelStillingMedKandidat from '../hendelser/DelStillingMedKandidat';
import SvarFraKandidat from '../hendelser/SvarFraKandidat';
import { Nettressurs } from '../../../../api/Nettressurs';
import { ForespørselOmDelingAvCv } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

type Props = {
    kandidat: Kandidat;
    kandidatlisteId: string;
    forespørselOmDelingAvCv: Nettressurs<ForespørselOmDelingAvCv>;
};

const SeHendelser: FunctionComponent<Props> = ({
    kandidat,
    kandidatlisteId,
    forespørselOmDelingAvCv,
}) => {
    return (
        <>
            <Undertittel>Hendelser</Undertittel>
            <ol className="endre-status-og-hendelser__hendelsesliste">
                <NyKandidat kandidat={kandidat} />
                {erIkkeProd && (
                    <DelStillingMedKandidat forespørselOmDelingAvCv={forespørselOmDelingAvCv} />
                )}
                {erIkkeProd && (
                    <SvarFraKandidat
                        kanEndre={false}
                        forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                    />
                )}
                <DelCvMedArbeidsgiver
                    kandidat={kandidat}
                    kandidatlisteId={kandidatlisteId}
                    kanEndre={false}
                />
                <HarFåttJobben
                    kandidat={kandidat}
                    kandidatlisteId={kandidatlisteId}
                    kanEndre={false}
                />
            </ol>
        </>
    );
};

export default SeHendelser;
