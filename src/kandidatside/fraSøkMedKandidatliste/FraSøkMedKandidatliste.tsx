import React, { FunctionComponent, ReactNode, useState } from 'react';
import { BodyShort, Button, Tabs } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { PersonPlusIcon } from '@navikt/aksel-icons';

import { lenkeTilKandidatliste, lenkeTilKandidatsøk } from '../../app/paths';
import { Nettstatus } from '../../api/Nettressurs';
import { KandidatsøkØkt, hentØktFraKandidatsøk } from '../søkekontekst';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import useCv from '../hooks/useCv';
import useFaner from '../hooks/useFaner';
import useKandidatliste from '../hooks/useKandidatliste';
import useNavigerbareKandidaterFraSøk from '../hooks/useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../utils/useScrollTilToppen';
import LagreKandidatIKandidatlisteModal from './LagreKandidatIKandidatlisteModal';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
    kandidatlisteId: string;
};

const FraSøkMedKandidatliste: FunctionComponent<Props> = ({
    tabs,
    kandidatnr,
    kandidatlisteId,
    children,
}) => {
    useScrollTilToppen(kandidatnr);

    const [fane, setFane] = useFaner();
    const [visLagreKandidatModal, setVisLagreKandidatModal] = useState<boolean>(false);

    const cv = useCv(kandidatnr);
    const kandidatliste = useKandidatliste(kandidatlisteId);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr, kandidatlisteId);

    const økt = hentØktFraKandidatsøk();
    const lenkeTilFinnKandidater = {
        to: lenkeTilKandidatsøk(økt.searchParams),
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
