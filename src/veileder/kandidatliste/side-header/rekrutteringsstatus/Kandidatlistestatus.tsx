import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';

import { Kandidatlistestatus as Status } from '../../kandidatlistetyper';
import ÅpenHengelås from './ÅpenHengelås';
import LåstHengelås from './LåstHengelås';
import './Kandidatlistestatus.less';

const hentTittel = (rekrutteringsstatus: Status) => {
    return rekrutteringsstatus === Status.Pågår ? `Åpen` : `Avsluttet`;
};

type Props = {
    status: Status;
    kanEditere: boolean;
    besatteStillinger: number;
    antallStillinger: number;
    onEndreStatus: () => void;
    erKnyttetTilStilling: boolean;
};

const Kandidatlistestatus: FunctionComponent<Props> = (props) => {
    const {
        status,
        kanEditere,
        besatteStillinger,
        antallStillinger,
        onEndreStatus,
        erKnyttetTilStilling,
    } = props;

    return (
        <Panel border className="side-header__kandidatlistestatus kandidatlistestatus">
            <div className="kandidatlistestatus__ikon">
                {status === Status.Pågår ? <ÅpenHengelås /> : <LåstHengelås />}
            </div>
            <div className="kandidatlistestatus__informasjon">
                <Element>{hentTittel(status)}</Element>
                {erKnyttetTilStilling && (
                    <Normaltekst>
                        {besatteStillinger} av {antallStillinger} stilling
                        {antallStillinger === 1 ? '' : 'er'} er besatt.
                    </Normaltekst>
                )}
            </div>
            {kanEditere && (
                <Knapp mini onClick={onEndreStatus}>
                    {status === Status.Pågår ? 'Avslutt' : 'Gjenåpne'}
                </Knapp>
            )}
        </Panel>
    );
};

export default Kandidatlistestatus;
