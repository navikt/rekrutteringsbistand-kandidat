import React, { FunctionComponent } from 'react';
import { Column, Row } from 'nav-frontend-grid';
import {
    Element,
    Normaltekst,
    Systemtittel,
    Undertekst,
    Undertittel,
} from 'nav-frontend-typografi';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import sortByDato from './SortByDato';
import Tidsperiode from './Tidsperiode';
import Cv, { Omfang, Omfangenhet } from '../reducer/cv-typer';
import Beskrivelse from './Beskrivelse';
import Yrkeserfaring from './Yrkeserfaring';
import './Cv.less';

const fjernDuplikater = (forerkortListe) => {
    const forerkortAlleredeILista = new Set();
    return forerkortListe.filter((forerkort) => {
        const forerkortetErIkkeAlleredeLagtTil = !forerkortAlleredeILista.has(
            forerkort.sertifikatKodeNavn
        );
        forerkortAlleredeILista.add(forerkort.sertifikatKodeNavn);
        return forerkortetErIkkeAlleredeLagtTil;
    });
};

const hentKursvarighet = (omfang: Omfang) => {
    switch (omfang.enhet) {
        case Omfangenhet.Time:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'timer' : 'time'}`;
        case Omfangenhet.Dag:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'dager' : 'dag'}`;
        case Omfangenhet.Uke:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'uker' : 'uke'}`;
        case Omfangenhet.Måned:
            return `${omfang.verdi} ${omfang.verdi > 1 ? 'måneder' : 'måned'}`;
        default:
            return '';
    }
};

enum Språklabels {
    IkkeOppgitt = 'Ikke oppgitt',
    Nybegynner = 'Nybegynner',
    Godt = 'Godt',
    VeldigGodt = 'Veldig godt',
    Foerstespraak = 'Førstespråk (morsmål)',
}

type Props = {
    cv: Cv;
};

const KandidatCv: FunctionComponent<Props> = ({ cv }) => (
    <div className="kandidat-cv">
        <Ekspanderbartpanel
            apen
            id="ekspanderbartpanel-cv"
            tittel={<Systemtittel>CV</Systemtittel>}
        >
            {cv.beskrivelse && (
                <Row className="kandidat-cv__row">
                    <Column xs="12">
                        <Undertittel className="kandidat-cv__overskrift">Sammendrag</Undertittel>
                        <Beskrivelse beskrivelse={cv.beskrivelse} />
                    </Column>
                </Row>
            )}
            {cv.utdanning && cv.utdanning.length !== 0 && (
                <Row className="kandidat-cv__row">
                    <Column xs="12" sm="5">
                        <Undertittel className="kandidat-cv__overskrift">Utdanning</Undertittel>
                    </Column>
                    <Column xs="12" sm="7">
                        {sortByDato(cv.utdanning).map((u, i) => (
                            <Row
                                className="kandidat-cv__row-kategori"
                                key={JSON.stringify({ ...u, index: i })}
                            >
                                <Undertekst className="kandidat-cv__tidsperiode">
                                    <Tidsperiode fradato={u.fraDato} tildato={u.tilDato} />
                                </Undertekst>
                                {u.utdannelsessted && (
                                    <Normaltekst>{u.utdannelsessted}</Normaltekst>
                                )}
                                <Element>
                                    {u.alternativtUtdanningsnavn
                                        ? u.alternativtUtdanningsnavn
                                        : u.nusKodeUtdanningsnavn}
                                </Element>
                                {u.beskrivelse && <Normaltekst>{u.beskrivelse}</Normaltekst>}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
            {cv.fagdokumentasjon &&
                cv.fagdokumentasjon.length !== 0 &&
                cv.fagdokumentasjon.some((f) => f.type !== 'Autorisasjon') && (
                    <Row className="kandidat-cv__row">
                        <Column xs="12" sm="5">
                            <Undertittel className="kandidat-cv__overskrift">
                                Fagbrev/svennebrev og mesterbrev
                            </Undertittel>
                        </Column>
                        <Column xs="12" sm="7">
                            {cv.fagdokumentasjon
                                .filter((f) => f.type !== 'Autorisasjon')
                                .map((f, i) => (
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
                        {sortByDato(cv.annenErfaring).map((a, i) => (
                            <Row
                                className="kandidat-cv__row-kategori"
                                key={JSON.stringify({ ...a, index: i })}
                            >
                                <Undertekst className="kandidat-cv__tidsperiode">
                                    <Tidsperiode
                                        fradato={a.fraDato}
                                        tildato={a.tilDato}
                                        navarende={!a.tilDato}
                                    />
                                </Undertekst>
                                {a.rolle && <Element>{a.rolle}</Element>}
                                {a.beskrivelse && <Normaltekst>{a.beskrivelse}</Normaltekst>}
                            </Row>
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
                        {fjernDuplikater(sortByDato(cv.forerkort)).map((s, i) => (
                            <Row
                                className="kandidat-cv__row-kategori"
                                key={JSON.stringify({ ...s, index: i })}
                            >
                                <Undertekst className="kandidat-cv__tidsperiode">
                                    <Tidsperiode fradato={s.fraDato} tildato={s.tilDato} />
                                </Undertekst>
                                <Normaltekst>
                                    {s.alternativtNavn ? s.alternativtNavn : s.sertifikatKodeNavn}
                                </Normaltekst>
                            </Row>
                        ))}
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
                        {sortByDato(cv.godkjenninger).map((s, i) => (
                            <Row
                                className="kandidat-cv__row-kategori"
                                key={JSON.stringify({ ...s, index: i })}
                            >
                                <Undertekst className="kandidat-cv__tidsperiode">
                                    <Tidsperiode fradato={s.gjennomfoert} />
                                </Undertekst>
                                {s.utsteder && <Normaltekst>{s.utsteder}</Normaltekst>}
                                <Element>{s.tittel}</Element>
                                {s.utloeper && (
                                    <Normaltekst>
                                        Utløper: <Tidsperiode tildato={s.utloeper} />
                                    </Normaltekst>
                                )}
                            </Row>
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
                        {sortByDato(cv.sertifikater).map((s, i) => (
                            <Row
                                className="kandidat-cv__row-kategori"
                                key={JSON.stringify({ ...s, index: i })}
                            >
                                <Undertekst className="kandidat-cv__tidsperiode">
                                    <Tidsperiode fradato={s.fraDato} />
                                </Undertekst>
                                {s.utsteder && <Normaltekst>{s.utsteder}</Normaltekst>}
                                <Element>
                                    {s.alternativtNavn ? s.alternativtNavn : s.sertifikatKodeNavn}
                                </Element>
                                {s.tilDato && (
                                    <Normaltekst>
                                        Utløper: <Tidsperiode tildato={s.tilDato} />
                                    </Normaltekst>
                                )}
                            </Row>
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
                        {sortByDato(cv.kurs).map((k, i) => (
                            <Row
                                className="kandidat-cv__row-kategori"
                                key={JSON.stringify({ ...k, index: i })}
                            >
                                <Undertekst className="kandidat-cv__tidsperiode">
                                    <Tidsperiode fradato={k.fraDato} tildato={k.tilDato} />
                                </Undertekst>
                                {k.arrangor && <Normaltekst>{k.arrangor}</Normaltekst>}
                                {k.tittel && <Element>{k.tittel}</Element>}
                                {hentKursvarighet(k.omfang) && (
                                    <Normaltekst>{`Varighet: ${hentKursvarighet(
                                        k.omfang
                                    )}`}</Normaltekst>
                                )}
                            </Row>
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
                        {cv.sprakferdigheter.map((s) => (
                            <Row className="kandidat-cv__row-kategori" key={JSON.stringify(s)}>
                                <Element>{s.sprak}</Element>
                                {s.ferdighetSkriftlig && (
                                    <Normaltekst>
                                        Skriftlig: {Språklabels[s.ferdighetSkriftlig]}
                                    </Normaltekst>
                                )}
                                {s.ferdighetMuntlig && (
                                    <Normaltekst>
                                        Muntlig: {Språklabels[s.ferdighetMuntlig]}
                                    </Normaltekst>
                                )}
                            </Row>
                        ))}
                    </Column>
                </Row>
            )}
        </Ekspanderbartpanel>
    </div>
);

export default KandidatCv;
