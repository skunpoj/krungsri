"""
Comprehensive Thai SME Export Document Set
Complex, realistic, hard-to-verify-manually — perfect for AI demo
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, cm
from reportlab.platypus import (SimpleDocTemplate, Table, TableStyle, Paragraph,
                                Spacer, HRFlowable, KeepTogether)
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.pdfgen import canvas
import datetime, os

OUT = "/home/claude/docs"
W, H = A4

# ── Color Palette ─────────────────────────────────────────────────────────────
NAVY   = colors.HexColor("#003366")
BLUE   = colors.HexColor("#0066CC")
TEAL   = colors.HexColor("#006B6B")
RED    = colors.HexColor("#CC0000")
AMBER  = colors.HexColor("#CC7700")
GRAY   = colors.HexColor("#555555")
LGRAY  = colors.HexColor("#F4F4F4")
MGRAY  = colors.HexColor("#CCCCCC")
WHITE  = colors.white
BLACK  = colors.black

# ── Helper: Page border + header canvas ────────────────────────────────────────
def page_border(canvas_obj, doc):
    canvas_obj.saveState()
    canvas_obj.setStrokeColor(NAVY)
    canvas_obj.setLineWidth(1.2)
    canvas_obj.rect(10*mm, 10*mm, W-20*mm, H-20*mm)
    canvas_obj.setStrokeColor(BLUE)
    canvas_obj.setLineWidth(0.4)
    canvas_obj.rect(11.5*mm, 11.5*mm, W-23*mm, H-23*mm)
    canvas_obj.restoreState()

def make_tbl(data, col_widths, style_cmds=None):
    style = [
        ("FONTNAME",  (0,0), (-1,-1), "Helvetica"),
        ("FONTSIZE",  (0,0), (-1,-1), 8),
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [WHITE, LGRAY]),
        ("GRID",      (0,0), (-1,-1), 0.3, MGRAY),
        ("VALIGN",    (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING",(0,0),(-1,-1), 4),
        ("RIGHTPADDING",(0,0),(-1,-1), 4),
        ("TOPPADDING",(0,0),(-1,-1), 2.5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 2.5),
    ]
    if style_cmds:
        style.extend(style_cmds)
    return Table(data, colWidths=col_widths, style=TableStyle(style), repeatRows=1)

# ══════════════════════════════════════════════════════════════════════════════
# FILE A: Multi-Product Commercial Invoice (3 products, L/C, CIF Hamburg)
# ══════════════════════════════════════════════════════════════════════════════
def make_invoice_a():
    fn = f"{OUT}/A1_MultiProduct_Invoice_INV-2026-087.pdf"
    doc = SimpleDocTemplate(fn, pagesize=A4,
                             leftMargin=18*mm, rightMargin=18*mm,
                             topMargin=18*mm, bottomMargin=18*mm)
    ss = getSampleStyleSheet()
    hdr = ParagraphStyle("hdr", fontName="Helvetica-Bold", fontSize=10, textColor=NAVY, spaceAfter=1)
    nor = ParagraphStyle("nor", fontName="Helvetica", fontSize=8.5, textColor=BLACK, leading=13)
    sml = ParagraphStyle("sml", fontName="Helvetica", fontSize=7.5, textColor=GRAY, leading=11)
    ctr = ParagraphStyle("ctr", fontName="Helvetica-Bold", fontSize=14, textColor=NAVY, alignment=TA_CENTER, spaceAfter=4)
    els = []
    
    # Company header block
    els.append(Spacer(1, 4*mm))
    hdr_tbl = Table([
        [Paragraph("<b>THAI FRESH ORGANIC PRODUCTS CO., LTD.</b>",
                   ParagraphStyle("", fontName="Helvetica-Bold", fontSize=13, textColor=NAVY)),
         Paragraph("COMMERCIAL INVOICE",
                   ParagraphStyle("", fontName="Helvetica-Bold", fontSize=16, textColor=NAVY, alignment=TA_RIGHT))
        ]
    ], colWidths=[100*mm, 72*mm])
    hdr_tbl.setStyle(TableStyle([
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("LINEBELOW",(0,0),(-1,0),1.5,NAVY),
    ]))
    els.append(hdr_tbl)
    els.append(Spacer(1, 3*mm))
    
    # Exporter / Consignee block
    parties = Table([
        [Paragraph("<b>Exporter / Seller:</b>", hdr),
         "",
         Paragraph("<b>Invoice No.:</b>", hdr),
         Paragraph("INV-2026-087", ParagraphStyle("", fontName="Helvetica-Bold", fontSize=9, textColor=RED))],
        [Paragraph("Thai Fresh Organic Products Co., Ltd.", nor),
         "",
         Paragraph("<b>Invoice Date:</b>", hdr),
         Paragraph("25 February 2026", nor)],
        [Paragraph("88/12 Moo 5, Rangsit-Nakhon Nayok Rd.", nor),
         "",
         Paragraph("<b>Contract No.:</b>", hdr),
         Paragraph("SC-2026-BIO-031", nor)],
        [Paragraph("Khlong Luang, Pathum Thani 12110, THAILAND", nor),
         "",
         Paragraph("<b>Payment Terms:</b>", hdr),
         Paragraph("Irrevocable L/C at Sight", nor)],
        [Paragraph("Tel: +66 2 909 5566  |  VAT ID: 0105555012345", sml),
         "",
         Paragraph("<b>L/C Number:</b>", hdr),
         Paragraph("LC/2026/MUN/0047  (Bayerische Handelsbank AG)", nor)],
        [Paragraph("Export License No.: EX-2026-AGRI-1234", sml),
         "",
         Paragraph("<b>L/C Expiry Date:</b>", hdr),
         Paragraph("20 March 2026  (Hamburg)", nor)],
    ], colWidths=[86*mm, 4*mm, 40*mm, 42*mm])
    parties.setStyle(TableStyle([
        ("SPAN",(0,0),(0,5)), # left column spans
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("LINERIGHT",(1,0),(1,-1),0.5,MGRAY),
    ]))
    els.append(parties)
    els.append(Spacer(1, 3*mm))
    
    consignee_tbl = Table([
        [Paragraph("<b>Consignee / Buyer:</b>", hdr),
         Paragraph("<b>Notify Party:</b>", hdr)],
        [Paragraph("BioNatur GmbH\n88 Leopoldstrasse, 80802 München, GERMANY\nEORI: DE4567890123\nVAT: DE245678901\nContact: Mr. Klaus Hoffmann  Tel: +49 89 3456789", nor),
         Paragraph("DB Schenker GmbH\nLogistics Center Hamburg\nAmburger Strasse 55, 20457 Hamburg, Germany\nAttn: Ms. Petra Braun  Tel: +49 40 7654321", nor)],
    ], colWidths=[88*mm, 84*mm])
    consignee_tbl.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),0.5,MGRAY),
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#E8EFF7")),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("INNERGRID",(0,0),(-1,-1),0.3,MGRAY),
    ]))
    els.append(consignee_tbl)
    els.append(Spacer(1, 3*mm))
    
    # Shipping details
    ship_tbl = Table([
        ["Port of Loading:", "Laem Chabang, Thailand", "Incoterms:", "CIF Hamburg (Incoterms® 2020)"],
        ["Port of Discharge:", "Hamburg, Germany", "Country of Origin:", "Thailand"],
        ["Vessel / Voyage:", "EVER GIVEN 2 / VOY-2026-018", "Shipped per:", "Full Container Load (FCL)"],
        ["ETD Laem Chabang:", "05 March 2026", "Container:", "1 × 20'GP  |  TEMU 3456789-0  STC 24 pallets"],
        ["ETA Hamburg:", "28 March 2026", "B/L Number:", "HAPLC2026HAM0314 (TO BE ISSUED)"],
    ], colWidths=[36*mm, 52*mm, 35*mm, 49*mm])
    ship_tbl.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8),
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),
        ("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F0F5FA")),
        ("BOX",(0,0),(-1,-1),0.5,NAVY),
        ("INNERGRID",(0,0),(-1,-1),0.3,MGRAY),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),3),
        ("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els.append(ship_tbl)
    els.append(Spacer(1, 4*mm))
    
    # ── Product Lines ──────────────────────────────────────────────────────────
    els.append(Paragraph("<b>DESCRIPTION OF GOODS</b>",
                         ParagraphStyle("", fontName="Helvetica-Bold", fontSize=9, textColor=NAVY, spaceAfter=3)))
    
    prod_hdr = [
        ["No.", "Description of Goods\n& Specifications", "HS Code\n(6-digit)", "Qty\n(Bags/Ctns)", "Net Wt.\n(kg)", "Gross Wt.\n(kg)", "Unit Price\n(USD/kg)", "Amount\n(USD)"]
    ]
    prod_rows = [
        ["1",
         "ORGANIC JASMINE RICE 100% (Thai Hom Mali)\nGrade A, Crop 2025, Moisture ≤14.5%\nImpurity ≤0.3%, White Belly ≤5%\nPacked in PP woven bags 25 kg each\nOrganic Cert. No.: ACT-TH-2025-0891",
         "1006.30", "500 bags", "12,500.00", "12,875.00", "1.45", "18,125.00"],
        ["2",
         "PANDAN LEAF EXTRACT (Pandanus amaryllifolius)\nConcentration: 1:10, Colour: Green, Brix: 62–65\nPreservative-free, Food Grade\nPacked in HDPE bottles 500 ml, 4 pcs/carton, 50 cartons\nCOA No.: QC-2026-PLE-0044",
         "2106.90", "200 bottles\n(50 cartons)", "50.00\n(liquid)", "58.00", "8.50/btl", "1,700.00"],
        ["3",
         "COCONUT BLOSSOM SUGAR – Organic\n(Cocos nucifera L.) Granulated, Light Brown\nMoisture ≤3.5%, GI Index 35, Vegan\nPacked in zip-lock kraft bags 1 kg, 10 bags/box\n100 boxes.  EU Organic Cert.: DE-ÖKO-006-88421",
         "1702.90", "1,000 bags\n(100 boxes)", "1,000.00", "1,080.00", "4.20", "4,200.00"],
    ]
    prod_data = prod_hdr + prod_rows + [
        ["", Paragraph("<b>TOTAL NET WEIGHT</b>", ParagraphStyle("", fontName="Helvetica-Bold", fontSize=8)),
         "", "", Paragraph("<b>13,550.00 kg</b>", ParagraphStyle("", fontName="Helvetica-Bold", fontSize=8, alignment=TA_CENTER)),
         Paragraph("<b>14,013.00 kg</b>", ParagraphStyle("", fontName="Helvetica-Bold", fontSize=8, alignment=TA_CENTER)),
         "", Paragraph("<b>USD 24,025.00</b>", ParagraphStyle("", fontName="Helvetica-Bold", fontSize=9, textColor=NAVY, alignment=TA_RIGHT))],
    ]
    prod_tbl = Table(prod_data, colWidths=[8*mm, 64*mm, 17*mm, 17*mm, 16*mm, 16*mm, 16*mm, 18*mm])
    prod_tbl.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
        ("BACKGROUND",(0,0),(-1,0),NAVY),
        ("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("BACKGROUND",(0,-1),(-1,-1),colors.HexColor("#E8EFF7")),
        ("ROWBACKGROUNDS",(0,1),(-1,-2),[WHITE, LGRAY]),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("ALIGN",(2,0),(-1,-1),"CENTER"),
        ("ALIGN",(-1,0),(-1,-1),"RIGHT"),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),3),
        ("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),4),
    ]))
    els.append(prod_tbl)
    els.append(Spacer(1, 3*mm))
    
    # Financial Summary
    fin_tbl = Table([
        ["FOB Value (Laem Chabang):", "USD 21,622.50"],
        ["Ocean Freight (FCL 20'GP, LCB–HAM):", "USD 1,850.00"],
        ["Marine Insurance (110% × CIF, ICC-A):", "USD 552.50"],
        ["CIF Hamburg Total:", "USD 24,025.00"],
        ["Insurance Certificate No.:", "TBIA-2026-MRN-00445"],
    ], colWidths=[100*mm, 72*mm])
    fin_tbl.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8.5),
        ("FONTNAME",(0,3),(0,3),"Helvetica-Bold"),
        ("FONTNAME",(1,3),(1,3),"Helvetica-Bold"),
        ("FONTSIZE",(0,3),(1,3),9.5),
        ("TEXTCOLOR",(0,3),(1,3),NAVY),
        ("ALIGN",(1,0),(1,-1),"RIGHT"),
        ("LINEABOVE",(0,3),(-1,3),1,NAVY),
        ("LINEBELOW",(0,3),(-1,3),0.5,NAVY),
        ("BACKGROUND",(0,3),(1,3),colors.HexColor("#E8EFF7")),
        ("TOPPADDING",(0,0),(-1,-1),2),
        ("BOTTOMPADDING",(0,0),(-1,-1),2),
    ]))
    els.append(fin_tbl)
    els.append(Spacer(1, 3*mm))
    
    # L/C Conditions
    lc_tbl = Table([
        [Paragraph("<b>LETTER OF CREDIT CONDITIONS</b>", ParagraphStyle("", fontName="Helvetica-Bold", fontSize=8, textColor=NAVY))],
        [Paragraph(
            "1. Documents must be presented to Bayerische Handelsbank AG, Munich within 15 days after B/L date and before L/C expiry 20 March 2026.\n"
            "2. Partial shipment PROHIBITED.  Transhipment ALLOWED (at Singapore only).\n"
            "3. Original B/L required (3 Originals), consigned to Order of Bayerische Handelsbank AG, notify BioNatur GmbH.\n"
            "4. Packing List must state gross/net weight per item and per container.  Country of Origin must appear on ALL documents.\n"
            "5. Organic certificate issued by ACT (Organic Agriculture Certification Thailand) must accompany shipment.\n"
            "6. Insurance coverage must be for 110% of CIF value, ICC (A) clause, with claims payable in Germany.",
            ParagraphStyle("", fontName="Helvetica", fontSize=7.5, leading=11, textColor=BLACK))],
    ], colWidths=[172*mm])
    lc_tbl.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),0.5,AMBER),
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#FFF8E8")),
        ("TOPPADDING",(0,0),(-1,-1),3),
        ("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els.append(lc_tbl)
    els.append(Spacer(1, 4*mm))
    
    # Signature
    sig_tbl = Table([
        ["I/We hereby certify that the information on this invoice is true and correct and that the contents of this "
         "consignment are as stated above.",
         ""],
        ["Authorized Signatory:", ""],
        ["\n\n_______________________________________", ""],
        ["Ms. Nanthida Phonsri – Export Manager", "Company Stamp"],
        ["Thai Fresh Organic Products Co., Ltd.", ""],
        ["Date: 25 February 2026", ""],
    ], colWidths=[120*mm, 52*mm])
    sig_tbl.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8),
        ("SPAN",(0,0),(1,0)),
        ("BOX",(1,1),(1,-1),0.5,MGRAY),
        ("TOPPADDING",(0,0),(-1,-1),3),
    ]))
    els.append(sig_tbl)
    
    doc.build(els, onFirstPage=page_border, onLaterPages=page_border)
    print(f"A1 done: {fn}")
    return fn

# ══════════════════════════════════════════════════════════════════════════════
# FILE A2: Matching Packing List (for HOW TO 3 — generate this from Invoice A1)
# ══════════════════════════════════════════════════════════════════════════════
def make_packing_list_a():
    fn = f"{OUT}/A2_MultiProduct_PackingList_PL-2026-087.pdf"
    doc = SimpleDocTemplate(fn, pagesize=A4,
                             leftMargin=18*mm, rightMargin=18*mm,
                             topMargin=18*mm, bottomMargin=18*mm)
    ss = getSampleStyleSheet()
    hdr = ParagraphStyle("hdr", fontName="Helvetica-Bold", fontSize=9, textColor=NAVY, spaceAfter=1)
    nor = ParagraphStyle("nor", fontName="Helvetica", fontSize=8.5, leading=13)
    els = []
    
    els.append(Spacer(1, 4*mm))
    top = Table([[
        Paragraph("THAI FRESH ORGANIC PRODUCTS CO., LTD.\n88/12 Moo 5, Rangsit-Nakhon Nayok Rd.\nKhlong Luang, Pathum Thani 12110, THAILAND",
                  ParagraphStyle("", fontName="Helvetica-Bold", fontSize=11, textColor=NAVY, leading=16)),
        Paragraph("PACKING LIST",
                  ParagraphStyle("", fontName="Helvetica-Bold", fontSize=18, textColor=NAVY, alignment=TA_RIGHT))
    ]], colWidths=[110*mm, 62*mm])
    top.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"BOTTOM"),
                              ("LINEBELOW",(0,0),(-1,0),1.5,NAVY)]))
    els.append(top)
    els.append(Spacer(1, 3*mm))
    
    ref = Table([
        ["Packing List No.:", "PL-2026-087", "Invoice Ref.:", "INV-2026-087 dated 25 Feb 2026"],
        ["Date:", "25 February 2026", "Contract Ref.:", "SC-2026-BIO-031"],
        ["Buyer:", "BioNatur GmbH, München, Germany", "L/C No.:", "LC/2026/MUN/0047"],
        ["Vessel:", "EVER GIVEN 2 / VOY-2026-018", "Container:", "1 × 20'GP  |  TEMU 3456789-0"],
        ["ETD:", "05 March 2026 (Laem Chabang)", "Seal No.:", "LCB-TFOP-2026-0305"],
    ], colWidths=[30*mm, 52*mm, 28*mm, 62*mm])
    ref.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),
        ("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8.5),
        ("BACKGROUND",(0,0),(-1,-1),LGRAY),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),3),
        ("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els.append(ref)
    els.append(Spacer(1, 4*mm))
    
    # Packing detail by product
    els.append(Paragraph("<b>PACKING DETAILS BY ITEM</b>",
                         ParagraphStyle("", fontName="Helvetica-Bold", fontSize=9, textColor=NAVY, spaceAfter=3)))
    
    pk_data = [
        ["Pkg\nMark", "Description", "HS\nCode", "No. of\nPackages", "Pkg\nType", "Net Wt.\n(kg/pkg)", "Net Wt.\nTotal (kg)", "Gross Wt.\n(kg/pkg)", "Gross\nTotal (kg)", "Dimensions\n(L×W×H cm)"],
        ["TFOP/1-500\nBKK-HAM\n2026\nNo.1-500",
         "Organic Jasmine Rice 100%\nThai Hom Mali Grade A 2025\nMoisture ≤14.5%  GI: 616",
         "1006.30", "500\n(bags)", "PP woven\nbag", "25.00", "12,500.00", "25.75", "12,875.00", "35×35×65"],
        ["TFOP/PLE\nBKK-HAM\n2026\nNo.1-50",
         "Pandan Leaf Extract 1:10\nConc. 62-65°Brix  (4 btl/ctn)\nCOA: QC-2026-PLE-0044",
         "2106.90", "50\n(cartons)", "corrugated\nbox", "1.00\n(liquid)", "50.00", "1.16", "58.00", "25×20×18"],
        ["TFOP/CBS\nBKK-HAM\n2026\nNo.1-100",
         "Coconut Blossom Sugar Organic\nGranulated, Kraft Bag 1 kg × 10\nEU Organic: DE-ÖKO-006-88421",
         "1702.90", "100\n(boxes)", "kraft paper\nbox", "10.00", "1,000.00", "10.80", "1,080.00", "30×20×20"],
        ["PALLET\nSUMMARY", "Palletized on ISPM-15 certified heat-treated wood pallets\n  Pallets 1–20: Jasmine Rice (25 bags each = 20 pallets)\n  Pallets 21–22: Packing (mixed: 25 PLE cartons each)\n  Pallets 23–24: Coconut Sugar (50 boxes each)\n  Stretch-wrapped, top cardboard, 2 strapping bands each",
         "", "24\npallets", "", "", "", "", "", "120×100×160"],
    ]
    pk_tbl = Table(pk_data, colWidths=[25*mm,56*mm,11*mm,14*mm,14*mm,12*mm,14*mm,13*mm,13*mm,18*mm])
    pk_tbl.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
        ("FONTSIZE",(0,0),(-1,-1),7.5),
        ("BACKGROUND",(0,0),(-1,0),NAVY),
        ("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("ROWBACKGROUNDS",(0,1),(-1,-2),[WHITE, LGRAY]),
        ("BACKGROUND",(0,-1),(-1,-1),colors.HexColor("#E0F0E0")),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("ALIGN",(2,0),(-1,-1),"CENTER"),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),3),
        ("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),3),
        ("SPAN",(1,-1),(0,-1)),
    ]))
    els.append(pk_tbl)
    els.append(Spacer(1, 3*mm))
    
    # Totals
    tot_data = [
        ["CONTAINER TOTAL SUMMARY (1 × 20'GP  |  TEMU 3456789-0)", "", "", "", ""],
        ["Item", "Packages", "Net Weight (kg)", "Gross Weight (kg)", "CBM (est.)"],
        ["Organic Jasmine Rice", "500 bags", "12,500.00", "12,875.00", "11.54"],
        ["Pandan Leaf Extract", "50 cartons (200 btl)", "50.00", "58.00", "0.45"],
        ["Coconut Blossom Sugar", "100 boxes (1,000 bags)", "1,000.00", "1,080.00", "0.60"],
        ["Pallets (ISPM-15 HT)", "24 pallets", "240.00 (pallet tare)", "—", "—"],
        ["GRAND TOTAL", "650 pkgs + 24 pallets", "13,550.00 kg", "14,013.00 kg", "12.59 CBM"],
    ]
    tot_tbl = Table(tot_data, colWidths=[52*mm,36*mm,34*mm,34*mm,16*mm])
    tot_tbl.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),
        ("FONTSIZE",(0,0),(-1,-1),8),
        ("SPAN",(0,0),(-1,0)),
        ("BACKGROUND",(0,0),(-1,0),TEAL),
        ("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("FONTNAME",(0,0),(-1,1),"Helvetica-Bold"),
        ("BACKGROUND",(0,1),(-1,1),colors.HexColor("#C0D8D8")),
        ("BACKGROUND",(0,-1),(-1,-1),NAVY),
        ("TEXTCOLOR",(0,-1),(-1,-1),WHITE),
        ("FONTNAME",(0,-1),(-1,-1),"Helvetica-Bold"),
        ("ROWBACKGROUNDS",(0,2),(-1,-2),[WHITE, LGRAY]),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("ALIGN",(1,0),(-1,-1),"CENTER"),
        ("TOPPADDING",(0,0),(-1,-1),3),
        ("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els.append(tot_tbl)
    els.append(Spacer(1, 3*mm))
    
    els.append(Paragraph(
        "<b>Shipping Marks:</b>  TFOP/&lt;ITEM&gt;/BKK-HAM/2026/No.XXX-YYY  ·  "
        "<b>Country of Origin:</b> THAILAND  ·  <b>Keep Dry, Handle with Care</b>",
        ParagraphStyle("", fontName="Helvetica", fontSize=7.5, textColor=GRAY)))
    
    doc.build(els, onFirstPage=page_border, onLaterPages=page_border)
    print(f"A2 done: {fn}")
    return fn

make_invoice_a()
make_packing_list_a()
print("Files A1-A2 done")
