#!/bin/sh


: "${UPWD:?Du må sette \$UPWD til <brukernavn>:<passord>, f.eks e116053:SuperHemmeligPassord siden dette brukes i Basic Auth mot REST-tjenestene}"

APIURL=https://api-management.nais.adeo.no/rest

curl -v -XPUT -k -u "$UPWD" "$APIURL/v1/katalog/applikasjoner/pam-kandidatsok-api?eier=0000-GA-PAM&sone=TilbudtFraFss&kilde=fasit&miljo=t6"
curl -v -XPUT -k -u "$UPWD" "$APIURL/v1/katalog/applikasjoner/pam-kandidatsok-api?eier=0000-GA-PAM&sone=TilbudtFraFss&kilde=fasit&miljo=q6"
curl -v -XPUT -k -u "$UPWD" "$APIURL/v1/katalog/applikasjoner/pam-kandidatsok-api?eier=0000-GA-PAM&sone=TilbudtFraFss&kilde=fasit&miljo=q0"
curl -v -XPUT -k -u "$UPWD" "$APIURL/v1/katalog/applikasjoner/pam-kandidatsok-api?eier=0000-GA-PAM&sone=TilbudtFraFss&kilde=fasit&miljo=p"
curl -v -XPUT -k -u "$UPWD" -H "Content-type: application/json" "$APIURL/v1/katalog/applikasjoner/pam-kandidatsok-api/pam-kandidatsok-api/pam-kandidatsok"

curl -v -XPUT -k -u "$UPWD" -H "Content-type: application/json" \
  -d '{"gatewayEnv": "t6", "tilbyderEnv": "t6", "kommentar": ""}' \
  "$APIURL/v2/register/deploy/pam-kandidatsok-api"
curl -v -XPUT -k -u "$UPWD" -H "Content-type: application/json" \
  -d '{"gatewayEnv": "q6", "tilbyderEnv": "q6", "kommentar": ""}' \
  "$APIURL/v2/register/deploy/pam-kandidatsok-api"
curl -v -XPUT -k -u "$UPWD" -H "Content-type: application/json" \
  -d '{"gatewayEnv": "q0", "tilbyderEnv": "q0", "kommentar": ""}' \
  "$APIURL/v2/register/deploy/pam-kandidatsok-api"
curl -v -XPUT -k -u "$UPWD" -H "Content-type: application/json" \
  -d '{"gatewayEnv": "p", "tilbyderEnv": "p", "kommentar": ""}' \
  "$APIURL/v2/register/deploy/pam-kandidatsok-api"