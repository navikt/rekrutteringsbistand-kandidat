import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
    Kandidatliste as Kandidatlistetype,
    KandidatIKandidatliste,
    Kandidatlistefilter,
    FormidlingAvUsynligKandidat,
} from './kandidatlistetyper';
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
import FormidlingAvUsynligKandidatrad from './formidling-av-usynlig-kandidatrad/FormidlingAvUsynligKandidatrad';
import '../../felles/common/ikoner/ikoner.less';

export enum Visningsstatus {
    SkjulPanel = 'SKJUL_PANEL',
    VisNotater = 'VIS_NOTATER',
    VisMerInfo = 'VIS_MER_INFO',
}

type Props = {
    kandidater: KandidatIKandidatliste[];
    kandidatliste: Kandidatlistetype;

    filter: Kandidatlistefilter;
    onToggleMarkert: (kandidatnr: string) => void;
    onFjernAllMarkering: () => void;
    onMarkerKandidater: (kandidatnumre: string[]) => void;
    onKandidatStatusChange: any;
    onKandidatUtfallChange: (
        utfall: Utfall,
        kandidat: KandidatIKandidatliste,
        visModal: boolean
    ) => void;
    onUsynligKandidatFormidlingsutfallChange: (
        utfall: Utfall,
        formidling: FormidlingAvUsynligKandidat,
        visModal: true
    ) => void;
    onKandidatShare: any;
    onEmailKandidater: any;
    onKandidaterAngreArkivering: any;
    onSendSmsClick: any;
    onLeggTilKandidat: any;
    onVisningChange: any;
    onToggleArkivert: any;
};

const Kandidatliste: FunctionComponent<Props> = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

    const antallFiltertreff = useAntallFiltertreff(props.kandidater);
    const antallFilterTreffJSON = JSON.stringify(antallFiltertreff);
    const alleFiltrerteErMarkerte = useAlleFiltrerteErMarkerte(props.kandidater);

    useEffect(() => {
        const filter = queryParamsTilFilter(new URLSearchParams(location.search));
        dispatch({
            type: KandidatlisteActionType.ENDRE_KANDIDATLISTE_FILTER,
            filter,
        });
    }, [dispatch, history, location.search, antallFilterTreffJSON]);

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

        props.onFjernAllMarkering();
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
            props.onFjernAllMarkering();
        } else {
            props.onMarkerKandidater(filtrerteKandidater.map((k) => k.kandidatnr));
        }
    };

    const listenInneholderKandidater =
        props.kandidater.length > 0 || props.kandidatliste.formidlingerAvUsynligKandidat.length > 0;

    return (
        <div className="kandidatliste">
            <SideHeader kandidater={props.kandidater} kandidatliste={props.kandidatliste} />
            {listenInneholderKandidater ? (
                <>
                    <Meny
                        kandidatlisteId={props.kandidatliste.kandidatlisteId}
                        stillingId={props.kandidatliste.stillingId}
                        onLeggTilKandidat={props.onLeggTilKandidat}
                    />
                    <div className="kandidatliste__grid">
                        <div className="kandidatliste__knapperad-container">
                            {props.kandidatliste.kanEditere && (
                                <SmsFeilAlertStripe kandidater={props.kandidater} />
                            )}
                            <KnappeRad
                                arbeidsgiver={props.kandidatliste.organisasjonNavn}
                                kanEditere={props.kandidatliste.kanEditere}
                                kandidater={props.kandidater}
                                onEmailKandidater={props.onEmailKandidater}
                                onSendSmsClick={props.onSendSmsClick}
                                onKandidatShare={props.onKandidatShare}
                                onKandidaterAngreArkivering={props.onKandidaterAngreArkivering}
                                kandidatlisteId={props.kandidatliste.kandidatlisteId}
                                onLeggTilKandidat={props.onLeggTilKandidat}
                                stillingsId={props.kandidatliste.stillingId}
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
                            utfallsfilter={
                                props.kandidatliste.stillingId ? props.filter.utfall : undefined
                            }
                            onToggleArkiverte={toggleVisArkiverteOgFjernMarkering}
                            onToggleStatus={onToggleStatus}
                            onToggleUtfall={onToggleUtfall}
                        />
                        <div className="kandidatliste__liste">
                            <ListeHeader
                                alleMarkert={alleFiltrerteErMarkerte}
                                onCheckAlleKandidater={onCheckAlleKandidater}
                                stillingsId={props.kandidatliste.stillingId}
                                visArkiveringskolonne={!props.filter.visArkiverte}
                            />
                            {props.kandidatliste.formidlingerAvUsynligKandidat.map(
                                (formidlingAvUsynligKandidat) => (
                                    <FormidlingAvUsynligKandidatrad
                                        key={formidlingAvUsynligKandidat.lagtTilTidspunkt}
                                        formidling={formidlingAvUsynligKandidat}
                                        onUtfallChange={
                                            props.onUsynligKandidatFormidlingsutfallChange
                                        }
                                    />
                                )
                            )}
                            {filtrerteKandidater.length > 0 ? (
                                filtrerteKandidater.map((kandidat: KandidatIKandidatliste) => (
                                    <Kandidatrad
                                        key={kandidat.kandidatnr}
                                        kandidat={kandidat}
                                        kanEditere={props.kandidatliste.kanEditere}
                                        stillingsId={props.kandidatliste.stillingId}
                                        kandidatlisteId={props.kandidatliste.kandidatlisteId}
                                        onKandidatStatusChange={props.onKandidatStatusChange}
                                        onKandidatUtfallChange={props.onKandidatUtfallChange}
                                        onToggleKandidat={props.onToggleMarkert}
                                        onVisningChange={props.onVisningChange}
                                        toggleArkivert={props.onToggleArkivert}
                                        visArkiveringskolonne={!props.filter.visArkiverte}
                                    />
                                ))
                            ) : (
                                <IngenKandidater>
                                    {props.filter.visArkiverte
                                        ? 'Det er ingen vanlige kandidater som passer med valgte kriterier'
                                        : 'Du har ingen vanlige kandidater i kandidatlisten'}
                                </IngenKandidater>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <TomListe>
                    <FinnKandidaterLenke
                        kandidatlisteId={props.kandidatliste.kandidatlisteId}
                        stillingId={props.kandidatliste.stillingId}
                    />
                    <LeggTilKandidatKnapp onLeggTilKandidat={props.onLeggTilKandidat} />
                </TomListe>
            )}
        </div>
    );
};

export default Kandidatliste;
