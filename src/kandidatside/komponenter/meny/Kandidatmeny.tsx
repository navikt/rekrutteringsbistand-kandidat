import React, { FunctionComponent } from 'react';

import { sendEvent } from '../../../amplitude/amplitude';
import Kandidattab from './Kandidattab';
import Cv from '../../../cv/reducer/cv-typer';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import './Kandidatmeny.less';
import useMiljøvariabler from '../../../common/useMiljøvariabler';

type Props = {
    cv: Nettressurs<Cv>;
};

const Kandidatmeny: FunctionComponent<Props> = ({ cv, children }) => {
    const { arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <div className="kandidatmeny">
            <div className="kandidatmeny__venstre">
                <nav className="kandidatmeny__tabs">
                    <Kandidattab sti="cv" label="CV og jobbønsker" />
                    <Kandidattab sti="historikk" label="Historikk" />
                </nav>
                {cv.kind === Nettstatus.Suksess && (
                    <a
                        className="ForlateSiden lenke"
                        href={`${arbeidsrettetOppfølgingUrl}/${cv.data.fodselsnummer}`}
                        target="_blank"
                        onClick={() => sendEvent('cv_aktivitetsplan_lenke', 'klikk')}
                        rel="noopener noreferrer"
                    >
                        <i className="ForlateSiden__icon" />
                        <span className="kandidatmeny__se-aktivitetsplan">Se aktivitetsplan</span>
                    </a>
                )}
            </div>
            <div className="kandidatmeny__children">{children}</div>
        </div>
    );
};

export default Kandidatmeny;
