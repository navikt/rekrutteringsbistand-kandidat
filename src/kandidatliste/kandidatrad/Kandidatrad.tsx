import React, { FunctionComponent, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import { erKobletTilStilling, Kandidatliste, Kandidatlistestatus } from '../domene/Kandidatliste';
import { erInaktiv, Kandidat } from '../domene/Kandidat';
import { lenkeTilCv } from '../../app/paths';
import { modifierTilListeradGrid } from '../liste-header/ListeHeader';
import { Nettstatus } from '../../api/Nettressurs';
import { Visningsstatus } from '../domene/Kandidatressurser';
import AppState from '../../AppState';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import LenkeknappNy from '../../common/lenkeknapp/Lenkeknapp';
import MerInfo from './mer-info/MerInfo';
import Notater from './notater/Notater';
import SmsStatusPopup from './smsstatus/SmsStatusPopup';
import StatusOgHendelser from './status-og-hendelser/StatusOgHendelser';
import useForespørselOmDelingAvCv from '../hooks/useForespørselOmDelingAvCv';
import useKandidatnotater from '../hooks/useKandidatnotater';
import useKandidattilstand from '../hooks/useKandidattilstand';
import useSendtKandidatmelding from '../hooks/useSendtKandidatmelding';
import StatusPåForespørselOmDelingAvCv from './status-på-forespørsel/StatusPåForespørselOmDelingAvCv';
import { formaterDato } from '../../utils/dateUtils';
import { BodyShort, Checkbox } from '@navikt/ds-react';
import {
    InformationSquareIcon,
    TasklistIcon,
    TrashIcon,
    InformationSquareFillIcon,
    TasklistFillIcon,
    TrashFillIcon,
} from '@navikt/aksel-icons';
import './Kandidatrad.less';
import css from './Kandidatrad.module.css';
import classNames from 'classnames';

type Props = {
    kandidat: Kandidat;
    kandidatliste: Kandidatliste;
    toggleArkivert: any;
    onToggleKandidat: (kandidatnr: string) => void;
    onKandidatStatusChange: any;
    visArkiveringskolonne: boolean;
    sistValgteKandidat?: {
        kandidatlisteId: string;
        kandidatnr: string;
    };
};

const Kandidatrad: FunctionComponent<Props> = ({
    kandidat,
    kandidatliste,
    toggleArkivert,
    onToggleKandidat,
    onKandidatStatusChange,
    visArkiveringskolonne,
    sistValgteKandidat,
}) => {
    const dispatch = useDispatch();
    const kandidatRadRef = useRef<HTMLDivElement>(null);

    const tilstand = useKandidattilstand(kandidat.kandidatnr);
    const notater = useKandidatnotater(kandidat.kandidatnr);
    const melding = useSendtKandidatmelding(kandidat.fodselsnr);
    const forespørselOmDelingAvCv = useForespørselOmDelingAvCv(kandidat.aktørid);

    useEffect(() => {
        const erSistValgteKandidat =
            sistValgteKandidat &&
            sistValgteKandidat.kandidatnr === kandidat.kandidatnr &&
            sistValgteKandidat.kandidatlisteId === kandidatliste.kandidatlisteId;

        if (erSistValgteKandidat) {
            kandidatRadRef?.current?.focus();
        }
    }, [sistValgteKandidat, kandidat.kandidatnr, kandidatliste.kandidatlisteId, kandidatRadRef]);

    const antallNotater =
        notater?.kind === Nettstatus.Suksess ? notater.data.length : kandidat.antallNotater;

    const endreVisningsstatus = (visningsstatus: Visningsstatus) => {
        dispatch({
            type: KandidatlisteActionType.EndreVisningsstatusKandidat,
            kandidatnr: kandidat.kandidatnr,
            visningsstatus,
        });
    };

    const toggleNotater = () => {
        endreVisningsstatus(
            tilstand?.visningsstatus === Visningsstatus.VisNotater
                ? Visningsstatus.SkjulPanel
                : Visningsstatus.VisNotater
        );
    };

    const toggleMerInfo = () => {
        endreVisningsstatus(
            tilstand?.visningsstatus === Visningsstatus.VisMerInfo
                ? Visningsstatus.SkjulPanel
                : Visningsstatus.VisMerInfo
        );
    };

    const onOpprettNotat = (tekst: string) => {
        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.OpprettNotat,
            kandidatlisteId: kandidatliste.kandidatlisteId,
            kandidatnr: kandidat.kandidatnr,
            tekst,
        });
    };

    const onEndreNotat = (notatId: string, tekst: string) => {
        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.EndreNotat,
            kandidatlisteId: kandidatliste.kandidatlisteId,
            kandidatnr: kandidat.kandidatnr,
            notatId,
            tekst,
        });
    };

    const onSlettNotat = (notatId: string) => {
        dispatch({
            type: KandidatlisteActionType.SlettNotat,
            kandidatlisteId: kandidatliste.kandidatlisteId,
            kandidatnr: kandidat.kandidatnr,
            notatId,
        });
    };

    const onToggleArkivert = () => {
        toggleArkivert(kandidatliste.kandidatlisteId, kandidat.kandidatnr, true);
    };

    const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
    const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';
    const fulltNavn = `${etternavn}, ${fornavn}`;

    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(erKobletTilStilling(kandidatliste), visArkiveringskolonne);

    const klassenavn = `kandidatliste-kandidat${
        kandidatliste.status === Kandidatlistestatus.Lukket
            ? ' kandidatliste-kandidat--disabled'
            : ''
    } ${tilstand?.markert ? 'kandidatliste-kandidat--checked' : ''}`;

    const kanEndreKandidatlisten =
        kandidatliste.status === Kandidatlistestatus.Åpen && kandidatliste.kanEditere;

    const kandidatenKanMarkeres =
        kandidatliste.status === Kandidatlistestatus.Åpen &&
        (!erInaktiv(kandidat) || kandidat.arkivert);

    return (
        <div role="rowgroup" tabIndex={-1} ref={kandidatRadRef} className={klassenavn}>
            <div role="row" className={klassenavnForListerad}>
                <div role="cell">
                    <StatusPåForespørselOmDelingAvCv forespørsel={forespørselOmDelingAvCv} />
                </div>
                <Checkbox
                    disabled={!kandidatenKanMarkeres}
                    checked={tilstand?.markert}
                    onChange={() => {
                        onToggleKandidat(kandidat.kandidatnr);
                    }}
                >
                    &#8203;
                </Checkbox>
                <div className={css.kolonneSorterbar}>
                    {erInaktiv(kandidat) ? (
                        <BodyShort>{fulltNavn}</BodyShort>
                    ) : (
                        <Link
                            role="cell"
                            title="Vis profil"
                            className={classNames('navds-link', css.kolonneMedSmsLenke)}
                            to={lenkeTilCv(
                                kandidat.kandidatnr,
                                kandidatliste.kandidatlisteId,
                                true
                            )}
                        >
                            {fulltNavn}
                        </Link>
                    )}
                    {melding && <SmsStatusPopup sms={melding} />}
                </div>
                <div role="cell" className={classNames(css.kolonneSorterbar, css.wrapHvorSomHelst)}>
                    {erInaktiv(kandidat) ? 'Inaktiv' : kandidat.fodselsnr}
                </div>
                <div role="cell" className={css.kolonneSorterbar}>
                    <span className={css.tabellTekstInner}>
                        {kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})
                    </span>
                </div>

                <div role="cell" className={classNames(css.kolonneSorterbar, css.lagtTil)}>
                    <span>{formaterDato(kandidat.lagtTilTidspunkt)}</span>
                </div>

                <StatusOgHendelser
                    kandidat={kandidat}
                    kandidatliste={kandidatliste}
                    forespørselOmDelingAvCv={forespørselOmDelingAvCv}
                    kanEditere={kanEndreKandidatlisten}
                    sms={melding}
                    onStatusChange={(status) => {
                        onKandidatStatusChange(
                            status,
                            kandidatliste.kandidatlisteId,
                            kandidat.kandidatnr
                        );
                    }}
                />

                <div role="cell">
                    <LenkeknappNy onClick={toggleNotater} className={css.ikonknapp} tittel="Notat">
                        <TasklistIcon
                            fontSize="1.7rem"
                            className={classNames(css.notatIkon, css.kandidatradIkonIkkeFylt)}
                        />
                        <TasklistFillIcon
                            fontSize="1.7rem"
                            className={classNames(css.notatIkon, css.kandidatradIkonFylt)}
                        />
                        <span className={css.antallNotater}>{antallNotater}</span>
                    </LenkeknappNy>
                </div>
                <div role="cell" className={css.kolonneMidtstilt}>
                    {!erInaktiv(kandidat) && (
                        <LenkeknappNy
                            onClick={toggleMerInfo}
                            className={css.ikonknapp}
                            tittel="Mer informasjon"
                        >
                            <InformationSquareIcon
                                fontSize="1.7rem"
                                className={css.kandidatradIkonIkkeFylt}
                            />
                            <InformationSquareFillIcon
                                fontSize="1.7rem"
                                className={css.kandidatradIkonFylt}
                            />
                        </LenkeknappNy>
                    )}
                </div>
                {visArkiveringskolonne && (
                    <div role="cell" className={css.kolonnHøyrestilt}>
                        <LenkeknappNy
                            tittel="Slett kandidat"
                            onClick={onToggleArkivert}
                            className={css.ikonknapp}
                        >
                            <TrashIcon
                                title="Slett kandidat"
                                fontSize="1.7rem"
                                className={css.kandidatradIkonIkkeFylt}
                            />
                            <TrashFillIcon
                                title="Slett kandidat"
                                fontSize="1.7rem"
                                className={css.kandidatradIkonFylt}
                            />
                        </LenkeknappNy>
                    </div>
                )}
            </div>
            {tilstand?.visningsstatus === Visningsstatus.VisNotater && (
                <Notater
                    kandidat={kandidat}
                    kandidatliste={kandidatliste}
                    notater={notater}
                    antallNotater={antallNotater}
                    onOpprettNotat={onOpprettNotat}
                    onEndreNotat={onEndreNotat}
                    onSlettNotat={onSlettNotat}
                />
            )}
            {tilstand?.visningsstatus === Visningsstatus.VisMerInfo && (
                <MerInfo kandidat={kandidat} />
            )}
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    sistValgteKandidat: state.kandidatliste.sistValgteKandidat,
});

export default connect(mapStateToProps, null)(Kandidatrad);
