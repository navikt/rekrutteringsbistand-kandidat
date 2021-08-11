import React, { FunctionComponent } from 'react';
import { Kandidat } from '../../../domene/Kandidat';
import { Undertittel } from 'nav-frontend-typografi';
import DelCvMedArbeidsgiver from '../hendelser/DelCvMedArbeidsgiver';
import HarFåttJobben from '../hendelser/HarFåttJobben';
import NyKandidat from '../hendelser/NyKandidat';

type Props = {
    kandidat: Kandidat;
    kandidatlisteId: string;
};

const SeHendelser: FunctionComponent<Props> = ({ kandidat, kandidatlisteId }) => {
    return (
        <>
            <Undertittel>Hendelser</Undertittel>
            <ol className="endre-status-og-hendelser__hendelsesliste">
                <NyKandidat kandidat={kandidat} />
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
