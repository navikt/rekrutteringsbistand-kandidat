# language: no

Egenskap: Finne kandidater basert på førerkort

  @forerkort
  Scenario: Søke etter kandidater basert på førerkort
    Gitt at jeg er logget inn i kandidatsøket som "10051400971"
    Når jeg legger til førerkort "B - Personbil"
    Så skal antall treff minke
    Når jeg legger til førerkort "A - Tung motorsykkel"
    Så skal antall treff minke
