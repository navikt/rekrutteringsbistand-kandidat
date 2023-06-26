import { FunctionComponent } from 'react';
import { formaterDatoNaturlig } from '../../../../utils/dateUtils';
import { Kandidat, Kandidatutfall, Utfallsendring } from '../../../domene/Kandidat';
import Hendelse, { Hendelsesstatus } from './Hendelse';

type Props = {
    kandidat: Kandidat;
};

const CvErSlettet: FunctionComponent<Props> = ({ kandidat }) => {
    const erSendtTilArbeidsgiverOgSlettet = cvErSendtTilArbeidsgiverOgSlettet(
        kandidat.utfallsendringer
    );

    if (!erSendtTilArbeidsgiverOgSlettet) {
        return null;
    }

    const sisteUtfall = hentSisteUtfall(kandidat.utfallsendringer);
    const slettetTidspunkt = formaterDatoNaturlig(sisteUtfall.tidspunkt);

    return (
        <Hendelse
            status={Hendelsesstatus.Grønn}
            tittel="CV-en er slettet av NAV fra listen til arbeidsgiver"
            beskrivelse={`${slettetTidspunkt} av ${sisteUtfall.registrertAvIdent}`}
        />
    );
};

const sorterUtfallmedNyesteFørst = (utfallsendringer: Utfallsendring[]) =>
    utfallsendringer.sort((u, v) => Number(new Date(v.tidspunkt)) - Number(new Date(u.tidspunkt)));

export const cvErSendtTilArbeidsgiverOgSlettet = (utfallsendringer: Utfallsendring[]) => {
    const utfallSortertMedNyesteFørst = sorterUtfallmedNyesteFørst(utfallsendringer);

    const [sisteUtfall, nestSisteUtfall] = utfallSortertMedNyesteFørst;
    if (nestSisteUtfall === undefined) {
        return false;
    }

    return (
        nestSisteUtfall.sendtTilArbeidsgiversKandidatliste &&
        sisteUtfall.utfall === Kandidatutfall.IkkePresentert
    );
};

const hentSisteUtfall = (utfallsendringer: Utfallsendring[]) =>
    sorterUtfallmedNyesteFørst(utfallsendringer)[0];

export default CvErSlettet;
