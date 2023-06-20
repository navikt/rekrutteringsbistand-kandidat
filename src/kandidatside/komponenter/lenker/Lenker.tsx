import React from 'react';
import { ExternalLinkIcon, DownloadIcon, MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { Link as NavLink } from '@navikt/ds-react';
import { Link } from 'react-router-dom';

import { sendEvent } from '../../../amplitude/amplitude';
import { arbeidsrettetOppfølgingUrl, lastNedCvUrl } from '../../../utils/eksterneUrler';
import { erIkkeProd } from '../../../utils/featureToggleUtils';
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
                {erIkkeProd && (
                    <Link
                        to={`/stillingssok/${fødselsnummer}`}
                        className="navds-button navds-button--tertiary navds-button--small"
                    >
                        Finn stilling
                        <MagnifyingGlassIcon />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Lenker;
