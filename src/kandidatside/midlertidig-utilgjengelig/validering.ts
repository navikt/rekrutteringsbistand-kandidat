import moment, { MomentInput } from 'moment';

export const dagensDato = () => moment(new Date()).startOf('day');
export const minDatoMidlertidigUtilgjengelig = () => dagensDato();
export const maksDatoMidlertidigUtilgjengelig = () => dagensDato().add(30, 'days');
export const antallDagerMellom = (start: MomentInput, slutt: MomentInput) =>
    moment(slutt).diff(moment(start), 'days');

export const validerDatoOgReturnerFeilmelding = (dato) => {
    if (dato === undefined) {
        return 'Du må velge en dato';
    }
    if (!moment(dato).isValid()) {
        return 'Du må velge en gyldig dato (dd.mm.åååå)';
    }
    if (moment(dato).isBefore(minDatoMidlertidigUtilgjengelig(), 'days')) {
        return 'Du kan ikke velge en dato tilbake i tid';
    }
    if (moment(dato).isAfter(maksDatoMidlertidigUtilgjengelig(), 'days')) {
        return 'Du kan velge maks en måned fram i tid';
    }
};
