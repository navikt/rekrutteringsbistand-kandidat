import React, { FunctionComponent } from 'react';
import { BodyShort, Button, Label, Panel } from '@navikt/ds-react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import AppState from '../../../AppState';
import { Nettstatus } from '../../../api/Nettressurs';
import KandidatlisteAction from '../../reducer/KandidatlisteAction';
import NudgeAvsluttOppdragModal from '../../modaler/NudgeAvsluttOppdragModal';
import { skalViseModal } from './skalViseAvsluttOppdragModal';
import useLagreKandidatlisteIder from './useLagreKandidatlisteIder';
import useSletteKandidatlisteIderFraLukkedata from './useSletteLagredeStillinger';
import { Kandidatlistestatus as Status } from '../../domene/Kandidatliste';
import { PadlockLockedFillIcon, PadlockUnlockedFillIcon } from '@navikt/aksel-icons';
import css from './Kandidatlistestatus.module.css';

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
        <Panel border className={classNames(className, css.kandidatlistestatus)}>
            <div className={css.ikon}>
                {status === Status.Åpen ? (
                    <PadlockUnlockedFillIcon className={css.ikonÅpen} />
                ) : (
                    <PadlockLockedFillIcon className={css.ikonLukket} />
                )}
            </div>
            <div className={css.informasjon}>
                <Label as="p">{kandidatlistestatusToDisplayName(status)}</Label>
                {erKnyttetTilStilling && antallStillinger != null && antallStillinger > 0 && (
                    <BodyShort>
                        {besatteStillinger} av {antallStillinger}{' '}
                        {antallStillinger === 1 ? 'stilling' : 'stillinger'} er besatt
                    </BodyShort>
                )}
                {erKnyttetTilStilling &&
                    !antallStillinger && ( // TODO: fjerne denne bolken når alle kandidatlistene er oppdatert fra stilling
                        <BodyShort>
                            {besatteStillinger === 0 ? 'Ingen' : besatteStillinger} stilling
                            {besatteStillinger === 1 ? '' : 'er'} er besatt
                        </BodyShort>
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
                <Button
                    size="small"
                    variant="secondary"
                    loading={endreStatusNettstatus === Nettstatus.SenderInn}
                    onClick={onEndreStatusClick}
                >
                    {status === Status.Åpen ? 'Avslutt' : 'Gjenåpne'}
                </Button>
            )}
        </Panel>
    );
};

export default Kandidatlistestatus;
