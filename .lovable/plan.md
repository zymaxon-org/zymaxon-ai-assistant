

# Jennymoore Event Supplies — PDF & PPTX Business Proposal

## Overview
Generate two downloadable artifacts from the provided business proposal content:
1. **PDF Document** — A formal, multi-page business proposal writeup (reportlab)
2. **PPTX Slide Deck** — A 10-12 slide investor pitch presentation (pptxgenjs)

Both use a **Professional & Corporate** style with a navy/gold color palette.

## Design Direction

```text
Color Palette:
  Primary:    #1E2761 (navy)
  Secondary:  #CADCFC (ice blue)
  Accent:     #C9A84C (gold)
  Text:       #1A1A2E (near-black)
  Background: #FFFFFF (white)
  Muted:      #6B7280 (gray)
```

Font pairing: Georgia (headings) + Calibri (body) for PPTX. Helvetica/Times for PDF (reportlab built-ins).

## PDF Document (reportlab)
~8-10 pages covering all sections from the proposal:
- Cover page (business name, tagline, date, "Confidential")
- Table of Contents
- Executive Summary
- Business Description (product categories)
- Business Goals & Market Opportunity
- Target Market
- Business Model & Revenue Streams
- Marketing Strategy
- Capital Requirement & Fund Allocation (table)
- Revenue & Profit Projections (tables)
- Investment Offer (with example calculation)
- Contact & Social Media
- Conclusion

Professional formatting: section headers in navy, gold accent lines, clean tables, proper margins.

## PPTX Slide Deck (pptxgenjs)
10-12 slides:
1. **Title** — Jennymoore Event Supplies, tagline, date
2. **Executive Summary** — Key points with icon-style layout
3. **Business Description** — 4 product categories in a 2x2 grid
4. **Market Opportunity** — Key growth drivers
5. **Target Market** — Customer segments
6. **Business Model** — Revenue streams
7. **Marketing Strategy** — Digital channels + collaborations
8. **Capital Requirement** — ₦6M breakdown (table or bar visual)
9. **Revenue & Profit Projections** — Key numbers as large stat callouts
10. **Investment Offer** — 2% monthly return, example ROI calculation
11. **Contact & Social Media** — All handles and phone
12. **Thank You / Conclusion**

Dark navy title + conclusion slides, white content slides, gold accents. No accent lines under titles.

## Process
1. Copy skill scripts (lovable_ai.py not needed — pure data formatting)
2. Generate PDF with reportlab → QA with pdftoppm
3. Generate PPTX with pptxgenjs → QA with LibreOffice conversion
4. Deliver both to `/mnt/documents/`

## Output Files
- `/mnt/documents/Jennymoore_Business_Proposal.pdf`
- `/mnt/documents/Jennymoore_Business_Proposal.pptx`

