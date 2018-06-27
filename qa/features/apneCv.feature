# language: no

Egenskap: Åpne CVen til en kandidat

  Scenario: Åpne CVen til den første kandidaten
    Gitt at jeg er logget inn i kandidatsøket som "08044601975"
    Når jeg trykker Se kandidatene
    Og jeg åpner CVen til den første kandidaten
    Så skal hele CVen vises
