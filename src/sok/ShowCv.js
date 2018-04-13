import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Link } from 'react-router-dom';
import NavFrontendChevron from 'nav-frontend-chevron';

const ShowCv = ({ ...props }) => {
    const kandidat = props.location.kandidatInfo;
    window.scrollTo(0, 0);
    console.log(kandidat);
    return (
        <div>
            <div className="search-page-header" />
            <Container className="search-page-margin">
                {kandidat && (
                    <Systemtittel>Forhåndsvisning av CV</Systemtittel>
                )}
            </Container>
            {kandidat ? (
                <Container>
                    <Row className="blokk-xxs">
                        <Column xs="6">
                            <div className="pull-left">
                                <Link to="/" className="lenke typo-normal">
                                    <NavFrontendChevron type="venstre" stor />
                                    Tilbake til kandidatsøk
                                </Link>
                            </div>
                        </Column>
                    </Row>
                    <div className="preview panel panel--padding">
                        <Row className="personalia">
                            <Column xs="12" className="blokk-s">
                                <div className="text-center blokk-xl">
                                    <Normaltekst>
                                        {kandidat.fornavn} {kandidat.etternavn}
                                    </Normaltekst>
                                    {kandidat.adresselinje1 !== '' && (
                                        <Normaltekst>
                                            {kandidat.adresselinje1}
                                            {kandidat.adresselinje1 !== '' &&
                                            (kandidat.postnummer !== '' || kandidat.poststed !== '') ?
                                                (', ') : null}
                                            {kandidat.postnummer} {kandidat.poststed}
                                        </Normaltekst>
                                    )}
                                    {kandidat.epostadresse !== '' && (
                                        <Normaltekst>
                                            E-post: {kandidat.epostadresse}
                                        </Normaltekst>
                                    )}
                                    {kandidat.fodselsdato !== '' && (
                                        <Normaltekst>
                                            Fødselsdato: {kandidat.fodselsdato.substring(0, 10)}
                                        </Normaltekst>
                                    )}
                                </div>
                            </Column>
                        </Row>
                        {kandidat.beskrivelse !== '' && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Beskrivelse</Undertittel>
                                    <Normaltekst>{kandidat.beskrivelse}</Normaltekst>
                                </Column>
                            </Row>
                        )}
                        {kandidat.utdanning && kandidat.utdanning.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Utdanning</Undertittel>
                                    {kandidat.utdanning.reverse().map((u) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {`${u.fraDato.substring(0, 10)} - ${u.tilDato.substring(0, 10)}`}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{u.nusKodeGrad}</Element>
                                                <Normaltekst>
                                                    {u.utdannelsessted}
                                                </Normaltekst>
                                                <Normaltekst><i>{u.alternativGrad}</i></Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.yrkeserfaring && kandidat.yrkeserfaring.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Arbeidserfaring</Undertittel>
                                    {kandidat.yrkeserfaring.reverse().map((a) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {`${a.fraDato.substring(0, 10)} - ${a.tilDato ? a.tilDato.substring(0, 10) : ''}`}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{a.styrkKodeStillingstittel}</Element>
                                                <Normaltekst>
                                                    {a.arbeidsgiver}
                                                </Normaltekst>
                                                <Normaltekst><i>{a.alternativStillingstittel}</i></Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.kompetanse && kandidat.kompetanse.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Kompetanse</Undertittel>
                                    {kandidat.kompetanse.reverse().map((k) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {k.fraDato.substring(0, 10)}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{k.kompKodeNavn}</Element>
                                                <Normaltekst>{k.alternativtNavn}</Normaltekst>
                                                <Normaltekst>{k.beskrivelse}</Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.annenerfaring && kandidat.annenerfaring.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Annen erfaring</Undertittel>
                                    {kandidat.annenerfaring.reverse().map((a) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {`${a.fraDato.substring(0, 10)} - ${a.tilDato ? a.tilDato.substring(0, 10) : ''}`}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{a.beskrivelse}</Element>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.kurs && kandidat.kurs.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Kurs og sertifiseringer</Undertittel>
                                    {kandidat.kurs.reverse().map((k) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {`${k.fraDato.substring(0, 10)} - ${k.tilDato ? k.tilDato.substring(0, 10) : ''}`}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{k.tittel}</Element>
                                                <Normaltekst>{k.arrangor}</Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.sertifikat && kandidat.sertifikat.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Sertifikater</Undertittel>
                                    {kandidat.sertifikat.reverse().map((s) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {`${s.fraDato.substring(0, 10)} - ${s.tilDato ? s.tilDato.substring(0, 10) : ''}`}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{s.sertifikatKodeNavn}</Element>
                                                <Normaltekst>{s.utsteder}</Normaltekst>
                                                <Normaltekst><i>{s.alternativtNavn}</i></Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.forerkort && kandidat.forerkort.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Førerkort</Undertittel>
                                    {kandidat.forerkort.reverse().map((f) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {`${f.fraDato.substring(0, 10)} - ${f.tilDato ? f.tilDato.substring(0, 10) : ''}`}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{f.forerkortKodeKlasse}</Element>
                                                <Normaltekst><i>{f.alternativKlasse}</i></Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.sprak && kandidat.sprak.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Språk</Undertittel>
                                    {kandidat.sprak.reverse().map((s) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {s.fraDato.substring(0, 10)}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{s.sprakKodeTekst}</Element>
                                                <Normaltekst>{s.beskrivelse}</Normaltekst>
                                                <Normaltekst><i>{s.alternativTekst}</i></Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                        {kandidat.verv && kandidat.verv.length !== 0 && (
                            <Row className="blokk-s">
                                <Column xs="12">
                                    <Undertittel>Verv</Undertittel>
                                    {kandidat.verv.reverse().map((v) => (
                                        <Row className="blokk-xs">
                                            <Column xs="4">
                                                <Normaltekst>
                                                    {`${v.fraDato.substring(0, 10)} - ${v.tilDato ? v.tilDato.substring(0, 10) : ''}`}
                                                </Normaltekst>
                                            </Column>
                                            <Column xs="8">
                                                <Element>{v.tittel}</Element>
                                                <Normaltekst>{v.organisasjon}</Normaltekst>
                                            </Column>
                                        </Row>
                                    ))}
                                </Column>
                            </Row>
                        )}
                    </div>
                </Container>
            ) : (
                <Row>
                    <Column xs="12">
                        <div className="text-center">
                            <h1>Det oppstod en feil</h1>
                        </div>
                    </Column>
                </Row>
            )}
        </div>
    );
};

ShowCv.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    }).isRequired,
    location: PropTypes.shape({
        kandidatInfo: PropTypes.object
    }).isRequired
};

export default ShowCv;
