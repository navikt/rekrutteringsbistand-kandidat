import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { KandidatIKandidatliste, OpprettetAv, Kandidatlistefilter } from './kandidatlistetyper';
import { queryParamsTilFilter, filterTilQueryParams } from './filter/filter-utils';
import { Status } from './kandidatrad/statusSelect/StatusSelect';
import { useHistory, useLocation } from 'react-router-dom';
import { Utfall } from './kandidatrad/utfall-select/UtfallSelect';
import Filter from './filter/Filter';
import FinnKandidaterLenke from './meny/FinnKandidaterLenke';
import IngenKandidater from './ingen-kandidater/IngenKandidater';
import KandidatlisteActionType from './reducer/KandidatlisteActionType';
import Kandidatrad from './kandidatrad/Kandidatrad';
import KnappeRad from './knappe-rad/KnappeRad';
import LeggTilKandidatKnapp from './meny/LeggTilKandidatKnapp';
import ListeHeader from './liste-header/ListeHeader';
import Meny from './meny/Meny';
import Navnefilter from './navnefilter/Navnefilter';
import SideHeader from './side-header/SideHeader';
import SmsFeilAlertStripe from './smsFeilAlertStripe/SmsFeilAlertStripe';
import TomListe from './tom-liste/TomListe';
import useAlleFiltrerteErMarkerte from './hooks/useAlleFiltrerteErMarkerte';
import useAntallFiltertreff from './hooks/useAntallFiltertreff';
import '../../felles/common/ikoner/ikoner.less';

export enum Visningsstatus {
    SkjulPanel = 'SKJUL_PANEL',
    VisNotater = 'VIS_NOTATER',
    VisMerInfo = 'VIS_MER_INFO',
}

type Props = {
    kandidater: KandidatIKandidatliste[];
    filter: Kandidatlistefilter;
    arbeidsgiver?: string;
    stillingsId: string | null;
    tittel: string;
    opprettetAv: OpprettetAv;
    kandidatlisteId: string;
    kanEditere: boolean;
    toggleMarkert: (kandidatnr: string) => void;
    fjernAllMarkering: () => void;
    markerKandidater: (kandidatnumre: string[]) => void;
    onKandidatStatusChange: any;
    onKandidatUtfallChange: (
        utfall: Utfall,
        kandidat: KandidatIKandidatliste,
        visModal: boolean
    ) => void;
    onKandidatShare: any;
    onEmailKandidater: any;
    onKandidaterAngreArkivering: any;
    onSendSmsClick: any;
    onLeggTilKandidat: any;
    onVisningChange: any;
    toggleArkivert: any;
    beskrivelse?: string;
};

