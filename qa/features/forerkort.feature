# language: no

Egenskap: Finne kandidater basert på førerkort

  @forerkort @elastic @janzz
  Scenario: Søke etter kandidater basert på førerkort
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til førerkort "Førerkort: Kl. B"
    Så skal antall treff minke
    Når jeg legger til førerkort "Førerkort: Kl. A"
    Så skal antall treff minke
