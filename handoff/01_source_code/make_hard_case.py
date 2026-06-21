"""
Hard Case: 8 Planted Mismatches — L/C Discrepancy Set
This is designed to show exactly what AI catches that humans miss
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer)
from reportlab.lib.enums import TA_CENTER, TA_RIGHT

OUT = "/home/claude/docs"
NAVY=colors.HexColor("#003366"); BLUE=colors.HexColor("#0066CC")
RED=colors.HexColor("#CC0000"); AMBER=colors.HexColor("#CC7700")
GREEN=colors.HexColor("#006633"); GRAY=colors.HexColor("#555555")
LGRAY=colors.HexColor("#F4F4F4"); MGRAY=colors.HexColor("#CCCCCC")
WHITE=colors.white; BLACK=colors.black

def pb(c,d):
    c.saveState(); c.setStrokeColor(RED); c.setLineWidth(1)
    c.rect(10*mm,10*mm,A4[0]-20*mm,A4[1]-20*mm)
    c.setFont("Helvetica-Bold",7); c.setFillColor(RED)
    c.drawString(12*mm,12*mm,"⚠ EDUCATIONAL SAMPLE — CONTAINS INTENTIONAL DISCREPANCIES FOR TRAINING PURPOSES")
    c.restoreState()

# ── B1: Invoice with discrepancies ────────────────────────────────────────────
def make_B1():
    fn=f"{OUT}/B1_HardCase_Invoice_INV-2026-LC-099.pdf"
    doc=SimpleDocTemplate(fn,pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,topMargin=20*mm,bottomMargin=18*mm)
    nor=ParagraphStyle("n",fontName="Helvetica",fontSize=8.5,leading=13)
    hdr=ParagraphStyle("h",fontName="Helvetica-Bold",fontSize=9,textColor=NAVY)
    els=[]
    
    # Header
    t=Table([[
        Paragraph("SIAM AGRO EXPORT CO., LTD.\n142 Charoen Nakhon Rd., Khlong San\nBangkok 10600, THAILAND\nTel: +66 2 437 8899 | Fax: +66 2 437 8800\nVAT ID: 0105561089234",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=11,textColor=NAVY,leading=16)),
        Paragraph("COMMERCIAL INVOICE",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=18,textColor=NAVY,alignment=TA_RIGHT))
    ]],colWidths=[110*mm,62*mm])
    t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"BOTTOM"),
                           ("LINEBELOW",(0,0),(-1,0),2,NAVY)]))
    els+=[t,Spacer(1,3*mm)]
    
    # !! MISMATCH 1: Invoice date 25 Mar 2026 but L/C latest shipment = 20 Mar 2026
    # !! MISMATCH 2: Unit price different from contract (1.52 vs contract 1.50/kg)
    ref=Table([
        ["Invoice No.:","INV-2026-LC-099","Invoice Date:","25 MARCH 2026  ← L/C LATEST SHIP: 20 MAR"],
        ["Contract No.:","SC-2026-JPN-055","Payment:","Irrevocable L/C at Sight"],
        ["L/C No.:","SMBC-JP-2026-TH-04471","Issuing Bank:","Sumitomo Mitsui Banking Corp., Tokyo"],
        ["L/C Expiry:","15 April 2026 (Bangkok)","Latest Ship Date:","20 March 2026"],
    ],colWidths=[30*mm,60*mm,32*mm,50*mm])
    ref.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8.5),
        ("BACKGROUND",(0,0),(-1,-1),LGRAY),("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("TEXTCOLOR",(3,0),(3,0),RED),("FONTNAME",(3,0),(3,0),"Helvetica-Bold"),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[ref,Spacer(1,3*mm)]
    
    # Parties
    parties=Table([
        ["Consignee:",""],
        [Paragraph("Tanaka Shokuhin Trading K.K.\n3-15-7 Shibaura, Minato-ku\nTokyo 108-0023, JAPAN\nTel: +81 3 5444 7890\nEORI / IOR No.: JP-IM-2026-T-000891",nor),""],
    ],colWidths=[100*mm,72*mm])
    parties.setStyle(TableStyle([("FONTNAME",(0,0),(0,0),"Helvetica-Bold"),
                                  ("FONTSIZE",(0,0),(-1,-1),8.5),
                                  ("BOX",(0,0),(-1,-1),0.5,MGRAY)]))
    els+=[parties,Spacer(1,3*mm)]
    
    # Shipping
    # !! MISMATCH 3: Incoterms in invoice is CFR Osaka — but contract says CIF Osaka
    ship=Table([
        ["Port of Loading:","Laem Chabang, Thailand","Incoterms:","CFR Osaka (Incoterms® 2020)"],
        ["Port of Discharge:","Osaka, Japan","Country of Origin:","Thailand"],
        ["Vessel:","THAI PRESTIGE 7 / VOY 2026-012","B/L Number:","HLCU LCBOSA 2603015"],
        ["ETD:","18 March 2026","ETA Osaka:","30 March 2026"],
    ],colWidths=[34*mm,52*mm,34*mm,52*mm])
    ship.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8.5),
        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F0F5FA")),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),("BOX",(0,0),(-1,-1),0.5,NAVY),
        ("TEXTCOLOR",(1,0),(1,0),RED),("FONTNAME",(1,0),(1,0),"Helvetica-Bold"),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[ship,Spacer(1,4*mm)]
    
    # Products
    # !! MISMATCH 4: Qty 5,200 bags (invoice) vs Packing List will show 5,150 bags
    # !! MISMATCH 5: HS Code 1006.30 in Invoice vs Certificate of Origin 1006.20 (paddy)
    # !! MISMATCH 6: Unit price 1.52 USD/kg but Contract says 1.50 USD/kg
    prod_hdr=[["No.","Description","HS Code","Qty (Bags)","Net Wt. (kg)","Gross Wt. (kg)","Unit Price\n(USD/kg)","Amount (USD)"]]
    prod_rows=[
        ["1","Thai Jasmine Rice 100% (Hom Mali)\nGrade Standard Export  Crop 2025\nMoisture ≤ 14.5%  Broken ≤ 5%\nPP Bag 50 kg / bag",
         "1006.30","5,200 bags","260,000.00","267,800.00","1.52","395,200.00"],
    ]
    tot_row=[["","TOTAL",""," 5,200 bags","260,000.00 kg","267,800.00 kg","",
              Paragraph("<b>USD 395,200.00</b>",ParagraphStyle("",fontName="Helvetica-Bold",fontSize=9,textColor=NAVY,alignment=TA_RIGHT))]]
    pd=Table(prod_hdr+prod_rows+tot_row,colWidths=[8*mm,62*mm,16*mm,18*mm,18*mm,18*mm,17*mm,15*mm])
    pd.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),8),
        ("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("BACKGROUND",(0,-1),(-1,-1),colors.HexColor("#E8EFF7")),
        ("ROWBACKGROUNDS",(0,1),(-1,-2),[WHITE,LGRAY]),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("ALIGN",(2,0),(-1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
    ]))
    els+=[pd,Spacer(1,3*mm)]
    
    # Financials
    # !! MISMATCH 7: Insurance shown as 100% of CFR only — L/C requires 110% CIF
    fin=Table([
        ["CFR Value (Laem Chabang to Osaka):","USD 395,200.00"],
        ["Ocean Freight (FCL 2×40'HC, LCB–OSA):","USD 4,800.00 (included in CFR)"],
        ["Marine Insurance:","NOT INCLUDED — Buyer arranges (per CFR terms)"],
        ["CFR Osaka Total:","USD 395,200.00"],
        ["Insurance Certificate:","N/A (Buyer's responsibility under CFR)"],
    ],colWidths=[110*mm,62*mm])
    fin.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8.5),
        ("FONTNAME",(0,3),(0,3),"Helvetica-Bold"),("FONTNAME",(1,3),(1,3),"Helvetica-Bold"),
        ("FONTSIZE",(0,3),(1,3),9.5),("TEXTCOLOR",(0,3),(1,3),NAVY),
        ("ALIGN",(1,0),(1,-1),"RIGHT"),
        ("LINEABOVE",(0,3),(-1,3),1,NAVY),("LINEBELOW",(0,3),(-1,3),0.5,NAVY),
        ("BACKGROUND",(0,3),(1,3),colors.HexColor("#E8EFF7")),
        ("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2),
    ]))
    els+=[fin,Spacer(1,3*mm)]
    
    # NOTE on Country of Origin
    # !! MISMATCH 8: Certificate of Origin not mentioned (required by L/C)
    note=Table([
        [Paragraph("<b>CERTIFICATION:</b> I certify that the goods described in this invoice are of THAILAND origin "
                   "and that the particulars are true and correct.\n\n"
                   "<b>NOTE:</b> Form E (ASEAN-China FTA) Certificate of Origin to be issued by Department of Foreign Trade, "
                   "Thailand — Application reference: DFT-2026-FE-0089421 (Pending issuance).",
                   ParagraphStyle("",fontName="Helvetica",fontSize=7.5,textColor=GRAY,leading=11))]
    ],colWidths=[172*mm])
    note.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),0.5,AMBER),("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#FFFBF0")),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LEFTPADDING",(0,0),(-1,-1),6),
    ]))
    els+=[note]
    
    doc.build(els,onFirstPage=pb,onLaterPages=pb)
    print(f"B1 done: {fn}")

# ── B2: Packing List with different qty ───────────────────────────────────────
def make_B2():
    fn=f"{OUT}/B2_HardCase_PackingList_PL-2026-LC-099.pdf"
    doc=SimpleDocTemplate(fn,pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,
                           topMargin=20*mm,bottomMargin=18*mm)
    nor=ParagraphStyle("n",fontName="Helvetica",fontSize=8.5,leading=13)
    els=[]
    t=Table([[
        Paragraph("SIAM AGRO EXPORT CO., LTD.  |  Bangkok, THAILAND",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=12,textColor=NAVY)),
        Paragraph("PACKING LIST",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=18,textColor=NAVY,alignment=TA_RIGHT))
    ]],colWidths=[110*mm,62*mm])
    t.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"BOTTOM"),
                           ("LINEBELOW",(0,0),(-1,0),2,NAVY)]))
    els+=[t,Spacer(1,3*mm)]
    
    # !! MISMATCH 4 (opposite side): 5,150 bags vs Invoice 5,200 bags
    ref=Table([
        ["P/L No.:","PL-2026-LC-099","Invoice Ref.:","INV-2026-LC-099 / 25 Mar 2026"],
        ["Date:","25 March 2026","Contract:","SC-2026-JPN-055"],
        ["Buyer:","Tanaka Shokuhin K.K., Tokyo","L/C No.:","SMBC-JP-2026-TH-04471"],
    ],colWidths=[25*mm,58*mm,28*mm,61*mm])
    ref.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8.5),
        ("BACKGROUND",(0,0),(-1,-1),LGRAY),("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[ref,Spacer(1,4*mm)]
    
    pk_data=[
        ["Pkg Mark & Nos.","Description","Qty\n(Bags)","Net Wt.\n(kg/bag)","Net Wt.\nTotal","Gross Wt.\n(kg/bag)","Gross Wt.\nTotal","Dimensions\n(cm)"],
        ["SAE/JPN/2026\nNo. 1–2,580\n(Container 1:\nTGBU 7890123-4)","Thai Jasmine Rice 100% Grade Std\nPP bag 50 kg, sealed, labeled","2,580\nbags","50.00","129,000 kg","51.50","132,870 kg","55×35×45"],
        ["SAE/JPN/2026\nNo. 2581–5150\n(Container 2:\nCMCU 4567890-1)","Thai Jasmine Rice 100% Grade Std\nPP bag 50 kg, sealed, labeled","2,570\nbags","50.00","128,500 kg","51.50","132,205 kg","55×35×45"],
        ["CONTAINER\nTOTAL","ALL ITEMS — Thai Jasmine Rice 100%\n2 × 40'HC FCL  |  Seal C1: LCB-SAE-0301  Seal C2: LCB-SAE-0302",
         "5,150\nbags","50.00","257,500.00\nkg","51.50","265,075.00\nkg","—"],
    ]
    pk=Table(pk_data,colWidths=[30*mm,58*mm,13*mm,14*mm,17*mm,14*mm,17*mm,17*mm])
    pk.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),8),
        ("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("BACKGROUND",(0,-1),(-1,-1),colors.HexColor("#E0E8F0")),
        ("FONTNAME",(0,-1),(-1,-1),"Helvetica-Bold"),
        ("ROWBACKGROUNDS",(0,1),(-1,-2),[WHITE,LGRAY]),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("ALIGN",(2,0),(-1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
    ]))
    els+=[pk,Spacer(1,3*mm)]
    
    els+=[Paragraph(
        "<b>IMPORTANT NOTES:</b>  All packages marked COUNTRY OF ORIGIN: THAILAND  |  "
        "Handle with care — keep dry  |  Do not stack more than 5 bags high  |  "
        "ISPM-15 certified heat-treated pallets where used",
        ParagraphStyle("",fontName="Helvetica",fontSize=7.5,textColor=GRAY))]
    
    doc.build(els,onFirstPage=pb,onLaterPages=pb)
    print(f"B2 done: {fn}")

# ── B3: Sales Contract (with further mismatches) ─────────────────────────────
def make_B3():
    fn=f"{OUT}/B3_HardCase_SalesContract_SC-2026-JPN-055.pdf"
    doc=SimpleDocTemplate(fn,pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,
                           topMargin=20*mm,bottomMargin=18*mm)
    nor=ParagraphStyle("n",fontName="Helvetica",fontSize=8.5,leading=13)
    hdr=ParagraphStyle("h",fontName="Helvetica-Bold",fontSize=10,textColor=NAVY)
    els=[]
    
    t=Table([[
        Paragraph("SALES CONTRACT",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=20,textColor=NAVY,alignment=TA_CENTER))
    ]],colWidths=[172*mm])
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#003366")),
                           ("TEXTCOLOR",(0,0),(-1,-1),WHITE),("ALIGN",(0,0),(-1,-1),"CENTER"),
                           ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
    els+=[t,Spacer(1,4*mm)]
    
    meta=Table([
        ["Contract No.:","SC-2026-JPN-055","Date:","10 January 2026"],
        ["Seller:","Siam Agro Export Co., Ltd., Bangkok, Thailand","Buyer:","Tanaka Shokuhin Trading K.K., Tokyo, Japan"],
    ],colWidths=[25*mm,61*mm,15*mm,71*mm])
    meta.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8.5),
        ("BACKGROUND",(0,0),(-1,-1),LGRAY),("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[meta,Spacer(1,4*mm)]
    
    # Contract clauses
    # !! MISMATCH 3: Contract says CIF (Invoice says CFR)
    # !! MISMATCH 6: Unit price in contract 1.50 (Invoice shows 1.52)
    # !! MISMATCH 5: HS Code 1006.20 (paddy) — should be 1006.30 (milled)
    clauses=[
        ["1. COMMODITY", "Thai Jasmine Rice 100% (Thai Hom Mali), Grade Standard Export\nHS Tariff Code: 1006.20 (paddy)  |  Crop Year: 2025\nSpecification per Annex A attached hereto"],
        ["2. QUANTITY","Total: 260,000 kg (approximately 5,200 × 50 kg PP bags)\nTolerance: ±2% at Seller's option"],
        ["3. UNIT PRICE","USD 1.50 per kilogram (FOB Laem Chabang, Thailand)\nBased on SICOM weekly average, week of 06 Jan 2026"],
        ["4. TOTAL VALUE","USD 390,000.00 (Three Hundred Ninety Thousand US Dollars)\n± tolerance adjustment at final invoice"],
        ["5. INCOTERMS","CIF Osaka, Japan  (International Chamber of Commerce Incoterms® 2020)\nSeller to arrange and pay for ocean freight and insurance"],
        ["6. PAYMENT","Irrevocable Letter of Credit, at sight\nL/C to be opened within 15 days of contract signing\nL/C amount: USD 395,000.00 (inclusive of 1% price tolerance)\nLatest shipment date: 20 March 2026\nL/C expiry: 15 April 2026"],
        ["7. SHIPMENT","From: Laem Chabang, Thailand\nTo: Osaka, Japan\nBy: Full Container Load (FCL) — 2 × 40'HC\nPartial shipments: NOT ALLOWED\nTransshipment: NOT ALLOWED"],
        ["8. DOCUMENTS\nREQUIRED","(1) Commercial Invoice — 3 originals, 3 copies\n(2) Full Set Ocean Bills of Lading (3/3 originals), Made out to Order, notify Buyer\n(3) Packing List — 3 originals\n(4) Certificate of Origin (Form E, ASEAN-China FTA) — 1 original\n(5) Insurance Certificate — 1 original (Seller's obligation under CIF)\n(6) Phytosanitary Certificate — 1 original (Thai Department of Agriculture)\n(7) SGS Pre-shipment Inspection Certificate — 1 original"],
        ["9. INSURANCE","Seller to insure for 110% of CIF invoice value\nICC (A) All Risks clause, war and strikes included\nClaims payable in Japan"],
        ["10. QUALITY &\nINSPECTION","Weight and quality to be verified by SGS (Thailand) Ltd. at loading port\nSGS certificate to be final and binding on both parties for weight and grade"],
        ["11. PENALTY","Late delivery: 0.5% of contract value per week, max 5%\nNon-conforming goods: Buyer's right to reject and claim damages"],
    ]
    for num, (art, content) in enumerate(clauses):
        ct=Table([[Paragraph(f"<b>{art}</b>",ParagraphStyle("",fontName="Helvetica-Bold",fontSize=8,textColor=NAVY)),
                   Paragraph(content,ParagraphStyle("",fontName="Helvetica",fontSize=8,leading=12))]],
                  colWidths=[32*mm,140*mm])
        ct.setStyle(TableStyle([
            ("VALIGN",(0,0),(-1,-1),"TOP"),
            ("BACKGROUND",(0,0),(0,0),colors.HexColor("#E8EFF7") if num%2==0 else colors.HexColor("#F4F7FC")),
            ("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#CCCCCC")),
            ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
            ("LEFTPADDING",(0,0),(-1,-1),5),
        ]))
        els+=[ct]
    
    els+=[Spacer(1,5*mm)]
    sig=Table([
        ["FOR AND ON BEHALF OF SELLER","FOR AND ON BEHALF OF BUYER"],
        ["SIAM AGRO EXPORT CO., LTD.","TANAKA SHOKUHIN TRADING K.K."],
        ["\n\n_________________________________","\n\n_________________________________"],
        ["Mr. Wanchai Thipphayaphong","Mr. Kenji Tanaka"],
        ["Managing Director","General Manager, Procurement"],
        ["Date: ____________________","Date: ____________________"],
    ],colWidths=[86*mm,86*mm])
    sig.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8.5),
        ("FONTNAME",(0,0),(-1,1),"Helvetica-Bold"),
        ("ALIGN",(0,0),(-1,-1),"CENTER"),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("BOX",(0,0),(0,-1),0.5,MGRAY),("BOX",(1,0),(1,-1),0.5,MGRAY),
        ("LINERIGHT",(0,0),(0,-1),1,MGRAY),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
    ]))
    els+=[sig]
    doc.build(els,onFirstPage=pb,onLaterPages=pb)
    print(f"B3 done: {fn}")

make_B1(); make_B2(); make_B3()
print("Hard Case B1-B3 done")