const Kandidatliste: FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const antallFiltertreff = useAntallFiltertreff(props.kandidater);
    const alleFiltrerteErMarkerte = useAlleFiltrerteErMarkerte(props.kandidater);

    useEffect(() => {
        const filter = queryParamsTilFilter(new URLSearchParams(location.search));
        dispatch({
            type: KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER,
            filter,
        });
    }, [dispatch, history, location.search]);

    const filtrerteKandidater = props.kandidater.filter(
        (kandidat) => !kandidat.tilstand.filtrertBort
    );

    const setFilterIUrl = (filter: Kandidatlistefilter) => {
        const query = filterTilQueryParams(filter).toString();
        history.replace({
            pathname: history.location.pathname,
            search: query,
        });
    };

    const toggleVisArkiverteOgFjernMarkering = () => {
        setFilterIUrl({
            ...props.filter,
            visArkiverte: !props.filter.visArkiverte,
        });

        props.fjernAllMarkering();
    };

    const onToggleStatus = (status: Status) => {
        setFilterIUrl({
            ...props.filter,
            status: {
                ...props.filter.status,
                [status]: !props.filter.status[status],
            },
        });
    };

    const onToggleUtfall = (utfall: Utfall) => {
        setFilterIUrl({
            ...props.filter,
            utfall: {
                ...props.filter.utfall,
                [utfall]: !props.filter.utfall[utfall],
            },
        });
    };

    const setNavnefilter = (navn: string) => {
        dispatch({
            type: KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER,
            filter: {
                ...props.filter,
                navn,
            },
        });
    };

    const onCheckAlleKandidater = () => {
        if (alleFiltrerteErMarkerte) {
            props.fjernAllMarkering();
        } else {
            props.markerKandidater(filtrerteKandidater.map((k) => k.kandidatnr));
        }
    };

    return (
        <div className="kandidatliste">
            <SideHeader
                kandidater={props.kandidater}
                opprettetAv={props.opprettetAv}
                stillingsId={props.stillingsId}
                tittel={props.tittel}
                erEierAvListen={props.kanEditere}
                arbeidsgiver={props.arbeidsgiver}
                beskrivelse={props.beskrivelse}
            />
            {props.kandidater.length > 0 ? (
                <>
                    <Meny
                        kandidatlisteId={props.kandidatlisteId}
                        stillingsId={props.stillingsId}
                        onLeggTilKandidat={props.onLeggTilKandidat}
                    />
                    <div className="kandidatliste__grid">
                        <div className="kandidatliste__knapperad-container">
                            {props.kanEditere && (
                                <SmsFeilAlertStripe kandidater={props.kandidater} />
                            )}
                            <KnappeRad
                                arbeidsgiver={props.arbeidsgiver}
                                kanEditere={props.kanEditere}
                                kandidater={props.kandidater}
                                onEmailKandidater={props.onEmailKandidater}
                                onSendSmsClick={props.onSendSmsClick}
                                onKandidatShare={props.onKandidatShare}
                                onKandidaterAngreArkivering={props.onKandidaterAngreArkivering}
                                kandidatlisteId={props.kandidatlisteId}
                                onLeggTilKandidat={props.onLeggTilKandidat}
                                stillingsId={props.stillingsId}
                                visArkiverte={props.filter.visArkiverte}
                            >
                                <Navnefilter
                                    value={props.filter.navn}
                                    onChange={(e) => setNavnefilter(e.currentTarget.value)}
                                    onReset={() => setNavnefilter('')}
                                />
                            </KnappeRad>
                        </div>
                        <Filter
                            antallTreff={antallFiltertreff}
                            visArkiverte={props.filter.visArkiverte}
                            statusfilter={props.filter.status}
                            utfallsfilter={props.stillingsId ? props.filter.utfall : undefined}
                            onToggleArkiverte={toggleVisArkiverteOgFjernMarkering}
                            onToggleStatus={onToggleStatus}
                            onToggleUtfall={onToggleUtfall}
                        />
                        <div className="kandidatliste__liste">
                            <ListeHeader
                                alleMarkert={alleFiltrerteErMarkerte}
                                onCheckAlleKandidater={onCheckAlleKandidater}
                                stillingsId={props.stillingsId}
                                visArkiveringskolonne={!props.filter.visArkiverte}
                            />
                            {filtrerteKandidater.length > 0 ? (
                                filtrerteKandidater.map((kandidat: KandidatIKandidatliste) => (
                                    <Kandidatrad
                                        key={kandidat.kandidatnr}
                                        kandidat={kandidat}
                                        kanEditere={props.kanEditere}
                                        stillingsId={props.stillingsId}
                                        kandidatlisteId={props.kandidatlisteId}
                                        onKandidatStatusChange={props.onKandidatStatusChange}
                                        onKandidatUtfallChange={props.onKandidatUtfallChange}
                                        onToggleKandidat={props.toggleMarkert}
                                        onVisningChange={props.onVisningChange}
                                        toggleArkivert={props.toggleArkivert}
                                        visArkiveringskolonne={!props.filter.visArkiverte}
                                    />
                                ))
                            ) : (
                                <IngenKandidater>
                                    {props.filter.visArkiverte
                                        ? 'Det er ingen kandidater som passer med valgte kriterier'
                                        : 'Du har ingen kandidater i kandidatlisten'}
                                </IngenKandidater>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <TomListe>
                    <FinnKandidaterLenke
                        kandidatlisteId={props.kandidatlisteId}
                        stillingsId={props.stillingsId}
                    />
                    <LeggTilKandidatKnapp onLeggTilKandidat={props.onLeggTilKandidat} />
                </TomListe>
            )}
        </div>
    );
};

export default Kandidatliste;
