# Trust Flow

Build a polished, high-fidelity web prototype called PAYTRACE.

TAGLINE:

“Know where your money goes — before you pay.”

CORE IDEA:

PAYTRACE is NOT another payment app and NOT a fraud detector.

It is a trust and transparency layer shown before a user authorizes an unfamiliar or complex digital payment method such as Pay Later / BNPL.

Its purpose is to help users clearly understand:

- Who is providing the payment option

- How much they will actually pay

- What they pay today

- Future payment amounts and dates

- Any fees or inconsistencies

- What happens if they return the product

- What happens if they miss a payment

- What data is being requested

The core flow should feel:

VERIFY → UNDERSTAND → SIMULATE → DECIDE → RECORD

IMPORTANT:

Do not overbuild this prototype.

Prioritize these 4 features:

1. Provider Verification

2. Trust Replay

3. Trust Breaker

4. Trust Receipt

Other features can appear only as small secondary/future-scope elements.

--------------------------------------------------

DEMO SCENARIO

--------------------------------------------------

Create a realistic e-commerce checkout for headphones.

Product:

Premium Wireless Headphones

Price:

₹2,000

Payment methods:

○ UPI

○ Card

● Pay Later

For Pay Later show:

“Pay ₹500 today”

Underneath show:

Powered by PAYTRACE

“Preview before you pay”

Primary button:

[ Preview with PAYTRACE ]

The PAYTRACE experience should open as a premium full-screen panel/modal rather than navigating to a completely unrelated website.

--------------------------------------------------

SCREEN 1 — CHECKOUT

--------------------------------------------------

Create a clean modern checkout page.

Show:

- Product image placeholder

- Headphones

- ₹2,000

- Order summary

- UPI

- Card

- Pay Later

Pay Later should initially appear simple:

“₹500 today”

Then show a noticeable but elegant:

“Preview with PAYTRACE”

The goal is to demonstrate that the original checkout does not immediately explain the complete future payment journey.

--------------------------------------------------

SCREEN 2 — VERIFYING

--------------------------------------------------

After clicking Preview with PAYTRACE, show a short animated verification sequence.

Heading:

“Let’s check what you’re agreeing to.”

Animate these checks one by one:

✓ Provider identified

✓ Payment amount identified

✓ Future payments identified

✓ Fees checked

✓ Refund terms found

✓ Support information found

Provider:

XYZ Pay

Verification Status:

VERIFIED

Do NOT claim real RBI integration.

This is a demo provider registry.

Then automatically continue to Trust Replay.

--------------------------------------------------

SCREEN 3 — TRUST REPLAY

--------------------------------------------------

This is the HERO FEATURE.

Make this the most visually impressive screen.

Heading:

“See your transaction’s future.”

Show a beautiful vertical or horizontal animated timeline:

₹500

TODAY

↓

₹750

OCT 6

↓

₹750

NOV 6

Then prominently show:

TOTAL PAYABLE

₹2,000

Status:

CLEAR

Text:

“No critical issue detected.”

The UI should make this understandable within 3 seconds.

Under the timeline add three interactive scenario buttons:

[ What if I return it? ]

[ What if I miss a payment? ]

[ What happens to my data? ]

--------------------------------------------------

INTERACTION — WHAT IF I RETURN IT?

--------------------------------------------------

When clicked, animate a scenario flow:

RETURN REQUESTED

↓

MERCHANT PROCESSES RETURN

↓

REFUND INITIATED

↓

PAYMENT PLAN UPDATED

↓

FUTURE PAYMENTS REDUCED / CANCELLED

Add small text:

“Exact behaviour depends on the provider’s disclosed refund terms.”

Do not invent financial rules.

--------------------------------------------------

INTERACTION — WHAT IF I MISS A PAYMENT?

--------------------------------------------------

Show a simple warning card.

Heading:

“Missed payment scenario”

Display:

“Applicable consequences should be taken directly from the provider’s supplied terms.”

For the prototype use seeded/demo text such as:

“Payment may become overdue and the provider may contact you regarding repayment.”

Clearly label it:

DEMO TERMS

Do not make unsupported financial claims.

--------------------------------------------------

INTERACTION — WHAT HAPPENS TO MY DATA?

--------------------------------------------------

Create a simple Data Lens panel:

Phone Number

✓ Required

Purpose: Account verification

Transaction Data

✓ Required

Purpose: Payment processing

Location

⚠ Not required for this transaction

Keep this screen simple.

It is secondary to Trust Replay.

--------------------------------------------------

SCREEN 4 — TRUST BREAKER

--------------------------------------------------

Create a second demo transaction showing why PAYTRACE is useful.

This should feel dramatically different from the CLEAR state.

Checkout advertisement:

₹499/month

But PAYTRACE calculates:

TOTAL PAYABLE

₹1,650

Additional amount:

₹150

Show a strong warning:

PAUSE

“The headline price does not represent the complete payable amount.”

Then provide:

[ Review Details ]

[ Continue Anyway ]

This feature is called TRUST BREAKER.

PAYTRACE should not simply give users a green trust badge.

It should actively tell them when something materially does not add up.

