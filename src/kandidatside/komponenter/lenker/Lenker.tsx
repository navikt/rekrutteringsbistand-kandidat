import React from 'react';
import { ExternalLinkIcon, DownloadIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';

import { sendEvent } from '../../../amplitude/amplitude';
import { arbeidsrettetOppfølgingUrl, lastNedCvUrl } from '../../../utils/eksterneUrler';
import css from './Lenker.module.css';

type Props = {
    fødselsnummer: string;
    className: string;
};

const Lenker = ({ fødselsnummer, className }: Props) => {
    return (
        <div className={className}>
            <div className={css.lenker}>
                <Link
                    target="_blank"
                    href={`${arbeidsrettetOppfølgingUrl}/${fødselsnummer}`}
                    onClick={() => sendEvent('cv_aktivitetsplan_lenke', 'klikk')}
                >
                    Se aktivitetsplan
                    <ExternalLinkIcon />
                </Link>
                <Link
                    target="_blank"
                    href={`${lastNedCvUrl}${fødselsnummer}`}
                    onClick={() => sendEvent('cv_last_ned', 'klikk')}
                >
                    Last ned CV
                    <DownloadIcon />
                </Link>
            </div>
        </div>
    );
};

export default Lenker;
