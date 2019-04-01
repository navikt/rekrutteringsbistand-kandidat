import PropTypes from 'prop-types';

const cvPropTypes = PropTypes.shape({
    adresselinje1: PropTypes.string,
    adresselinje2: PropTypes.string,
    adresselinje3: PropTypes.string,
    annenerfaring: PropTypes.array,
    ansettelsesforholdJobbonsker: PropTypes.array,
    arbeidstidsordningJobbonsker: PropTypes.array,
    arenaKandidatnr: PropTypes.string,
    arenaPersonId: PropTypes.number,
    profilId: PropTypes.string,
    beskrivelse: PropTypes.string,
    disponererBil: PropTypes.bool,
    epostadresse: PropTypes.string,
    mobiltelefon: PropTypes.string,
    telefon: PropTypes.string,
    etternavn: PropTypes.string,
    fodselsdato: PropTypes.string,
    fodselsdatoErDnr: PropTypes.bool,
    fodselsnummer: PropTypes.string,
    forerkort: PropTypes.array,
    formidlingsgruppekode: PropTypes.string,
    fornavn: PropTypes.string,
    geografiJobbonsker: PropTypes.array,
    heltidDeltidJobbonsker: PropTypes.array,
    kommunenummer: PropTypes.number,
    kompetanse: PropTypes.array,
    kurs: PropTypes.array,
    landkode: PropTypes.string,
    postnummer: PropTypes.string,
    poststed: PropTypes.string,
    samletKompetanse: PropTypes.array,
    samtykkeDato: PropTypes.string,
    samtykkeStatus: PropTypes.string,
    sertifikat: PropTypes.array,
    servicebehov: PropTypes.string,
    sprak: PropTypes.array,
    statsborgerskap: PropTypes.string,
    tidsstempel: PropTypes.string,
    totalLengdeYrkeserfaring: PropTypes.number,
    utdanning: PropTypes.array,
    fagdokumentasjon: PropTypes.array,
    verv: PropTypes.array,
    yrkeJobbonsker: PropTypes.array,
    yrkeserfaring: PropTypes.array
});

export default cvPropTypes;
