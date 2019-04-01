# language: no

Egenskap: Finne kandidater basert på geografi

  @geografi
  Scenario: Søke etter kandidater basert på geografi
    Gitt at jeg er logget inn i kandidatsøket som "10051400971"
    Og jeg legger til sted "Oslo"
    Så skal antall treff minke
    Når jeg legger til sted "Akershus"
    Så skal antall treff øke
