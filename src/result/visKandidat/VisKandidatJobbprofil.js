import React from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import TruncatedTextList from '../../common/TruncatedTextList';
import cvPropTypes from '../../PropTypes';
import './VisKandidat.less';

const VisKandidatJobbprofil = ({ cv }) => (
    <div className="panel--jobbprofil">
        <Ekspanderbartpanel
            id="ekspanderbartpanel-jobbprofil"
            tittel="Jobbprofil"
            tittelProps="systemtittel"
            apen
        >
            <Row className="panel--jobbprofil__row">
                <Column xs="12">
                    <Normaltekst>Kandidatens jobbprofil inneholder ønsker og krav for fremtidige jobber.</Normaltekst>
                </Column>
            </Row>
            {cv.yrkeJobbonsker && cv.yrkeJobbonsker.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Ønsket yrke</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <TruncatedTextList
                            tekstElementer={
                                cv.yrkeJobbonsker
                                    .map((u) => (
                                        u.styrkBeskrivelse
                                    ))
                            }
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
                            tekstElementer={
                                cv.geografiJobbonsker
                                    .map((u) => (
                                        u.geografiKodeTekst
                                    ))
                            }
                        />
                    </Column>
                </Row>
            )}
            {cv.heltidDeltidJobbonsker && cv.heltidDeltidJobbonsker.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Heltid/deltid</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <Normaltekst>
                            {cv.heltidDeltidJobbonsker.join(', ')}
                        </Normaltekst>
                    </Column>
                </Row>
            )}
            {cv.arbeidstidsordningJobbonsker && cv.arbeidstidsordningJobbonsker.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Arbeidstid</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <Normaltekst>
                            {cv.arbeidstidsordningJobbonsker.join(', ')}
                        </Normaltekst>
                    </Column>
                </Row>
            )}
            {cv.ansettelsesforholdJobbonsker && cv.ansettelsesforholdJobbonsker.length !== 0 && (
                <Row className="panel--jobbprofil__row">
                    <Column xs="12" sm="4">
                        <Element className="jobbprofil__overskrift">Arbeidsforhold</Element>
                    </Column>
                    <Column xs="12" sm="8">
                        <Normaltekst>
                            {cv.ansettelsesforholdJobbonsker.join(', ')}
                        </Normaltekst>
                    </Column>
                </Row>
            )}
        </Ekspanderbartpanel>
    </div>
);


VisKandidatJobbprofil.propTypes = {
    cv: cvPropTypes.isRequired
};

export default VisKandidatJobbprofil;

