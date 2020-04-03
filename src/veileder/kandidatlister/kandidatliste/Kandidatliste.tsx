import React, { FunctionComponent, useState, useEffect } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { KandidatIKandidatliste, OpprettetAv } from '../kandidatlistetyper';
import FinnKandidaterLenke from './knappe-rad/FinnKandidaterLenke';
import KandidatRad from './kandidatrad/KandidatRad';
import KnappeRad from './knappe-rad/KnappeRad';
import LeggTilKandidatKnapp from './knappe-rad/LeggTilKandidatKnapp';
import ListeHeader from './liste-header/ListeHeader';
import SideHeader from './side-header/SideHeader';
import TomListe from './tom-liste/TomListe';
import '../../../felles/common/ikoner/ikoner.less';

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
    alleMarkert: boolean;
    onCheckAlleKandidater: (markert: boolean) => void;
    onToggleKandidat: any;
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
    visSendSms?: boolean;
};

const hentAntallArkiverte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.filter(kandidat => kandidat.arkivert).length;
};

const Kandidatliste: FunctionComponent<Props> = props => {
    const [visArkiverte, toggleVisArkiverte] = useState<boolean>(false);
    const [antallArkiverte, setAntallArkiverte] = useState<number>(
        hentAntallArkiverte(props.kandidater)
    );
    const [antallIkkeArkiverte, setAntallIkkeArkiverte] = useState<number>(
        props.kandidater.length - hentAntallArkiverte(props.kandidater)
    );

    const toggleVisArkiverteOgFjernMarkering = () => {
        toggleVisArkiverte(!visArkiverte);
        props.onCheckAlleKandidater(false);
    };

    const [filtrerteKandidater, setFiltrerteKandidater] = useState<KandidatIKandidatliste[]>(
        props.kandidater
    );

    useEffect(() => {
        setFiltrerteKandidater(
            props.kandidater.filter(kandidat => kandidat.arkivert === visArkiverte)
        );
    }, [props.kandidater, visArkiverte]);

    useEffect(() => {
        const antallArkiverte = hentAntallArkiverte(props.kandidater);
        const totaltAntallKandidater = props.kandidater.length;

        setAntallArkiverte(antallArkiverte);
        setAntallIkkeArkiverte(totaltAntallKandidater - antallArkiverte);
    }, [props.kandidater]);

    return (
        <div className="kandidatliste">
            <SideHeader
                antallKandidater={antallIkkeArkiverte}
                opprettetAv={props.opprettetAv}
                stillingsId={props.stillingsId}
                tittel={props.tittel}
                arbeidsgiver={props.arbeidsgiver}
                beskrivelse={props.beskrivelse}
            />
            {props.kandidater.length > 0 ? (
                <div className="kandidatliste__container">
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
                        visSendSms={props.visSendSms}
                        visArkiverte={visArkiverte}
                    >
                        <FinnKandidaterLenke
                            kandidatlisteId={props.kandidatlisteId}
                            stillingsId={props.stillingsId}
                        />
                        <LeggTilKandidatKnapp onLeggTilKandidat={props.onLeggTilKandidat} />
                    </KnappeRad>

                    <aside className="kandidatliste__filter">
                        <Ekspanderbartpanel border apen tittel="Slettet" tittelProps="element">
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
                            alleMarkert={props.alleMarkert}
                            onCheckAlleKandidater={props.onCheckAlleKandidater}
                            stillingsId={props.stillingsId}
                            visArkiveringskolonne={!visArkiverte}
                        />
                        {filtrerteKandidater.map((kandidat: KandidatIKandidatliste) => (
                            <KandidatRad
                                key={kandidat.kandidatnr}
                                kandidat={kandidat}
                                endreNotat={props.endreNotat}
                                kanEditere={props.kanEditere}
                                stillingsId={props.stillingsId}
                                kandidatlisteId={props.kandidatlisteId}
                                onKandidatStatusChange={props.onKandidatStatusChange}
                                onToggleKandidat={props.onToggleKandidat}
                                onVisningChange={props.onVisningChange}
                                opprettNotat={props.opprettNotat}
                                slettNotat={props.slettNotat}
                                toggleArkivert={props.toggleArkivert}
                                visSendSms={props.visSendSms}
                                visArkiveringskolonne={!visArkiverte}
                            />
                        ))}
                    </div>
                </div>
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
