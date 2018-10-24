# language: no

Egenskap: Finne kandidater basert på arbeidserfaring

  @erfaring @elastic @janzz
  Scenario: Søke etter kandidater basert på arbeidserfaring
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til arbeidserfaring "Barnehagelærer"
    Så skal kandidatene ha arbeidserfaring som matcher "Barnehagelærer"
    Og antall treff skal minke
    Når jeg legger til arbeidserfaring "Førskolelærer"
    Så skal antall treff minke
    Når jeg legger til "4-9 år" med arbeidserfaring
    Så skal antall treff minke
