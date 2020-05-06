import React, { FunctionComponent } from 'react';
import { Nettstatus } from '../../../../felles/common/remoteData';
import { Visningsstatus } from '../Kandidatliste';
import { capitalizeFirstLetter } from '../../../../felles/sok/utils';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import StatusSelect, { Status, Statusvisning } from './statusSelect/StatusSelect';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import NavFrontendChevron from 'nav-frontend-chevron';
import Notater from './notater/Notater';
import SmsStatusIkon from './smsstatus/SmsStatusIkon';
import { KandidatIKandidatliste } from '../../kandidatlistetyper';
import { modifierTilListeradGrid } from '../liste-header/ListeHeader';
import { logEvent } from '../../../amplitude/amplitude';
import { SET_SCROLL_POSITION } from '../../../sok/searchReducer';
import { connect } from 'react-redux';

const utfallToString = (utfall: string) => {
    if (utfall === 'IKKE_PRESENTERT') {
        return 'Ikke presentert';
    } else if (utfall === 'PRESENTERT') {
        return 'Presentert';
    } else if (utfall === 'FATT_JOBBEN') {
        return 'Fått jobben';
    }
    return utfall;
};

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
    visArkiveringskolonne: boolean;
    setScrollPosition: (position: number) => void;
};

const KandidatRad: FunctionComponent<Props> = ({
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
    visArkiveringskolonne,
    setScrollPosition,
}) => {
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
            logEvent('kandidatliste_mer_info', 'åpne');
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
        'liste-rad' + modifierTilListeradGrid(stillingsId !== null, visArkiveringskolonne);

    return (
        <div className={`liste-rad-wrapper kandidat ${kandidat.markert ? 'checked' : 'unchecked'}`}>
            <div className={klassenavnForListerad}>
                <Checkbox
                    label="&#8203;" // <- tegnet for tom streng
                    className="text-hide skjemaelement--pink"
                    checked={kandidat.markert}
                    onChange={() => {
                        onToggleKandidat(kandidat.kandidatnr);
                    }}
                />
                <div className="kolonne-med-sms">
                    <Link
                        title="Vis profil"
                        className="link"
                        to={`/kandidater/lister/detaljer/${kandidatlisteId}/cv/${kandidat.kandidatnr}`}
                        onClick={() => setScrollPosition(window.pageYOffset)}
                    >
                        {`${etternavn}, ${fornavn}`}
                    </Link>
                    {kandidat.sms && <SmsStatusIkon sms={kandidat.sms} />}
                </div>
                <span>{kandidat.fodselsnr}</span>
                <div className="tabell-tekst">
                    <span className="tabell-tekst-inner">
                        {kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})
                    </span>
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
                {stillingsId && (
                    <div className="tabell-tekst">{utfallToString(kandidat.utfall)}</div>
                )}
                <div>
                    <Lenkeknapp
                        onClick={toggleNotater}
                        className="Notat liste-rad__ekspanderbar-knapp"
                    >
                        <i className="Notat__icon" />
                        <span className="liste-rad__antall-notater">{antallNotater}</span>
                        <NavFrontendChevron
                            type={
                                kandidat.visningsstatus === Visningsstatus.VisNotater
                                    ? 'opp'
                                    : 'ned'
                            }
                        />
                    </Lenkeknapp>
                </div>
                <div className="kolonne-midtstilt">
                    <Lenkeknapp
                        onClick={toggleMerInfo}
                        className="MerInfo liste-rad__ekspanderbar-knapp"
                    >
                        <i className="MerInfo__icon" />
                        <NavFrontendChevron
                            type={
                                kandidat.visningsstatus === Visningsstatus.VisMerInfo
                                    ? 'opp'
                                    : 'ned'
                            }
                        />
                    </Lenkeknapp>
                </div>
                {visArkiveringskolonne && (
                    <div className="kolonne-midtstilt">
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
                <div className="info-under-kandidat">
                    <div className="info-under-kandidat-content mer-info">
                        <div className="kontaktinfo-kolonne">
                            <Element>Kontaktinfo</Element>
                            <Normaltekst className="tekst">
                                E-post:{' '}
                                {kandidat.epost ? (
                                    <a className="link" href={`mailto:${kandidat.epost}`}>
                                        {kandidat.epost}
                                    </a>
                                ) : (
                                    <span>&mdash;</span>
                                )}
                            </Normaltekst>
                            <Normaltekst className="tekst">
                                Telefon:{' '}
                                {kandidat.telefon ? kandidat.telefon : <span>&mdash;</span>}
                            </Normaltekst>
                        </div>
                        <div className="innsatsgruppe-kolonne">
                            <Normaltekst>
                                <strong>Innsatsgruppe:</strong>
                                {` ${kandidat.innsatsgruppe}`}
                            </Normaltekst>
                            <a
                                className="frittstaende-lenke ForlateSiden link"
                                href={`https://app.adeo.no/veilarbpersonflatefs/${kandidat.fodselsnr}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="link">Se aktivitetsplan</span>
                                <i className="ForlateSiden__icon" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    setScrollPosition: (scrollPosisjon) =>
        dispatch({ type: SET_SCROLL_POSITION, scrolletFraToppen: scrollPosisjon }),
});

export default connect(null, mapDispatchToProps)(KandidatRad);
