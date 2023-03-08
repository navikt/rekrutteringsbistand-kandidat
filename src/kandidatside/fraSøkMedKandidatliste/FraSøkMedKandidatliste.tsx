import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { BodyShort, Button, Tabs } from '@navikt/ds-react';
import { Link } from 'react-router-dom';
import { AddPeople } from '@navikt/ds-icons';

import {
    lenkeTilAutomatiskMatching,
    lenkeTilKandidatliste,
    lenkeTilNyttKandidatsøk,
} from '../../app/paths';
import { Nettstatus } from '../../api/Nettressurs';
import { NyttKandidatsøkØkt, skrivKandidatnrTilNyttKandidatsøkØkt } from '../søkekontekst';
import { VarslingAction, VarslingActionType } from '../../common/varsling/varslingReducer';
import Kandidatheader from '../komponenter/header/Kandidatheader';
import KandidatlisteAction from '../../kandidatliste/reducer/KandidatlisteAction';
import KandidatlisteActionType from '../../kandidatliste/reducer/KandidatlisteActionType';
import Kandidatmeny from '../komponenter/meny/Kandidatmeny';
import useCv from '../hooks/useCv';
import useFaner from '../hooks/useFaner';
import useKandidatliste from '../hooks/useKandidatliste';
import useNavigerbareKandidaterFraSøk from './useNavigerbareKandidaterFraSøk';
import useScrollTilToppen from '../../common/useScrollTilToppen';
import LagreKandidatIKandidatlisteModal from './LagreKandidatIKandidatlisteModal';
import { Kandidatliste } from '../../kandidatliste/domene/Kandidatliste';

type Props = {
    tabs: ReactNode;
    kandidatnr: string;
    kandidatlisteId: string;
    søkeøkt: NyttKandidatsøkØkt;
    fraAutomatiskMatching: boolean;
};

const FraSøkMedKandidatliste: FunctionComponent<Props> = ({
    tabs,
    kandidatnr,
    kandidatlisteId,
    søkeøkt,
    fraAutomatiskMatching,
    children,
}) => {
    const dispatch: Dispatch<KandidatlisteAction | VarslingAction> = useDispatch();

    useScrollTilToppen(kandidatnr);

    const [fane, setFane] = useFaner();
    const [visLagreKandidatModal, setVisLagreKandidatModal] = useState<boolean>(false);

    const cv = useCv(kandidatnr);
    const kandidatliste = useKandidatliste(kandidatlisteId);
    const kandidatnavigering = useNavigerbareKandidaterFraSøk(
        kandidatnr,
        kandidatlisteId,
        søkeøkt,
        fraAutomatiskMatching
    );

    useEffect(() => {
        skrivKandidatnrTilNyttKandidatsøkØkt(kandidatnr);
        dispatch({
            type: KandidatlisteActionType.NullstillKandidatIKandidatliste,
        });
    }, [dispatch, kandidatnr]);

    /*
    const onLagreKandidat = (cv: Cv) => (kandidatliste: Kandidatliste) => {
        sendEvent('cv', 'lagre_kandidat_i_kandidatliste');

        dispatch({
            type: KandidatlisteActionType.LagreKandidatIKandidatliste,
            kandidatliste,
            fodselsnummer: cv.fodselsnummer,
            kandidatnr,
        });
    };
    */

    const handleLagretKandidat = (kandidatliste: Kandidatliste) => {
        dispatch({
            type: VarslingActionType.VisVarsling,
            alertType: 'suksess',
            innhold: `Kandidaten er lagret i kandidatlisten «${kandidatliste.tittel}»`,
        });
    };

    const lenkeTilFinnKandidater = {
        to: fraAutomatiskMatching
            ? lenkeTilAutomatiskMatching(
                  (kandidatliste.kind === Nettstatus.Suksess && kandidatliste.data.stillingId) || ''
              )
            : lenkeTilNyttKandidatsøk(søkeøkt?.searchParams),
        state: { scrollTilKandidat: true },
    };

    const kandidatErAlleredeLagretIListen =
        kandidatliste.kind === Nettstatus.Suksess &&
        kandidatliste.data.kandidater.some((k) => k.kandidatnr === kandidatnr);

    return (
        <>
            <Kandidatheader
                cv={cv}
                tilbakelenkeTekst={fraAutomatiskMatching ? 'Til resultatet' : 'Til finn kandidater'}
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
                            icon={<AddPeople aria-hidden />}
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
                onLagre={handleLagretKandidat}
            />
        </>
    );
};

export default FraSøkMedKandidatliste;
