# language: no

Egenskap: Finne kandidater basert på arbeidserfaring

  @erfaring
  Scenario: Søke etter kandidater basert på arbeidserfaring
    Gitt at jeg er logget inn i kandidatsøket som "10051400971"
    Når jeg legger til arbeidserfaring "Barnehagelærer"
    Så skal kandidatene ha arbeidserfaring som matcher "Barnehagelærer"
    Og antall treff skal minke
    Når jeg legger til arbeidserfaring "Butikkmedarbeider"
    Så skal antall treff øke
    Når jeg legger til "4-9 år" med arbeidserfaring
    Så skal antall treff minke
