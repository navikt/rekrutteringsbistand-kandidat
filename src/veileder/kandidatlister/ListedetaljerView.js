import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { Checkbox } from 'nav-frontend-skjema';
import { Element, Normaltekst, Sidetittel, Undertittel } from 'nav-frontend-typografi';
import { Kandidat, Notat } from './PropTypes';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import '../../felles/common/ikoner/ikoner.less';
import Notater from './Notater';
import { capitalizeEmployerName, capitalizeFirstLetter } from '../../felles/sok/utils';

const STATUS = {
    FORESLATT: 'FORESLATT',
    VURDERES: 'VURDERES',
    KONTAKTET: 'KONTAKTET',
    AKTUELL: 'AKTUELL',
    UAKTUELL: 'UAKTUELL',
    UINTERESSERT: 'UINTERESSERT'
};

export const VISNINGSSTATUS = {
    SKJUL_PANEL: 'SKJUL_PANEL',
    VIS_NOTATER: 'VIS_NOTATER',
    VIS_MER_INFO: 'VIS_MER_INFO'
};

const statusToString = (status) => {
    if (status === STATUS.FORESLATT) {
        return 'Foreslått';
    } else if (status === STATUS.VURDERES) {
        return 'Vurderes';
    } else if (status === STATUS.KONTAKTET) {
        return 'Kontaktet';
    } else if (status === STATUS.AKTUELL) {
        return 'Aktuell';
    } else if (status === STATUS.UAKTUELL) {
        return 'Ikke aktuell';
    } else if (status === STATUS.UINTERESSERT) {
        return 'Ikke interessert';
    }
    return status;
};

const statusToClassname = (status) => {
    if (status === STATUS.FORESLATT) {
        return 'foreslatt';
    } else if (status === STATUS.VURDERES) {
        return 'vurderes';
    } else if (status === STATUS.KONTAKTET) {
        return 'kontaktet';
    } else if (status === STATUS.AKTUELL) {
        return 'aktuell';
    } else if (status === STATUS.UAKTUELL) {
        return 'uaktuell';
    } else if (status === STATUS.UINTERESSERT) {
        return 'uinteressert';
    }
    return '';
};

const utfallToString = (utfall) => {
    if (utfall === 'IKKE_PRESENTERT') {
        return 'Ikke presentert';
    } else if (utfall === 'PRESENTERT') {
        return 'Presentert';
    } else if (utfall === 'FATT_JOBBEN') {
        return 'Fått jobben';
    }
    return utfall;
};

