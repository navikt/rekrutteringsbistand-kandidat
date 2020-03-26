import React, { FunctionComponent } from 'react';
import { RemoteDataTypes } from '../../../../felles/common/remoteData';
import { Visningsstatus } from '../Kandidatliste';
import { capitalizeFirstLetter } from '../../../../felles/sok/utils';
import { Checkbox } from 'nav-frontend-skjema';
import { Link } from 'react-router-dom';
import StatusSelect, { Status } from './statusSelect/StatusSelect';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Lenkeknapp from '../../../../felles/common/Lenkeknapp';
import NavFrontendChevron from 'nav-frontend-chevron';
import Notater from './notater/Notater';
import { KandidatIKandidatliste, SmsStatus } from '../../kandidatlistetyper';
import { HjelpetekstUnder } from 'nav-frontend-hjelpetekst';
import SendSmsIkon from './SendSmsIkon';

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

const formaterSendtDato = (dato: Date) => {
    return `${dato.toLocaleString('no-NB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    })}`;
};

type Props = {
    kandidat: KandidatIKandidatliste;
    kandidatlisteId: string;
    stillingsId?: string;
    endreNotat: any;
    slettNotat: any;
    opprettNotat: any;
    kanEditere: boolean;
    onToggleKandidat: (kandidatnr: string) => void;
    onVisningChange: (
        visningsstatus: Visningsstatus,
        kandidatlisteId: string,
        kandidatnr: string
    ) => void;
    onKandidatStatusChange: any;
    visSendSms?: boolean;
};

const KandidatRad: FunctionComponent<Props> = ({
    kandidat,
    kandidatlisteId,
    stillingsId,
    endreNotat,
    slettNotat,
    opprettNotat,
    onToggleKandidat,
    onVisningChange,
    kanEditere,
    onKandidatStatusChange,
    visSendSms,
}) => {
    const antallNotater =
        kandidat.notater.kind === RemoteDataTypes.SUCCESS
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
        onVisningChange(
            kandidat.visningsstatus === Visningsstatus.VisMerInfo
                ? Visningsstatus.SkjulPanel
                : Visningsstatus.VisMerInfo,
            kandidatlisteId,
            kandidat.kandidatnr
        );
    };

    const onEndreNotat = (notatId, tekst) => {
        endreNotat(kandidatlisteId, kandidat.kandidatnr, notatId, tekst);
    };

    const onSletteNotat = notatId => {
        slettNotat(kandidatlisteId, kandidat.kandidatnr, notatId);
    };

    const fornavn = kandidat.fornavn ? capitalizeFirstLetter(kandidat.fornavn) : '';
    const etternavn = kandidat.etternavn ? capitalizeFirstLetter(kandidat.etternavn) : '';

    return (
        <div className={`liste-rad-wrapper kandidat ${kandidat.markert ? 'checked' : 'unchecked'}`}>
            <div className="liste-rad">
                <div className="kolonne-checkboks">
                    <Checkbox
                        label="&#8203;" // <- tegnet for tom streng
                        className="text-hide skjemaelement--pink"
                        checked={kandidat.markert}
                        onChange={() => {
                            onToggleKandidat(kandidat.kandidatnr);
                        }}
                    />
                </div>
                <div className="kolonne-bred kolonne-med-sms">
                    <Link
                        title="Vis profil"
                        className="link"
                        to={`/kandidater/lister/detaljer/${kandidatlisteId}/cv/${kandidat.kandidatnr}`}
                    >
                        {`${etternavn}, ${fornavn}`}
                    </Link>
                    {visSendSms && kandidat.sms && kandidat.sms.status !== SmsStatus.IkkeSendt && (
                        <HjelpetekstUnder
                            className="sms-status-popup"
                            id="hjelpetekst-sms-status"
                            anchor={SendSmsIkon}
                        >
                            {formaterSendtDato(new Date(kandidat.sms.opprettet))}
                            <br />
                            En SMS blir sendt til kandidaten.
                        </HjelpetekstUnder>
                    )}
                </div>
                <div className="kolonne-dato">{kandidat.fodselsnr}</div>
                <div className="kolonne-bred">
                    <span className="tabell-tekst">
                        {kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})
                    </span>
                </div>
                <div className="kolonne-middels">
                    <StatusSelect
                        kanEditere={kanEditere}
                        value={kandidat.status as Status}
                        onChange={status => {
                            onKandidatStatusChange(status, kandidatlisteId, kandidat.kandidatnr);
                        }}
                    />
                </div>
                {stillingsId && (
                    <div className="kolonne-bred tabell-tekst">
                        {utfallToString(kandidat.utfall)}
                    </div>
                )}
                <div className="kolonne-smal">
                    <Lenkeknapp onClick={toggleNotater} className="legg-til-kandidat Notat">
                        <i className="Notat__icon" />
                        {antallNotater}
                        <NavFrontendChevron
                            type={
                                kandidat.visningsstatus === Visningsstatus.VisNotater
                                    ? 'opp'
                                    : 'ned'
                            }
                        />
                    </Lenkeknapp>
                </div>
                <div className="kolonne-smal">
                    <Lenkeknapp onClick={toggleMerInfo} className="legg-til-kandidat MerInfo">
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
            </div>
            {kandidat.visningsstatus === Visningsstatus.VisNotater && (
                <Notater
                    notater={kandidat.notater}
                    antallNotater={
                        kandidat.notater.kind === RemoteDataTypes.SUCCESS
                            ? kandidat.notater.data.length
                            : kandidat.antallNotater
                    }
                    onOpprettNotat={tekst => {
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

export default KandidatRad;
