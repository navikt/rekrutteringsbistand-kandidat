import React, { Fragment, FunctionComponent, ReactNode } from 'react';
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react';

import sortByDato from './sortByDato';
import CvType, { Sertifikat as SertifikatType } from '../reducer/cv-typer';
import Språkferdighet from './Språkferdighet';
import Kurs from './Kurs';
import Informasjonspanel from '../Informasjonspanel';
import Arbeidserfaring from './Arbeidserfaring';
import Erfaring from './Erfaring';
import Tidsperiode from './Tidsperiode';
import css from './Cv.module.css';

type Props = {
    cv: CvType;
};

const Cv: FunctionComponent<Props> = ({ cv }) => {
    const autorisasjoner = cv.fagdokumentasjon?.filter((f) => f.type !== 'Autorisasjon') ?? [];

    return (
        <Informasjonspanel tittel="CV" className={css.cv}>
            {cv.beskrivelse && (
                <BolkMedToKolonner tittel="Sammendrag">
                    <BodyLong>{cv.beskrivelse}</BodyLong>
                </BolkMedToKolonner>
            )}

            {cv.utdanning?.length > 0 && (
                <BolkMedErfaringer tittel="Utdanning">
                    {sortByDato(cv.utdanning).map((utdanning) => (
                        <Erfaring
                            fraDato={utdanning.fraDato}
                            tilDato={utdanning.tilDato}
                            key={`${utdanning.nusKode}${utdanning.fraDato}`}
                        >
                            <BodyShort className={css.bold}>
                                {utdanning.alternativtUtdanningsnavn
                                    ? utdanning.alternativtUtdanningsnavn
                                    : utdanning.nusKodeUtdanningsnavn}
                            </BodyShort>
                            {utdanning.utdannelsessted && (
                                <BodyShort>{utdanning.utdannelsessted}</BodyShort>
                            )}
                            {utdanning.beskrivelse && (
                                <BodyShort>{utdanning.beskrivelse}</BodyShort>
                            )}
                        </Erfaring>
                    ))}
                </BolkMedErfaringer>
            )}

            {autorisasjoner?.length > 0 && (
                <BolkMedPunktliste tittel="Fagbrev/svennebrev og mesterbrev">
                    {autorisasjoner.map(({ tittel, type }) => (
                        <Fragment key={tittel}>
                            {(tittel || type) && <BodyShort as="li">{tittel ?? type}</BodyShort>}
                        </Fragment>
                    ))}
                </BolkMedPunktliste>
            )}

            {cv.yrkeserfaring?.length > 0 && (
                <BolkMedErfaringer tittel="Arbeidserfaring">
                    {sortByDato(cv.yrkeserfaring).map((erfaring) => (
                        <Arbeidserfaring
                            key={`${erfaring.styrkKode}-${erfaring.fraDato}`}
                            arbeidserfaring={erfaring}
                        />
                    ))}
                </BolkMedErfaringer>
            )}

            {cv.annenErfaring?.length > 0 && (
                <BolkMedErfaringer tittel="Annen erfaring">
                    {sortByDato(cv.annenErfaring).map((erfaring, i) => (
                        <Erfaring
                            key={`${erfaring.rolle}-${erfaring.fraDato}`}
                            fraDato={erfaring.fraDato}
                            tilDato={erfaring.tilDato}
                        >
                            <BodyShort className={css.bold}>{erfaring.rolle}</BodyShort>
                            <BodyShort>{erfaring.beskrivelse}</BodyShort>
                        </Erfaring>
                    ))}
                </BolkMedErfaringer>
            )}

            {cv.godkjenninger?.length > 0 && (
                <BolkMedErfaringer tittel="Godkjenninger i lovreguelerte yrker">
                    {cv.godkjenninger.map((godkjenning) => (
                        <Erfaring
                            fraDato={godkjenning.gjennomfoert}
                            key={`${godkjenning.konseptId}-${godkjenning.gjennomfoert}`}
                        >
                            <BodyShort className={css.bold}>{godkjenning.tittel}</BodyShort>
                            <BodyShort>{godkjenning.utsteder}</BodyShort>
                            {godkjenning.utloeper && (
                                <BodyShort>
                                    Utløper: <Tidsperiode tildato={godkjenning.utloeper} />
                                </BodyShort>
                            )}
                        </Erfaring>
                    ))}
                </BolkMedErfaringer>
            )}

            {cv.sertifikater?.length > 0 && (
                <BolkMedErfaringer tittel="Andre godkjenninger">
                    {sortByDato(cv.sertifikater).map((sertifikat) => (
                        <Erfaring
                            key={`${sertifikat.sertifikatKode}-${sertifikat.alternativtNavn}-${sertifikat.fraDato}`}
                            fraDato={sertifikat.fraDato}
                        >
                            <BodyShort className={css.bold}>
                                {sertifikat.alternativtNavn
                                    ? sertifikat.alternativtNavn
                                    : sertifikat.sertifikatKodeNavn}
                            </BodyShort>
                            {sertifikat.utsteder && <BodyShort>{sertifikat.utsteder}</BodyShort>}
                            {sertifikat.tilDato && (
                                <BodyShort>
                                    Utløper: <Tidsperiode tildato={sertifikat.tilDato} />
                                </BodyShort>
                            )}
                        </Erfaring>
                    ))}
                </BolkMedErfaringer>
            )}

            {cv.kurs?.length > 0 && (
                <BolkMedErfaringer tittel="Kurs">
                    {sortByDato(cv.kurs).map((kurs, i) => (
                        <Kurs key={`${kurs.tittel}-${kurs.fraDato}`} kurs={kurs} />
                    ))}
                </BolkMedErfaringer>
            )}

            {cv.forerkort?.length > 0 && (
                <BolkMedErfaringer tittel="Førerkort">
                    {fjernDuplikater(sortByDato(cv.forerkort)).map((førerkort) => (
                        <Erfaring
                            key={`${førerkort.sertifikatKode}-${førerkort.fraDato}`}
                            fraDato={førerkort.fraDato}
                            tilDato={førerkort.tilDato}
                        >
                            <BodyShort className={css.bold}>
                                {førerkort.alternativtNavn
                                    ? førerkort.alternativtNavn
                                    : førerkort.sertifikatKodeNavn}
                            </BodyShort>
                        </Erfaring>
                    ))}
                </BolkMedErfaringer>
            )}

            {cv.sprakferdigheter?.length > 0 && (
                <BolkMedToKolonner tittel="Språk">
                    <div className={css.kolonne}>
                        {cv.sprakferdigheter.map((ferdighet) => (
                            <Språkferdighet
                                ferdighet={ferdighet}
                                key={`${ferdighet.sprak}${ferdighet.ferdighetMuntlig}${ferdighet.ferdighetSkriftlig}`}
                            />
                        ))}
                    </div>
                </BolkMedToKolonner>
            )}
        </Informasjonspanel>
    );
};

const BolkMedToKolonner = ({ tittel, children }: { tittel: string; children: ReactNode }) => (
    <div className={css.bolkMedToKolonner}>
        <Heading level="3" size="medium">
            {tittel}
        </Heading>
        {children}
    </div>
);

const BolkMedErfaringer = ({ tittel, children }: { tittel: string; children: ReactNode }) => (
    <div className={css.bolkMedErfaringer}>
        <Heading level="3" size="medium">
            {tittel}
        </Heading>
        <div className={css.erfaringer}>{children}</div>
    </div>
);

const BolkMedPunktliste = ({ tittel, children }: { tittel: string; children: ReactNode }) => (
    <div className={css.bolkMedPunktliste}>
        <Heading level="3" size="medium">
            {tittel}
        </Heading>
        <div className={css.erfaringer}>
            <span />
            <ul className={css.punktliste}>{children}</ul>
        </div>
    </div>
);

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
