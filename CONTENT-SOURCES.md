# Content and asset provenance

Reviewed 27 September 2026.

## Source of truth

- https://kh.tm.org/ — practice overview, seated twice-daily practice, nonreligious nature, foundation identity, introductory sessions, and links to original personal stories.
- https://kh.tm.org/transcendental-meditation-contact — Cambodia TM Centre, telephone **010 980 840**, contact **Mok Samen**, and Phnom Penh teacher information. Availability is not represented as a confirmed appointment.
- https://kh.tm.org/legal-details — organization name and trademark attribution. Linked directly in the footer.
- https://kh.tm.org/privacy-policy — existing privacy policy. Linked directly; the current source contains legacy Australian references requiring foundation review.
- https://kh.tm.org/reduce-anxiety
- https://kh.tm.org/meditate-for-creativity
- https://kh.tm.org/lower-blood-pressure
- https://kh.tm.org/reduce-stress
- https://kh.tm.org/benefits-of-meditation

Some legacy benefits pages intermittently time out. The frontend links to the official source destinations and avoids presenting precise medical outcomes or statistics as promises.

## Design reference

https://tm.org.au/ informed the spacious editorial layout, navigation grouping, two starting points, benefit cards, personal stories, and accessible question-and-answer flow. No Australia-specific operational information was copied.

## Local assets

| File                         | Original URL                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `public/images/hero.jpg`     | https://kh.tm.org/documents/2976864/0/main+banner-duncan+mfa-3.jpg                                               |
| `public/images/practice.jpg` | https://kh.tm.org/documents/2976864/25679669/TM-Home-02_1000x500.jpg                                             |
| `public/images/cameron.jpg`  | https://kh.tm.org/documents/2976864/25679669/CDiaz_520x520+%281%29.jpg/                                          |
| `public/images/paul.png`     | https://kh.tm.org/documents/2976864/25679669/Paul-McCartney_151x151.png/4f8e5892-45ea-4dad-a319-be46dd35a512     |
| `public/images/samen.jpg`    | https://kh.tm.org/documents/2976864/25679641/Mok-Samen-profile_1000x500.jpg/c3753f8b-983c-4d1a-80ba-4a9b7556a51e |
| `public/images/tm-logo.png`  | https://resources.tm.org/logos/TM_logo-58-en-r.png                                                               |

The logo emblem is displayed through a CSS crop; the original file is preserved. The photographs and logo remain the property of their respective rights holders. They are reused here for the requested redesign of the Cambodia site, not asserted to be freely licensed stock.

The original Cambodia site links to Cameron Diaz's video at https://player.vimeo.com/video/259069130. The redesign links to the same video with autoplay disabled and identifies its English audio in both languages.

Khmer copy was drafted for this implementation and should receive native editorial review before release. Existing proper names and trademarks are preserved where appropriate.

## Multi-page demo additions

The expanded application uses illustrative November 2026 course dates, USD/KHR prices, capacities and a clearly labeled Siem Reap sample venue. These are not verified offers. Phnom Penh visits remain by appointment rather than inventing a street address. Confirm actual information with the foundation before publication.

Khmer typography uses self-hosted Kantumruy Pro through `next/font/google`, as requested. Existing English typography is retained.

The legal pages describe the demo implementation and require operator review before live use. The payment QR contains non-payment demonstration text; card entry is never requested. No merchant relationship, live payment capability, or real registration confirmation is implied by a demo outcome.
