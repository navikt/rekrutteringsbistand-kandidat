import { Element, Normaltekst, Sidetittel } from 'nav-frontend-typografi';
import { capitalizeEmployerName } from '../utils';
import { Flatknapp } from 'nav-frontend-knapper';
import NavFrontendChevron from 'nav-frontend-chevron';
import React, { FunctionComponent, useState } from 'react';
import { Kandidatliste } from '../../kandidatliste/kandidatlistetyper';
import { Container } from 'nav-frontend-grid';
import { Link } from 'react-router-dom';
import { lenkeTilKandidatliste, lenkeTilStilling } from '../../app/paths';

interface Props {
    kandidatliste?: Kandidatliste;
    stillingsId?: string;
}

export const KandidatlisteHeader: FunctionComponent<Props> = ({ kandidatliste, stillingsId }) => {
    const [visBeskrivelse, setVisBeskrivelse] = useState<boolean>();

    const { tittel, organisasjonNavn, opprettetAv, beskrivelse } = kandidatliste || {
        tittel: undefined,
        organisasjonNavn: undefined,
        opprettetAv: undefined,
        beskrivelse: undefined,
    };

    const toggleVisBeskrivelse = () => {
        setVisBeskrivelse(!visBeskrivelse);
    };

    return (
        <Container className="container--header">
            <div className="child-item__container--header">
                <div className="header__row--veileder">
                    <Element className="text">{`Finn kandidater til ${
                        stillingsId ? 'stilling/' : ''
                    }kandidatliste:`}</Element>
                </div>
                {tittel && <Sidetittel className="text">{tittel}</Sidetittel>}
                <div className="header__row--veileder">
                    <div className="opprettet-av__row">
                        {organisasjonNavn && (
                            <Normaltekst className="text">
                                Arbeidsgiver: {`${capitalizeEmployerName(organisasjonNavn)}`}
                            </Normaltekst>
                        )}
                        {opprettetAv && (
                            <Normaltekst className="text">
                                Veileder: {opprettetAv.navn} ({opprettetAv.ident})
                            </Normaltekst>
                        )}
                        {beskrivelse && (
                            <Flatknapp
                                className="beskrivelse--knapp"
                                mini
                                onClick={toggleVisBeskrivelse}
                            >
                                {visBeskrivelse ? 'Skjul beskrivelse' : 'Se beskrivelse'}
                                <NavFrontendChevron type={visBeskrivelse ? 'opp' : 'ned'} />
                            </Flatknapp>
                        )}
                    </div>
                </div>
                {visBeskrivelse && (
                    <div className="header__row--veileder">
                        <div>
                            <Element className="beskrivelse">Beskrivelse</Element>
                            <Normaltekst className="beskrivelse--text">{beskrivelse}</Normaltekst>
                        </div>
                    </div>
                )}
            </div>
            <div className="container--header__lenker">
                {stillingsId && (
                    <Link className="SeStilling lenke" to={lenkeTilStilling(stillingsId)}>
                        <i className="SeStilling__icon" />
                        Se stilling
                    </Link>
                )}
                {kandidatliste && (
                    <Link
                        className="TilKandidater lenke"
                        to={lenkeTilKandidatliste(kandidatliste.kandidatlisteId)}
                    >
                        <i className="TilKandidater__icon" />
                        Se kandidatliste
                    </Link>
                )}
            </div>
        </Container>
    );
};
