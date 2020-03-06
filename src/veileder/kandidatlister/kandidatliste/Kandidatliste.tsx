import React, { FunctionComponent } from 'react';

import FinnKandidaterLenke from './knappe-rad/FinnKandidaterLenke';
import KandidatRad from './kandidatrad/KandidatRad';
import KnappeRad from './knappe-rad/KnappeRad';
import LeggTilKandidatKnapp from './knappe-rad/LeggTilKandidatKnapp';
import ListeHeader from './liste-header/ListeHeader';
import SideHeader, { OpprettetAv } from './SideHeader';
import TomListe from './TomListe';
import '../../../felles/common/ikoner/ikoner.less';
import { KandidatIKandidatliste } from '../kandidatlistetyper';

export enum Visningsstatus {
    SkjulPanel = 'SKJUL_PANEL',
    VisNotater = 'VIS_NOTATER',
    VisMerInfo = 'VIS_MER_INFO',
}

type Props = {
    kandidater: KandidatIKandidatliste[];
    arbeidsgiver?: string;
    stillingsId?: string;
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
    onLeggTilKandidat: any;
    onVisningChange: any;
    opprettNotat: any;
    endreNotat: any;
    slettNotat: any;
    toggleErSlettet: any;
    beskrivelse?: string;
};

const Kandidatliste: FunctionComponent<Props> = props => {
    return (
        <div className="Kandidatliste">
            <SideHeader
                kandidater={props.kandidater}
                opprettetAv={props.opprettetAv}
                stillingsId={props.stillingsId}
                tittel={props.tittel}
                arbeidsgiver={props.arbeidsgiver}
                beskrivelse={props.beskrivelse}
            />
            {props.kandidater.length > 0 ? (
                <div className="detaljer">
                    <div className="wrapper">
                        <KnappeRad
                            arbeidsgiver={props.arbeidsgiver}
                            kanEditere={props.kanEditere}
                            kandidater={props.kandidater}
                            onEmailKandidater={props.onEmailKandidater}
                            onKandidatShare={props.onKandidatShare}
                            kandidatlisteId={props.kandidatlisteId}
                            onLeggTilKandidat={props.onLeggTilKandidat}
                            stillingsId={props.stillingsId}
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
                        />
                        {props.kandidater.map((kandidat: KandidatIKandidatliste) => (
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
                                toggleErSlettet={props.toggleErSlettet}
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
