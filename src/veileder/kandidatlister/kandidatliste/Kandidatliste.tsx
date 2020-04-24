import React, { FunctionComponent, useState, useEffect } from 'react';
import { Checkbox, Input } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { KandidatIKandidatliste, OpprettetAv } from '../kandidatlistetyper';
import FinnKandidaterLenke from './knappe-rad/FinnKandidaterLenke';
import IngenKandidater from './ingen-kandidater/IngenKandidater';
import KandidatRad from './kandidatrad/KandidatRad';
import KnappeRad from './knappe-rad/KnappeRad';
import LeggTilKandidatKnapp from './knappe-rad/LeggTilKandidatKnapp';
import ListeHeader from './liste-header/ListeHeader';
import SideHeader from './side-header/SideHeader';
import SmsFeilAlertStripe from './smsFeilAlertStripe/SmsFeilAlertStripe';
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
    arkiveringErEnabled?: boolean;
};

const matchArkivering = (visArkiverte: boolean) => (kandidat: KandidatIKandidatliste) =>
    !!kandidat.arkivert === visArkiverte;

const matchNavn = (navnefilter: string) => (kandidat: KandidatIKandidatliste) => {
    if (navnefilter.length === 0) return true;

    const [normalisertFilter, normalisertFornavn, normalisertEtternavn] = [
        navnefilter,
        kandidat.fornavn,
        kandidat.etternavn,
    ].map((s) => s.toLowerCase());

    return (
        normalisertFornavn.startsWith(normalisertFilter) ||
        normalisertEtternavn.startsWith(normalisertFilter) ||
        (normalisertFornavn + ' ' + normalisertEtternavn).startsWith(normalisertFilter)
    );
};

const hentAntallArkiverte = (kandidater: KandidatIKandidatliste[]) => {
    return kandidater.filter(matchArkivering(true)).length;
};

const hentFiltrerteKandidater = (
    kandidater: KandidatIKandidatliste[],
    visArkiverte: boolean,
    navnefilter: string
) => {
    return kandidater.filter(matchArkivering(visArkiverte)).filter(matchNavn(navnefilter));
};

const Kandidatliste: FunctionComponent<Props> = (props) => {
    const [visArkiverte, toggleVisArkiverte] = useState<boolean>(false);
    const [navnefilter, setNavnefilter] = useState<string>('');
    const [antallArkiverte, setAntallArkiverte] = useState<number>(
        hentAntallArkiverte(props.kandidater)
    );

    const toggleVisArkiverteOgFjernMarkering = () => {
        toggleVisArkiverte(!visArkiverte);
        props.onCheckAlleKandidater(false);
    };

    const [filtrerteKandidater, setFiltrerteKandidater] = useState<KandidatIKandidatliste[]>(
        hentFiltrerteKandidater(props.kandidater, visArkiverte, navnefilter)
    );

    useEffect(() => {
        setFiltrerteKandidater(
            hentFiltrerteKandidater(props.kandidater, visArkiverte, navnefilter)
        );
    }, [props.kandidater, visArkiverte, navnefilter]);

    useEffect(() => {
        setAntallArkiverte(hentAntallArkiverte(props.kandidater));
    }, [props.kandidater]);

    return (
        <div className="kandidatliste">
            <SideHeader
                antallKandidater={props.kandidater.length - antallArkiverte}
                opprettetAv={props.opprettetAv}
                stillingsId={props.stillingsId}
                tittel={props.tittel}
                arbeidsgiver={props.arbeidsgiver}
                beskrivelse={props.beskrivelse}
            />
            {props.kandidater.length > 0 ? (
                <div className="kandidatliste__container">
                    <div className="kandidatliste__knapperad-container">
                        {props.kanEditere && <SmsFeilAlertStripe kandidater={props.kandidater} />}
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
                            <input
                                placeholder="Søk på navn"
                                value={navnefilter}
                                className="kandidatliste__navnefilter"
                                onChange={(e) => setNavnefilter(e.currentTarget.value)}
                            />
                        </KnappeRad>
                    </div>

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
                            visArkiveringskolonne={!!props.arkiveringErEnabled && !visArkiverte}
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
                                    onToggleKandidat={props.onToggleKandidat}
                                    onVisningChange={props.onVisningChange}
                                    opprettNotat={props.opprettNotat}
                                    slettNotat={props.slettNotat}
                                    toggleArkivert={props.toggleArkivert}
                                    visSendSms={props.visSendSms}
                                    visArkiveringskolonne={
                                        !!props.arkiveringErEnabled && !visArkiverte
                                    }
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
