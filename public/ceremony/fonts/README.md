# Ceremony webfonts

Self-hosted Google Fonts builds, downloaded 2026-11-17. The files are unmodified WOFF2 responses from `fonts.gstatic.com`. Each style includes Latin and Vietnamese subsets; the combined font payload is 168,416 bytes. Browsers request only the faces/glyph subsets needed by the page.

- **Be Vietnam Pro v12**: normal 400, 500, 600, 900. [Original project](https://github.com/bettergui/BeVietnamPro), [Google Fonts metadata](https://github.com/google/fonts/tree/main/ofl/bevietnampro). License: `BeVietnamPro-OFL.txt`.
- **Lora v37**: normal variable 400–600 and true italic variable 400–500. [Original project](https://github.com/cyrealtype/Lora-Cyrillic), [Google Fonts metadata](https://github.com/google/fonts/tree/main/ofl/lora). License: `Lora-OFL.txt`.

The CSS2 source request used `family=Be+Vietnam+Pro:wght@400;500;600;900&family=Lora:ital,wght@0,400..600;1,400..500&display=swap`. Subset Unicode ranges are preserved in `src/modules/ceremony/styles/typography.css`. Keep the supplied OFL licenses with redistributed fonts. No Google Fonts request is needed at runtime.
