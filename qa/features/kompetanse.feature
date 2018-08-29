# language: no

Egenskap: Finne kandidater basert på kompetanse

  Scenario: Søke etter kandidater basert på kompetanse
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til kompetanse "Førerkort"
    #Og jeg trykker Se kandidatene
    Så skal antall treff minke
    Når jeg legger til kompetanse "Ledelse"
    Så skal antall treff minke

  @janzz @kompetanse
  Scenario: Søke på kompetanse
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til kompetanse "Ledelse"
    Så skal antall treff øke