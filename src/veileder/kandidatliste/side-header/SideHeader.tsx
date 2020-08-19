import React, { FunctionComponent, useState } from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { useSelector } from 'react-redux';
import Lenke from 'nav-frontend-lenker';
import NavFrontendChevron from 'nav-frontend-chevron';

import { capitalizeEmployerName } from '../../../felles/sok/utils';
import { LenkeMedChevron } from '../../kandidatside/header/lenke-med-chevron/LenkeMedChevron';
import { lenkeTilStilling } from '../../application/paths';
import { OpprettetAv, KandidatIKandidatliste } from '../kandidatlistetyper';
import { Status as Kandidatstatus } from '../kandidatrad/statusSelect/StatusSelect';
import { Utfall } from '../kandidatrad/utfall-select/UtfallSelect';
import AppState from '../../AppState';
import Lenkeknapp from '../../../felles/common/Lenkeknapp';
import Rekrutteringsstatus, {
    Status as RekStatus,
} from './rekrutteringsstatus/Rekrutteringsstatus';
import './SideHeader.less';

type Props = {
    tittel: string;
    kandidater: KandidatIKandidatliste[];
    arbeidsgiver?: string;
    opprettetAv: OpprettetAv;
    stillingsId: string | null;
    beskrivelse?: string;
    erEierAvListen: boolean;
};

const erIkkeArkivert = (k: KandidatIKandidatliste) => !k.arkivert;
const erAktuell = (k: KandidatIKandidatliste) => k.status === Kandidatstatus.Aktuell;
const erPresentert = (k: KandidatIKandidatliste) => k.utfall === Utfall.Presentert;
const harFåttJobb = (k: KandidatIKandidatliste) => k.utfall === Utfall.FåttJobben;

const SideHeader: FunctionComponent<Props> = ({
    tittel,
    kandidater,
    arbeidsgiver,
    opprettetAv,
    stillingsId,
    beskrivelse,
    erEierAvListen,
}) => {
    const visRekrutteringsstatus = useSelector(
        (state: AppState) => state.søk.featureToggles['vis-rekrutteringsstatus']
    );

    const ikkeArkiverteKandidater = kandidater.filter(erIkkeArkivert);
    const antallAktuelleKandidater = ikkeArkiverteKandidater.filter(erAktuell).length;
    const antallPresenterteKandidater = ikkeArkiverteKandidater.filter(erPresentert).length;
    const antallKandidaterSomHarFåttJobb = ikkeArkiverteKandidater.filter(harFåttJobb).length;

    const [beskrivelseSkalVises, setBeskrivelseSkalVises] = useState(false);
    const oppsummeringTekst = `${
        kandidater.length
    } kandidater (${antallAktuelleKandidater} er aktuelle${
        stillingsId ? ` / ${antallPresenterteKandidater} er presentert` : ''
    })`;

    return (
        <header className="side-header">
            <div className="side-header__inner">
                <div className="side-header__tilbake">
                    <LenkeMedChevron
                        to="/kandidater/lister"
                        text="Til kandidatlister"
                        type="venstre"
                    />
                </div>
                <div className="side-header__informasjon">
                    <Systemtittel className="side-header__tittel">{tittel}</Systemtittel>
                    <Element className="side-header__antall-kandidater">
                        {oppsummeringTekst}
                    </Element>
                    <div className="side-header__om-kandidatlisten">
                        {arbeidsgiver && (
                            <span>Arbeidsgiver: {capitalizeEmployerName(arbeidsgiver)}</span>
                        )}
                        <span>
                            Registrert av: {opprettetAv.navn} ({opprettetAv.ident})
                        </span>
                        {stillingsId && (
                            <span>
                                <Lenke href={lenkeTilStilling(stillingsId)}>
                                    Se stillingsannonse
                                </Lenke>
                            </span>
                        )}
                        {beskrivelse && (
                            <Lenkeknapp
                                onClick={() => setBeskrivelseSkalVises(!beskrivelseSkalVises)}
                            >
                                {beskrivelseSkalVises ? 'Skjul beskrivelse' : 'Vis beskrivelse'}
                                <NavFrontendChevron type={beskrivelseSkalVises ? 'opp' : 'ned'} />
                            </Lenkeknapp>
                        )}
                    </div>
                    {beskrivelseSkalVises && (
                        <>
                            <Element className="side-header__beskrivelse-tittel">
                                Beskrivelse
                            </Element>
                            <Normaltekst className="side-header__beskrivelse">
                                {beskrivelse}
                            </Normaltekst>
                        </>
                    )}
                </div>
                {visRekrutteringsstatus && (
                    <Rekrutteringsstatus
                        erKnyttetTilStilling={stillingsId !== null}
                        onEndreStatus={() => {
                            console.log('TODO: Endre status');
                        }}
                        erEierAvListen={erEierAvListen}
                        besatteStillinger={antallKandidaterSomHarFåttJobb}
                        antallStillinger={0} // TODO: Hent dette fra stillingen.
                        status={RekStatus.Pågår} // TODO: TODO: Lag nytt backend-felt for rekrutteringsstatus
                    />
                )}
            </div>
        </header>
    );
};

export default SideHeader;
