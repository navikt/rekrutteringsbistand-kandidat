import React, { FunctionComponent, ReactNode, useState } from 'react';
import { Button, Label, Tabs } from '@navikt/ds-react';
import { MagnifyingGlassIcon, PersonPlusIcon } from '@navikt/aksel-icons';

import { lenkeTilKandidatsøk } from '../../app/paths';
import { KandidatsøkØkt, hentØktFraKandidatsøk } from '../søkekontekst';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import useCv from '../hooks/useCv';
import useNavigerbareKandidaterFraSøk from '../hooks/useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../utils/useScrollTilToppen';
import useFaner from '../hooks/useFaner';
import LagreKandidaterIMineKandidatlisterModal from './lagre-kandidat-modal/LagreKandidatIMineKandidatlisterModal';
import css from './FraSøkUtenKontekst.module.css';
import { erIkkeProd } from '../../utils/featureToggleUtils';
import { Link } from 'react-router-dom';
import { Nettstatus } from '../../api/Nettressurs';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
};

const FraSøkUtenKontekst: FunctionComponent<Props> = ({ tabs, kandidatnr, children }) => {
    useScrollTilToppen(kandidatnr);

    const [fane, setFane] = useFaner();
    const cv = useCv(kandidatnr);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(kandidatnr);
    const [visKandidatlisterModal, setVisKandidatlisterModal] = useState<boolean>(false);

    const økt = hentØktFraKandidatsøk();
    const tilbakelenke = {
        to: lenkeTilKandidatsøk(økt.searchParams),
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
                    <div className={css.knapper}>
                        {erIkkeProd && cv.kind === Nettstatus.Suksess && (
                            <Link
                                to={`/stillingssok/${cv.data.fodselsnummer}`}
                                className="navds-button navds-button--secondary navds-button--small"
                            >
                                <MagnifyingGlassIcon />
                                <Label as="span" size="small">
                                    Finn stilling
                                </Label>
                            </Link>
                        )}
                        <Button
                            size="small"
                            icon={<PersonPlusIcon aria-hidden />}
                            onClick={() => setVisKandidatlisterModal(true)}
                        >
                            Velg kandidatlister
                        </Button>
                    </div>
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
