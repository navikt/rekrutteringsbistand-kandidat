import React from 'react';
import { ExternalLink, Download } from '@navikt/ds-icons';
import { Link } from '@navikt/ds-react';

import { sendEvent } from '../../../amplitude/amplitude';
import useMiljøvariabler from '../../../common/useMiljøvariabler';
import css from './Lenker.module.css';

type Props = {
    fødselsnummer: string;
    className: string;
};

const Lenker = ({ fødselsnummer, className }: Props) => {
    const { lastNedCvUrl, arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <div className={className}>
            <div className={css.lenker}>
                <Link
                    target="_blank"
                    href={`${arbeidsrettetOppfølgingUrl}/${fødselsnummer}`}
                    onClick={() => sendEvent('cv_aktivitetsplan_lenke', 'klikk')}
                >
                    Se aktivitetsplan
                    <ExternalLink />
                </Link>
                <Link
                    target="_blank"
                    href={`${lastNedCvUrl}${fødselsnummer}`}
                    onClick={() => sendEvent('cv_last_ned', 'klikk')}
                >
                    Last ned CV
                    <Download />
                </Link>
            </div>
        </div>
    );
};

export default Lenker;
