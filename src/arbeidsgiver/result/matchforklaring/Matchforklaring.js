import React from 'react';
import PropTypes from 'prop-types';
import { Undertittel, Systemtittel, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import { ConceptMatchPropType, MatchedGroupConceptsPropType, MatchexplainProptypesGrouped, UnmatchedGroupConceptsPropType } from './Proptypes';
import { KONSEPTTYPE } from '../../../felles/konstanter';
import { mapExperienceLevelTilAar, mapExperienceLevelTilKalenderEnhet } from '../../../felles/sok/utils';
import ScoreLimitEnum from './score/ScoreLimitEnum';
import Score from './score/Score';
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

const conceptMatchRad = (conceptMatch) => (
    <Row key={`${conceptMatch.c1id}.${conceptMatch.c2id}`}>
        <Column className="col-xs-5">{mapYrkeserfaringStilling(conceptMatch.c1name)}</Column>
        <Column className="col-xs-2 text-center">{`${(conceptMatch.cor * 100).toString()} %`}</Column>
        <Column className="col-xs-5 match-explanation-right-column">{mapYrkeserfaringKandidat(conceptMatch.c2name)}</Column>
    </Row>
);


const rowColor = (match) => {
    let color = 'color-low-score';
    if (match >= ScoreLimitEnum.LIMIT_3) {
        color = 'color-high-score';
    } else if (match >= ScoreLimitEnum.LIMIT_1) {
        color = 'color-medium-score';
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
            className="match-row blokk-xxs color-low-score"
        >
            <Normaltekst>{mapYrkeserfaringStilling(konseptName)}</Normaltekst>
            <Score value={0} />
            <Normaltekst className="no-match-text">Match ikke funnet</Normaltekst>
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

const KonsepttypeUtenMatch = ({ tittel, stillingskonsepter, kandidatkonsepter }) => {
    if (stillingskonsepter.length > 0 || kandidatkonsepter.length > 0) {
        return (
            <Row className="match-explanation-concept-type-row">
                <Column className="col-xs-12">
                    <Undertittel className="match-explanation-concept-type-header">{tittel}</Undertittel>
                </Column>
                <Column className="col-xs-6">
                    {stillingskonsepter.map((concept) => <Row key={concept.id}><Column className="col-xs-12">{mapYrkeserfaringStilling(concept.name)}</Column></Row>)}
                </Column>
                <Column className="col-xs-6">
                    {kandidatkonsepter.map((concept) => <Row key={concept.id}><Column className="col-xs-12 match-explanation-right-column">{mapYrkeserfaringKandidat(concept.name)}</Column></Row>)}
                </Column>
            </Row>
        );
    }
    return null;
};

const KonsepttypeMedMatch = ({ tittel, konseptmatcher }) => {
    if (konseptmatcher.length > 0) {
        return (
            <Row className="match-explanation-concept-type-row">
                <Column className="col-xs-12">
                    <Undertittel className="match-explanation-concept-type-header">{tittel}</Undertittel>
                    <div>
                        {konseptmatcher.sort((a, b) => (a.cor < b.cor)).map(conceptMatchRad)}
                    </div>
                </Column>
            </Row>
        );
    }
    return null;
};


const MatchPanel = ({ matchedeKonsepter, score, stillingskonsepter, matchScore }) => (
    <Row className="match-explanation-match blokk-s">
        <Normaltekst className="match-category-title">Total match</Normaltekst>
        <div className={`match-row blokk-s ${rowColor(matchScore)}`}>
            <Undertittel>Ditt søk</Undertittel>
            <Score value={matchScore} />
            <Undertittel >Kandidaten</Undertittel>
        </div>
        <Konsepttype
            tittel="Stilling/yrke"
            konseptmatcher={matchedeKonsepter.yrker}
            stillingskonsepter={stillingskonsepter.yrker}
        />
        <Konsepttype
            tittel="Kompetanse"
            konseptmatcher={matchedeKonsepter.kompetanse}
            stillingskonsepter={stillingskonsepter.kompetanse}
        />
        <Konsepttype
            tittel="Utdanning"
            konseptmatcher={matchedeKonsepter.utdanning}
            stillingskonsepter={stillingskonsepter.utdanning}
        />
        <Konsepttype
            tittel="Arbeidserfaring"
            konseptmatcher={matchedeKonsepter.erfaring}
            stillingskonsepter={stillingskonsepter.erfaring}
        />
        <Konsepttype
            tittel="Sertifikat"
            konseptmatcher={matchedeKonsepter.sertifikat}
            stillingskonsepter={stillingskonsepter.sertifikat}
        />
        <Konsepttype
            tittel="Soft skills"
            konseptmatcher={matchedeKonsepter.softSkills}
            stillingskonsepter={stillingskonsepter.softSkills}
        />
        <Konsepttype
            tittel="Annet"
            konseptmatcher={matchedeKonsepter.andre}
            stillingskonsepter={stillingskonsepter.andre}
        />


        <div className="match-explanation-title">
            <Systemtittel className="text-center blokk-xs">{`Snittmatch: ${score.snitt} %`} </Systemtittel>
            <Systemtittel className="text-center blokk-xs">{`Match: ${score.match} %`} </Systemtittel>
            <Systemtittel className="text-center blokk-xs">{`Reversert match: ${score.revertertMatch} %`} </Systemtittel>
        </div>
        <Row>
            <Column className="col-xs-6"><Undertittel>Stillingsprofil</Undertittel></Column>
            <Column className="col-xs-6 match-explanation-right-column"><Undertittel>Kandidatprofil</Undertittel></Column>
        </Row>
        <KonsepttypeMedMatch tittel="Ønsket yrke" konseptmatcher={matchedeKonsepter.yrker}/>
        <KonsepttypeMedMatch tittel="Utdanning" konseptmatcher={matchedeKonsepter.utdanning} />
        <KonsepttypeMedMatch tittel="Yrkeserfaring" konseptmatcher={matchedeKonsepter.erfaring} />
        <KonsepttypeMedMatch tittel="Kompetanse" konseptmatcher={matchedeKonsepter.kompetanse} />
        <KonsepttypeMedMatch tittel="Sertifikat" konseptmatcher={matchedeKonsepter.sertifikat} />
        <KonsepttypeMedMatch tittel="Soft skills" konseptmatcher={matchedeKonsepter.softSkills} />
        <KonsepttypeMedMatch tittel="Annet" konseptmatcher={matchedeKonsepter.andre} />
    </Row>
);

const IkkematchPanel = ({ stillingskonsepter, kandidatkonsepter }) => {
    return (
        <Row className="search-result-item">
            <div className="match-explanation-title">
                <Systemtittel className="text-center blokk-xs">Ikke match</Systemtittel>
            </div>
            <Column className="col-xs-6">
                <Row>
                    <Column>
                        <Undertittel>Stillingsprofil</Undertittel>
                    </Column>
                </Row>
            </Column>
            <Column className="col-xs-6">
                <Row className="match-explanation-right-column">
                    <Column>
                        <Undertittel>Kandidatprofil</Undertittel>
                    </Column>
                </Row>
            </Column>
            <KonsepttypeUtenMatch tittel="Ønsket yrke" stillingskonsepter={stillingskonsepter.yrker} kandidatkonsepter={kandidatkonsepter.yrker} />
            <KonsepttypeUtenMatch tittel="Utdanning" stillingskonsepter={stillingskonsepter.utdanning} kandidatkonsepter={kandidatkonsepter.utdanning} />
            <KonsepttypeUtenMatch tittel="Yrkeserfaring" stillingskonsepter={stillingskonsepter.erfaring} kandidatkonsepter={kandidatkonsepter.erfaring} />
            <KonsepttypeUtenMatch tittel="Kompetanse" stillingskonsepter={stillingskonsepter.kompetanse} kandidatkonsepter={kandidatkonsepter.kompetanse} />
            <KonsepttypeUtenMatch tittel="Sertifikat" stillingskonsepter={stillingskonsepter.sertifikat} kandidatkonsepter={kandidatkonsepter.sertifikat} />
            <KonsepttypeUtenMatch tittel="Soft skills" stillingskonsepter={stillingskonsepter.softSkills} kandidatkonsepter={kandidatkonsepter.softSkills} />
            <KonsepttypeUtenMatch tittel="Andre" stillingskonsepter={stillingskonsepter.andre} kandidatkonsepter={kandidatkonsepter.andre} />
        </Row>
    );
};

const Matchforklaring = ({ matchforklaring }) => (
    <div>
        <MatchPanel
            matchedeKonsepter={matchforklaring.matchedeKonsepter}
            score={matchforklaring.score}
            matchScore={Math.min(matchforklaring.score.match, 100)}
            stillingskonsepter={matchforklaring.stillingskonsepterUtenMatch}
            kandidatkonsepter={matchforklaring.kandidatkonsepterUtenMatch}
        />
        <IkkematchPanel
            stillingskonsepter={matchforklaring.stillingskonsepterUtenMatch}
            kandidatkonsepter={matchforklaring.kandidatkonsepterUtenMatch}
        />
    </div>
);

Matchforklaring.propTypes = {
    matchforklaring: MatchexplainProptypesGrouped.isRequired
};

KonsepttypeMedMatch.propTypes = {
    tittel: PropTypes.string.isRequired,
    konseptmatcher: PropTypes.arrayOf(ConceptMatchPropType).isRequired
};

Konsepttype.propTypes = {
    tittel: PropTypes.string.isRequired,
    konseptmatcher: PropTypes.arrayOf(ConceptMatchPropType).isRequired,
    stillingskonsepter: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired
};

MatchPanel.propTypes = {
    score: PropTypes.shape({ snitt: PropTypes.number, match: PropTypes.number, revertertMatch: PropTypes.number }).isRequired,
    matchedeKonsepter: MatchedGroupConceptsPropType.isRequired,
    stillingskonsepter: UnmatchedGroupConceptsPropType.isRequired
};

IkkematchPanel.propTypes = {
    stillingskonsepter: UnmatchedGroupConceptsPropType.isRequired,
    kandidatkonsepter: UnmatchedGroupConceptsPropType.isRequired
};

KonsepttypeUtenMatch.propTypes = {
    tittel: PropTypes.string.isRequired,
    stillingskonsepter: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    kandidatkonsepter: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired
};

export default Matchforklaring;
