import React, { FunctionComponent } from 'react';
import { Sidetittel, Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

import { OpprettetAv } from '../../kandidatlistetyper';
import { capitalizeEmployerName } from '../../../../felles/sok/utils';
import './SideHeader.less';

type Props = {
    tittel: string;
    antallKandidater: number;
    arbeidsgiver?: string;
    opprettetAv: OpprettetAv;
    stillingsId: string | null;
    beskrivelse?: string;
};

const SideHeader: FunctionComponent<Props> = (
    {
        tittel,
        antallKandidater,
        arbeidsgiver,
        opprettetAv,
        stillingsId,
        beskrivelse,
    } /*
    <div className="side-header">
        <div className="side-header__wrapper">
            <div className="side-header__top">
                <div className="side-header__header-side" />
                <Sidetittel className="tittel">{tittel}</Sidetittel>
                <div className="side-header__header-side" />
            </div>
            <div className="side-header__antall">
                <Element>
                    {antallKandidater === 1 ? '1 kandidat' : `${antallKandidater} kandidater`}
                </Element>
            </div>
            <div className="side-header__bottom">
                {arbeidsgiver && (
                    <div className="side-header__bottom--no-border-left">
                        Arbeidsgiver: {capitalizeEmployerName(arbeidsgiver)}
                    </div>
                )}
                <div
                    className={`${
                        arbeidsgiver
                            ? 'side-header__bottom--border-left'
                            : 'side-header__bottom--no-border-left'
                    }`}
                >
                    {`Veileder: ${opprettetAv.navn} (${opprettetAv.ident})`}
                </div>
                {stillingsId && (
                    <div className="side-header__bottom--border-left">
                        <a className="link" href={`/stilling/${stillingsId}`}>
                            Se stillingsannonse
                        </a>
                    </div>
                )}
            </div>
            {beskrivelse && (
                <div className="side-header__beskrivelse">
                    <Normaltekst>{beskrivelse}</Normaltekst>
                </div>
            )}
        </div>
    </div>*/
) => (
    <header className="side-header">
        <div className="side-header__inner">
            <div className="side-header__tilbake">Til kandidatlisten</div>
            <div className="side-header__informasjon">
                <Sidetittel className="side-header__tittel">{tittel}</Sidetittel>
                <Element className="side-header__antall-kandidater">
                    {antallKandidater === 1 ? '1 kandidat' : `${antallKandidater} kandidater`}
                </Element>
                <div className="side-header__om-kandidatlisten">
                    {arbeidsgiver && (
                        <span>Arbeidsgiver: {capitalizeEmployerName(arbeidsgiver)}</span>
                    )}
                    <span>
                        Registrert av: {opprettetAv.navn} ({opprettetAv.ident})
                    </span>
                    {stillingsId && (
                        <Lenke href={`/stilling/${stillingsId}`}>Se stillingsannonse</Lenke>
                    )}
                </div>
            </div>
        </div>
    </header>
);

export default SideHeader;
