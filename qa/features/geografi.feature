# language: no

Egenskap: Finne kandidater basert på geografi

  Scenario: Søke etter kandidater basert på geografi
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til sted "Oslo"
    #Og jeg trykker Se kandidatene
    Så skal antall treff minke
    Når jeg legger til sted "Akershus"
    Så skal antall treff minke

  @ignore @janzz @geografi
  Scenario: Søke på geografi
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til sted "Oslo"
    Så skal antall treff øke