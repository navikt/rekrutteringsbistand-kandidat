import React from 'react';
import { booleanTilTekst } from '../formatering';
import Kandidatmatch from '../Kandidatmatch';
import { Seksjon } from './Seksjon';

const Personalia = ({ kandidat }: { kandidat: Kandidatmatch }) => (
    <Seksjon åpen tittel="Personalia" className="matchforklaring__personalia">
        <table>
            <tbody>
                <tr>
                    <td>Fornavn</td>
                    <td>{kandidat.fornavn}</td>
                </tr>
                <tr>
                    <td>Etternavn</td>
                    <td>{kandidat.etternavn}</td>
                </tr>
                <tr>
                    <td>Epost</td>
                    <td>{kandidat.epost}</td>
                </tr>
                <tr>
                    <td>Telefon</td>
                    <td>{kandidat.telefon}</td>
                </tr>
                <tr>
                    <td>Gateadresse</td>
                    <td>{kandidat.gateadresse}</td>
                </tr>
                <tr>
                    <td>Postnummer</td>
                    <td>{kandidat.postnummer}</td>
                </tr>
                <tr>
                    <td>Poststed</td>
                    <td>{kandidat.poststed}</td>
                </tr>
                <tr>
                    <td>Kommunenr</td>
                    <td>{kandidat.kommunenr}</td>
                </tr>
                <tr>
                    <td>Land</td>
                    <td>{kandidat.land}</td>
                </tr>
                <tr>
                    <td>Nasjonalitet</td>
                    <td>{kandidat.nasjonalitet}</td>
                </tr>
                <tr>
                    <td>Fødselsnummer</td>
                    <td>{kandidat.fodselsnummer}</td>
                </tr>
                <tr>
                    <td>Fødselsdato</td>
                    <td>{kandidat.foedselsdato}</td>
                </tr>
                <tr>
                    <td>Aktørid</td>
                    <td>{kandidat.aktoerId}</td>
                </tr>

                {kandidat.veileder && (
                    <tr>
                        <td>Veileder</td>
                        <td>{kandidat.veileder.veilederId}</td>
                    </tr>
                )}

                <tr>
                    <td>NAV-kontor</td>
                    {/*<td>{kandidat.oppfolgingsinformasjon.oppfolgingsenhet}</td>*/}
                </tr>
                <tr>
                    <td>Disponerer bil</td>
                    <td>{booleanTilTekst(kandidat.disponererBil === true)}</td>
                </tr>
            </tbody>
        </table>
    </Seksjon>
);

export default Personalia;
