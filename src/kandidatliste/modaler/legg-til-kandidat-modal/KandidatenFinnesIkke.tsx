import React, { FunctionComponent } from 'react';

enum Synlighetskriterie {
    HarAktivCv = 'harAktivCv',
    HarJobbprofil = 'harJobbprofil',
    HarSettHjemmel = 'harSettHjemmel',
    MåIkkeBehandleTidligereCv = 'maaIkkeBehandleTidligereCv',
    ErIkkeFritattKandidatsøk = 'erIkkefritattKandidatsøk',
    ErUnderOppfølging = 'erUnderOppfoelging',
    HarRiktigFormidlingsgruppe = 'harRiktigFormidlingsgruppe',
    ErIkkeKode6eller7 = 'erIkkeKode6eller7',
    ErIkkeSperretAnsatt = 'erIkkeSperretAnsatt',
    ErIkkeDød = 'erIkkeDoed',
    ErFerdigBeregnet = 'erFerdigBeregnet',
}

export type Synlighetsevaluering = Record<Synlighetskriterie, boolean>;

type Props = {
    synlighetsevaluering: Synlighetsevaluering;
};

const KandidatenFinnesIkke: FunctionComponent<Props> = ({ synlighetsevaluering }) => (
    <div className="skjemaelement__feilmelding">
        <div className="blokk-xxs">Kandidaten kan ikke legges til fordi:</div>
        <ul className="leggTilKandidatModal--feilmelding__ul">
            {Object.entries(synlighetsevaluering)
                .filter(([_, verdi]) => !verdi)
                .map(([kriterie, _]) => (
                    <li>{kriterieTilForklaring(kriterie as Synlighetskriterie)}</li>
                ))}
        </ul>
    </div>
);

const kriterieTilForklaring = (kriterie: Synlighetskriterie): string => {
    switch (kriterie) {
        case Synlighetskriterie.HarAktivCv:
            return 'Kandidaten mangler CV';
        case Synlighetskriterie.HarJobbprofil:
            return 'Kandidaten mangler jobbprofil';
        case Synlighetskriterie.HarRiktigFormidlingsgruppe:
            return 'Kandidaten har feil formidlingsgruppe';
        case Synlighetskriterie.MåIkkeBehandleTidligereCv:
            return 'Kandidaten må behandle CV registrert før oppfølgingsperioden';
        case Synlighetskriterie.HarSettHjemmel:
            return 'Kandidaten har ikke blitt informert om NAVs behandlingsgrunnlag';
        case Synlighetskriterie.ErIkkeKode6eller7:
            return 'Kandidaten har diskresjonskode (kode 6 og 7)'; // TODO: Bør vi fjerne denne eller kombinere med en annen?
        case Synlighetskriterie.ErIkkeFritattKandidatsøk:
            return 'Kandidaten har personforhold "Fritatt for kandidatsøk" i Arena';
        case Synlighetskriterie.ErIkkeSperretAnsatt:
            return 'Kandidaten er sperret "Egen ansatt"';
        case Synlighetskriterie.ErIkkeDød:
            return 'Kandidaten er død';
        default:
            return 'Ukjent';
    }
};

export default KandidatenFinnesIkke;
