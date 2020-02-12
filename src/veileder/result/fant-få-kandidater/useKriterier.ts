import { useEffect, useState } from 'react';
import Kategori, { getKortKategoriLabel } from '../../sok/tilretteleggingsbehov/Kategori';
import { Geografi } from './FantFåKandidater';

const storForbokstav = (kriterie: string) =>
    kriterie.length < 2 ? kriterie : kriterie[0].toUpperCase() + kriterie.substr(1);

export type Kriterie = {
    value: any;
    label: string;
    onRemove: any;
};

const useKriterier = (
    stillinger: string[],
    geografi: Geografi[],
    kategorier: Kategori[],
    tilretteleggingsbehov: boolean,
    onRemoveStillingEllerYrke: (stilling: string) => void,
    onRemoveGeografi: (geografi: Geografi) => void,
    onRemoveTilretteleggingsbehov: () => void,
    onRemoveKategori: (kategori: Kategori) => void
): [Kriterie[], Kriterie[]] => {
    const [kriterier, setKriterier] = useState<Kriterie[]>([]);
    const [kriterierInnenTilretteleggingsbehov, setKriterierInnenTilretteleggingsbehov] = useState<
        Kriterie[]
    >([]);

    useEffect(() => {
        const stillingKriterier = stillinger.map(stilling => ({
            value: stilling,
            label: stilling,
            onRemove: onRemoveStillingEllerYrke,
        }));

        const geografiKriterier = geografi.map(geografi => ({
            value: geografi.geografiKode,
            label: geografi.geografiKodeTekst,
            onRemove: onRemoveGeografi,
        }));

        const tilretteleggingsbehovKriterier = tilretteleggingsbehov
            ? [
                  {
                      value: tilretteleggingsbehov,
                      label: storForbokstav('tilretteleggingsbehov'),
                      onRemove: onRemoveTilretteleggingsbehov,
                  },
              ]
            : [];

        const kategoriKriterier = kategorier.map(kategori => ({
            value: kategori,
            label: getKortKategoriLabel(kategori),
            onRemove: onRemoveKategori,
        }));

        setKriterier([
            ...stillingKriterier,
            ...geografiKriterier,
            ...tilretteleggingsbehovKriterier,
        ]);

        setKriterierInnenTilretteleggingsbehov([...kategoriKriterier]);
    }, [
        stillinger,
        geografi,
        kategorier,
        tilretteleggingsbehov,
        onRemoveStillingEllerYrke,
        onRemoveGeografi,
        onRemoveTilretteleggingsbehov,
        onRemoveKategori,
    ]);

    return [kriterier, kriterierInnenTilretteleggingsbehov];
};

export default useKriterier;
