import { KanSletteEnum } from '../kandidatlister/Kandidatlister';

export const kandidatliste = {
    kandidatlisteId: 'bf6877fa-5c82-4610-8cf7-ff7a0df18e29',
    tittel: 'Tulleskolen søker tøysekopper',
    beskrivelse:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    organisasjonReferanse: '976434099',
    organisasjonNavn: 'TULLEKONTORET AS',
    stillingId: 'ce3da214-8771-4115-9362-b83145150551',
    opprettetAv: {
        ident: 'Z992777',
        navn: 'F_Z992776 E_Z992776',
    },
    opprettetTidspunkt: '2019-11-18T11:40:34.732',
    kandidater: [
        {
            kandidatId: 'a3933da3-468a-45ad-a2ee-6f4db1779c30',
            kandidatnr: 'DC294105',
            sisteArbeidserfaring: 'Butikkinnehaver (liten butikk)',
            status: 'VURDERES',
            lagtTilTidspunkt: '2019-11-25T14:23:22.856',
            lagtTilAv: {
                ident: 'Z990315',
                navn: 'F_Z990315 E_Z990315',
            },
            fornavn: 'Ola',
            etternavn: 'Nordmann',
            fodselsdato: '2019-09-16',
            fodselsnr: '17118926005',
            utfall: 'IKKE_PRESENTERT',
            telefon: '(+47) 123456789',
            epost: 'spammenot@mailinator.com',
            innsatsgruppe: 'Situasjonsbestemt innsats',
            arkivert: false,
            antallNotater: 1,
            arkivertTidspunkt: null,
            arkivertAv: null,
            aktørid: '111',
            midlertidigUtilgjengeligStatus: 'tilgjengeliginnen1uke',
        },
        {
            kandidatId: '839dd75b-49fd-4aa3-8511-ce677432bd65',
            kandidatnr: 'CD430805',
            sisteArbeidserfaring: 'Anleggsmaskinfører/Grunnarbeider lærling',
            status: 'VURDERES',
            lagtTilTidspunkt: '2019-11-21T08:28:44.821',
            lagtTilAv: {
                ident: 'Z992776',
                navn: 'F_Z992776 E_Z992776',
            },
            fornavn: 'aasmund',
            etternavn: 'nordstoga',
            fodselsdato: '2019-01-09',
            fodselsnr: '21067630103',
            utfall: 'IKKE_PRESENTERT',
            telefon: '91333532',
            epost: 'anostoga@gmail.com',
            innsatsgruppe: 'Varig tilpasset innsats',
            arkivert: false,
            antallNotater: 1,
            arkivertTidspunkt: null,
            arkivertAv: null,
            aktørid: '1000031078958',
            midlertidigUtilgjengeligStatus: 'midlertidigutilgjengelig',
        },
    ],
    kanEditere: true,
    kanSlette: KanSletteEnum.KAN_SLETTES,
};

const kandidatliste2 = {
    ...kandidatliste,
    kandidatlisteId: 'bf6877fa-5c82-4610-8cf7-ff7a0df18eas',
    tittel: 'Tulleskolen søker tøysekopper 2',
    kanEditere: false,
    kanSlette: KanSletteEnum.KAN_SLETTES,
};

const kandidatliste3 = {
    ...kandidatliste,
    kandidatlisteId: 'bf6877fa-5a82-4610-8cf7-ff7a0df18eas',
    stillingId: undefined,
    tittel: 'Jobbmesse 2090',
    kanEditere: false,
    kanSlette: KanSletteEnum.ER_IKKE_DIN,
};

export const kandidatlister = [kandidatliste, kandidatliste2, kandidatliste3];
