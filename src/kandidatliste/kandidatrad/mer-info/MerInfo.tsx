import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import InfoUnderKandidat from '../info-under-kandidat/InfoUnderKandidat';
import { Kandidat } from '../../domene/Kandidat';

interface Props {
    kandidat: Kandidat;
}

const MerInfo: FunctionComponent<Props> = ({ kandidat }) => {
    return (
        <InfoUnderKandidat className="mer-info">
            <div className="kontaktinfo-kolonne">
                <Element>Kontaktinfo</Element>
                <Normaltekst className="tekst">
                    E-post:{' '}
                    {kandidat.epost ? (
                        <Lenke href={`mailto:${kandidat.epost}`}>{kandidat.epost}</Lenke>
                    ) : (
                        <span>&mdash;</span>
                    )}
                </Normaltekst>
                <Normaltekst className="tekst">
                    Telefon: {kandidat.telefon ? kandidat.telefon : <span>&mdash;</span>}
                </Normaltekst>
            </div>
            <div className="innsatsgruppe-kolonne">
                <Normaltekst>
                    <strong>Innsatsgruppe:</strong>
                    {` ${kandidat.innsatsgruppe}`}
                </Normaltekst>
                <a
                    className="frittstaende-lenke ForlateSiden link"
                    href={`https://app.adeo.no/veilarbpersonflatefs/${kandidat.fodselsnr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="lenke">Se aktivitetsplan</span>
                    <i className="ForlateSiden__icon" />
                </a>
            </div>
        </InfoUnderKandidat>
    );
};

export default MerInfo;
