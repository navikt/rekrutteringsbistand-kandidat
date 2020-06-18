import React, { FunctionComponent, useEffect, useRef } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import NavFrontendChevron from 'nav-frontend-chevron';

import { capitalizeFirstLetter } from '../../../../felles/sok/utils';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { KandidatQueryParam } from '../../../kandidatside/Kandidatside';
import { MidlertidigUtilgjengeligState } from '../../../kandidatside/midlertidig-utilgjengelig/midlertidigUtilgjengeligReducer';
import { modifierTilListeradGrid } from '../liste-header/ListeHeader';
import { Nettstatus } from '../../../../felles/common/remoteData';
import { sendEvent } from '../../../amplitude/amplitude';
import { Visningsstatus } from '../Kandidatliste';
import AppState from '../../../AppState';
import KandidatlisteActionType from '../../reducer/KandidatlisteActionType';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import MerInfo from './mer-info/MerInfo';
import Notater from './notater/Notater';
import SmsStatusIkon from './smsstatus/SmsStatusIkon';
import StatusSelect, { Status, Statusvisning } from './statusSelect/StatusSelect';
import TilgjengelighetFlagg from '../../../result/kandidater-tabell/tilgjengelighet-flagg/TilgjengelighetFlagg';
import './Kandidatrad.less';
import UtfallSelect from './utfall-select/UtfallSelect';
import { useFeatureToggle } from '../../../mock/useFeatureToggle';
import { utfallToDisplayName } from './utfall-select/UtfallVisning';
import { lenkeTilCv } from '../../../application/paths';

// TODO Vi har nå to typer Utfall.
//      Når endring av utfall er slått på kan disse to typene slås sammen til én.
export enum Utfall {
    IkkePresentert = 'IKKE_PRESENTERT',
    Presentert = 'PRESENTERT',
}

type Props = {
    kandidat: KandidatIKandidatliste;
    kandidatlisteId: string;
    stillingsId: string | null;
    endreNotat: any;
    slettNotat: any;
    opprettNotat: any;
    toggleArkivert: any;
    kanEditere: boolean;
    onToggleKandidat: (kandidatnr: string) => void;
    onVisningChange: (
        visningsstatus: Visningsstatus,
        kandidatlisteId: string,
        kandidatnr: string
    ) => void;
    onKandidatStatusChange: any;
    onKandidatUtfallChange: (
        utfall: Utfall,
        navKontor: string,
        kandidatlisteId: string,
        kandidatnr: string
    ) => void;
    visArkiveringskolonne: boolean;
    setValgtKandidat: (kandidatlisteId: string, kandidatnr: string) => void;
    midlertidigUtilgjengeligMap: MidlertidigUtilgjengeligState;
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => void;
    sistValgteKandidat?: {
        kandidatlisteId: string;
        kandidatnr: string;
    };
    valgtNavKontor: string;
};

