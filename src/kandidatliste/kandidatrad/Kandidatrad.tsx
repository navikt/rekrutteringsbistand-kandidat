import React, { FunctionComponent, useEffect, useRef } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { capitalizeFirstLetter } from '../../kandidatsøk/utils';
import { KandidatIKandidatliste, Kandidatliste, Kandidatlistestatus } from '../kandidatlistetyper';
import { lenkeTilCv } from '../../app/paths';
import { MidlertidigUtilgjengeligState } from '../../kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { modifierTilListeradGrid } from '../liste-header/ListeHeader';
import { Nettstatus } from '../../api/remoteData';
import { sendEvent } from '../../amplitude/amplitude';
import { Visningsstatus } from '../Kandidatliste';
import KandidatlisteAction from '../reducer/KandidatlisteAction';
import KandidatlisteActionType from '../reducer/KandidatlisteActionType';
import SmsStatusPopup from './smsstatus/SmsStatusPopup';
import StatusSelect, { Statusvisning } from './statusSelect/StatusSelect';
import TilgjengelighetFlagg from '../../kandidatsøk/kandidater-tabell/tilgjengelighet-flagg/TilgjengelighetFlagg';
import UtfallMedEndreIkon, { Utfall } from './utfall-med-endre-ikon/UtfallMedEndreIkon';
import './Kandidatrad.less';
import Lenkeknapp from '../../common/lenkeknapp/Lenkeknapp';
import NavFrontendChevron from 'nav-frontend-chevron';
import Notater from './notater/Notater';
import MerInfo from './mer-info/MerInfo';
import AppState from '../../AppState';

