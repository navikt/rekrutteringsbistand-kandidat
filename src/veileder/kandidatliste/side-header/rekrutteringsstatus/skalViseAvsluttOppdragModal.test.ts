import { skalViseModal } from './skalViseAvsluttOppdragModal';
import { Kandidatlistestatus } from '../../kandidatlistetyper';

describe('Nudging av lukking av kandidatliste', () => {
    test('Skal vise modal hvis alle stillinger er besatte og du eier kandidatlisten', () => {
        expect(skalViseModal(Kandidatlistestatus.Åpen, 7, 7, true, false)).toBe(true);
    });

    test('Skal ikke vise modal hvis kandidatlisten allerede er lukket', () => {
        expect(skalViseModal(Kandidatlistestatus.Lukket, 7, 7, true, false)).toBe(false);
    });

    test('Skal ikke vise modal hvis ikke alle stillingene er besatt', () => {
        expect(skalViseModal(Kandidatlistestatus.Åpen, 7, 6, true, false)).toBe(false);
    });

    test('Skalikke vise modal hvis man ikke er eier av kandidatlisten', () => {
        expect(skalViseModal(Kandidatlistestatus.Åpen, 7, 7, false, false)).toBe(false);
    });

    test('Skal ikke vise modal hvis antall stillinger og oppdrag er 0', () => {
        expect(skalViseModal(Kandidatlistestatus.Åpen, 0, 0, true, false)).toBe(false);
    });

    test('Skal ikke vise modal hvis det ikke er stilling tilknyttet', () => {
        expect(skalViseModal(Kandidatlistestatus.Åpen, null, 0, true, false)).toBe(false);
    });

    test('Skal ikke vise modal hvis det ikke er stilling tilknyttet, og det er personer som har fått jobb', () => {
        expect(skalViseModal(Kandidatlistestatus.Åpen, null, 7, true, false)).toBe(false);
    });

    test('Skal ikke vise modal hvis veileder har lukket den tidligere', () => {
        expect(skalViseModal(Kandidatlistestatus.Åpen, 7, 7, true, true)).toBe(false); // TODO Are: Tallet kan være hva som helst, skal blir boolean?
    });
});
