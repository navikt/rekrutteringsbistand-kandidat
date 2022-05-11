import React, { FunctionComponent } from 'react';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import { Kandidat, Kandidatutfall } from '../../../domene/Kandidat';
import Hendelse, { Hendelsesstatus } from './Hendelse';

type Props = {
    kandidat: Kandidat;
};

const CvErSlettet: FunctionComponent<Props> = ({ kandidat }) => {
    const utfallSortertMedNyesteFørst = kandidat.utfallsendringer.sort(
        (u, v) => Number(new Date(v.tidspunkt)) - Number(new Date(u.tidspunkt))
    );

    const [sisteUtfall, nestSisteUtfall] = utfallSortertMedNyesteFørst;
    if (nestSisteUtfall === undefined) {
        return null;
    }

    const kandidatenErSendtTilArbeidsgiverOgTrukketTilbake =
        nestSisteUtfall.sendtTilArbeidsgiversKandidatliste &&
        sisteUtfall.utfall === Kandidatutfall.IkkePresentert;

    if (!kandidatenErSendtTilArbeidsgiverOgTrukketTilbake) {
        return null;
    }

    const slettetTidspunkt = formaterDatoNaturlig(sisteUtfall.tidspunkt);

    return (
        <Hendelse
            status={Hendelsesstatus.Grønn}
            tittel="CV-en er slettet av NAV fra listen til arbeidsgiver"
            beskrivelse={`${slettetTidspunkt} av ${sisteUtfall.registrertAvIdent}`}
        />
    );
};

export default CvErSlettet;
