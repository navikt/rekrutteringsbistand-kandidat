import React, { FunctionComponent } from 'react';
import { Sidetittel, Element, Normaltekst } from 'nav-frontend-typografi';
import { KandidatIKandidatliste } from '../reducer/kandidatlisteReducer';
import { capitalizeEmployerName } from '../../../felles/sok/utils';

export type OpprettetAv = {
    ident: string;
    navn: string;
};

type Props = {
    tittel: string;
    kandidater: KandidatIKandidatliste[];
    arbeidsgiver?: string;
    opprettetAv: OpprettetAv;
    stillingsId?: string;
    beskrivelse?: string;
};

const SideHeader: FunctionComponent<Props> = ({
    tittel,
    kandidater,
    arbeidsgiver,
    opprettetAv,
    stillingsId,
    beskrivelse,
}) => (
    <div className="side-header">
        <div className="wrapper">
            <div className="top">
                <div className="header-side" />
                <Sidetittel className="tittel">{tittel}</Sidetittel>
                <div className="header-side" />
            </div>
            <div className="antall">
                <Element>
                    {kandidater.length === 1 ? '1 kandidat' : `${kandidater.length} kandidater`}
                </Element>
            </div>
            <div className="bottom">
                {arbeidsgiver && (
                    <div className="no-border-left">
                        Arbeidsgiver: {capitalizeEmployerName(arbeidsgiver)}
                    </div>
                )}
                <div className={`${arbeidsgiver ? 'border-left' : 'no-border-left'}`}>
                    {`Veileder: ${opprettetAv.navn} (${opprettetAv.ident})`}
                </div>
                {stillingsId && (
                    <div className="border-left">
                        <a className="link" href={`/stilling/${stillingsId}`}>
                            Se stillingsannonse
                        </a>
                    </div>
                )}
            </div>
            {beskrivelse && (
                <div className="beskrivelse">
                    <Normaltekst>{beskrivelse}</Normaltekst>
                </div>
            )}
        </div>
    </div>
);

export default SideHeader;
