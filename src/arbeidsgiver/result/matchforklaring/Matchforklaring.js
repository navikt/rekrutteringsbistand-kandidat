import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { ConceptMatchPropType, MatchexplainProptypes } from './Proptypes';
import { KONSEPTTYPE } from '../../../felles/konstanter';
import { mapExperienceLevelTilAar, mapExperienceLevelTilKalenderEnhet } from '../../../felles/sok/utils';
import Score from './score/Score';
import { TotalScoreLimitEnum, ScoreLimitEnum } from './score/ScoreLimitEnum';
import './Matchforklaring.less';

function mapYrkeserfaringStilling(name) {
    if (name.includes(KONSEPTTYPE.ERFARING)) {
        const experienceLevel = parseInt(name.substring(name.length - 2), 10);
        if (isNaN(experienceLevel)) {
            return name;
        }
        return mapExperienceLevelTilAar(experienceLevel);
    }
    return name;
}

function mapYrkeserfaringKandidat(name) {
    if (name.includes(KONSEPTTYPE.ERFARING)) {
        const experienceLevel = parseInt(name.substring(name.length - 2), 10);
        if (isNaN(experienceLevel)) {
            return name;
        }
        return mapExperienceLevelTilKalenderEnhet(experienceLevel);
    }
    return name;
}


const rowColor = (match, isTotalScore = false) => {
    const limitEnumm = isTotalScore ? TotalScoreLimitEnum : ScoreLimitEnum;
    let color = 'color-low-score';
    if (match >= limitEnumm.LIMIT_4) {
        color = 'color-high-score';
    }

    return color;
};

const matchRad = (conceptMatch) => {
    return (
        <div
            key={`${conceptMatch.c1id}.${conceptMatch.c2id}`}
            className={`match-row blokk-xxs ${rowColor(conceptMatch.cor * 100)}`}
        >
            <Normaltekst>{mapYrkeserfaringStilling(conceptMatch.c1name)}</Normaltekst>
            <Score value={conceptMatch.cor * 100} />
            <Normaltekst>{mapYrkeserfaringKandidat(conceptMatch.c2name)}</Normaltekst>
        </div>
    );
};

const noMatchRad = (konseptName) => {
    return (
        <div
            key={konseptName}
            className="match-row color-low-score blokk-xxs"
        >
            <Normaltekst>{mapYrkeserfaringStilling(konseptName)}</Normaltekst>
            <Score value={0} />
            <Normaltekst>(Ikke match)</Normaltekst>
        </div>
    );
};


const Konsepttype = ({ tittel, konseptmatcher, stillingskonsepter }) => {
    if (stillingskonsepter.length > 0 || konseptmatcher.length > 0) {
        return (
            <div className="blokk-s">
                <Normaltekst className="match-category-title">{tittel}</Normaltekst>
                {konseptmatcher.length > 0 &&
                    konseptmatcher.sort((a, b) => (b.cor - a.cor )).map(matchRad)
                }
                {stillingskonsepter.length > 0 &&
                    stillingskonsepter.map((concept) => noMatchRad(concept.name))
                }
            </div>
        );
    }
    return null;
};


const Matchforklaring = ({ matchforklaring }) => {
    const matchScore = Math.min(matchforklaring.score.match, 100);
    const { matchedeKonsepter, stillingskonsepterUtenMatch } = matchforklaring;

    return (
        <div className="blokk-s">
            <Normaltekst className="match-category-title">Total match</Normaltekst>
            <div className={`match-row blokk-s ${rowColor(matchScore, true)}`}>
                <Undertittel>Ditt søk</Undertittel>
                <Score value={matchScore} isTotalScore />
                <Undertittel >Kandidaten</Undertittel>
            </div>
            <Konsepttype
                tittel="Stilling/yrke"
                konseptmatcher={matchedeKonsepter.yrker}
                stillingskonsepter={stillingskonsepterUtenMatch.yrker}
            />
            <Konsepttype
                tittel="Kompetanse"
                konseptmatcher={matchedeKonsepter.kompetanse}
                stillingskonsepter={stillingskonsepterUtenMatch.kompetanse}
            />
            <Konsepttype
                tittel="Utdanning"
                konseptmatcher={matchedeKonsepter.utdanning}
                stillingskonsepter={stillingskonsepterUtenMatch.utdanning}
            />
            <Konsepttype
                tittel="Arbeidserfaring"
                konseptmatcher={matchedeKonsepter.erfaring}
                stillingskonsepter={stillingskonsepterUtenMatch.erfaring}
            />
            <Konsepttype
                tittel="Språk"
                konseptmatcher={matchedeKonsepter.sprak}
                stillingskonsepter={stillingskonsepterUtenMatch.sprak}
            />
            <Konsepttype
                tittel="Sertifisering"
                konseptmatcher={matchedeKonsepter.sertifikat}
                stillingskonsepter={stillingskonsepterUtenMatch.sertifikat}
            />
        </div>
    );
};

Matchforklaring.propTypes = {
    matchforklaring: MatchexplainProptypes.isRequired
};

Konsepttype.propTypes = {
    tittel: PropTypes.string.isRequired,
    konseptmatcher: PropTypes.arrayOf(ConceptMatchPropType).isRequired,
    stillingskonsepter: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired
};


export default Matchforklaring;
