import React, { FunctionComponent } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import InfoUnderKandidat from '../info-under-kandidat/InfoUnderKandidat';
import { Kandidat } from '../../domene/Kandidat';
import useMiljøvariabler from '../../../common/useMiljøvariabler';
import { Link } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';

interface Props {
    kandidat: Kandidat;
}

const MerInfo: FunctionComponent<Props> = ({ kandidat }) => {
    const { arbeidsrettetOppfølgingUrl } = useMiljøvariabler();

    return (
        <InfoUnderKandidat className="mer-info">
            <div className="kontaktinfo-kolonne">
                <Element>Kontaktinfo</Element>
                <Normaltekst className="tekst">
                    E-post:{' '}
                    {kandidat.epost ? (
                        <Link href={`mailto:${kandidat.epost}`}>{kandidat.epost}</Link>
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
                <Link
                    className="frittstaende-lenke"
                    href={`${arbeidsrettetOppfølgingUrl}/${kandidat.fodselsnr}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Se aktivitetsplan
                    <ExternalLinkIcon aria-hidden />
                </Link>
            </div>
        </InfoUnderKandidat>
    );
};

export default MerInfo;
