# language: no

Egenskap: Finne kandidater basert på kompetanse

  @kompetanse
  Scenario: Søke etter kandidater basert på kompetanse
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til kompetanse "Excel"
    Så skal antall treff minke
    Når jeg legger til kompetanse "Ledelse"
    Så skal antall treff minke