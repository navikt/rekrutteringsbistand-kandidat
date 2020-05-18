import React, { FunctionComponent } from 'react';

import { logEvent } from '../../amplitude/amplitude';
import Kandidattab from './Kandidattab';
import './Kandidatmeny.less';
import { useSelector } from 'react-redux';
import AppState from '../../AppState';

interface Props {
    fødselsnummer: string;
}

const Kandidatmeny: FunctionComponent<Props> = (props) => {
    const visHistorikk = useSelector(
        (state: AppState) => state.search.featureToggles['vis-historikk']
    );

    return (
        <div className="kandidatmeny">
            <div className="kandidatmeny__venstre">
                {visHistorikk && (
                    <nav className="kandidatmeny__tabs">
                        <Kandidattab sti="cv" label="Cv og jobbprofil" />
                        <Kandidattab sti="historikk" label="Historikk" />
                    </nav>
                )}
                <a
                    className="ForlateSiden lenke"
                    href={`https://app.adeo.no/veilarbpersonflatefs/${props.fødselsnummer}`}
                    target="_blank"
                    onClick={() => logEvent('cv_aktivitetsplan_lenke', 'klikk')}
                    rel="noopener noreferrer"
                >
                    <i className="ForlateSiden__icon" />
                    <span className="kandidatmeny__se-aktivitetsplan">Se aktivitetsplan</span>
                </a>
            </div>
            <div className="kandidatmeny__children">{props.children}</div>
        </div>
    );
};

export default Kandidatmeny;