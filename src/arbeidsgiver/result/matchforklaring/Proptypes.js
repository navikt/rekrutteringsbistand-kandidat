import PropTypes from 'prop-types';

export const ConceptMatchPropType = PropTypes.shape({
    c1name: PropTypes.string.isRequired,
    c1id: PropTypes.number.isRequired,
    c2name: PropTypes.string.isRequired,
    c2id: PropTypes.number.isRequired,
    cor: PropTypes.number.isRequired
});

export const UnmatchedGroupConceptsPropType = PropTypes.shape({
    utdanning: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    yrker: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    erfaring: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    kompetanse: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    sertifikat: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    softSkills: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    sprak: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    andre: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
});

export const MatchedGroupConceptsPropType = PropTypes.shape({
    andre: PropTypes.arrayOf(ConceptMatchPropType),
    erfaring: PropTypes.arrayOf(ConceptMatchPropType),
    kompetanse: PropTypes.arrayOf(ConceptMatchPropType),
    sertifikat: PropTypes.arrayOf(ConceptMatchPropType),
    softSkills: PropTypes.arrayOf(ConceptMatchPropType),
    sprak: PropTypes.arrayOf(ConceptMatchPropType),
    utdanning: PropTypes.arrayOf(ConceptMatchPropType),
    yrker: PropTypes.arrayOf(ConceptMatchPropType)
});

export const MatchexplainProptypes = PropTypes.shape({
    score: PropTypes.shape({ snitt: PropTypes.number, match: PropTypes.number, revertertMatch: PropTypes.number }).isRequired,
    matchedeKonsepter: MatchedGroupConceptsPropType.isRequired,
    stillingskonsepterUtenMatch: UnmatchedGroupConceptsPropType.isRequired,
    kandidatkonsepterUtenMatch: UnmatchedGroupConceptsPropType
});

