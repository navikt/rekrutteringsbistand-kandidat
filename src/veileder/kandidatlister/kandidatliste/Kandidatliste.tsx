import React, { FunctionComponent, useState, useEffect } from 'react';

import FinnKandidaterLenke from './knappe-rad/FinnKandidaterLenke';
import KandidatRad from './kandidatrad/KandidatRad';
import KnappeRad from './knappe-rad/KnappeRad';
import LeggTilKandidatKnapp from './knappe-rad/LeggTilKandidatKnapp';
import ListeHeader from './liste-header/ListeHeader';
import SideHeader from './SideHeader';
import TomListe from './TomListe';
import '../../../felles/common/ikoner/ikoner.less';
import { KandidatIKandidatliste, OpprettetAv } from '../kandidatlistetyper';
import { Checkbox } from 'nav-frontend-skjema';

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
    onCheckAlleKandidater: any;
    onToggleKandidat: any;
    onKandidatStatusChange: any;
    onKandidatShare: any;
    onEmailKandidater: any;
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

const Kandidatliste: FunctionComponent<Props> = props => {
    const [visArkiverte, toggleVisArkiverte] = useState<boolean>(false);
    const [filtrerteKandidater, setFiltrerteKandidater] = useState<KandidatIKandidatliste[]>(
        props.kandidater
    );

    useEffect(() => {
        setFiltrerteKandidater(
            props.kandidater.filter(kandidat => kandidat.arkivert === visArkiverte)
        );
    }, [props.kandidater, visArkiverte]);

    return (
        <div className="Kandidatliste">
            <SideHeader
                kandidater={filtrerteKandidater}
                opprettetAv={props.opprettetAv}
                stillingsId={props.stillingsId}
                tittel={props.tittel}
                arbeidsgiver={props.arbeidsgiver}
                beskrivelse={props.beskrivelse}
            />
            <Checkbox
                label="Vis kun slettede"
                checked={visArkiverte}
                onChange={() => toggleVisArkiverte(!visArkiverte)}
            />
            {props.kandidater.length > 0 ? (
                <div className="detaljer">
                    <div className="wrapper">
                        <KnappeRad
                            arbeidsgiver={props.arbeidsgiver}
                            kanEditere={props.kanEditere}
                            kandidater={filtrerteKandidater}
                            onEmailKandidater={props.onEmailKandidater}
                            onSendSmsClick={props.onSendSmsClick}
                            onKandidatShare={props.onKandidatShare}
                            kandidatlisteId={props.kandidatlisteId}
                            onLeggTilKandidat={props.onLeggTilKandidat}
                            stillingsId={props.stillingsId}
                            visSendSms={props.visSendSms}
                        >
                            <FinnKandidaterLenke
                                kandidatlisteId={props.kandidatlisteId}
                                stillingsId={props.stillingsId}
                            />
                            <LeggTilKandidatKnapp onLeggTilKandidat={props.onLeggTilKandidat} />
                        </KnappeRad>
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
