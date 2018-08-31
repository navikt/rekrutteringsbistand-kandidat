# language: no

Egenskap: Finne kandidater basert på arbeidserfaring

  Scenario: Søke etter kandidater basert på arbeidserfaring
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til arbeidserfaring "Barnehagelærer"
    #Og jeg trykker Se kandidatene
    Så skal kandidatene ha arbeidserfaring som matcher "Barnehagelærer"
    Og antall treff skal minke
    Når jeg legger til arbeidserfaring "Førskolelærer"
    Så skal antall treff minke
    Når jeg legger til "4-9 år" med arbeidserfaring
    Så skal antall treff minke
    Og kandidatene skal ha år med arbeidserfaring som matcher "4-9 år"

  @janzz @erfaring
  Scenario: Søke på arbeidserfaring
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg legger til arbeidserfaring "Barnehagelærer"
    Så skal antall treff øke