import PropTypes from 'prop-types';

export const KandidatPropTypes = PropTypes.shape({
    lagtTilAv: PropTypes.string,
    kandidatnr: PropTypes.string.isRequired,
    sisteArbeidserfaring: PropTypes.string,
    fornavn: PropTypes.string,
    etternavn: PropTypes.string,
    erSynlig: PropTypes.bool.isRequired,
    checked: PropTypes.bool.isRequired,
    antallNotater: PropTypes.number.isRequired
});

export const KandidatlisteDetaljerPropType = PropTypes.shape({
    tittel: PropTypes.string,
    kandidatlisteId: PropTypes.string,
    beskrivelse: PropTypes.string,
    organisasjonNavn: PropTypes.string,
    oppdragsgiver: PropTypes.string,
    allChecked: PropTypes.bool,
    kandidater: PropTypes.arrayOf(KandidatPropTypes).isRequired
});
