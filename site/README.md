# Bellora: landingspagina

Sign-up- en landingspagina voor **Bellora Honey**, een fictief parfummerk voor de periodeopdracht Creative Automation (Digital Design, Arteveldehogeschool). Gebouwd in code met Claude Code ("vibe coded") en gepubliceerd via GitHub Pages.

## Secties
| Sectie | Inhoud |
|---|---|
| Hero | Kop "Zoet. Luid. Van jou.", festivalfoto, CTA naar het formulier |
| Verhaal | Merkverhaal, geurnoten (kop, hart, basis) en een video |
| Eén spray, de hele nacht | Drie momenten van een avond (20:00, 23:30, 03:00) met foto's |
| Inschrijven | Ingebed MailerLite-formulier: voornaam, e-mail, opt-in |

## Bestanden
```
index.html          de pagina
privacy.html        privacyverklaring (gelinkt vanuit de opt-in)
assets/css/style.css
assets/js/main.js   video-knop + formulier (validatie en verzending naar MailerLite)
assets/img/         foto's, bewegingsonscherpe hero-versies en videoposter (AI-gegenereerd)
assets/video/       1 korte video (H.264, zonder geluid)
```

## Merk en stijl
Gebaseerd op vier referenties (Rough, Obsidia, BC Trail, Boxbet), vertaald naar Bellora.
- Kleuren: nachtzwart `#0E0D0C`, wit `#FFFFFF` en honinggeel `#F6D86B` als accent (in de plaats van het oranje uit de referentie), met goud `#998648` (hoofdkleur `hsl(46, 36%, 44%)`)
- Woordmerk "Bellora": het handschrift van het etiket, gevectoriseerd uit `Honey — refined one-color 90×40 mm.png` (OpenCV-contouren) naar `assets/img/bellora-wordmark.svg` en inline-symbool `#wordmark`; gebruikt in topbar, hero (goudverloop), merkpalet en footer
- Fonts: **Fraunces** voor koppen (luxe schreef met hoog contrast; de SOFT-as staat op 100 voor zachte, zoete rondingen; cursief voor de vervagende tekst) en **Jost** voor tekst, knoppen en labels (elegante geometrische schreefloze letter, labels in kapitalen met ruime spatiëring en een geel vierkant bolletje). Beide via Google Fonts, open licentie (OFL)
- Hero zoals Obsidia: festivalfoto met bewegingsonscherpte rond een scherpe fles, gigantisch woordmerk "Bellora"
- Bento-kaarten zoals Rough/Obsidia: video, witte verhaalkaart, prijs met vervagende cijfers, geurpiramide en merkpalet met hex-chips
- Lichte sectie met gespreide kaarten en pijlknoppen zoals BC Trail
- Glazen inschrijfkaart met gele knop zoals Boxbet

## Scroll-effecten
Gebouwd zonder bibliotheken: één scroll-lus in `main.js` geeft elk element met `data-scroll` een voortgangswaarde `--p` (0 tot 1), en de CSS vertaalt die waarde naar beweging.

| Plaats | Effect |
|---|---|
| Hele pagina | Gele voortgangsbalk bovenaan; topbar wordt glas; actieve sectie licht op in de navigatie |
| Hero | Woordmerk groeit en schuift weg, achtergrond zoomt in en wordt donker, tekst vervaagt |
| Statement | De zin licht woord per woord op tijdens het scrollen; honing, jasmijn, amber en duur kleuren geel |
| Bento | Kaarten kantelen in 3D recht terwijl ze binnenkomen; video zoomt uit; prijs telt op van €0 naar €19,99 |
| Marquee | Twee rijen grote tekst schuiven in tegengestelde richting mee met het scrollen |
| De nacht | Sectie blijft vastgepind terwijl de kaarten horizontaal voorbij schuiven; tijdbalk 20:00 tot 03:00 loopt mee; foto's bewegen binnen hun kader; pijlknoppen springen naar het volgende moment |
| Inschrijven | Kaart opent als een groeiende cirkel; fles zweeft en beweegt mee |
| Footer | Letters van "Bellora" rijzen een voor een op |

Daarnaast: laadanimatie van de hero, muisvolgende lichtranden op kaarten en hero-beeld dat de cursor volgt.
Op mobiel (onder 1000 px) wordt de vastgepinde tijdlijn een swipebare rij. Met "minder beweging" in het systeem staat alles stil en is alle tekst meteen leesbaar.

## Beelden
`bellora-hero-blur.jpg`, `bellora-hero-blur-m.jpg` en `bellora-confetti-blur.jpg` zijn met een Python-script (Pillow + NumPy) gemaakt uit de AI-productbeelden: horizontale bewegingsonscherpte met een scherpe zone rond de fles.

## Formulier en GDPR
- Het formulier verstuurt naar het MailerLite-formulier "Bellora – Landingspagina sign-up" (groep *newsletter*).
- Dubbele opt-in staat aan in MailerLite: inschrijvers bevestigen via e-mail.
- Het opt-in-vakje staat standaard uit en is verplicht; het linkt naar `privacy.html`.
- Test enkel met fictieve gegevens.

## Lokaal bekijken
Open `index.html` in je browser. Het formulier werkt pas echt zodra de pagina online staat.

## Publiceren op GitHub Pages
1. Maak een publieke repository (bv. `bellora`) en zet de inhoud van deze map in de hoofdmap.
2. Ga naar **Settings → Pages**, kies **Deploy from a branch**, branch `main`, map `/ (root)`.
3. Na een minuut staat de site op `https://<gebruikersnaam>.github.io/bellora/`.