Use statuses:

CLEAR 🟢

No critical issue detected

REVIEW 🟡

Something needs your attention

PAUSE 🔴

A material inconsistency or missing piece of information was found

Do NOT use a numeric “Trust Score” such as 87/100.

--------------------------------------------------

SCREEN 5 — DECISION

--------------------------------------------------

After reviewing the transaction allow:

[ Go Back ]

[ Continue with Payment ]

Before continuing, show a concise summary:

You pay today: ₹500

Future payments: ₹750 + ₹750

Total payable: ₹2,000

Provider: XYZ Pay

Fees disclosed: Yes

Refund information: Available

Keep this very easy to scan.

--------------------------------------------------

SCREEN 6 — TRUST RECEIPT

--------------------------------------------------

After Continue, show:

✓ Payment Authorized

Then animate:

“Trust Receipt Created”

Display a professional digital receipt:

PAYTRACE TRUST RECEIPT

Transaction

#PT-84932

Purchase

₹2,000

Paid Today

₹500

Future Payments

₹750 — Oct 6

₹750 — Nov 6

Total Payable

₹2,000

Provider

XYZ Pay

Fees Disclosed

✓

Refund Information

✓

Support Information

✓

Trust Status

CLEAR

User Authorization

14:32:21

Add:

“This is an auditable record of what was presented to the user at the point of decision.”

Buttons:

[ Download Receipt ]

[ Done ]

The Download button can simply generate or simulate a downloadable receipt in the prototype.

--------------------------------------------------

OPTIONAL FINAL SCREEN — INTELLIGENCE DASHBOARD

--------------------------------------------------

Only build this after the main consumer flow looks excellent.

This is a secondary screen accessible through a small navigation item called:

“Intelligence”

Use SEEDED DEMO DATA only.

PAYTRACE INTELLIGENCE

Transactions Analysed

2.4M

CLEAR

89%

REVIEW

8%

PAUSE

3%

Top Issues:

Cost Transparency

41,203 cases

Refund Clarity

18,920 cases

Provider Identity

12,201 cases

Include one or two clean charts.

Add:

“Aggregated demo signals — no individual financial information displayed.”

This represents a long-term regulator / ecosystem vision, not the main product.

--------------------------------------------------

VISUAL DESIGN

--------------------------------------------------

The product should look like a serious fintech startup, not a student project.

Style:

- Premium fintech

- Minimal

- Clean

- Trustworthy

- Modern SaaS aesthetic

- Lots of whitespace

- Strong typography

- Soft shadows

- Rounded cards

- Smooth micro-animations

- High-quality transitions

- Mobile responsive

Avoid:

- Excessive gradients

- Cartoonish illustrations

- Generic AI-looking designs

- Too much text on one screen

- Overuse of glowing effects

- Crypto-style design

- Fake security badges

Use a light neutral background with dark text.

Use green only for CLEAR / successful verification.

Use amber/yellow for REVIEW.

Use red carefully for PAUSE / Trust Breaker.

PAYTRACE branding should feel professional and neutral.

--------------------------------------------------

UX PRINCIPLES

--------------------------------------------------

The user should understand the transaction within seconds.

Do not dump terms and conditions onto the screen.

Convert information into:

- Timelines

- Cards

- Status indicators

- Short explanations

- Scenario simulations

The experience should repeatedly communicate:

“Here’s exactly what will happen. Now you decide.”

PAYTRACE should NEVER claim:

“This payment is safe.”

Instead say things such as:

“No critical issue detected.”

“Something needs your attention.”

“Review this before paying.”

--------------------------------------------------

TECHNICAL BEHAVIOUR

--------------------------------------------------

This is a working prototype, not a static landing page.

Implement:

- Functional navigation

- Interactive payment-method selection

- Preview with PAYTRACE button

- Verification animation

- Animated Trust Replay

- Interactive scenario buttons

- CLEAR / REVIEW / PAUSE states

- Trust Breaker demo

- Trust Receipt generation

- Responsive design

Use seeded/local demo data.

No real:

- Banking integration

- Payment processing

- KYC

- Credit underwriting

- RBI API

- Real financial provider verification

Structure the code cleanly so that a backend/API could later replace the seeded data.

--------------------------------------------------

MOST IMPORTANT DEMO JOURNEY

--------------------------------------------------

The final working flow must be:

CHECKOUT

↓

PAY LATER

↓

PREVIEW WITH PAYTRACE

↓

VERIFY PROVIDER + PAYMENT TERMS

↓

TRUST REPLAY

↓

SEE ₹500 → ₹750 → ₹750

↓

TOTAL ₹2,000

↓

SIMULATE RETURN / MISSED PAYMENT / DATA

↓

TRUST BREAKER IF SOMETHING DOESN’T ADD UP

↓

USER DECIDES

↓

TRUST RECEIPT

The hero moment of the entire prototype should be TRUST REPLAY.

The second strongest moment should be TRUST BREAKER.

Prioritize making those two screens exceptional before adding any other feature.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pay-path-clarity.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/528230b7-a74c-4109-abde-b816f5c53f0c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
