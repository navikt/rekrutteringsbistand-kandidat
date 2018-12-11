import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';
import { HjelpetekstMidt } from 'nav-frontend-hjelpetekst';
import { Checkbox } from 'nav-frontend-skjema';
import { Element, Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { Kandidat, Notat } from './PropTypes';
import Lenkeknapp from '../../felles/common/Lenkeknapp';
import '../../felles/common/ikoner/ikoner.less';
import Notater from './Notater';

const STATUS = {
    FORESLATT: 'FORESLATT',
    VURDERES: 'VURDERES',
    KONTAKTET: 'KONTAKTET',
    AKTUELL: 'AKTUELL',
    UAKTUELL: 'UAKTUELL'
};

export const VISNINGSSTATUS = {
    ENKEL_RAD: 'ENKEL_RAD',
    VIS_NOTATER: 'VIS_NOTATER',
    VIS_MER_INFO: 'VIS_MER_INFO'
};

const statusToString = (status) => {
    if (status === 'FORESLATT') {
        return 'Foreslått';
    } else if (status === 'VURDERES') {
        return 'Vurderes';
    } else if (status === 'KONTAKTET') {
        return 'Kontaktet';
    } else if (status === 'AKTUELL') {
        return 'Aktuell';
    } else if (status === 'UAKTUELL') {
        return 'Ikke aktuell';
    }
    return status;
};

const statusToClassname = (status) => {
    if (status === 'FORESLATT') {
        return 'foreslatt';
    } else if (status === 'VURDERES') {
        return 'vurderes';
    } else if (status === 'KONTAKTET') {
        return 'kontaktet';
    } else if (status === 'AKTUELL') {
        return 'aktuell';
    } else if (status === 'UAKTUELL') {
        return 'uaktuell';
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
        slettNotat
    } = props;
    const SideHeader = () => (
        <div className="side-header">
            <div className="wrapper">
                <div className="top">
                    <div className="header-side" />
                    <div className="tittel">
                        <Sidetittel>{tittel}</Sidetittel>
                    </div>
                    <div className="header-side" />
                </div>
                <div className="bottom">
                    <div className="antall">
                        {kandidater.length === 1 ? '1 kandidat' : `${kandidater.length} kandidater`}
                    </div>
                    { arbeidsgiver &&
                    <div className="border-left">
                        Arbeidsgiver: {arbeidsgiver}
                    </div>
                    }
                    <div className="border-left">
                        { `Registrert av: ${opprettetAv.navn} (${opprettetAv.ident})` }
                    </div>
                    <div className="border-left">
                        <Lenke href={`/stilling/${stillingsId}`}>Se stillingsannonse</Lenke>
                    </div>
                </div>
            </div>
        </div>
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
                >
                    Du må huke av for kandidatene du ønsker å presentere for arbeidsgiver
                </HjelpetekstMidt>
            );
        };
        const EpostKnapp = () => {
            const Disabled = () => (
                <div className="Lenkeknapp typo-normal Email">
                    <i className="Email__icon" />
                    Send e-post til kandidatene
                </div>
            );
            const Enabled = () => (
                <div className="hjelpetekst">
                    <Lenkeknapp onClick={onEmailKandidater} className="Email">
                        <i className="Email__icon" />
                        <span>Send e-post til kandidatene</span>
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
                >
                    Du må huke av for kandidatene du ønsker å sende e-post til, og kandidatene må ha en e-postadresse
                </HjelpetekstMidt>
            );
        };
        return (
            <div className="knappe-rad">
                <div className="knapper-venstre">
                    <Link to={`/kandidater/stilling/${stillingsId}`} className="finn-kandidater FinnKandidater">
                        <i className="FinnKandidater__icon" />
                        <span className="lenke">Finn kandidater</span>
                    </Link>
                    <Lenkeknapp onClick={onLeggTilKandidat} className="legg-til-kandidat LeggTilKandidat">
                        <i className="LeggTilKandidat__icon" />
                        Legg til kandidat
                    </Lenkeknapp>
                </div>
                <div className="dele-wrapper">
                    <EpostKnapp />
                    { kanEditere && <DeleKnapp /> }
                </div>
            </div>
        );
    };

    const ListeHeader = () => (
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
                <div className="kolonne-smal"><Element>Fødselsdato</Element></div>
                <div className="kolonne-bred"><Element>Lagt til av</Element></div>
                <div className="kolonne-bred"><Element>Status</Element></div>
                <div className="kolonne-bred"><Element>Utfall</Element></div>
                <div className="kolonne-smal"><Element>Notater</Element></div>
                <div className="kolonne-smal"><Element>Mer info</Element></div>
            </div>
        </div>
    );

    const StatusSelect = ({ value, onChange }) => ( // eslint-disable-line react/prop-types
        <div className="skjemaelement">
            <div className="selectContainer input--s">
                <select className="skjemaelement__input" value={value} onChange={onChange}>
                    {[STATUS.FORESLATT, STATUS.VURDERES, STATUS.KONTAKTET, STATUS.AKTUELL, STATUS.UAKTUELL]
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
                ? VISNINGSSTATUS.ENKEL_RAD
                : VISNINGSSTATUS.VIS_NOTATER,
            kandidatlisteId,
            kandidat.kandidatnr);
        };

        const toggleMerInfo = () => {
            onVisningChange(kandidat.visningsstatus === VISNINGSSTATUS.VIS_MER_INFO
                ? VISNINGSSTATUS.ENKEL_RAD
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

        return (
            <div className={`liste-rad-wrapper kandidat ${kandidat.markert ? 'checked' : 'unchecked'}`}>
                <div className={'liste-rad '}>
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
                    <div className="kolonne-bred">
                        <Link title="Vis profil" className="lenke" to={`/kandidater/lister/detaljer/${stillingsId}/cv/${kandidat.kandidatnr}`}>
                            {kandidat.fornavn} {kandidat.etternavn}
                        </Link></div><div className="kolonne-smal">{new Date(kandidat.fodselsdato).toLocaleDateString('nb-NO')}</div>
                    <div className="kolonne-bred">{kandidat.lagtTilAv.navn} ({kandidat.lagtTilAv.ident})</div>
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
                    <div className="kolonne-bred">{utfallToString(kandidat.utfall)}</div>
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
                                        kandidat.epost ? <a className="lenke" href={`mailto:${kandidat.epost}`}>{kandidat.epost}</a> : <span>&mdash;</span>
                                    }
                                </Normaltekst>
                                <Normaltekst className="tekst">
                                    Telefon: {
                                        kandidat.telefon ? <a className="lenke" href={`tel:${kandidat.telefon}`}>{kandidat.telefon}</a> : <span>&mdash;</span>
                                    }
                                </Normaltekst>
                            </div>
                            <div className="innsatsgruppe-kolonne">
                                <Element>Innsatsgruppe</Element>
                                <Normaltekst className="tekst">{kandidat.innsatsgruppe}</Normaltekst>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
    return (
        <div className="Listedetaljer">
            <SideHeader />
            <div className="detaljer">
                <div className="wrapper">
                    <KnappeRad />
                    <ListeHeader />
                    {kandidater.map((kandidat) => (
                        <KandidatRad key={kandidat.kandidatnr} kandidat={kandidat} />
                    ))}
                </div>
            </div>
        </div>
    );
};

ListedetaljerView.defaultProps = {
    arbeidsgiver: undefined
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
    stillingsId: PropTypes.string.isRequired,
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
    slettNotat: PropTypes.func.isRequired
};

export default ListedetaljerView;
