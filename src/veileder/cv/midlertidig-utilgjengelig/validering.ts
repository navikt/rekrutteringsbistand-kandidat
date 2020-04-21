import moment from 'moment';

export const minDatoMidlertidigUtilgjengelig = () => moment(new Date());
export const maksDatoMidlertidigUtilgjengelig = () => moment(moment(new Date()).add(30, 'days'));

export const validerDatoOgReturnerFeilmelding = (dato) => {
    if (dato === undefined) {
        return 'Du må velge en dato';
    }
    if (!moment(dato).isValid()) {
        return 'Du må velge en gyldig dato';
    }
    if (moment(dato).isBefore(minDatoMidlertidigUtilgjengelig(), 'days')) {
        return 'Du kan ikke velge en dato tilbake i tid';
    }
    if (moment(dato).isAfter(maksDatoMidlertidigUtilgjengelig(), 'days')) {
        return 'Du kan velge maks en måned fram i tid';
    }
};
