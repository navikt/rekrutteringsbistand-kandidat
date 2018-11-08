#!/bin/sh

regex="app:arb|app:veil|app:arb,veil|app:veil:arb"
commitpath=".git/COMMIT_EDITMSG"
file=`cat ${commitpath}`

RED=$(tput setaf 1)
BLUE=$(tput setaf 4)
NORMAL=$(tput sgr0)

if ! [[ ${file} =~ $regex ]]; then
    echo "${RED}ERROR: Commit-meldingen må inneholde minst én av følgende strenger,"
    echo "avhengig av om commiten inneholder endringer i kandidatsøk for"
    echo "arbeidsgiver (arb) eller veileder (veil):"
    echo ""
    echo "${BLUE}    'app:arb' 'app:veil' 'app:arb,veil' ${RED}eller ${BLUE}'app:veil,arb'$RED"
    echo ""
    echo "Commit-meldingen var følgende:"
    echo ""
    echo "$(grep -v '^#' ${commitpath}) $NORMAL"
    exit 1
fi

exit 0
