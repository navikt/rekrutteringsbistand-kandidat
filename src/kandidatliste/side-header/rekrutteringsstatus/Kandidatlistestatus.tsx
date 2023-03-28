import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import { useDispatch, useSelector } from 'react-redux';
import Panel from 'nav-frontend-paneler';

import ÅpenHengelås from './ÅpenHengelås';
import LåstHengelås from './LåstHengelås';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import AppState from '../../../AppState';
import { Nettstatus } from '../../../api/Nettressurs';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import NudgeAvsluttOppdragModal from '../../modaler/NudgeAvsluttOppdragModal';
import { skalViseModal } from './skalViseAvsluttOppdragModal';
import useLagreKandidatlisteIder from './useLagreKandidatlisteIder';
import useSletteKandidatlisteIderFraLukkedata from './useSletteLagredeStillinger';
import { Kandidatlistestatus as Status } from '../../domene/Kandidatliste';
import './Kandidatlistestatus.less';

const kandidatlistestatusToDisplayName = (status: Status) => {
    return status === Status.Åpen ? 'Åpen' : 'Avsluttet';
};

type Props = {
    className: string;
    status: Status;
    kanEditere: boolean;
    besatteStillinger: number;
    antallStillinger: number | null;
    erKnyttetTilStilling: boolean;
    kandidatlisteId: string;
};

const Kandidatlistestatus: FunctionComponent<Props> = ({
    className,
    status,
    kanEditere,
    besatteStillinger,
    antallStillinger,
    erKnyttetTilStilling,
    kandidatlisteId,
}) => {
    const [lukkedata, setLukkedata] = useLagreKandidatlisteIder();

    useSletteKandidatlisteIderFraLukkedata(
        kandidatlisteId,
        besatteStillinger,
        antallStillinger,
        lukkedata,
        setLukkedata
    );

    const dispatch = useDispatch();
    const endreStatusNettstatus = useSelector(
        (state: AppState) => state.kandidatliste.endreKandidatlistestatus
    );

    const onEndreStatusClick = () => {
        if (status === Status.Lukket) {
            const newSet = new Set(lukkedata);
            newSet.add(kandidatlisteId);
            setLukkedata(newSet);
        }

        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.EndreKandidatlistestatus,
            kandidatlisteId: kandidatlisteId,
            status: status === Status.Åpen ? Status.Lukket : Status.Åpen,
        });
    };

    let klassenavn = className + ' kandidatlistestatus';
    if (erKnyttetTilStilling) {
        klassenavn += ' kandidatlistestatus--med-stilling';
    }

    const bekreftNudgeAvsluttOppdragModal = () => {
        dispatch({
            type: KandidatlisteActionType.EndreKandidatlistestatus,
            kandidatlisteId: kandidatlisteId,
            status: Status.Lukket,
        });
    };

    const avvisNudgeAvsluttOppdragModal = () => {
        const newSet = new Set(lukkedata);
        newSet.add(kandidatlisteId);
        setLukkedata(newSet);
    };

    const skalViseAvsluttOppdragModal = skalViseModal(
        status,
        antallStillinger,
        besatteStillinger,
        kanEditere,
        lukkedata.has(kandidatlisteId)
    );

    return (
        <Panel border className={klassenavn}>
            <div className="kandidatlistestatus__ikon">
                {status === Status.Åpen ? <ÅpenHengelås /> : <LåstHengelås />}
            </div>
            <div className="kandidatlistestatus__informasjon">
                <Element>{kandidatlistestatusToDisplayName(status)}</Element>
                {erKnyttetTilStilling && antallStillinger != null && antallStillinger > 0 && (
                    <Normaltekst>
                        {besatteStillinger} av {antallStillinger}{' '}
                        {antallStillinger === 1 ? 'stilling' : 'stillinger'} er besatt
                    </Normaltekst>
                )}
                {erKnyttetTilStilling &&
                    !antallStillinger && ( // TODO: fjerne denne bolken når alle kandidatlistene er oppdatert fra stilling
                        <Normaltekst>
                            {besatteStillinger === 0 ? 'Ingen' : besatteStillinger} stilling
                            {besatteStillinger === 1 ? '' : 'er'} er besatt
                        </Normaltekst>
                    )}
                {skalViseAvsluttOppdragModal && (
                    <NudgeAvsluttOppdragModal
                        antallKandidaterSomHarFåttJobb={besatteStillinger}
                        antallStillinger={antallStillinger || 0}
                        onBekreft={bekreftNudgeAvsluttOppdragModal}
                        onAvbryt={avvisNudgeAvsluttOppdragModal}
                    />
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