const ListedetaljerView = (props) => {
    const {
        kandidater,
        tittel,
        arbeidsgiver,
        opprettetAv,
        kandidatlisteId,
        stillingsId,
        kanEditere,
        alleMarkert,
        onCheckAlleKandidater,
        onToggleKandidat,
        onKandidatStatusChange,
        onKandidatShare,
        onEmailKandidater,
        onLeggTilKandidat,
        onVisningChange,
        opprettNotat,
        endreNotat,
        slettNotat,
        beskrivelse
    } = props;
    const SideHeader = () => (
        <div className="side-header">
            <div className="wrapper">
                <div className="top">
                    <div className="header-side" />
                    <Sidetittel className="tittel">{tittel}</Sidetittel>
                    <div className="header-side" />
                </div>
                <div className="antall">
                    <Element>{kandidater.length === 1 ? '1 kandidat' : `${kandidater.length} kandidater`}</Element>
                </div>
                <div className="bottom">
                    { arbeidsgiver &&
                    <div className="no-border-left">
                        Arbeidsgiver: {capitalizeEmployerName(arbeidsgiver)}
                    </div>
                    }
                    <div className={`${arbeidsgiver ? 'border-left' : 'no-border-left'}`}>
                        {`Veileder: ${opprettetAv.navn} (${opprettetAv.ident})`}
                    </div>
                    {stillingsId &&
                        <div className="border-left">
                            <a className="link" href={`/stilling/${stillingsId}`}>Se stillingsannonse</a>
                        </div>
                    }
                </div>
                {beskrivelse && (
                    <div className="beskrivelse">
                        <Normaltekst>{beskrivelse}</Normaltekst>
                    </div>
                )}
            </div>
        </div>
    );

    const FinnKandidaterLenke = () => (
        <Link to={stillingsId ? `/kandidater/stilling/${stillingsId}` : `/kandidater/kandidatliste/${kandidatlisteId}`} className="finn-kandidater FinnKandidater">
            <i className="FinnKandidater__icon" />
            <span className="link">Finn kandidater</span>
        </Link>
    );

    const LeggTilKandidatKnapp = () => (
        <Lenkeknapp onClick={onLeggTilKandidat} className="legg-til-kandidat LeggTilKandidat">
            <i className="LeggTilKandidat__icon" />
            Legg til kandidat
        </Lenkeknapp>
    );

    const KnappeRad = () => {
        const DeleKnapp = () => {
            const Disabled = () => (
                <div className="Lenkeknapp typo-normal Share">
                    <i className="Share__icon" />
                    <span>Del med arbeidsgiver (presenter)</span>
                </div>
            );
            const Enabled = () => (
                <div className="hjelpetekst">
                    <Lenkeknapp onClick={onKandidatShare} className="Share">
                        <i className="Share__icon" />
                        <span>Del med arbeidsgiver (presenter)</span>
                    </Lenkeknapp>
                </div>
            );
            if (kandidater.filter((kandidat) => kandidat.markert).length > 0) {
                return <Enabled />;
            }
            return (
                <HjelpetekstMidt
                    id="marker-kandidater-presentere-hjelpetekst"
                    anchor={Disabled}
                    tittel="Del de markerte kandidatene med arbeidsgiver (presenter)"
                >
                    Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver.
                </HjelpetekstMidt>
            );
        };
        const EpostKnapp = () => {
            const Disabled = () => (
                <div className="Lenkeknapp typo-normal Email">
                    <i className="Email__icon" />
                    Kopier e-post
                </div>
            );
            const Enabled = () => (
                <div className="hjelpetekst">
                    <Lenkeknapp onClick={onEmailKandidater} className="Email">
                        <i className="Email__icon" />
                        <span>Kopier e-post</span>
                    </Lenkeknapp>
                </div>
            );
            if (kandidater.filter((kandidat) => (kandidat.markert && kandidat.epost)).length > 0) {
                return <Enabled />;
            }
            return (
                <HjelpetekstMidt
                    id="marker-kandidater-epost-hjelpetekst"
                    anchor={Disabled}
                    tittel="Send e-post til de markerte kandidatene"
                >
                    Du må huke av for kandidatene du ønsker å kopiere e-postadressen til. Kandidatene må ha en e-postadresse.
                </HjelpetekstMidt>
            );
        };
        return (
            <div className="knappe-rad">
                <div className="knapper-venstre">
                    <FinnKandidaterLenke />
                    <LeggTilKandidatKnapp />
                </div>
                <div className="dele-wrapper">
                    <EpostKnapp />
                    { kanEditere && arbeidsgiver && <DeleKnapp /> }
                </div>
            </div>
        );
    };

    const ListeHeader = () => {
        const Sporsmalstegn = () => (
            <span className="Sporsmalstegn">
                <span className="Sporsmalstegn__icon" />
            </span>
        );
        const StatusHjelpetekst = () => (
            <HjelpetekstMidt id="sd" anchor={Sporsmalstegn} className="bred-hjelpetekst statusforklaring-stor">
                <strong>Forklaring til status</strong>
                <ul className="statusliste">
                    <li>Vurderes &ndash; Kandidater som er lagt i en kandidatliste får status vurderes</li>
                    <li>Kontaktet &ndash; Kandidaten er kontaktet, og det ventes på svar</li>
                    <li>Aktuell &ndash; Kandidaten er vurdert som aktuell for stillingen</li>
                    <li>Ikke aktuell &ndash; Kandidaten er vurdert som ikke aktuell for stillingen</li>
                    <li>Ikke interessert &ndash; Kandidaten er ikke interessert i stillingen</li>
                </ul>
                Statusene er kun synlig internt og vil ikke bli delt med arbeidsgiver.
            </HjelpetekstMidt>
        );
        return (
            <div className="liste-rad-wrapper liste-header">
                <div className="liste-rad">
                    <div className="kolonne-checkboks">
                        <Checkbox
                            label="&#8203;" // <- tegnet for tom streng
                            className="text-hide"
                            checked={alleMarkert}
                            onChange={onCheckAlleKandidater}
                        />
                    </div>
                    <div className="kolonne-bred"><Element>Navn</Element></div>
                    <div className="kolonne-dato"><Element>Fødselsnummer</Element></div>
                    <div className="kolonne-bred"><Element>Lagt til av</Element></div>
                    <div className="kolonne-bred">
                        <div className="status-overskrift">
                            Status
                            <StatusHjelpetekst />
                        </div>
                    </div>
                    {stillingsId && (
                        <div className="kolonne-bred"><Element>Utfall</Element></div>
                    )}
                    <div className="kolonne-smal"><Element>Notater</Element></div>
                    <div className="kolonne-smal"><Element>Mer info</Element></div>
                </div>
            </div>
        );
    };

    const StatusSelect = ({ value, onChange }) => ( // eslint-disable-line react/prop-types
        <div className="skjemaelement">
            <div className="selectContainer input--s">
                <select className="skjemaelement__input" value={value} onChange={onChange}>
                    {[STATUS.VURDERES, STATUS.KONTAKTET, STATUS.AKTUELL, STATUS.UAKTUELL, STATUS.UINTERESSERT]
                        .map((status) => (
                            <option key={status} value={status}>{statusToString(status)}</option>
                        ))
                    }
                </select>
            </div>
        </div>
    );

    const KandidatRad = ({ kandidat }) => { // eslint-disable-line react/prop-types
        const antallNotater = kandidat.notater ? kandidat.notater.length : kandidat.antallNotater;
        const toggleNotater = () => {
            onVisningChange(kandidat.visningsstatus === VISNINGSSTATUS.VIS_NOTATER
                ? VISNINGSSTATUS.SKJUL_PANEL
                : VISNINGSSTATUS.VIS_NOTATER,
            kandidatlisteId,
            kandidat.kandidatnr);
        };

        const toggleMerInfo = () => {
            onVisningChange(kandidat.visningsstatus === VISNINGSSTATUS.VIS_MER_INFO
                ? VISNINGSSTATUS.SKJUL_PANEL
                : VISNINGSSTATUS.VIS_MER_INFO,
            kandidatlisteId,
            kandidat.kandidatnr);
        };

        const onEndreNotat = (notatId, tekst) => {
            endreNotat(kandidatlisteId, kandidat.kandidatnr, notatId, tekst);
        };

        const onSletteNotat = (notatId) => {
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
                            className="text-hide"
                            checked={kandidat.markert}
                            onChange={() => {
                                onToggleKandidat(kandidat.kandidatnr);
                            }}
                        />
                    </div>
                    <div className="kolonne-bred tabell-tekst">
                        <Link title="Vis profil" className="link" to={`/kandidater/lister/detaljer/${kandidatlisteId}/cv/${kandidat.kandidatnr}`}>
                            {`${fornavn} ${etternavn}`}
                        </Link></div><div className="kolonne-dato">{kandidat.fodselsnr}</div>
                    <div className="kolonne-bred tabell-tekst">{kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})</div>
                    <div className="kolonne-bred">
                        {kanEditere
                            ? <StatusSelect
                                value={kandidat.status}
                                onChange={(e) => {
                                    onKandidatStatusChange(e.target.value, kandidatlisteId, kandidat.kandidatnr);
                                }}
                            />
                            : <span className="status">
                                <span className={`sirkel ${statusToClassname(kandidat.status)}`} />
                                {statusToString(kandidat.status)}
                            </span>
                        }
                    </div>
                    {stillingsId && (
                        <div className="kolonne-bred tabell-tekst">{utfallToString(kandidat.utfall)}</div>
                    )}
                    <div className="kolonne-smal">
                        <Lenkeknapp onClick={toggleNotater} className="legg-til-kandidat Notat">
                            <i className="Notat__icon" />
                            {antallNotater}
                            <NavFrontendChevron type={kandidat.visningsstatus === VISNINGSSTATUS.VIS_NOTATER ? 'opp' : 'ned'} />
                        </Lenkeknapp>
                    </div>
                    <div className="kolonne-smal">
                        <Lenkeknapp onClick={toggleMerInfo} className="legg-til-kandidat MerInfo">
                            <i className="MerInfo__icon" />
                            <NavFrontendChevron type={kandidat.visningsstatus === VISNINGSSTATUS.VIS_MER_INFO ? 'opp' : 'ned'} />
                        </Lenkeknapp>
                    </div>
                </div>
                {kandidat.visningsstatus === VISNINGSSTATUS.VIS_NOTATER &&
                    <Notater
                        notater={kandidat.notater}
                        antallNotater={kandidat.notater ? kandidat.notater.length : kandidat.antallNotater}
                        onOpprettNotat={(tekst) => {
                            opprettNotat(kandidatlisteId, kandidat.kandidatnr, tekst);
                        }}
                        onEndreNotat={onEndreNotat}
                        onSletteNotat={onSletteNotat}
                    />
                }
                {kandidat.visningsstatus === VISNINGSSTATUS.VIS_MER_INFO &&
                    <div className="info-under-kandidat">
                        <div className="info-under-kandidat-content mer-info">
                            <div className="kontaktinfo-kolonne">
                                <Element>Kontaktinfo</Element>
                                <Normaltekst className="tekst">
                                    E-post: {
                                        kandidat.epost ? <a className="link" href={`mailto:${kandidat.epost}`}>{kandidat.epost}</a> : <span>&mdash;</span>
                                    }
                                </Normaltekst>
                                <Normaltekst className="tekst">
                                    Telefon: {
                                        kandidat.telefon ? kandidat.telefon : <span>&mdash;</span>
                                    }
                                </Normaltekst>
                            </div>
                            <div className="innsatsgruppe-kolonne">
                                <Normaltekst><strong>Innsatsgruppe:</strong>{` ${kandidat.innsatsgruppe}`}</Normaltekst>
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
                }
            </div>
        );
    };
    const TomListe = () => (
        <div className="tom-liste">
            <div className="content">
                <Undertittel className="tekst">Du har ingen kandidater i kandidatlisten</Undertittel>
                <div className="knapper">
                    <FinnKandidaterLenke />
                    <LeggTilKandidatKnapp />
                </div>
            </div>
        </div>
    );
    return (
        <div className="Listedetaljer">
            <SideHeader />
            {kandidater.length > 0
                ? <div className="detaljer">
                    <div className="wrapper">
                        <KnappeRad />
                        <ListeHeader />
                        {kandidater.map((kandidat) => (
                            <KandidatRad key={kandidat.kandidatnr} kandidat={kandidat} />
                        ))}
                    </div>
                </div>
                : <TomListe />
            }
        </div>
    );
};

