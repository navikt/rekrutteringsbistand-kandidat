import React, { FunctionComponent } from 'react';
import { UsynligKandidat } from '../../domene/Kandidat';
import { capitalizeFirstLetter } from '../../../kandidatsøk/utils';
import { Normaltekst } from 'nav-frontend-typografi';

type Props = {
    navn: UsynligKandidat[];
    fnr?: string;
};

const NavnPåUsynligKandidat: FunctionComponent<Props> = ({ navn, fnr }) => (
    <>
        {navn.map((n) => {
            const fornavn = capitalizeFirstLetter(n.fornavn);
            const mellomnavn = n.mellomnavn ? capitalizeFirstLetter(n.mellomnavn) : '';
            const etternavn = capitalizeFirstLetter(n.etternavn);
            const heltNavn = `${fornavn}${mellomnavn ? ' ' + mellomnavn : ''} ${etternavn}`;

            return (
                <Normaltekst key={JSON.stringify(n)} className="fodselsnummer">
                    {heltNavn} ({fnr})
                </Normaltekst>
            );
        })}
    </>
);

export default NavnPåUsynligKandidat;
