import { Kandidat } from '../domene/Kandidat';

const useSlettedeKandidater = (kandidater: Kandidat[]) => {
    return kandidater.filter((kandidat) => kandidat.arkivert === true);
};

export default useSlettedeKandidater;
