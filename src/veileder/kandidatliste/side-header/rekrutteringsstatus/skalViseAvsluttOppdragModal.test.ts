import { skalViseModal } from './skalViseAvsluttOppdragModal';

describe('Nudging av lukking av kandidatliste', () => {
    test('Skal vise modal hvis alle stillinger er besatte og du eier kandidatlisten', () => {
        expect(skalViseModal('ÅPEN', 7, 7, true, undefined)).toBe(true);
    });
    test('Skal vise modal hvis antall stillinger var lavere når den sist ble lukket', () => {
        expect(skalViseModal('ÅPEN', 7, 7, true, 6)).toBe(true);
    });

    test('Skal ikke vise modal hvis kandidatlisten allerede er lukket', () => {
        expect(skalViseModal('LUKKET', 7, 7, true, undefined)).toBe(false);
    });

    test('Skal ikke vise modal hvis ikke alle stillingene er besatt', () => {
        expect(skalViseModal('ÅPEN', 7, 6, true, undefined)).toBe(false);
    });

    test('skal ikke vise modal hvis man ikke er eier av kandidatlisten', () => {
        expect(skalViseModal('ÅPEN', 7, 7, false, undefined)).toBe(false);
    });

    test('skal ikke vise modal hvis antall stillinger og oppdrag er 0', () => {
        expect(skalViseModal('ÅPEN', 0, 0, true, undefined)).toBe(false);
    });

    test('skal ikke vise modal hvis det ikke er stilling tilknyttet', () => {
        expect(skalViseModal('ÅPEN', null, 0, true, undefined)).toBe(false);
    });

    test('skal ikke vise modal hvis det ikke er stilling tilknyttet, og det er personer som har fått jobb', () => {
        expect(skalViseModal('ÅPEN', null, 7, true, undefined)).toBe(false);
    });

    test('skal ikke vise modal hvis veileder har lukket den tidligere, og den ikke trigges av endringer', () => {
        expect(skalViseModal('ÅPEN', 7, 7, true, 7)).toBe(false);
    });
});
