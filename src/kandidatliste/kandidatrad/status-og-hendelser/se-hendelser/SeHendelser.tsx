import React, { FunctionComponent } from 'react';
import { Kandidat } from '../../../domene/Kandidat';
import { Undertittel } from 'nav-frontend-typografi';
import DelCvMedArbeidsgiver from '../hendelser/DelCvMedArbeidsgiver';
import HarFåttJobben from '../hendelser/HarFåttJobben';
import NyKandidat from '../hendelser/NyKandidat';
import { Nettressurs } from '../../../../api/Nettressurs';
import { ForespørslerForKandidatForStilling } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import ForespørslerOgSvar from '../hendelser/forespørsler-og-svar/ForespørslerOgSvar';

type Props = {
    kandidat: Kandidat;
    kandidatlisteId: string;
    forespørselOmDelingAvCv: Nettressurs<ForespørslerForKandidatForStilling>;
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
                <ForespørslerOgSvar forespørsler={forespørselOmDelingAvCv} />
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
