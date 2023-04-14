import React, { FunctionComponent, useRef, useState } from 'react';
import classNames from 'classnames';
import { Nettressurs, Nettstatus } from '../../../api/Nettressurs';
import {
    ForespørslerForKandidatForStilling,
    TilstandPåForespørsel,
} from '../../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';
import { BodyShort, Popover } from '@navikt/ds-react';
import css from './StatusPåForespørselOmDelingAvCv.module.css';

type Props = {
    forespørsel: Nettressurs<ForespørslerForKandidatForStilling>;
};

const StatusPåForespørselOmDelingAvCv: FunctionComponent<Props> = ({ forespørsel }) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [visBeskjed, setVisBeskjed] = useState<boolean>(false);

    if (forespørsel.kind !== Nettstatus.Suksess) {
        return null;
    }

    const { tilstand } = forespørsel.data.gjeldendeForespørsel;

    const kanIkkeOpprette = tilstand === TilstandPåForespørsel.KanIkkeOpprette;
    const veilederKanSvare = tilstand === TilstandPåForespørsel.KanIkkeVarsle;

    return (
        <>
            {kanIkkeOpprette && (
                <button
                    ref={buttonRef}
                    onClick={() => setVisBeskjed(!visBeskjed)}
                    className={classNames(css.status, css.kortetBleIkkeOpprettet)}
                    aria-label="Vis beskjed om forespørsel om deling av CV."
                >
                    <span aria-hidden>×</span>
                </button>
            )}
            {veilederKanSvare && (
                <button
                    ref={buttonRef}
                    onClick={() => setVisBeskjed(!visBeskjed)}
                    className={classNames(css.status, css.veilederKanSvare)}
                    aria-label="Vis beskjed om forespørsel om deling av CV."
                >
                    <span aria-hidden>!</span>
                </button>
            )}
            <Popover
                open={visBeskjed}
                anchorEl={buttonRef.current}
                placement="bottom"
                onClose={() => setVisBeskjed(false)}
            >
                <Popover.Content className={css.popover}>
                    {kanIkkeOpprette && (
                        <BodyShort>
                            Stillingskortet ble ikke opprettet.
                            <br />
                            CV-en kan ikke deles med arbeidsgiver.
                        </BodyShort>
                    )}
                    {veilederKanSvare && (
                        <BodyShort>
                            Kandidaten bruker ikke digitale tjenester fra NAV. Du må ringe og
                            registrere svaret i stillingskortet i Aktivitetsplanen.
                        </BodyShort>
                    )}
                </Popover.Content>
            </Popover>
        </>
    );
};

export default StatusPåForespørselOmDelingAvCv;