type Props = {
    kandidat: KandidatIKandidatliste;
    kandidatliste: Kandidatliste;
    toggleArkivert: any;
    onToggleKandidat: (kandidatnr: string) => void;
    onVisningChange: (visningsstatus: Visningsstatus, kandidatnr: string) => void;
    onKandidatStatusChange: any;
    visEndreUtfallModal: (kandidat: KandidatIKandidatliste) => void;
    visArkiveringskolonne: boolean;
    midlertidigUtilgjengeligMap: MidlertidigUtilgjengeligState;
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => void;
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
    onVisningChange,
    onKandidatStatusChange,
    visEndreUtfallModal,
    visArkiveringskolonne,
    midlertidigUtilgjengeligMap,
    hentMidlertidigUtilgjengeligForKandidat,
    sistValgteKandidat,
}) => {
    const dispatch = useDispatch();
    const kandidatRadRef = useRef<HTMLDivElement>(null);

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
        kandidat.notater.kind === Nettstatus.Suksess
            ? kandidat.notater.data.length
            : kandidat.antallNotater;

    const toggleNotater = () => {
        onVisningChange(
            kandidat.tilstand.visningsstatus === Visningsstatus.VisNotater
                ? Visningsstatus.SkjulPanel
                : Visningsstatus.VisNotater,
            kandidat.kandidatnr
        );
    };

    const toggleMerInfo = () => {
        const nyStatus =
            kandidat.tilstand.visningsstatus === Visningsstatus.VisMerInfo
                ? Visningsstatus.SkjulPanel
                : Visningsstatus.VisMerInfo;
        onVisningChange(nyStatus, kandidat.kandidatnr);
        if (nyStatus === Visningsstatus.VisMerInfo) {
            sendEvent('kandidatliste_mer_info', 'åpne');
        }
    };

    const onOpprettNotat = (tekst: string) => {
        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.OPPRETT_NOTAT,
            kandidatlisteId: kandidatliste.kandidatlisteId,
            kandidatnr: kandidat.kandidatnr,
            tekst,
        });
    };

    const onEndreNotat = (notatId: string, tekst: string) => {
        dispatch<KandidatlisteAction>({
            type: KandidatlisteActionType.ENDRE_NOTAT,
            kandidatlisteId: kandidatliste.kandidatlisteId,
            kandidatnr: kandidat.kandidatnr,
            notatId,
            tekst,
        });
    };

    const onSlettNotat = (notatId: string) => {
        dispatch({
            type: KandidatlisteActionType.SLETT_NOTAT,
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

    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(kandidatliste.stillingId !== null, visArkiveringskolonne);

    const klassenavn = `kandidatliste-kandidat${
        kandidatliste.status === Kandidatlistestatus.Lukket
            ? ' kandidatliste-kandidat--disabled'
            : ''
    } ${kandidat.tilstand.markert ? 'kandidatliste-kandidat--checked' : ''}`;

    return (
        <div role="rowgroup" tabIndex={-1} ref={kandidatRadRef} className={klassenavn}>
            <div role="row" className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    disabled={kandidatliste.status === Kandidatlistestatus.Lukket}
                    checked={kandidat.tilstand.markert}
                    onChange={() => {
                        onToggleKandidat(kandidat.kandidatnr);
                    }}
                />
                <div className="kandidater-tabell__tilgjengelighet">
                    {kandidat.aktørid && (
                        <TilgjengelighetFlagg
                            className="kandidatliste-kandidat__fokuserbar-knapp"
                            status={kandidat.midlertidigUtilgjengeligStatus}
                            merInformasjon={midlertidigUtilgjengeligMap[kandidat.kandidatnr]}
                            hentMerInformasjon={() =>
                                hentMidlertidigUtilgjengeligForKandidat(
                                    kandidat.aktørid || '',
                                    kandidat.kandidatnr
                                )
                            }
                        />
                    )}
                </div>
                <div className="kandidatliste-kandidat__kolonne-med-sms kandidatliste-kandidat__kolonne-sorterbar">
                    <Link
                        role="cell"
                        title="Vis profil"
                        className="lenke"
                        to={lenkeTilCv(
                            kandidat.kandidatnr,
                            kandidatliste.kandidatlisteId,
                            undefined,
                            true
                        )}
                    >
                        {`${etternavn}, ${fornavn}`}
                    </Link>
                    {kandidat.sms && <SmsStatusPopup sms={kandidat.sms} />}
                </div>
                <div
                    role="cell"
                    className="kandidatliste-kandidat__wrap-hvor-som-helst kandidatliste-kandidat__kolonne-sorterbar"
                >
                    {kandidat.fodselsnr}
                </div>
                <div
                    role="cell"
                    className="kandidatliste-kandidat__tabell-tekst kandidatliste-kandidat__kolonne-sorterbar"
                >
                    <span className="kandidatliste-kandidat__tabell-tekst-inner">
                        {kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})
                    </span>
                </div>

                <div
                    role="cell"
                    className="kandidatliste-kandidat__lagt-til kandidatliste-kandidat__kolonne-sorterbar"
                >
                    <span>{moment(kandidat.lagtTilTidspunkt).format('DD.MM.')}</span>
                    <span>{moment(kandidat.lagtTilTidspunkt).format('YYYY')}</span>
                </div>
                <div
                    role="cell"
                    aria-label="Status"
                    className="kandidatliste-kandidat__kolonne-sorterbar"
                >
                    {visArkiveringskolonne ? (
                        <StatusSelect
                            kanEditere={
                                kandidatliste.status === Kandidatlistestatus.Åpen &&
                                kandidatliste.kanEditere
                            }
                            value={kandidat.status}
                            onChange={(status) => {
                                onKandidatStatusChange(
                                    status,
                                    kandidatliste.kandidatlisteId,
                                    kandidat.kandidatnr
                                );
                            }}
                        />
                    ) : (
                        <Statusvisning status={kandidat.status} />
                    )}
                </div>
                {kandidatliste.stillingId && (
                    <div role="cell" className="kandidatliste-kandidat__kolonne-sorterbar">
                        <UtfallMedEndreIkon
                            kanEndreUtfall={
                                kandidatliste.kanEditere &&
                                kandidatliste.status === Kandidatlistestatus.Åpen
                            }
                            utfall={kandidat.utfall as Utfall}
                            onClick={() => {
                                visEndreUtfallModal(kandidat);
                            }}
                            className="Notat kandidatliste-kandidat__fokuserbar-knapp"
                        />
                    </div>
                )}

                <div role="cell">
                    <Lenkeknapp
                        onClick={toggleNotater}
                        className="Notat kandidatliste-kandidat__fokuserbar-knapp"
                    >
                        <i className="Notat__icon" />
                        <span className="kandidatliste-kandidat__antall-notater">
                            {antallNotater}
                        </span>
                        <NavFrontendChevron
                            className="kandidatliste-kandidat__chevron"
                            type={
                                kandidat.tilstand.visningsstatus === Visningsstatus.VisNotater
                                    ? 'opp'
                                    : 'ned'
                            }
                        />
                    </Lenkeknapp>
                </div>
                <div role="cell" className="kandidatliste-kandidat__kolonne-midtstilt">
                    <Lenkeknapp
                        onClick={toggleMerInfo}
                        className="MerInfo kandidatliste-kandidat__fokuserbar-knapp"
                    >
                        <i className="MerInfo__icon" />
                        <NavFrontendChevron
                            className="kandidatliste-kandidat__chevron"
                            type={
                                kandidat.tilstand.visningsstatus === Visningsstatus.VisMerInfo
                                    ? 'opp'
                                    : 'ned'
                            }
                        />
                    </Lenkeknapp>
                </div>
                {visArkiveringskolonne && (
                    <div role="cell" className="kandidatliste-kandidat__kolonne-høyrestilt">
                        <Lenkeknapp
                            tittel="Slett kandidat"
                            onClick={onToggleArkivert}
                            className="Delete kandidatliste-kandidat__fokuserbar-knapp"
                        >
                            <div className="Delete__icon" />
                        </Lenkeknapp>
                    </div>
                )}
            </div>
            {kandidat.tilstand.visningsstatus === Visningsstatus.VisNotater && (
                <Notater
                    notater={kandidat.notater}
                    antallNotater={antallNotater}
                    onOpprettNotat={onOpprettNotat}
                    onEndreNotat={onEndreNotat}
                    onSlettNotat={onSlettNotat}
                />
            )}
            {kandidat.tilstand.visningsstatus === Visningsstatus.VisMerInfo && (
                <MerInfo kandidat={kandidat} />
            )}
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    midlertidigUtilgjengeligMap: state.midlertidigUtilgjengelig,
    sistValgteKandidat: state.kandidatliste.sistValgteKandidat,
});

const mapDispatchToProps = (dispatch) => ({
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => {
        dispatch({ type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG', aktørId, kandidatnr });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatrad);
