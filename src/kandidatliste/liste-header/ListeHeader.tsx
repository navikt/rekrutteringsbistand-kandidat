import { FunctionComponent } from 'react';
import { Checkbox, Label } from '@navikt/ds-react';
import classNames from 'classnames';

import { erKobletTilStilling, Kandidatliste, Kandidatlistestatus } from '../domene/Kandidatliste';
import { KandidatSorteringsfelt } from '../kandidatsortering';
import { nesteSorteringsretning, Retning } from './sorterbarKolonneheader/Retning';
import { Kandidatsortering } from '../reducer/kandidatlisteReducer';
import SorterbarKolonneheader from './sorterbarKolonneheader/SorterbarKolonneheader';
import css from '../kandidatrad/Kandidatrad.module.css';

interface Props {
    kandidatliste: Kandidatliste;
    alleMarkert: boolean;
    onCheckAlleKandidater: () => void;
    visArkiveringskolonne: boolean;
    sortering: Kandidatsortering;
    setSortering: (sortering: Kandidatsortering) => void;
}

export const modifierTilListeradGrid = (
    visUtfallskolonne: boolean,
    visArkiveringskolonne: boolean
) => {
    if (visUtfallskolonne) {
        return visArkiveringskolonne ? css.radVisUtfallOgArkivering : css.radVisUtfall;
    } else {
        return visArkiveringskolonne ? css.radVisArkivering : css.rad;
    }
};

const Kolonne: FunctionComponent<{
    tekst: string;
    className?: string;
}> = ({ tekst, className, children }) => {
    return (
        <Label as="div" role="columnheader" className={classNames(className, css.kolonneTittel)}>
            {tekst}
            {children}
        </Label>
    );
};

const ListeHeader: FunctionComponent<Props> = ({
    kandidatliste,
    alleMarkert,
    onCheckAlleKandidater,
    visArkiveringskolonne,
    sortering,
    setSortering,
}) => {
    const klassenavn = classNames(css.header, {
        [css.kandidatDisabled]: kandidatliste.status === Kandidatlistestatus.Lukket,
    });

    const klassenavnForListerad = classNames(
        css.rad,
        modifierTilListeradGrid(erKobletTilStilling(kandidatliste), visArkiveringskolonne)
    );

    const endreSortering = (sorteringsfeltIndex: number) => {
        const endringPåAktivtFelt = sortering?.felt === sorteringsfeltIndex;

        const felt = KandidatSorteringsfelt[KandidatSorteringsfelt[sorteringsfeltIndex]];
        const retning = endringPåAktivtFelt
            ? nesteSorteringsretning(sortering?.retning || null)
            : Retning.Stigende;

        setSortering({ felt, retning });
    };

    const aktivtSorteringsfelt = sortering?.felt ?? null;
    const aktivSorteringsretning = sortering?.retning ?? null;

    return (
        <div role="rowgroup" className={klassenavn}>
            <div role="row" className={klassenavnForListerad}>
                <div />
                <Checkbox
                    checked={alleMarkert}
                    disabled={kandidatliste.status === Kandidatlistestatus.Lukket}
                    onChange={() => onCheckAlleKandidater()}
                >
                    &#8203;
                </Checkbox>
                <SorterbarKolonneheader
                    tekst="Navn"
                    sorteringsfelt={KandidatSorteringsfelt.Navn}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Fødselsnr."
                    sorteringsfelt={KandidatSorteringsfelt.Fødselsnummer}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til av"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilAv}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst="Lagt til"
                    sorteringsfelt={KandidatSorteringsfelt.LagtTilTidspunkt}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <SorterbarKolonneheader
                    tekst={erKobletTilStilling(kandidatliste) ? 'Status/hendelser' : 'Status'}
                    sorteringsfelt={KandidatSorteringsfelt.StatusOgHendelser}
                    aktivtSorteringsfelt={aktivtSorteringsfelt}
                    aktivSorteringsretning={aktivSorteringsretning}
                    onClick={endreSortering}
                />
                <Kolonne tekst="Notater" />
                <Kolonne tekst="Info" className={css.kolonneMidtstilt} />
                {visArkiveringskolonne && (
                    <Kolonne tekst="Slett" className={css.kolonneHøyrestilt} />
                )}
            </div>
        </div>
    );
};

export default ListeHeader;
