import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import ÅpenHengelås from './ÅpenHengelås';
import LåstHengelås from './LåstHengelås';
import Panel from 'nav-frontend-paneler';
import './Rekrutteringsstatus.less';

export enum Status {
    Pågår = 'PAGAR',
    Avsluttet = 'AVSLUTTET',
}

const hentTittel = (rekrutteringsstatus: Status, erKnyttetTilStilling: boolean) => {
    const begrep = erKnyttetTilStilling ? 'Rekruttering' : 'Oppdraget';

    return rekrutteringsstatus === Status.Pågår ? `${begrep} pågår` : `${begrep} avsluttet`;
};

interface Props {
    status: Status;
    kanEditere: boolean;
    besatteStillinger: number;
    antallStillinger: number;
    onEndreStatus: () => void;
    erKnyttetTilStilling: boolean;
}

const Rekrutteringsstatus: FunctionComponent<Props> = (props) => {
    const {
        status,
        kanEditere,
        besatteStillinger,
        antallStillinger,
        onEndreStatus,
        erKnyttetTilStilling,
    } = props;

    return (
        <Panel border className="rekrutteringsstatus">
            <div className="rekrutteringsstatus__ikon">
                {status === Status.Pågår ? <ÅpenHengelås /> : <LåstHengelås />}
            </div>
            <div className="rekrutteringsstatus__informasjon">
                <Element>{hentTittel(status, erKnyttetTilStilling)}</Element>
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

export default Rekrutteringsstatus;
