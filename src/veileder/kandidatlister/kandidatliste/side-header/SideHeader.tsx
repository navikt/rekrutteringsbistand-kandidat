import React, { FunctionComponent } from 'react';
import { Sidetittel, Element, Normaltekst } from 'nav-frontend-typografi';
import { OpprettetAv } from '../../kandidatlistetyper';
import { capitalizeEmployerName } from '../../../../felles/sok/utils';
import './SideHeader.less';
import { RemoteDataTypes } from '../../../../felles/common/remoteData';

type Props = {
    tittel: string;
    antallKandidater: number;
    arbeidsgiver?: string;
    opprettetAv: OpprettetAv;
    stillingsId: string | null;
    beskrivelse?: string;
    kandidatlisteState: RemoteDataTypes;
};

const SideHeader: FunctionComponent<Props> = ({
    tittel,
    antallKandidater,
    arbeidsgiver,
    opprettetAv,
    stillingsId,
    beskrivelse,
    kandidatlisteState,
}) => (
    <div className="side-header">
        <div className="side-header__wrapper">
            <div className="side-header__top">
                <div className="side-header__header-side" />
                <Sidetittel className="tittel">{tittel}</Sidetittel>
                <div className="side-header__header-side" />
            </div>
            <div className="side-header__antall">
                <Element>
                    {antallKandidater === 1
                        ? `1 kandidat`
                        : `${
                              kandidatlisteState === RemoteDataTypes.SUCCESS
                                  ? antallKandidater
                                  : '-'
                          } kandidater`}
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
    </div>
);

export default SideHeader;
