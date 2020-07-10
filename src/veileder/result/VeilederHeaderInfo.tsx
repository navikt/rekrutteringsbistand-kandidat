import { Element, Normaltekst } from 'nav-frontend-typografi';
import Sidetittel from '../../felles/common/Sidetittel';
import { capitalizeEmployerName } from '../../felles/sok/utils';
import { Flatknapp } from 'nav-frontend-knapper';
import NavFrontendChevron from 'nav-frontend-chevron';
import React, { FunctionComponent, useState } from 'react';
import { Kandidatliste } from '../kandidatliste/kandidatlistetyper';

interface Props {
    kandidatliste?: Kandidatliste;
    stillingsId?: string;
}

export const VeilederHeaderInfo: FunctionComponent<Props> = ({ kandidatliste, stillingsId }) => {
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
        <div className="child-item__container--header">
            <div className="header__row--veileder">
                <Element className="text">{`Finn kandidater til ${
                    stillingsId ? 'stilling/' : ''
                }kandidatliste:`}</Element>
            </div>
            {tittel && (
                <div className="header__row--veileder">
                    <Sidetittel className="text">{tittel}</Sidetittel>
                </div>
            )}
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
    );
};
