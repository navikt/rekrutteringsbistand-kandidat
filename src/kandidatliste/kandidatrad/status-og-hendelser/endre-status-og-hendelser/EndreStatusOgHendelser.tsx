import React, { FunctionComponent, useState } from 'react';

import { Kandidat, Kandidatstatus } from '../../../domene/Kandidat';
import DelCvMedArbeidsgiver from '../hendelser/DelCvMedArbeidsgiver';
import HarFåttJobben from '../hendelser/HarFåttJobben';
import { statusToDisplayName } from '../etiketter/StatusEtikett';
import { ForespørslerForKandidatForStilling } from '../../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { Nettressurs } from '../../../../api/Nettressurs';
import NyKandidat from '../hendelser/NyKandidat';
import ForespørslerOgSvar from '../hendelser/forespørsler-og-svar/ForespørslerOgSvar';
import './EndreStatusOgHendelser.less';
import css from './EndreStatusOgHendelser.module.css';
import {
    kandidaterMåGodkjenneDelingAvCv,
    Kandidatliste,
    Stillingskategori,
} from '../../../domene/Kandidatliste';
import { Sms } from '../../../domene/Kandidatressurser';
import SmsSendt from '../hendelser/SmsSendt';
import CvErSlettet from '../hendelser/CvErSlettet';
import { Button, RadioGroup, Radio, Detail, BodyShort, Heading } from '@navikt/ds-react';
import classNames from 'classnames';

type Props = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
    forespørselOmDelingAvCv: Nettressurs<ForespørslerForKandidatForStilling>;
    sms?: Sms;
    onStatusChange: (status: Kandidatstatus) => void;
};

const hentStatusbeskrivelse = (status: Kandidatstatus) => {
    return status === Kandidatstatus.Vurderes
        ? 'Settes automatisk når en kandidat legges i listen'
        : null;
};

const EndreStatusOgHendelser: FunctionComponent<Props> = ({
    kandidat,
    kandidatliste,
    forespørselOmDelingAvCv,
    sms,
    onStatusChange,
}) => {
    const [status, setStatus] = useState(kandidat.status);
    const statuser = Object.entries(Kandidatstatus);

    const onConfirmStatus = () => {
        onStatusChange(status);
    };

    const visHendelser =
        kandidaterMåGodkjenneDelingAvCv(kandidatliste) ||
        kandidatliste.stillingskategori === Stillingskategori.Formidling ||
        kandidatliste.stillingskategori === Stillingskategori.Jobbmesse;

    const erStillingEllerFormidling =
        kandidatliste.stillingskategori === Stillingskategori.Stilling ||
        kandidatliste.stillingskategori === Stillingskategori.Formidling ||
        kandidatliste.stillingskategori == null;
    return (
        <div
            className={classNames(css.endreStatusOgHendelser, {
                [css.makshøyde]: visHendelser,
            })}
        >
            <div className={css.velgStatus}>
                <RadioGroup
                    size="small"
                    legend={
                        <Heading level="2" size="small">
                            Velg status
                        </Heading>
                    }
                >
                    {statuser.map(([statusKey, statusValue]) => {
                        const beskrivelse = hentStatusbeskrivelse(statusValue);

                        return (
                            <Radio
                                key={statusKey}
                                onChange={() => setStatus(statusValue)}
                                defaultChecked={statusValue === status}
                                value={statusValue}
                                name={`kandidatstatus-${kandidat.kandidatnr}`}
                            >
                                <>
                                    <BodyShort>{statusToDisplayName(statusValue)}</BodyShort>
                                    {beskrivelse && <Detail>{beskrivelse}</Detail>}
                                </>
                            </Radio>
                        );
                    })}
                </RadioGroup>
                <Button
                    variant="secondary"
                    onClick={onConfirmStatus}
                    size="small"
                    className={css.lagreStatus}
                >
                    Lagre status
                </Button>
            </div>
            {visHendelser && (
                <div className={css.hendelser}>
                    <Heading level="2" size="small">
                        Hendelser
                    </Heading>
                    <ol className={css.hendelsesliste}>
                        <NyKandidat kandidat={kandidat} />
                        <SmsSendt sms={sms} />
                        {erStillingEllerFormidling && (
                            <>
                                <ForespørslerOgSvar forespørsler={forespørselOmDelingAvCv} />

                                <DelCvMedArbeidsgiver
                                    kanEndre
                                    kandidatlisteId={kandidatliste.kandidatlisteId}
                                    kandidat={kandidat}
                                />

                                <CvErSlettet kandidat={kandidat} />

                                <HarFåttJobben
                                    kanEndre
                                    kandidatlisteId={kandidatliste.kandidatlisteId}
                                    kandidat={kandidat}
                                />
                            </>
                        )}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default EndreStatusOgHendelser;
