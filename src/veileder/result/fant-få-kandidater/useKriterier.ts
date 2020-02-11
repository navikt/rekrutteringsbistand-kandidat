import { useEffect, useState } from 'react';
import Kategori, { getKortKategoriLabel } from '../../sok/tilretteleggingsbehov/Kategori';

const storForbokstav = (kriterie: string) =>
    kriterie.length < 2 ? kriterie : kriterie[0].toUpperCase() + kriterie.substr(1);

export type Kriterie = {
    value: any;
    label: string;
    onRemove: any;
};

const useKriterier = (
    kategorier: Kategori[],
    tilretteleggingsbehov: boolean,
    onRemoveTilretteleggingsbehov: () => void,
    onRemoveKategori: (kategori: Kategori) => void
): Kriterie[] => {
    const [kriterier, setKriterier] = useState<Kriterie[]>([]);

    useEffect(() => {
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

        setKriterier([...tilretteleggingsbehovKriterier, ...kategoriKriterier]);
    }, [kategorier, tilretteleggingsbehov, onRemoveTilretteleggingsbehov, onRemoveKategori]);

    return kriterier;
};

export default useKriterier;
