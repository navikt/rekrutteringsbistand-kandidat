import React, { FunctionComponent, useState } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { KandidatIKandidatliste, OpprettetAv } from '../kandidatlistetyper';
import FinnKandidaterLenke from './knappe-rad/FinnKandidaterLenke';
import IngenKandidater from './ingen-kandidater/IngenKandidater';
import KandidatRad, { Utfall } from './kandidatrad/KandidatRad';
import KnappeRad from './knappe-rad/KnappeRad';
import LeggTilKandidatKnapp from './knappe-rad/LeggTilKandidatKnapp';
import ListeHeader from './liste-header/ListeHeader';
import SideHeader from './side-header/SideHeader';
import SmsFeilAlertStripe from './smsFeilAlertStripe/SmsFeilAlertStripe';
import TomListe from './tom-liste/TomListe';
import '../../../felles/common/ikoner/ikoner.less';
import useKandidatlistefilter from './useKandidatlistefilter';
import Navnefilter from './navnefilter/Navnefilter';
import { Element } from 'nav-frontend-typografi';
import { Status } from './kandidatrad/statusSelect/StatusSelect';

export enum Visningsstatus {
    SkjulPanel = 'SKJUL_PANEL',
    VisNotater = 'VIS_NOTATER',
    VisMerInfo = 'VIS_MER_INFO',
}

type Props = {
    kandidater: KandidatIKandidatliste[];
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
    onKandidatShare: any;
    onEmailKandidater: any;
    onKandidaterAngreArkivering: any;
    onSendSmsClick: any;
    onLeggTilKandidat: any;
    onVisningChange: any;
    opprettNotat: any;
    endreNotat: any;
    slettNotat: any;
    toggleArkivert: any;
    beskrivelse?: string;
};

const Kandidatliste: FunctionComponent<Props> = (props) => {
    const [visArkiverte, toggleVisArkiverte] = useState<boolean>(false);
    const [navnefilter, setNavnefilter] = useState<string>('');
    const [filtrerteKandidater, antallArkiverte, alleFiltrerteErMarkerte] = useKandidatlistefilter(
        props.kandidater,
        visArkiverte,
        navnefilter
    );

    const toggleVisArkiverteOgFjernMarkering = () => {
        toggleVisArkiverte(!visArkiverte);
        props.fjernAllMarkering();
    };

    const onCheckAlleKandidater = () => {
        if (alleFiltrerteErMarkerte) {
            props.fjernAllMarkering();
        } else {
            props.markerKandidater(filtrerteKandidater.map((k) => k.kandidatnr));
        }
    };

    /**
     * Stjålet fra http://adripofjavascript.com/blog/drips/negating-predicate-functions-in-javascript.html
     * @param predicateFunc
     */
    function not(predicateFunc) {
        return function () {
            return !predicateFunc.apply(this, arguments);
        };
    }
    const erArkivert = (k: KandidatIKandidatliste) => k.arkivert;
    const erAktuell = (k: KandidatIKandidatliste) => k.status === Status.Aktuell;
    const erPresentert = (k: KandidatIKandidatliste) => k.utfall === Utfall.Presentert;

    return (
        <div className="kandidatliste">
            <SideHeader
                antallKandidater={props.kandidater.length - antallArkiverte}
                antallAktuelleKandidater={
                    props.kandidater.filter(not(erArkivert)).filter(erAktuell).length
                }
                antallPresenterteKandidater={
                    props.kandidater.filter(not(erArkivert)).filter(erPresentert).length
                }
                opprettetAv={props.opprettetAv}
                stillingsId={props.stillingsId}
                tittel={props.tittel}
                arbeidsgiver={props.arbeidsgiver}
                beskrivelse={props.beskrivelse}
            />
            {props.kandidater.length > 0 ? (
                <>
                    <div className="kandidatliste__kontrollpanel">
                        <FinnKandidaterLenke
                            kandidatlisteId={props.kandidatlisteId}
                            stillingsId={props.stillingsId}
                        />
                        <LeggTilKandidatKnapp onLeggTilKandidat={props.onLeggTilKandidat} />
                    </div>
                    <div className="kandidatliste__grid">
                        <div className="kandidatliste__knapperad-container">
                            {props.kanEditere && (
                                <SmsFeilAlertStripe kandidater={props.kandidater} />
                            )}
                            <KnappeRad
                                arbeidsgiver={props.arbeidsgiver}
                                kanEditere={props.kanEditere}
                                kandidater={filtrerteKandidater}
                                onEmailKandidater={props.onEmailKandidater}
                                onSendSmsClick={props.onSendSmsClick}
                                onKandidatShare={props.onKandidatShare}
                                onKandidaterAngreArkivering={props.onKandidaterAngreArkivering}
                                kandidatlisteId={props.kandidatlisteId}
                                onLeggTilKandidat={props.onLeggTilKandidat}
                                stillingsId={props.stillingsId}
                                visArkiverte={visArkiverte}
                            >
                                <Navnefilter
                                    value={navnefilter}
                                    onChange={(e) => setNavnefilter(e.currentTarget.value)}
                                    onReset={() => setNavnefilter('')}
                                />
                            </KnappeRad>
                        </div>

                        <aside className="kandidatliste__filter">
                            <Ekspanderbartpanel border apen tittel={<Element>Slettet</Element>}>
                                <Checkbox
                                    className="skjemaelement--pink"
                                    label={`Vis kun slettede (${antallArkiverte})`}
                                    checked={visArkiverte}
                                    onChange={toggleVisArkiverteOgFjernMarkering}
                                />
                            </Ekspanderbartpanel>
                        </aside>
                        <div className="kandidatliste__liste">
                            <ListeHeader
                                alleMarkert={alleFiltrerteErMarkerte}
                                onCheckAlleKandidater={onCheckAlleKandidater}
                                stillingsId={props.stillingsId}
                                visArkiveringskolonne={!visArkiverte}
                            />
                            {filtrerteKandidater.length > 0 ? (
                                filtrerteKandidater.map((kandidat: KandidatIKandidatliste) => (
                                    <KandidatRad
                                        key={kandidat.kandidatnr}
                                        kandidat={kandidat}
                                        endreNotat={props.endreNotat}
                                        kanEditere={props.kanEditere}
                                        stillingsId={props.stillingsId}
                                        kandidatlisteId={props.kandidatlisteId}
                                        onKandidatStatusChange={props.onKandidatStatusChange}
                                        onToggleKandidat={props.toggleMarkert}
                                        onVisningChange={props.onVisningChange}
                                        opprettNotat={props.opprettNotat}
                                        slettNotat={props.slettNotat}
                                        toggleArkivert={props.toggleArkivert}
                                        visArkiveringskolonne={!visArkiverte}
                                    />
                                ))
                            ) : (
                                <IngenKandidater>
                                    {visArkiverte
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
