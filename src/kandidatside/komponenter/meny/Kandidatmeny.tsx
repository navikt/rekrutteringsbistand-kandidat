import React, { FunctionComponent, ReactNode } from 'react';

import { sendEvent } from '../../../amplitude/amplitude';
import Cv from '../../../cv/reducer/cv-typer';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import useMiljøvariabler from '../../../common/useMiljøvariabler';
import { Link } from '@navikt/ds-react';
import { ExternalLink } from '@navikt/ds-icons';
import './Kandidatmeny.less';

type Props = {
    cv: Nettressurs<Cv>;
    tabs: ReactNode;
};

const Kandidatmeny: FunctionComponent<Props> = ({ cv, tabs, children }) => {
    const { arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <div className="kandidatmeny">
            <div className="kandidatmeny__venstre">
                <nav className="kandidatmeny__tabs">{tabs}</nav>

                {cv.kind === Nettstatus.Suksess && (
                    <Link
                        target="_blank"
                        href={`${arbeidsrettetOppfølgingUrl}/${cv.data.fodselsnummer}`}
                        onClick={() => sendEvent('cv_aktivitetsplan_lenke', 'klikk')}
                    >
                        Se aktivitetsplan
                        <ExternalLink />
                    </Link>
                )}
            </div>
            <div className="kandidatmeny__children">{children}</div>
        </div>
    );
};

export default Kandidatmeny;
