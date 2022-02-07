import React, { FunctionComponent } from 'react';

export type Synlighetsevaluering = {
    harAktivCv: boolean;
    harJobbprofil: boolean;
    harSettHjemmel: boolean;
    maaIkkeBehandleTidligereCv: boolean;
    erIkkefritattKandidatsøk: boolean;
    erUnderOppfoelging: boolean;
    harRiktigFormidlingsgruppe: boolean;
    erIkkeKode6eller7: boolean;
    erIkkeSperretAnsatt: boolean;
    erIkkeDoed: boolean;
    erFerdigBeregnet: boolean;
};

type Props = {
    synlighetsevaluering: Synlighetsevaluering;
};

const KandidatenFinnesIkke: FunctionComponent<Props> = ({ synlighetsevaluering }) => (
    <div className="skjemaelement__feilmelding">
        <div className="blokk-xxs">Kandidaten kan ikke legges til fordi:</div>
        <ul className="leggTilKandidatModal--feilmelding__ul">
            {Object.entries(synlighetsevaluering)
                .filter(([kriterie, verdi]) => verdi === false)
                .map(([kriterie]) => (
                    <li>{kriterieTilForklaring(kriterie)}</li>
                ))}
        </ul>
        {/*<ul className="leggTilKandidatModal--feilmelding__ul">
            <li>Fødselsnummeret er feil</li>
            <li>Kandidaten mangler CV eller jobbprofil</li>
            <li>Kandidaten har ikke blitt informert om NAVs behandlingsgrunnlag</li>
            <li>Kandidaten har personforhold "Fritatt for kandidatsøk" i Arena</li>
            <li>Kandidaten er sperret "Egen ansatt"</li>
            <li>Kandidaten har diskresjonskode (kode 6 og 7)</li>
        </ul>*/}
    </div>
);

const kriterieTilForklaring = (kriterie: string): string => {
    /*
        <li>Fødselsnummeret er feil</li>
        <li>Kandidaten mangler CV eller jobbprofil</li>
        <li>Kandidaten har ikke blitt informert om NAVs behandlingsgrunnlag</li>
        <li>Kandidaten har personforhold "Fritatt for kandidatsøk" i Arena</li>
        <li>Kandidaten er sperret "Egen ansatt"</li>
        <li>Kandidaten har diskresjonskode (kode 6 og 7)</li>
    */
    switch (kriterie) {
        case 'maaIkkeBehandleTidligereCv':
            return 'Personen må behandle tidligere CV';
        default:
            return 'Ukjent';
    }
};

export default KandidatenFinnesIkke;
