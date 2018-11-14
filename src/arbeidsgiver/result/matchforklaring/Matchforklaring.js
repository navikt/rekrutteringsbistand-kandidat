import React from 'react';
import { Undertittel, Systemtittel } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import PropTypes from 'prop-types';
import { ConceptMatchPropType, MatchedGroupConceptsPropType, MatchexplainProptypesGrouped, UnmatchedGroupConceptsPropType } from './Proptypes';
import { KONSEPTTYPE } from '../../../felles/konstanter';
import { mapExperienceLevelTilAar, mapExperienceLevelTilKalenderEnhet } from '../../../felles/sok/utils';

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

const MatchPanel = ({ matchedeKonsepter, score }) => (
    <Row className="match-explanation-match blokk-s">
        <div className="match-explanation-title">
            <Systemtittel className="text-center blokk-xs">{`Match: ${score} %`} </Systemtittel>
        </div>
        <Row>
            <Column className="col-xs-6"><Undertittel>Stillingsprofil</Undertittel></Column>
            <Column className="col-xs-6 match-explanation-right-column"><Undertittel>Kandidatprofil</Undertittel></Column>
        </Row>
        <KonsepttypeMedMatch tittel="Ønsket yrke" konseptmatcher={matchedeKonsepter.yrker} />
        <KonsepttypeMedMatch tittel="Utdanning" konseptmatcher={matchedeKonsepter.utdanning} />
        <KonsepttypeMedMatch tittel="Yrkeserfaring" konseptmatcher={matchedeKonsepter.erfaring} />
        <KonsepttypeMedMatch tittel="Kompetanse" konseptmatcher={matchedeKonsepter.kompetanse} />
        <KonsepttypeMedMatch tittel="Soft skills" konseptmatcher={matchedeKonsepter.softSkills} />
        <KonsepttypeMedMatch tittel="Annet" konseptmatcher={matchedeKonsepter.andre} />
    </Row>
);

const IkkematchPanel = ({ stillingskonsepter, kandidatkonsepter }) => (
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
        <KonsepttypeUtenMatch tittel="Soft skills" stillingskonsepter={stillingskonsepter.softSkills} kandidatkonsepter={kandidatkonsepter.softSkills} />
        <KonsepttypeUtenMatch tittel="Andre" stillingskonsepter={stillingskonsepter.andre} kandidatkonsepter={kandidatkonsepter.andre} />
    </Row>
);

const Matchforklaring = ({ matchforklaring }) => (
    <div>
        <MatchPanel
            matchedeKonsepter={matchforklaring.matchedeKonsepter}
            score={matchforklaring.score}
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

MatchPanel.propTypes = {
    score: PropTypes.number.isRequired,
    matchedeKonsepter: MatchedGroupConceptsPropType.isRequired
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
