import React, { FunctionComponent } from 'react';
import { BodyShort, Label, Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

import { Kandidat } from '../../domene/Kandidat';
import InfoUnderKandidat from '../info-under-kandidat/InfoUnderKandidat';
import useMiljøvariabler from '../../../common/useMiljøvariabler';
import css from './MerInfo.module.css';

type Props = {
    kandidat: Kandidat;
};

const MerInfo: FunctionComponent<Props> = ({ kandidat }) => {
    const { arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <InfoUnderKandidat className={css.merInfo}>
            <div className={css.kontaktinfo}>
                <Label spacing as="p">
                    Kontaktinfo:
                </Label>
                <BodyShort>
                    E-post:{' '}
                    {kandidat.epost ? (
                        <Link href={`mailto:${kandidat.epost}`}>{kandidat.epost}</Link>
                    ) : (
                        <span>&mdash;</span>
                    )}
                </BodyShort>
                <BodyShort>
                    Telefon: {kandidat.telefon ? kandidat.telefon : <span>&mdash;</span>}
                </BodyShort>
            </div>
            <div className={css.innsatsgruppe}>
                <Label spacing as="p">
                    Innsatsgruppe:
                </Label>
                <span>{kandidat.innsatsgruppe}</span>
                <Link
                    target="_blank"
                    href={`${arbeidsrettetOppfølgingUrl}/${kandidat.fodselsnr}`}
                    rel="noopener noreferrer"
                >
                    Se aktivitetsplan
                    <ExternalLinkIcon aria-hidden />
                </Link>
            </div>
        </InfoUnderKandidat>
    );
};

export default MerInfo;
