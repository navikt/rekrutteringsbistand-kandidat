# language: no

Egenskap: Finne kandidater basert på geografi

  @geografi @elastic
  Scenario: Søke etter kandidater basert på geografi
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Og jeg legger til sted "Oslo"
    Så skal antall treff minke
    Når jeg legger til sted "Akershus"
    Så skal antall treff øke

  @geografi-janzz @janzz
  Scenario: Søke etter kandidater basert på geografi
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til stillingen "Kokk"
    Og jeg legger til sted "Oslo"
    Så skal antall treff minke
    Når jeg legger til sted "Akershus"
    Så skal antall treff øke
