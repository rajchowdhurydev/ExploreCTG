# Explore Chattogram

<!-- This README describes the static Explore Chattogram travel-planning application and its deliberately backend-free architecture. -->

Explore Chattogram is a plain HTML, CSS, and JavaScript travel planner for selected destinations in Chattogram Division, Bangladesh.

## Local-first design

<!-- This section explains why browser storage and local data files are used: the project has no server or external API dependency. -->

- HTML5 structures the pages.
- CSS3 provides the responsive interface.
- Vanilla JavaScript renders data and manages interactions.
- JSON files hold mock destination and guide data.
- Browser localStorage holds demo accounts, the active session, saved itineraries, and budget estimates.

## Planned pages

<!-- This list maps the core user journeys to the page files that will implement them. -->

- Destination discovery and detailed local travel guidance.
- Tourist-guide search and browser-only hire requests.
- Traveler, guide, and admin registration roles.
- Budget estimation and itinerary creation.
- Traveler and guide dashboards.

## Running the project

<!-- A local static server is recommended because browsers can restrict JSON fetch requests from a directly opened file URL. -->

Serve this folder with any static server, then open the served index.html page. For example, VS Code Live Server works without installing project dependencies.

## Data disclaimer

<!-- Travel conditions and prices change. This clarifies that locally mocked planning data must be verified before a real trip. -->

Transport routes reflect common Bangladesh travel patterns. Fares, schedules, property availability, and local travel rules are planning estimates, not live quotations. Image links are realistic Unsplash placeholders.
