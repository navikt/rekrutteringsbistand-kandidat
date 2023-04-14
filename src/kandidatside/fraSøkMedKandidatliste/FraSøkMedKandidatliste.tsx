import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { BodyShort, Button, Tabs } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { PersonPlusIcon } from '@navikt/aksel-icons';

import { lenkeTilKandidatliste, lenkeTilNyttKandidatsøk } from '../../app/paths';
import { Nettstatus } from '../../api/Nettressurs';
import { NyttKandidatsøkØkt, skrivKandidatnrTilNyttKandidatsøkØkt } from '../søkekontekst';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import useCv from '../hooks/useCv';
import useFaner from '../hooks/useFaner';
import useKandidatliste from '../hooks/useKandidatliste';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../common/useScrollTilToppen';
import LagreKandidatIKandidatlisteModal from './LagreKandidatIKandidatlisteModal';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
    kandidatlisteId: string;
    søkeøkt: NyttKandidatsøkØkt;
};

const FraSøkMedKandidatliste: FunctionComponent<Props> = ({
    tabs,
    kandidatnr,
    kandidatlisteId,
    søkeøkt,
    children,
}) => {
    useScrollTilToppen(kandidatnr);

    const [fane, setFane] = useFaner();
    const [visLagreKandidatModal, setVisLagreKandidatModal] = useState<boolean>(false);

    const cv = useCv(kandidatnr);
    const kandidatliste = useKandidatliste(kandidatlisteId);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr, kandidatlisteId, søkeøkt);

    useEffect(() => {
        skrivKandidatnrTilNyttKandidatsøkØkt(kandidatnr);
    }, [kandidatnr]);

    const lenkeTilFinnKandidater = {
        to: lenkeTilNyttKandidatsøk(søkeøkt?.searchParams),
        state: { scrollTilKandidat: true },
    };

    const kandidatErAlleredeLagretIListen =
        kandidatliste.kind === Nettstatus.Suksess &&
        kandidatliste.data.kandidater.some((k) => k.kandidatnr === kandidatnr);

    return (
        <>
            <Kandidatheader
                cv={cv}
                tilbakelenkeTekst="Til finn kandidater"
                tilbakelenke={lenkeTilFinnKandidater}
                kandidatnavigering={kandidatnavigering}
            />
            <Tabs value={fane} onChange={setFane}>
                <Kandidatmeny tabs={tabs} cv={cv}>
                    {kandidatErAlleredeLagretIListen ? (
                        <BodyShort>
                            <span>Kandidaten er lagret i </span>
                            <Link
                                to={lenkeTilKandidatliste(kandidatlisteId)}
                                className="navds-link"
                            >
                                kandidatlisten
                            </Link>
                        </BodyShort>
                    ) : (
                        <Button
                            size="small"
                            icon={<PersonPlusIcon aria-hidden />}
                            onClick={() => setVisLagreKandidatModal(true)}
                        >
                            Lagre kandidat
                        </Button>
                    )}
                </Kandidatmeny>
                <Tabs.Panel value={fane}>{children}</Tabs.Panel>
            </Tabs>

            <LagreKandidatIKandidatlisteModal
                vis={visLagreKandidatModal}
                kandidatliste={kandidatliste}
                kandidatnr={kandidatnr}
                onClose={() => setVisLagreKandidatModal(false)}
            />
        </>
    );
};

export default FraSøkMedKandidatliste;
