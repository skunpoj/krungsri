from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_RIGHT

OUT = "/home/claude/docs"
NAVY=colors.HexColor("#003366"); RED=colors.HexColor("#CC0000")
TEAL=colors.HexColor("#006B6B"); PURPLE=colors.HexColor("#4B0082")
LGRAY=colors.HexColor("#F4F4F4"); MGRAY=colors.HexColor("#CCCCCC")
WHITE=colors.white

def pb_med(c,d):
    c.saveState(); c.setStrokeColor(PURPLE); c.setLineWidth(1.2)
    c.rect(10*mm,10*mm,A4[0]-20*mm,A4[1]-20*mm)
    c.setFont("Helvetica-Bold",7); c.setFillColor(PURPLE)
    c.drawString(12*mm,12*mm,"EDUCATIONAL SAMPLE — Medical Device Export Document (NOT for regulatory use)")
    c.restoreState()

# ── C1: Medical Device Commercial Invoice (Complex) ──────────────────────────
def make_C1():
    fn=f"{OUT}/C1_MedicalDevice_Invoice_INV-2026-MED-234.pdf"
    doc=SimpleDocTemplate(fn,pagesize=A4,leftMargin=16*mm,rightMargin=16*mm,
                           topMargin=20*mm,bottomMargin=18*mm)
    nor=ParagraphStyle("n",fontName="Helvetica",fontSize=8,leading=12)
    hdr=ParagraphStyle("h",fontName="Helvetica-Bold",fontSize=9,textColor=NAVY)
    els=[]
    
    # Header
    top=Table([[
        Paragraph("THAI SAFETY PRODUCTS CO., LTD.\n(Licensed Manufacturer of Medical Devices)\n89 Hi-Tech Industrial Estate, Wang Noi, Ayutthaya 13170, THAILAND\nTel: +66 3 527 9900 | FDA License: MD-2024-01-1234 | ISO 13485:2016 Certified\nCE Mark Authority: DEKRA SE, Notified Body 0124",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=10,textColor=NAVY,leading=15)),
        Paragraph("COMMERCIAL INVOICE\n(Medical Device – For Customs & Regulatory Purposes)",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=13,textColor=NAVY,alignment=TA_RIGHT,leading=18))
    ]],colWidths=[105*mm,67*mm])
    top.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"BOTTOM"),
                             ("LINEBELOW",(0,0),(-1,0),2,PURPLE)]))
    els+=[top,Spacer(1,3*mm)]
    
    ref=Table([
        ["Invoice No.:","INV-2026-MED-234","Date:","15 January 2026"],
        ["Contract No.:","SC-2025-MED-AMS-089","Payment Terms:","T/T 30 days net after BL date"],
        ["FDA 510(k) No. (USA):","K201234 (cleared July 2020)","CE Certificate:","CE-0124-MD-2023-4556"],
        ["ISO 13485 Cert.:","TÜV Rheinland Cert. 01 100 2023456","TISI License:","TH-TISI-MD-2024-12345"],
        ["Buyer PO No.:","MED-PO-2026-00441","Currency:","USD"],
    ],colWidths=[30*mm,50*mm,35*mm,57*mm])
    ref.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8),
        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F4F0FA")),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("TOPPADDING",(0,0),(-1,-1),2.5),("BOTTOMPADDING",(0,0),(-1,-1),2.5),
        ("LEFTPADDING",(0,0),(-1,-1),4),
    ]))
    els+=[ref,Spacer(1,3*mm)]
    
    parties=Table([
        [Paragraph("<b>Seller / Exporter:</b>",hdr),Paragraph("<b>Buyer / Consignee / Importer of Record:</b>",hdr)],
        [Paragraph("Thai Safety Products Co., Ltd.\n89 Hi-Tech Industrial Estate\nWang Noi, Ayutthaya 13170, THAILAND\nReg. No. 0145556012890\nExport License: MED-EX-2026-00021",nor),
         Paragraph("MedSupply Benelux B.V.\n44 Amstelplein, 1096 BC Amsterdam\nTHE NETHERLANDS\nEORI: NL876543210B01 | BTW: NL876543210B01\nGDPMD Registration: NL-GDPMD-2024-MED-0089\nContact: Mr. Johan van den Berg, Tel: +31 20 555 7890",nor)],
    ],colWidths=[86*mm,86*mm])
    parties.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),
        ("BOX",(0,0),(-1,-1),0.5,MGRAY),("INNERGRID",(0,0),(-1,-1),0.3,MGRAY),
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#EDE8FA")),
        ("FONTSIZE",(0,0),(-1,-1),8),("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[parties,Spacer(1,3*mm)]
    
    ship=Table([
        ["Port of Loading:","U-Tapao Airport (UTP), Rayong","Incoterms:","CIP Amsterdam (Incoterms® 2020)"],
        ["Port of Discharge:","Amsterdam Schiphol Airport (AMS)","Mode:","Air Freight (IATA DGR Class: Non-hazardous)"],
        ["Carrier:","Thai Airways International TG924","AWB No.:",  "217-12345678"],
        ["ETD:","20 January 2026","ETA AMS:","21 January 2026"],
        ["Country of Orig.","Thailand","Gross Weight (Air):","2,856.00 kg"],
    ],colWidths=[35*mm,52*mm,32*mm,53*mm])
    ship.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8),
        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F0F5FA")),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),("BOX",(0,0),(-1,-1),0.5,PURPLE),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[ship,Spacer(1,4*mm)]
    
    # Complex multi-line medical products
    prod_hdr=[["No.","Product Description & Regulatory References","HS Code","Qty\n(Boxes)","Qty\n(Pcs)","Net Wt.\n(kg)","Unit Price\n(USD)","Amount\n(USD)"]]
    prod_data=[
        ["1","NITRILE EXAMINATION GLOVES, Powder-free\n"
              "Size: SMALL  |  Colour: Blue  |  Thickness: 0.10mm\n"
              "AQL ≤ 1.5 (EN 455-2:2015)  |  Tensile Str. ≥6N (ISO 37)\n"
              "Lot No: NG2025-12-S001  |  Expiry: 31 Dec 2028\n"
              "100 pcs/box  |  10 boxes/carton  |  ASTM D6319  |  FDA 510(k) K201234",
         "4015.19","320 cartons\n(3,200 boxes)","320,000","480.00","2.85/100pcs","9,120.00"],
        ["2","NITRILE EXAMINATION GLOVES, Powder-free\n"
              "Size: MEDIUM  |  Colour: Blue  |  Thickness: 0.10mm\n"
              "AQL ≤ 1.5 (EN 455-2:2015)  |  Tensile Str. ≥6N\n"
              "Lot No: NG2025-12-M002  |  Expiry: 31 Dec 2028\n"
              "100 pcs/box  |  10 boxes/carton  |  CE Mark: 2023/C/0124-MD-4556",
         "4015.19","480 cartons\n(4,800 boxes)","480,000","720.00","2.85/100pcs","13,680.00"],
        ["3","NITRILE EXAMINATION GLOVES, Powder-free\n"
              "Size: LARGE  |  Colour: Blue  |  Thickness: 0.10mm\n"
              "AQL ≤ 1.5 (EN 455-2:2015)  |  CE Mark: 2023/C/0124-MD-4556\n"
              "Lot No: NG2025-12-L003  |  Expiry: 31 Dec 2028\n"
              "100 pcs/box  |  10 boxes/carton  |  ISO 13485:2016 Quality Mgmt",
         "4015.19","200 cartons\n(2,000 boxes)","200,000","300.00","2.85/100pcs","5,700.00"],
        ["4","SURGICAL LATEX GLOVES, Sterile, Powder-free\n"
              "Size: 7.5  |  Textured  |  Thickness: 0.20mm (palm)\n"
              "Sterile (EO sterilization), Single-use, EN 455-1/2/3/4\n"
              "Lot No: SL2026-01-7.5-004  |  Expiry: 31 Jan 2029\n"
              "50 prs/box  |  4 boxes/carton  |  FDA 510(k) K195678",
         "4015.11","150 cartons\n(600 boxes)","30,000","180.00","12.50/50pr","3,750.00"],
        ["5","STERILE DRESSING PACK (Type II)\nContents: 1× drape 60×60cm, 4× gauze swabs 10×10cm\n"
              "4× cotton wool balls, 1× disposable pot, 1× pair forceps\nIrradiation sterilized (25kGy), EN 868\n"
              "Lot No: DP2026-01-005  |  Expiry: 31 Jan 2031  |  CE Mark",
         "3006.10","200 cartons\n(2,000 packs)","2,000","276.00","4.85/pack","9,700.00"],
    ]
    prod_rows=prod_hdr+prod_data+[
        ["","TOTAL","","1,350 cartons","1,032,000 pcs","1,956.00 kg","",
         Paragraph("<b>USD 41,950.00</b>",ParagraphStyle("",fontName="Helvetica-Bold",fontSize=9,textColor=NAVY,alignment=TA_RIGHT))]
    ]
    pt=Table(prod_rows,colWidths=[7*mm,72*mm,12*mm,15*mm,14*mm,12*mm,13*mm,17*mm])
    pt.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),7.5),
        ("BACKGROUND",(0,0),(-1,0),PURPLE),("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("ROWBACKGROUNDS",(0,1),(-1,-2),[WHITE,LGRAY]),
        ("BACKGROUND",(0,-1),(-1,-1),colors.HexColor("#EDE8FA")),
        ("FONTNAME",(0,-1),(-1,-1),"Helvetica-Bold"),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("ALIGN",(2,0),(-1,-1),"CENTER"),("ALIGN",(-1,0),(-1,-1),"RIGHT"),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2),
    ]))
    els+=[pt,Spacer(1,3*mm)]
    
    fin=Table([
        ["CIP Amsterdam Total (incl. Air Freight + Insurance):","USD 41,950.00"],
        ["Air Freight (U-Tapao → Amsterdam, DHL Air):","Included in CIP"],
        ["Marine/Air Insurance (110% × CIP, ICC-A):","Included in CIP"],
        ["THAIFDA Export Notification No.:","EN-2026-MD-0089421 (issued 10 Jan 2026)"],
        ["SGS Pre-shipment Inspection Cert.:","SGS-TH-MED-2026-00234 (attached)"],
        ["Batch Release Certificate (BRC):","Enclosed — issued by QC Dept., TSP Co.Ltd."],
    ],colWidths=[110*mm,62*mm])
    fin.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8),
        ("FONTNAME",(0,0),(0,0),"Helvetica-Bold"),("FONTNAME",(1,0),(1,0),"Helvetica-Bold"),
        ("FONTSIZE",(0,0),(1,0),9),("TEXTCOLOR",(0,0),(1,0),PURPLE),
        ("ALIGN",(1,0),(1,-1),"RIGHT"),("LINEABOVE",(0,0),(-1,0),1,PURPLE),
        ("BACKGROUND",(0,0),(1,0),colors.HexColor("#EDE8FA")),
        ("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2),
    ]))
    els+=[fin,Spacer(1,3*mm)]
    
    reg=Table([[Paragraph(
        "<b>REGULATORY COMPLIANCE STATEMENT:</b><br/>"
        "The goods described above are <b>Class I Medical Devices</b> (Non-sterile items #1-3) and "
        "<b>Class IIa Medical Devices</b> (Sterile items #4-5) as classified under EU MDR 2017/745 and US FDA 21 CFR Part 820.<br/>"
        "All products conform to: EN 455-1/2/3/4 (Medical gloves), ASTM D6319 (Nitrile gloves), ISO 11135 (Sterilization).<br/>"
        "EU Authorised Representative: MedRep Solutions GmbH, Berlin  |  Reg. No.: EU-AR-2024-MD-00234.<br/>"
        "End-use: Medical examination / surgical procedures.  Declared value represents TRUE COMMERCIAL VALUE.",
        ParagraphStyle("",fontName="Helvetica",fontSize=7.5,leading=11))]],
    colWidths=[172*mm])
    reg.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),0.5,PURPLE),("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F8F4FF")),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LEFTPADDING",(0,0),(-1,-1),6),
    ]))
    els+=[reg]
    doc.build(els,onFirstPage=pb_med,onLaterPages=pb_med)
    print(f"C1 done: {fn}")