ListedetaljerView.defaultProps = {
    arbeidsgiver: undefined,
    stillingsId: undefined,
    beskrivelse: undefined
};

ListedetaljerView.propTypes = {
    kandidater: PropTypes.arrayOf(PropTypes.shape({
        ...Kandidat,
        markert: PropTypes.bool,
        notaterVises: PropTypes.bool,
        notater: PropTypes.arrayOf(PropTypes.shape(Notat))
    })).isRequired,
    tittel: PropTypes.string.isRequired,
    arbeidsgiver: PropTypes.string,
    opprettetAv: PropTypes.shape({
        ident: PropTypes.string,
        navn: PropTypes.string
    }).isRequired,
    kandidatlisteId: PropTypes.string.isRequired,
    stillingsId: PropTypes.string,
    kanEditere: PropTypes.bool.isRequired,
    alleMarkert: PropTypes.bool.isRequired,
    onCheckAlleKandidater: PropTypes.func.isRequired,
    onToggleKandidat: PropTypes.func.isRequired,
    onKandidatStatusChange: PropTypes.func.isRequired,
    onKandidatShare: PropTypes.func.isRequired,
    onEmailKandidater: PropTypes.func.isRequired,
    onLeggTilKandidat: PropTypes.func.isRequired,
    onVisningChange: PropTypes.func.isRequired,
    opprettNotat: PropTypes.func.isRequired,
    endreNotat: PropTypes.func.isRequired,
    slettNotat: PropTypes.func.isRequired,
    beskrivelse: PropTypes.string
};

export default ListedetaljerView;
