import { FunctionComponent } from 'react';
import { Heading } from '@navikt/ds-react';

import { ForespørslerForKandidatForStilling } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Kandidat } from '../../../domene/Kandidat';
import { Nettressurs } from '../../../../api/Nettressurs';
import { Sms } from '../../../domene/Kandidatressurser';
import { Stillingskategori } from '../../../domene/Kandidatliste';
import CvErSlettet from '../hendelser/CvErSlettet';
import DelCvMedArbeidsgiver from '../hendelser/DelCvMedArbeidsgiver';
import ForespørslerOgSvar from '../hendelser/forespørsler-og-svar/ForespørslerOgSvar';
import HarFåttJobben from '../hendelser/HarFåttJobben';
import NyKandidat from '../hendelser/NyKandidat';
import SmsSendt from '../hendelser/SmsSendt';
import css from '../endre-status-og-hendelser/EndreStatusOgHendelser.module.css';

type Props = {
    kandidat: Kandidat;
    kandidatlisteId: string;
    forespørselOmDelingAvCv: Nettressurs<ForespørslerForKandidatForStilling>;
    sms?: Sms;
    stillingskategori: Stillingskategori | null;
};

const SeHendelser: FunctionComponent<Props> = ({
    kandidat,
    kandidatlisteId,
    forespørselOmDelingAvCv,
    sms,
    stillingskategori,
}) => {
    const erStillingEllerFormidling =
        stillingskategori === Stillingskategori.Stilling ||
        stillingskategori === Stillingskategori.Formidling ||
        stillingskategori == null;

    return (
        <>
            <Heading spacing level="2" size="small">
                Hendelser
            </Heading>
            <ol className={css.hendelsesliste}>
                <NyKandidat kandidat={kandidat} />
                <SmsSendt sms={sms} />
                {erStillingEllerFormidling && (
                    <>
                        <ForespørslerOgSvar forespørsler={forespørselOmDelingAvCv} />

                        <DelCvMedArbeidsgiver
                            kandidat={kandidat}
                            kandidatlisteId={kandidatlisteId}
                            kanEndre={false}
                        />

                        <CvErSlettet kandidat={kandidat} />

                        <HarFåttJobben
                            kandidat={kandidat}
                            kandidatlisteId={kandidatlisteId}
                            kanEndre={false}
                        />
                    </>
                )}
            </ol>
        </>
    );
};

export default SeHendelser;
