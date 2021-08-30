import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent, useState } from 'react';
import { MouseEvent } from 'react';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import {
    ForespørselOmDelingAvCv,
    StatusPåForespørsel,
    TilstandPåForespørsel,
} from '../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import './StatusPåForespørselOmDelingAvCv.less';

type Props = {
    forespørsel: Nettressurs<ForespørselOmDelingAvCv>;
};

const StatusPåForespørselOmDelingAvCv: FunctionComponent<Props> = ({ forespørsel }) => {
    const [popoverAnker, setPopoverAnker] = useState<HTMLElement | undefined>(undefined);

    const togglePopoverAnker = (event: MouseEvent<HTMLElement>) => {
        setPopoverAnker(popoverAnker === undefined ? event.currentTarget : undefined);
    };

    const lukkPopoverAnker = () => {
        setPopoverAnker(undefined);
    };

    if (forespørsel.kind !== Nettstatus.Suksess) {
        return null;
    }

    const { tilstand } = forespørsel.data;

    const kanIkkeOpprette = tilstand === TilstandPåForespørsel.KanIkkeOpprette;
    const veilederKanSvare =
        tilstand === TilstandPåForespørsel.KanIkkeVarsle && forespørsel.data.svar === null;

    return (
        <div className="status-på-forespørsel-om-deling-av-cv">
            {kanIkkeOpprette && (
                <button
                    onClick={togglePopoverAnker}
                    className="status-på-forespørsel-om-deling-av-cv__kortet-ble-ikke-opprettet"
                >
                    ×
                </button>
            )}
            {veilederKanSvare && (
                <button
                    onClick={togglePopoverAnker}
                    className="status-på-forespørsel-om-deling-av-cv__veileder-kan-svare"
                >
                    !
                </button>
            )}
            <Popover
                ankerEl={popoverAnker}
                orientering={PopoverOrientering.Under}
                onRequestClose={lukkPopoverAnker}
            >
                {kanIkkeOpprette && (
                    <Normaltekst>
                        Stillingskortet ble ikke opprettet.
                        <br />
                        CV-en kan ikke deles med arbeidsgiver.
                    </Normaltekst>
                )}
                {veilederKanSvare && (
                    <Normaltekst>
                        Kandidaten bruker ikke digitale tjenester fra NAV. Du må ringe og registrere
                        svaret i stillingskortet i Aktivitetsplanen.{' '}
                    </Normaltekst>
                )}
            </Popover>
        </div>
    );
};

export default StatusPåForespørselOmDelingAvCv;
