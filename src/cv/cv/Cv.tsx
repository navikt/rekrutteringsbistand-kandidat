import React, { Fragment, FunctionComponent } from 'react';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Undertittel } from 'nav-frontend-typografi';

import sortByDato from './sortByDato';
import CvType, { Sertifikat as SertifikatType } from '../reducer/cv-typer';
import Yrkeserfaring from './Yrkeserfaring';
import Utdanning from './Utdanning';
import AnnenErfaring from './AnnenErfaring';
import Førerkort from './Førerkort';
import Godkjenning from './Godkjenning';
import Språkferdighet from './Språkferdighet';
import Sertifikat from './Sertifikat';
import Kurs from './Kurs';
import Informasjonspanel from '../Informasjonspanel';
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react';
import css from './Cv.module.css';

type Props = {
    cv: CvType;
};

const Cv: FunctionComponent<Props> = ({ cv }) => {
    const autoriasjoner = cv.fagdokumentasjon?.filter((f) => f.type !== 'Autorisasjon') ?? [];

    return (
        <Informasjonspanel tittel="CV" className={css.cv}>
            {cv.beskrivelse && (
                <div className={css.sammendrag}>
                    <Heading level="3" size="small">
                        Sammendrag
                    </Heading>
                    <BodyLong>{cv.beskrivelse}</BodyLong>
                </div>
            )}

            {cv.utdanning?.length > 0 && (
                <div className={css.utdanning}>
                    <Heading level="3" size="small">
                        Utdanning
                    </Heading>
                    <div className={css.erfaringer}>
                        {sortByDato(cv.utdanning).map((utdanning) => (
                            <Utdanning utdanning={utdanning} key={JSON.stringify(utdanning)} />
                        ))}
                    </div>
                </div>
            )}

            {cv.utdanning?.length > 0 && (
                <div className={css.utdanning}>
                    <Heading level="3" size="small">
                        Fagbrev/svennebrev og mesterbrev
                    </Heading>
                    <ul className={css.punktliste}>
                        {autoriasjoner.map(({ tittel, type }) => (
                            <Fragment key={JSON.stringify(tittel)}>
                                {(tittel || type) && (
                                    <BodyShort as="li">{tittel ?? type}</BodyShort>
                                )}
                            </Fragment>
                        ))}
                    </ul>
                </div>
            )}

            {/* GAMMELT */}

            {cv.utdanning && cv.utdanning.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">Utdanning</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.utdanning).map((u, i) => (
                            <Utdanning key={JSON.stringify({ ...u, index: i })} utdanning={u} />
                        ))}
                    </Column>
                </Row>
            )}
            {autoriasjoner.length > 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">
                            Fagbrev/svennebrev og mesterbrev
                        </Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {autoriasjoner.map((f, i) => (
                            <Row
                                className="kandidat-cv__row-kategori"
                                key={JSON.stringify({ ...f, index: i })}
                            >
                                {(f.tittel || f.type) && (
                                    <Element>{f.tittel ? f.tittel : f.type}</Element>
                                )}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.yrkeserfaring && cv.yrkeserfaring.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">
                            Arbeidserfaring
                        </Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.yrkeserfaring).map((erfaring, i) => (
                            <Yrkeserfaring
                                key={JSON.stringify({ ...erfaring, i })}
                                erfaring={erfaring}
                            />
                        ))}
                    </Column>
                </Row>
            )}
            {cv.annenErfaring && cv.annenErfaring.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">
                            Annen erfaring
                        </Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.annenErfaring).map((erfaring, i) => (
                            <AnnenErfaring
                                key={JSON.stringify({ ...erfaring, index: i })}
                                erfaring={erfaring}
                            />
                        ))}
                    </Column>
                </Row>
            )}
            {cv.forerkort && cv.forerkort.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">Førerkort</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {fjernDuplikater(sortByDato(cv.forerkort)).map(
                            (førerkort: SertifikatType, i: number) => (
                                <Førerkort
                                    key={JSON.stringify({ ...førerkort, index: i })}
                                    førerkort={førerkort}
                                />
                            )
                        )}
                    </Column>
                </Row>
            )}
            {cv.godkjenninger && cv.godkjenninger.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">
                            Godkjenninger i lovreguelerte yrker
                        </Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.godkjenninger).map((godkjenning, i) => (
                            <Godkjenning
                                key={JSON.stringify({ ...godkjenning, index: i })}
                                godkjenning={godkjenning}
                            />
                        ))}
                    </Column>
                </Row>
            )}
            {cv.sertifikater && cv.sertifikater.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">
                            Andre godkjenninger
                        </Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.sertifikater).map((sertifikat: SertifikatType, i) => (
                            <Sertifikat
                                key={JSON.stringify({ ...sertifikat, i })}
                                sertifikat={sertifikat}
                            />
                        ))}
                    </Column>
                </Row>
            )}
            {cv.kurs && cv.kurs.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">Kurs</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.kurs).map((kurs, i) => (
                            <Kurs key={JSON.stringify({ ...kurs, index: i })} kurs={kurs} />
                        ))}
                    </Column>
                </Row>
            )}
            {cv.sprakferdigheter && cv.sprakferdigheter.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">Språk</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {cv.sprakferdigheter.map((ferdighet) => (
                            <Språkferdighet key={JSON.stringify(ferdighet)} ferdighet={ferdighet} />
                        ))}
                    </Column>
                </Row>
            )}
        </Informasjonspanel>
    );
};

const fjernDuplikater = (forerkortListe: SertifikatType[]) => {
    const forerkortAlleredeILista = new Set();

    return forerkortListe.filter((forerkort) => {
        const forerkortetErIkkeAlleredeLagtTil = !forerkortAlleredeILista.has(
            forerkort.sertifikatKodeNavn
        );

        forerkortAlleredeILista.add(forerkort.sertifikatKodeNavn);
        return forerkortetErIkkeAlleredeLagtTil;
    });
};

export default Cv;
