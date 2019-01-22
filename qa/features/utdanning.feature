# language: no

Egenskap: Finne kandidater basert på utdanningsnivå og fagfelt

  Bakgrunn: Logge inn
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"

  @utdanning @utdanningsnivå @elastic @janzz
  Scenario: Søke etter kandidater basert på utdanningsnivå
    Når jeg legger til utdanning "Bachelorgrad"
    Så skal antall treff minke
    Når jeg legger til utdanning "Mastergrad"
    Så skal antall treff øke

  @utdanning @fagfelt @elastic @janzz @ignore
  Scenario: Søke etter kandidater basert på fagfelt
    Når jeg legger til fagfelt "Pedagogikk"
    Så skal antall treff minke
    Når jeg legger til fagfelt "Undervisning"
    Så skal antall treff minke