# ── D1: Natural Rubber Multi-Grade Export ────────────────────────────────────
def pb_rub(c,d):
    c.saveState(); c.setStrokeColor(TEAL); c.setLineWidth(1.2)
    c.rect(10*mm,10*mm,A4[0]-20*mm,A4[1]-20*mm)
    c.setFont("Helvetica-Bold",7); c.setFillColor(TEAL)
    c.drawString(12*mm,12*mm,"EDUCATIONAL SAMPLE — Natural Rubber Commodity Export (Bangkok, Thailand)")
    c.restoreState()

def make_D1():
    fn=f"{OUT}/D1_NaturalRubber_Invoice_INV-2026-RUB-312.pdf"
    doc=SimpleDocTemplate(fn,pagesize=A4,leftMargin=16*mm,rightMargin=16*mm,
                           topMargin=20*mm,bottomMargin=18*mm)
    nor=ParagraphStyle("n",fontName="Helvetica",fontSize=8,leading=12)
    els=[]
    
    top=Table([[
        Paragraph("THAI PARA RUBBER EXPORT CO., LTD.\n55 Si Phraya Rd., Bang Rak, Bangkok 10500, THAILAND\nTel: +66 2 635 5500  |  RETRACOM Member Code: TH-RC-2025-0889\nTAT (Thai Auto Tire) Approved Supplier Code: TAT-2026-S-002213",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=10,textColor=TEAL,leading=15)),
        Paragraph("COMMERCIAL INVOICE\n(Natural Rubber — Commodity Shipment)",
                  ParagraphStyle("",fontName="Helvetica-Bold",fontSize=14,textColor=TEAL,alignment=TA_RIGHT,leading=20))
    ]],colWidths=[105*mm,67*mm])
    top.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"BOTTOM"),
                             ("LINEBELOW",(0,0),(-1,0),2,TEAL)]))
    els+=[top,Spacer(1,3*mm)]
    
    ref=Table([
        ["Invoice No.:","INV-2026-RUB-312","Date:","28 February 2026"],
        ["Contract No.:","SC-2026-SRI-JAP-089","Payment:","D/P at sight (Krungthai Bank)"],
        ["SICOM Ref. Price:","Week of 24 Feb 2026 (USD/kg)","SGS Cert. No.:","SGS-TH-RUB-2026-00312"],
        ["Phytosanitary Cert.:","PH-DOA-2026-02-00789","CITES (if req.):","Not applicable"],
    ],colWidths=[30*mm,52*mm,35*mm,55*mm])
    ref.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8),
        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F0FAF5")),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("TOPPADDING",(0,0),(-1,-1),2.5),("BOTTOMPADDING",(0,0),(-1,-1),2.5),
        ("LEFTPADDING",(0,0),(-1,-1),4),
    ]))
    els+=[ref,Spacer(1,3*mm)]
    
    parties=Table([
        [Paragraph("<b>Seller:</b>",nor),Paragraph("<b>Buyer / Consignee:</b>",nor)],
        [Paragraph("Thai Para Rubber Export Co., Ltd.\n55 Si Phraya Rd., Bang Rak, Bangkok 10500\nBank: Krungthai Bank PCL, Silom Branch\nA/C No.: 052-1-23456-7 (USD account)",nor),
         Paragraph("Sumitomo Rubber Industries Co., Ltd.\n3-6-9 Wakinohama-cho, Chuo-ku, Kobe 651-0072\nJAPAN\nTel: +81 78 265 3000  |  Fax: +81 78 265 3012\nImporter of Record Code: JP-IOR-2024-SRI-007",nor)],
    ],colWidths=[86*mm,86*mm])
    parties.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),8),
        ("BOX",(0,0),(-1,-1),0.5,MGRAY),("INNERGRID",(0,0),(-1,-1),0.3,MGRAY),
        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#D8F0E8")),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[parties,Spacer(1,3*mm)]
    
    ship=Table([
        ["Port of Loading:","Laem Chabang / Bangkok, Thailand","Incoterms:","FOB Laem Chabang (Incoterms® 2020)"],
        ["Port of Discharge:","Kobe, Japan","Vessel:","GLOBAL HARVEST 3 / VOY-2026-JAP-008"],
        ["ETD Laem Chabang:","05 March 2026","ETA Kobe:","14 March 2026"],
        ["Container Type:","2 × 20'GP + 1 × 20'RF (Reefer, 15°C)","B/L No.:","HLCULCB260301-RUB"],
    ],colWidths=[34*mm,52*mm,34*mm,52*mm])
    ship.setStyle(TableStyle([
        ("FONTNAME",(0,0),(0,-1),"Helvetica-Bold"),("FONTNAME",(2,0),(2,-1),"Helvetica-Bold"),
        ("FONTNAME",(0,0),(-1,-1),"Helvetica"),("FONTSIZE",(0,0),(-1,-1),8),
        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F0FAF5")),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),("BOX",(0,0),(-1,-1),0.5,TEAL),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),5),
    ]))
    els+=[ship,Spacer(1,4*mm)]
    
    # Complex rubber grades with commodity pricing
    pd_hdr=[["No.","Grade & Specification","HS\nCode","Qty\n(Bales)","Net Dry Wt.\n(DMT)","Gross Wt.\n(MT)","SICOM Ref.\n(USD/kg)","Price adj.","FOB Price\n(USD/DMT)","Amount\n(USD)"]]
    pd_rows=[
        ["1","RIBBED SMOKED SHEET No.1 (RSS-1)\nISO 2000-1  |  ANRPC Standard\nBale wt. ≈ 111.5 kg  |  DRC ≥ 99.8%\nFungicide-free  |  Air-dried\nContainer: 20'GP #1  TEMU-3334441-5\nSGS Weight Cert: Section 1",
         "4001.21","170\nbales","18.000\nDMT","18.954\nGMT","1.9450\n(SICOM\n24 Feb)","−0.0050\n(quality\nadj.)","1,940.00","34,920.00"],
        ["2","TECHNICALLY SPECIFIED RUBBER L (TSR-L)\nISO 2000-2  |  Pale Crepe No.1 equiv.\nBale wt. ≈ 33.3 kg  |  DRC ≥ 99.6%\nLow dirt content ≤0.010%, Ash ≤0.40%\nContainer: 20'GP #1 (shared w/ RSS-1)\nSGS Weight Cert: Section 2",
         "4001.22","450\nbales","14.985\nDMT","15.480\nGMT","1.8900\n(SICOM\n24 Feb)","−0.0100\n(moisture\nbonification)","1,880.00","28,171.80"],
        ["3","STANDARD THAI RUBBER 5L (STR-5L)\n(Equiv. to SMR-5, Low Viscosity)\nISO 2000-5  |  Bale wt. ≈ 33.3 kg\nViscosity (Mooney ML 1+4, 100°C): ≤ 60\nDirt ≤0.05%, Ash ≤0.60%, Nitrogen ≤0.60%\nContainer: 20'GP #2  CMCU-8876543-2\nSGS Weight Cert: Section 3  |  REACH compliance",
         "4001.22","600\nbales","19.980\nDMT","20.579\nGMT","1.7800\n(SICOM\n24 Feb)","flat","1,780.00","35,564.40"],
        ["4","SKIM RUBBER (SB Grade)\nMoisture ≤ 1.0%  |  Ash ≤ 2.0%\nBale wt. ≈ 33.3 kg\nNot for food contact use\nContainer: 20'GP #2 (shared w/ STR-5L)\nRefrigerated hold NOT required",
         "4001.29","180\nbales","5.994\nDMT","6.174\nGMT","0.9500\n(spot\nprice)","flat","950.00","5,694.30"],
    ]
    tot=[["","GRAND TOTAL — 4 RUBBER GRADES",""," 1,400\nbales",
          "58.959\nDMT","61.187\nGMT","","","",
          Paragraph("<b>USD 104,350.50</b>",ParagraphStyle("",fontName="Helvetica-Bold",fontSize=8,textColor=TEAL,alignment=TA_RIGHT))]]
    pt=Table(pd_hdr+pd_rows+tot,colWidths=[6*mm,66*mm,9*mm,12*mm,14*mm,13*mm,14*mm,11*mm,13*mm,14*mm])
    pt.setStyle(TableStyle([
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),("FONTSIZE",(0,0),(-1,-1),7),
        ("BACKGROUND",(0,0),(-1,0),TEAL),("TEXTCOLOR",(0,0),(-1,0),WHITE),
        ("ROWBACKGROUNDS",(0,1),(-1,-2),[WHITE,colors.HexColor("#F0FAF5")]),
        ("BACKGROUND",(0,-1),(-1,-1),colors.HexColor("#D8F0E8")),
        ("FONTNAME",(0,-1),(-1,-1),"Helvetica-Bold"),
        ("GRID",(0,0),(-1,-1),0.3,MGRAY),
        ("ALIGN",(2,0),(-1,-1),"CENTER"),("ALIGN",(-1,0),(-1,-1),"RIGHT"),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
        ("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2),
        ("LEFTPADDING",(0,0),(-1,-1),2),
    ]))
    els+=[pt,Spacer(1,3*mm)]
    
    note=Table([[Paragraph(
        "<b>PRICING BASIS:</b>  SICOM (Singapore Commodity Exchange) weekly average reference price for week ending 24 February 2026, "
        "adjusted for grade premium/discount as agreed in contract SC-2026-SRI-JAP-089.  Final weight per SGS weight certificate.  "
        "Final invoice adjusted accordingly.<br/>"
        "<b>PHYTOSANITARY:</b>  Phytosanitary Certificate No. PH-DOA-2026-02-00789 enclosed — issued by Dept. of Agriculture, Thailand, "
        "confirming goods free from Pestalotiopsis sp. and other regulated pests.<br/>"
        "<b>TEMPERATURE:</b>  STR-5L and RSS-1 grades — standard dry container.  TSR-L requires temperature-monitored handling "
        "(optimum 15–25°C) to prevent blocking.  Skim Rubber — standard dry container.  "
        "<b>Note: No Reefer container required for this shipment</b> — original booking for 20'RF cancelled per buyer email 15 Feb 2026.",
        ParagraphStyle("",fontName="Helvetica",fontSize=7.5,leading=11))]],
    colWidths=[172*mm])
    note.setStyle(TableStyle([
        ("BOX",(0,0),(-1,-1),0.5,TEAL),("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#F0FAF5")),
        ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("LEFTPADDING",(0,0),(-1,-1),6),
    ]))
    els+=[note]
    doc.build(els,onFirstPage=pb_rub,onLaterPages=pb_rub)
    print(f"D1 done: {fn}")

make_C1()
make_D1()
print("Medical + Rubber done")
