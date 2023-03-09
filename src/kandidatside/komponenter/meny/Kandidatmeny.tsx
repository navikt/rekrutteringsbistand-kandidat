import React, { FunctionComponent, ReactNode } from 'react';

import { sendEvent } from '../../../amplitude/amplitude';
import Cv from '../../../cv/reducer/cv-typer';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import useMiljøvariabler from '../../../common/useMiljøvariabler';
import { Link } from '@navikt/ds-react';
import { Download, ExternalLink } from '@navikt/ds-icons';
import css from './Kandidatmeny.module.css';

type Props = {
    cv: Nettressurs<Cv>;
    tabs: ReactNode;
};

const Kandidatmeny: FunctionComponent<Props> = ({ cv, tabs, children }) => {
    const { lastNedCvUrl, arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <div className={css.wrapper}>
            <div className={css.meny}>
                <nav className={css.faner}>{tabs}</nav>
                {cv.kind === Nettstatus.Suksess && (
                    <div className={css.lenker}>
                        <Link
                            target="_blank"
                            href={`${arbeidsrettetOppfølgingUrl}/${cv.data.fodselsnummer}`}
                            onClick={() => sendEvent('cv_aktivitetsplan_lenke', 'klikk')}
                        >
                            Se aktivitetsplan
                            <ExternalLink />
                        </Link>
                        <Link
                            target="_blank"
                            href={`${lastNedCvUrl}${cv.data.fodselsnummer}`}
                            onClick={() => sendEvent('cv_last_ned', 'klikk')}
                        >
                            Last ned CV
                            <Download />
                        </Link>
                    </div>
                )}

                <div className={css.høyre}>{children}</div>
            </div>
        </div>
    );
};

export default Kandidatmeny;
