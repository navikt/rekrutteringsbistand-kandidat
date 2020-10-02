import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { useDispatch, useSelector } from 'react-redux';
import Panel from 'nav-frontend-paneler';

import { Kandidatlistestatus as Status } from '../../kandidatlistetyper';
import ÅpenHengelås from './ÅpenHengelås';
import LåstHengelås from './LåstHengelås';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import './Kandidatlistestatus.less';
import AppState from '../../../AppState';
import { Nettstatus } from '../../../../felles/common/remoteData';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';

const kandidatlistestatusToDisplayName = (status: Status) => {
    return status === Status.Åpen ? 'Åpen' : 'Avsluttet';
};

type Props = {
    status: Status;
    kanEditere: boolean;
    besatteStillinger: number;
    antallStillinger: number;
    erKnyttetTilStilling: boolean;
    kandidatlisteId: string;
};

const Kandidatlistestatus: FunctionComponent<Props> = ({
    status,
    kanEditere,
    besatteStillinger,
    antallStillinger,
    erKnyttetTilStilling,
    kandidatlisteId,
}) => {
    const dispatch = useDispatch();
    const endreStatusNettstatus = useSelector(
        (state: AppState) => state.kandidatliste.endreKandidatlistestatus
    );

    const onEndreStatusClick = () => {
        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.ENDRE_KANDIDATLISTESTATUS,
            kandidatlisteId: kandidatlisteId,
            status: status === Status.Åpen ? Status.Lukket : Status.Åpen,
        });
    };

    let klassenavn = 'side-header__kandidatlistestatus kandidatlistestatus';
    if (erKnyttetTilStilling) {
        klassenavn += ' kandidatlistestatus--med-stilling';
    }

    return (
        <Panel border className={klassenavn}>
            <div className="kandidatlistestatus__ikon">
                {status === Status.Åpen ? <ÅpenHengelås /> : <LåstHengelås />}
            </div>
            <div className="kandidatlistestatus__informasjon">
                <Element>{kandidatlistestatusToDisplayName(status)}</Element>
                {erKnyttetTilStilling && antallStillinger > 0 && (
                    <Normaltekst>
                        {besatteStillinger} av {antallStillinger} {antallStillinger === 1 ? 'stilling' : 'stillinger'} er besatt
                    </Normaltekst>
                )}
                 {erKnyttetTilStilling && !antallStillinger && ( // TODO: fjerne denne bolken når alle kandidatlistene er oppdatert fra stilling
                    <Normaltekst>
                        {besatteStillinger === 0 ? 'Ingen' : besatteStillinger} stilling
                        {besatteStillinger === 1 ? '' : 'er'} er besatt
                    </Normaltekst>
                )}
            </div>
            {kanEditere && (
                <Knapp
                    mini
                    kompakt
                    className="kandidatlistestatus__knapp"
                    disabled={endreStatusNettstatus === Nettstatus.SenderInn}
                    onClick={onEndreStatusClick}
                >
                    {status === Status.Åpen ? 'Avslutt' : 'Gjenåpne'}
                </Knapp>
            )}
        </Panel>
    );
};

export default Kandidatlistestatus;
