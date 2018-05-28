import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';

export default function ShowCv({ cv, onTaKontaktClick }) {
    const utdanning = cv.utdanning.slice().reverse();
    const yrkeserfaring = cv.yrkeserfaring.slice().reverse();
    const kurs = cv.kurs.slice().reverse();
    const sertifikat = cv.sertifikat.slice().reverse();
    const sprak = cv.sprak.slice().reverse();
    return (
        <div className="panel">
            <Row>
                <Column xs="12" md="6">
                    <Knapp
                        type="hoved"
                        onClick={onTaKontaktClick}
                    >
                        Ta kontakt med kandidat
                    </Knapp>
                </Column>
            </Row>
            <Row>
                <Column xs="12">
                    <div className="text-center">
                        <Systemtittel className="modal--systemtittel">
                            CV
                        </Systemtittel>
                        <Normaltekst>
                            {cv.fornavn} {cv.etternavn}
                        </Normaltekst>
                        {cv.adresselinje1 !== '' && (
                            <Normaltekst>
                                {cv.adresselinje1}
                                {cv.adresselinje1 !== '' &&
                                (cv.postnummer !== '' || cv.poststed !== '') ?
                                    (', ') : null}
                                {cv.postnummer} {cv.poststed}
                            </Normaltekst>
                        )}
                        {cv.epostadresse !== '' && (
                            <Normaltekst>
                                E-post: {cv.epostadresse}
                            </Normaltekst>
                        )}
                        {cv.fodselsdato !== '' && (
                            <Normaltekst>
                                Fødselsdato: {cv.fodselsdato.substring(0, 10)}
                            </Normaltekst>
                        )}
                    </div>
                </Column>
            </Row>
            {utdanning && utdanning.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Utdanning</Undertittel>
                        {utdanning.map((u) => (
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
            {yrkeserfaring && yrkeserfaring.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Arbeidserfaring</Undertittel>
                        {yrkeserfaring.map((a) => (
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
            {kurs && kurs.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Kurs og sertifiseringer</Undertittel>
                        {kurs.map((k) => (
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
            {sertifikat && sertifikat.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Sertifikater</Undertittel>
                        {sertifikat.map((s) => (
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
            {sprak && sprak.length !== 0 && (
                <Row className="blokk-s">
                    <Column xs="12">
                        <Undertittel>Språk</Undertittel>
                        {sprak.map((s) => (
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
            <Row>
                <Column xs="12" md="6">
                    <Knapp
                        type="hoved"
                        onClick={onTaKontaktClick}
                    >
                        Ta kontakt med kandidat
                    </Knapp>
                </Column>
            </Row>
        </div>
    );
}

ShowCv.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    cv: PropTypes.object.isRequired,
    onTaKontaktClick: PropTypes.func.isRequired
};

