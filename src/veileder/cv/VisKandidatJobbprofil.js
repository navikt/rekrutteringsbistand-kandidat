import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import TruncatedTextList from '../../felles/common/TruncatedTextList';
import cvPropTypes from '../../felles/PropTypes';
import './VisKandidat.less';
import { OPPSTARTSKODER } from '../../felles/konstanter';

const VisKandidatJobbprofil = ({ cv }) => (
    <div className="panel--jobbprofil">
        <Ekspanderbartpanel
            className="ekspanderbartPanel--green"
            id="ekspanderbartpanel-jobbprofil"
            tittel="Jobbprofil"
            tittelProps="systemtittel"
            apen
        >
            <Row className="panel--jobbprofil__row">
                <Column xs="12">
                    <Normaltekst>
                        Kandidatens jobbprofil inneholder ønsker og krav for fremtidige jobber.
                    </Normaltekst>
                </Column>
            </Row>
            {cv.yrkeJobbonsker && cv.yrkeJobbonsker.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Ønsket yrke</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={cv.yrkeJobbonsker.map((u) => u.styrkBeskrivelse)}
                        />
                    </Column>
                </Row>
            )}
            {cv.kompetanse && cv.kompetanse.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Kompetanse</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={cv.kompetanse.map((u) => u.kompetanseKodeTekst)}
                        />
                    </Column>
                </Row>
            )}
            {cv.geografiJobbonsker && cv.geografiJobbonsker.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Ønsket sted</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={cv.geografiJobbonsker.map((u) => u.geografiKodeTekst)}
                        />
                    </Column>
                </Row>
            )}
            {cv.omfangJobbprofil && cv.omfangJobbprofil.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Heltid/deltid</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={cv.omfangJobbprofil.map((u) => u.heltidDeltidKodeTekst)}
                        />
                    </Column>
                </Row>
            )}
            {cv.arbeidstidJobbprofil && cv.arbeidstidJobbprofil.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Arbeidstid</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={cv.arbeidstidJobbprofil.map(
                                (u) => u.arbeidstidKodeTekst
                            )}
                        />
                    </Column>
                </Row>
            )}
            {cv.arbeidstidsordningJobbprofil && cv.arbeidstidsordningJobbprofil.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Arbeidstidsordning</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={cv.arbeidstidsordningJobbprofil.map(
                                (u) => u.arbeidstidsordningKodeTekst
                            )}
                        />
                    </Column>
                </Row>
            )}
            {cv.ansettelsesformJobbprofil && cv.ansettelsesformJobbprofil.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Arbeidsforhold</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={cv.ansettelsesformJobbprofil.map(
                                (u) => u.ansettelsesformKodeTekst
                            )}
                        />
                    </Column>
                </Row>
            )}
            {cv.oppstartKode &&
                cv.oppstartKode.length !== 0 &&
                OPPSTARTSKODER[cv.oppstartKode.toUpperCase()] && (
                    <Row className="panel--jobbprofil__row">
                        <Column xs="12" sm="4">
                            <Element className="jobbprofil__overskrift">
                                Når er kandidaten <br />
                                ledig for ny jobb:
                            </Element>
                        </Column>
                        <Column xs="12" sm="8">
                            <Normaltekst>
                                {OPPSTARTSKODER[cv.oppstartKode.toUpperCase()].label}
                            </Normaltekst>
                        </Column>
                    </Row>
                )}
        </Ekspanderbartpanel>
    </div>
);

VisKandidatJobbprofil.propTypes = {
    cv: cvPropTypes.isRequired,
};

export default VisKandidatJobbprofil;