const Kandidatrad: FunctionComponent<Props> = ({
    kandidat,
    kandidatlisteId,
    stillingsId,
    endreNotat,
    slettNotat,
    opprettNotat,
    toggleArkivert,
    onToggleKandidat,
    onVisningChange,
    kanEditere,
    onKandidatStatusChange,
    onKandidatUtfallChange,
    visArkiveringskolonne,
    midlertidigUtilgjengeligMap,
    hentMidlertidigUtilgjengeligForKandidat,
    setValgtKandidat,
    sistValgteKandidat,
    valgtNavKontor,
}) => {
    const kandidatRadRef = useRef<HTMLDivElement>(null);
    const visEndreUtfall = useFeatureToggle('vis-endre-utfall-dropdown');

    useEffect(() => {
        const erSistValgteKandidat =
            sistValgteKandidat &&
            sistValgteKandidat.kandidatnr === kandidat.kandidatnr &&
            sistValgteKandidat.kandidatlisteId === kandidatlisteId;

        if (erSistValgteKandidat) {
            kandidatRadRef?.current?.focus();
        }
    }, [sistValgteKandidat, kandidat.kandidatnr, kandidatlisteId, kandidatRadRef]);

    const antallNotater =
        kandidat.notater.kind === Nettstatus.Suksess
            ? kandidat.notater.data.length
            : kandidat.antallNotater;
    const toggleNotater = () => {
        onVisningChange(
            kandidat.visningsstatus === Visningsstatus.VisNotater
                ? Visningsstatus.SkjulPanel
                : Visningsstatus.VisNotater,
            kandidatlisteId,
            kandidat.kandidatnr
        );
    };

    const toggleMerInfo = () => {
        const nyStatus =
            kandidat.visningsstatus === Visningsstatus.VisMerInfo
                ? Visningsstatus.SkjulPanel
                : Visningsstatus.VisMerInfo;
        onVisningChange(nyStatus, kandidatlisteId, kandidat.kandidatnr);
        if (nyStatus === Visningsstatus.VisMerInfo) {
            sendEvent('kandidatliste_mer_info', 'åpne');
        }
    };

    const onEndreNotat = (notatId, tekst) => {
        endreNotat(kandidatlisteId, kandidat.kandidatnr, notatId, tekst);
    };

    const onSletteNotat = (notatId) => {
        slettNotat(kandidatlisteId, kandidat.kandidatnr, notatId);
    };

    const onToggleArkivert = () => {
        toggleArkivert(kandidatlisteId, kandidat.kandidatnr, true);
    };

    const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
    const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';

    const klassenavnForListerad =
        'kandidatliste-kandidat__rad' +
        modifierTilListeradGrid(stillingsId !== null, visArkiveringskolonne);

    const klassenavn = `kandidatliste-kandidat ${
        kandidat.markert ? 'kandidatliste-kandidat--checked' : ''
    }`;

    return (
        <div tabIndex={-1} ref={kandidatRadRef} className={klassenavn}>
            <div className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide"
                    checked={kandidat.markert}
                    onChange={() => {
                        onToggleKandidat(kandidat.kandidatnr);
                    }}
                />
                <div className="kandidater-tabell__tilgjengelighet">
                    {kandidat.aktørid && (
                        <TilgjengelighetFlagg
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
                <div className="kandidatliste-kandidat__kolonne-med-sms">
                    <Link
                        title="Vis profil"
                        className="lenke"
                        to={lenkeTilCv(kandidat.kandidatnr, kandidatlisteId, true)}
                        onClick={() => setValgtKandidat(kandidatlisteId, kandidat.kandidatnr)}
                    >
                        {`${etternavn}, ${fornavn}`}
                    </Link>
                    {kandidat.sms && <SmsStatusIkon sms={kandidat.sms} />}
                </div>
                <div className="kandidatliste-kandidat__wrap-hvor-som-helst">
                    {kandidat.fodselsnr}
                </div>
                <div className="kandidatliste-kandidat__tabell-tekst">
                    <span className="kandidatliste-kandidat__tabell-tekst-inner">
                        {kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})
                    </span>
                </div>

                <div className="kandidatliste-kandidat__lagt-til">
                    <span>{moment(kandidat.lagtTilTidspunkt).format('DD.MM.')}</span>
                    <span>{moment(kandidat.lagtTilTidspunkt).format('YYYY')}</span>
                </div>
                {visArkiveringskolonne ? (
                    <StatusSelect
                        kanEditere={kanEditere}
                        value={kandidat.status as Status}
                        onChange={(status) => {
                            onKandidatStatusChange(status, kandidatlisteId, kandidat.kandidatnr);
                        }}
                    />
                ) : (
                    <Statusvisning status={kandidat.status as Status} />
                )}
                {stillingsId &&
                    (visEndreUtfall ? (
                        <UtfallSelect
                            kanEndreUtfall={kanEditere}
                            value={kandidat.utfall as Utfall}
                            onChange={(utfall: Utfall) => {
                                sendEvent('kandidatliste', 'endre_utfall', { utfall: utfall });
                                onKandidatUtfallChange(
                                    utfall,
                                    valgtNavKontor,
                                    kandidatlisteId,
                                    kandidat.kandidatnr
                                );
                            }}
                        />
                    ) : (
                        <div className="kandidatliste-kandidat__tabell-tekst">
                            {utfallToDisplayName(kandidat.utfall as Utfall)}
                        </div>
                    ))}
                <div>
                    <Lenkeknapp
                        onClick={toggleNotater}
                        className="Notat kandidatliste-kandidat__ekspanderbar-knapp"
                    >
                        <i className="Notat__icon" />
                        <span className="kandidatliste-kandidat__antall-notater">
                            {antallNotater}
                        </span>
                        <NavFrontendChevron
                            className="kandidatliste-kandidat__chevron"
                            type={
                                kandidat.visningsstatus === Visningsstatus.VisNotater
                                    ? 'opp'
                                    : 'ned'
                            }
                        />
                    </Lenkeknapp>
                </div>
                <div className="kandidatliste-kandidat__kolonne-midtstilt">
                    <Lenkeknapp
                        onClick={toggleMerInfo}
                        className="MerInfo kandidatliste-kandidat__ekspanderbar-knapp"
                    >
                        <i className="MerInfo__icon" />
                        <NavFrontendChevron
                            className="kandidatliste-kandidat__chevron"
                            type={
                                kandidat.visningsstatus === Visningsstatus.VisMerInfo
                                    ? 'opp'
                                    : 'ned'
                            }
                        />
                    </Lenkeknapp>
                </div>
                {visArkiveringskolonne && (
                    <div className="kandidatliste-kandidat__kolonne-midtstilt">
                        <Lenkeknapp
                            tittel="Slett kandidat"
                            onClick={onToggleArkivert}
                            className="Delete"
                        >
                            <div className="Delete__icon" />
                        </Lenkeknapp>
                    </div>
                )}
            </div>
            {kandidat.visningsstatus === Visningsstatus.VisNotater && (
                <Notater
                    notater={kandidat.notater}
                    antallNotater={
                        kandidat.notater.kind === Nettstatus.Suksess
                            ? kandidat.notater.data.length
                            : kandidat.antallNotater
                    }
                    onOpprettNotat={(tekst) => {
                        opprettNotat(kandidatlisteId, kandidat.kandidatnr, tekst);
                    }}
                    onEndreNotat={onEndreNotat}
                    onSletteNotat={onSletteNotat}
                />
            )}
            {kandidat.visningsstatus === Visningsstatus.VisMerInfo && (
                <MerInfo kandidat={kandidat} />
            )}
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    midlertidigUtilgjengeligMap: state.midlertidigUtilgjengelig,
    sistValgteKandidat: state.kandidatlister.sistValgteKandidat,
    valgtNavKontor: state.navKontor.valgtNavKontor,
});

const mapDispatchToProps = (dispatch) => ({
    hentMidlertidigUtilgjengeligForKandidat: (aktørId: string, kandidatnr: string) => {
        dispatch({ type: 'FETCH_MIDLERTIDIG_UTILGJENGELIG', aktørId, kandidatnr });
    },
    setValgtKandidat: (kandidatlisteId, kandidatnr) =>
        dispatch({
            type: KandidatlisteActionType.VELG_KANDIDAT,
            kandidatlisteId,
            kandidatnr,
        }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Kandidatrad);
