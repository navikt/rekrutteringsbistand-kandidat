import React from 'react';
import { ExternalLinkIcon, DownloadIcon } from '@navikt/aksel-icons';
import { Link as NavLink } from '@navikt/ds-react';

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
                <NavLink
                    target="_blank"
                    href={`${arbeidsrettetOppfølgingUrl}/${fødselsnummer}`}
                    onClick={() => sendEvent('cv_aktivitetsplan_lenke', 'klikk')}
                >
                    Se aktivitetsplan
                    <ExternalLinkIcon />
                </NavLink>
                <NavLink
                    target="_blank"
                    href={`${lastNedCvUrl}${fødselsnummer}`}
                    onClick={() => sendEvent('cv_last_ned', 'klikk')}
                >
                    Last ned CV
                    <DownloadIcon />
                </NavLink>
            </div>
        </div>
    );
};

export default Lenker;
