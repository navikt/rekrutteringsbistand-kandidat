import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Button, Tabs } from '@navikt/ds-react';
import { PersonPlusIcon } from '@navikt/aksel-icons';

import { lenkeTilKandidatsøk } from '../../app/paths';
import { KandidatsøkØkt } from '../søkekontekst';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import useCv from '../hooks/useCv';
import useNavigerbareKandidaterFraSøk from '../hooks/useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../utils/useScrollTilToppen';
import useFaner from '../hooks/useFaner';
import LagreKandidaterIMineKandidatlisterModal from './lagre-kandidat-modal/LagreKandidatIMineKandidatlisterModal';
import css from './FraSøkUtenKontekst.module.css';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
    søkeøkt: KandidatsøkØkt;
};

const FraSøkUtenKontekst: FunctionComponent<Props> = ({ tabs, kandidatnr, søkeøkt, children }) => {
    useScrollTilToppen(kandidatnr);

    const [fane, setFane] = useFaner();
    const cv = useCv(kandidatnr);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr, søkeøkt);
    const [visKandidatlisterModal, setVisKandidatlisterModal] = useState<boolean>(false);

    const tilbakelenke = {
        to: lenkeTilKandidatsøk(søkeøkt.searchParams),
        state: { scrollTilKandidat: true },
    };

    return (
        <>
            <Kandidatheader
                cv={cv}
                kandidatnavigering={kandidatnavigering}
                tilbakelenkeTekst="Til kandidatsøket"
                tilbakelenke={tilbakelenke}
            />
            <Tabs value={fane} onChange={setFane}>
                <Kandidatmeny tabs={tabs} cv={cv}>
                    <Button
                        size="small"
                        className={css.velgKandidatlisterKnapp}
                        icon={<PersonPlusIcon aria-hidden />}
                        onClick={() => setVisKandidatlisterModal(true)}
                    >
                        Velg kandidatlister
                    </Button>
                </Kandidatmeny>
                <Tabs.Panel value={fane}>{children}</Tabs.Panel>
            </Tabs>
            <LagreKandidaterIMineKandidatlisterModal
                vis={visKandidatlisterModal}
                kandidatnr={kandidatnr}
                onClose={() => setVisKandidatlisterModal(false)}
            />
        </>
    );
};

export default FraSøkUtenKontekst;
