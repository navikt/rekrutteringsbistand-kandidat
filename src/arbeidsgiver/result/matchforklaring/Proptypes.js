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
    autorisasjon: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    softSkills: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    andre: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired }))
});

export const MatchedGroupConceptsPropType = PropTypes.shape({
    utdanning: PropTypes.arrayOf(ConceptMatchPropType),
    yrker: PropTypes.arrayOf(ConceptMatchPropType),
    erfaring: PropTypes.arrayOf(ConceptMatchPropType),
    kompetanse: PropTypes.arrayOf(ConceptMatchPropType),
    autorisasjon: PropTypes.arrayOf(ConceptMatchPropType),    
    softSkills: PropTypes.arrayOf(ConceptMatchPropType),
    andre: PropTypes.arrayOf(ConceptMatchPropType)
});

export const MatchexplainProptypesGrouped = PropTypes.shape({
    score: PropTypes.shape({ snitt: PropTypes.number, match: PropTypes.number, revertertMatch: PropTypes.number }),
    concepts_matched: ConceptMatchPropType,
    j1_not_matched: UnmatchedGroupConceptsPropType,
    j2_not_matched: UnmatchedGroupConceptsPropType,
    kandidatprofilId: PropTypes.string
});

export const MatchexplainProptypes = PropTypes.shape({
    concepts_matched: PropTypes.arrayOf(ConceptMatchPropType),
    j1_not_matched: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    j2_not_matched: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })),
    kandidatprofilId: PropTypes.string
});

export const MatchProptypes = PropTypes.shape({
    title: PropTypes.string.isRequired,
    score: PropTypes.shape({ snitt: PropTypes.number, match: PropTypes.number, revertertMatch: PropTypes.number })
});
