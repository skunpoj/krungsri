"""
Comprehensive Thai SME Export Ledger — 700+ rows, 7 sheets, realistic complexity
"""
import openpyxl as ox; from openpyxl.styles import Font,PatternFill,Alignment,Border,Side,numbers
from openpyxl.chart import BarChart, Reference; from openpyxl.chart.series import DataPoint
import random; random.seed(42); from datetime import date,timedelta; import math

wb=ox.Workbook(); OUT="/home/claude/docs"
FNT="Arial"
def H(c): return PatternFill("solid",start_color=c)
def B(c): s=Side(style="thin",color=c); return Border(left=s,right=s,top=s,bottom=s)
thin=B("D0D0D0"); navy_b=B("003366")

products=[
    ("ข้าวหอมมะลิ 100%","1006.30",1.42,1.72,"Rice","THB/USD+AgriCom"),
    ("ข้าวนึ่ง","1006.30",0.55,0.72,"Rice","Parboiled"),
    ("แป้งมันสำปะหลัง","1108.14",0.38,0.52,"Tapioca","Starch"),
    ("มันสำปะหลังเส้น","0714.10",0.19,0.28,"Tapioca","Chip"),
    ("สับปะรดกระป๋อง","2008.20",0.88,1.12,"Canned","Pineapple"),
    ("ทุเรียนแช่แข็ง","0811.90",3.50,5.80,"Frozen","Durian"),
    ("ยางแผ่นรมควัน RSS-3","4001.21",1.65,2.10,"Rubber","RSS3"),
    ("ยาง TSR 20","4001.22",1.45,1.90,"Rubber","TSR20"),
    ("ถุงมือยางทางการแพทย์","4015.12",3.20,4.50,"Medical","Glove"),
    ("ชิ้นส่วนยานยนต์","8708.99",6.50,9.80,"Auto","Parts"),
    ("เครื่องประดับเงิน","7113.11",180,320,"Jewelry","Silver"),
    ("เฟอร์นิเจอร์ไม้ยาง","9403.60",85,160,"Furniture","Rubberwood"),
]
markets=[
    ("จีน","CN","CNY",1,"RCEP",0.03,8.0),("ญี่ปุ่น","JP","JPY",0,"J-TAEP",0.01,6.5),
    ("สหรัฐฯ","US","USD",1,"None",0.015,8.5),("เยอรมนี","DE","EUR",0,"TAFTA(neg)",0.01,5.5),
    ("เนเธอร์แลนด์","NL","EUR",0,"TAFTA(neg)",0.01,5.8),("อินเดีย","IN","INR",1,"TH-IN FTA",0.04,9.0),
    ("เวียดนาม","VN","VND",1,"ASEAN-0%",0.02,7.5),("สหรัฐอาหรับเอมิเรตส์","AE","AED",0,"None",0.025,6.0),
    ("ออสเตรเลีย","AU","AUD",0,"TAFTA",0.008,5.0),("เกาหลีใต้","KR","KRW",0,"ASEAN-KR",0.01,6.0),
    ("แคนาดา","CA","CAD",0,"None",0.012,5.5),("สหราชอาณาจักร","GB","GBP",0,"TH-UK FTA(neg)",0.012,5.5),
]
pay_terms=["T/T 30 days","T/T 60 days","L/C at sight","L/C 30 days","D/P at sight","D/A 60 days","T/T advance","Open Account 45 days"]
incoterms=["FOB Bangkok","FOB Laem Chabang","CIF","CIF Hamburg","CIF Rotterdam","CFR","EXW","DDP","FCA Bangkok"]
vessels=["EVER GIVEN 2","THAI PRESTIGE","GOLDEN GATE","COSCO PACIFIC","MSC DIANA","HAPAG ONE","MAERSK ALTAIR","WAN HAI 505","SITC COMPASS","ONE COMMITMENT"]
statuses=["Shipped","Shipped","Shipped","Arrived","Arrived","Invoiced & Paid","Invoiced & Paid","Partial Payment","Overdue","Dispute","Cancelled"]

# Generate 720 rows (Jan 2024 – Jun 2026)
rows=[]
inv_seq=1000
start=date(2024,1,1)
for day_off in range(0,900,1):
    d=start+timedelta(days=day_off)
    if d>date(2026,6,30): break
    n_ship=random.choices([0,1,2,3],[0.4,0.35,0.2,0.05])[0]
    for _ in range(n_ship):
        prod=random.choice(products)
        mkt=random.choice(markets)
        # Seasonal factor
        month=d.month
        seasonal=1.0+0.15*math.sin((month-3)*math.pi/6)
        # Price trend (slight inflation)
        months_in=((d.year-2024)*12+d.month)
        price=round(random.uniform(prod[2],prod[3])*seasonal*(1+0.002*months_in),4)
        qty=round(random.randint(5000,80000)/1000)*1000 if "ยาง" not in prod[0] and "ชิ้น" not in prod[0] else round(random.randint(1000,25000)/500)*500
        net_wt=qty
        gross_wt=round(qty*random.uniform(1.02,1.08))
        fob=round(qty*price*random.uniform(0.95,1.05))
        freight=round(fob*random.uniform(0.03,0.08))
        insurance=round(fob*0.0012)
        cif=fob+freight+insurance
        # Payment
        pt=random.choice(pay_terms)
        due_days=30 if "30" in pt else (60 if "60" in pt else (45 if "45" in pt else 0))
        etd=d+timedelta(days=random.randint(5,20))
        due=etd+timedelta(days=due_days) if due_days>0 else etd
        # Status
        if d<date(2025,10,1): st=random.choices(statuses[:8],[5,5,3,3,4,4,4,2])[0]
        elif d<date(2026,3,1): st=random.choices(statuses[:9],[3,3,2,2,3,4,4,3,2])[0]
        else: st=random.choices(statuses[:7],[1,2,2,2,2,1,1])[0]
        # Payment received
        if "Paid" in st: 
            rec=due+timedelta(days=random.randint(-5,15))
            overdue=max(0,(rec-due).days)
            paid=fob+freight
        elif st=="Overdue":
            rec=None; overdue=(date(2026,6,30)-due).days; paid=round(fob*0.3)
        elif st=="Partial Payment":
            rec=None; overdue=0; paid=round(fob*0.5)
        else:
            rec=None; overdue=0; paid=0
        vessel=random.choice(vessels)
        eta=etd+timedelta(days=random.randint(12,35))
        inv_no=f"INV-{d.year}-{inv_seq:05d}"
        inv_seq+=1
        rows.append([
            d.isoformat()[:7],         # เดือน
            d.isoformat(),              # วันที่จัดส่ง
            inv_no,                     # เลขที่ Invoice
            f"SC-{d.year}-{random.randint(1000,9999)}",  # สัญญา
            prod[0],                    # สินค้า
            prod[1],                    # HS Code
            prod[4],                    # ประเภท
            prod[5],                    # หมายเหตุสินค้า
            mkt[0],                     # ประเทศ
            mkt[1],                     # รหัส
            mkt[2],                     # สกุลเงินปลายทาง
            mkt[4],                     # FTA
            net_wt,                     # น้ำหนักสุทธิ (kg)
            gross_wt,                   # น้ำหนักรวม (kg)
            price,                      # ราคา/kg (USD)
            fob,                        # มูลค่า FOB (USD)
            freight,                    # ค่าขนส่ง (USD)
            insurance,                  # ประกัน (USD)
            cif,                        # มูลค่า CIF (USD)
            pt,                         # เงื่อนไขการชำระ
            etd.isoformat(),            # ETD
            eta.isoformat(),            # ETA (ประมาณ)
            vessel,                     # เรือ
            due.isoformat(),            # กำหนดชำระ
            rec.isoformat() if rec else "",  # วันที่รับเงิน
            overdue,                    # เกินกำหนด (วัน)
            paid,                       # รับแล้ว (USD)
            st,                         # สถานะ
            incoterms[random.randint(0,len(incoterms)-1)],  # Incoterms
            f"REF-{random.randint(10000,99999)}",   # อ้างอิง Forwarder
        ])

# ── Sheet 1: ข้อมูลดิบ ───────────────────────────────────────────────────────
ws1=wb.active; ws1.title="ข้อมูลดิบ"
hdrs=["เดือน","วันที่ ETD","เลขที่ Invoice","เลขที่สัญญา","สินค้า","HS Code","กลุ่มสินค้า","รายละเอียดสินค้า","ประเทศปลายทาง","รหัสประเทศ","สกุลเงินปลายทาง","FTA ที่ใช้","น้ำหนักสุทธิ (kg)","น้ำหนักรวม (kg)","ราคาต่อ kg (USD)","มูลค่า FOB (USD)","ค่าขนส่ง (USD)","เบี้ยประกัน (USD)","มูลค่า CIF (USD)","เงื่อนไขการชำระ","ETD (วันที่จัดส่ง)","ETA (วันที่ถึง)","ชื่อเรือ","กำหนดชำระเงิน","วันที่รับเงินจริง","เกินกำหนด (วัน)","รับแล้ว (USD)","สถานะ","Incoterms","อ้างอิง Forwarder"]
for c,h in enumerate(hdrs,1):
    cell=ws1.cell(1,c,h)
    cell.font=Font(name=FNT,bold=True,color="FFFFFF",size=9)
    cell.fill=H("003366"); cell.alignment=Alignment(horizontal="center",wrap_text=True)
    cell.border=navy_b
ws1.row_dimensions[1].height=28
ws1.freeze_panes="A2"
for ri,row in enumerate(rows,2):
    for ci,val in enumerate(row,1):
        c=ws1.cell(ri,ci,val)
        c.font=Font(name=FNT,size=9)
        c.border=thin
        if ci in [13,14,16,17,18,19,27]: c.number_format="#,##0"
        if ci==15: c.number_format="0.0000"
        if ci==26: 
            c.fill=H("FFCCCC") if val>30 else H("FFF8CC") if val>0 else H("FFFFFF")
        if ci==28:
            colors_map={"Shipped":"CCE5FF","Arrived":"D5F5E3","Invoiced & Paid":"D5F5E3","Dispute":"FFE0B2","Overdue":"FFCCCC","Cancelled":"E8E8E8","Partial Payment":"FFF8CC","Invoiced":"FFFFFF"}
            for k,v in colors_map.items():
                if k in str(val): c.fill=H(v); break
ws1.column_dimensions["A"].width=8
for col,wd in [("B",11),("C",16),("D",14),("E",20),("F",10),("G",10),("H",14),("I",16),("J",8),("K",8),("L",10),("M",14),("N",14),("O",10),("P",14),("Q",10),("R",9),("S",14),("T",16),("U",11),("V",11),("W",18),("X",11),("Y",13),("Z",11),("AA",12),("AB",16),("AC",14),("AD",15)]:
    ws1.column_dimensions[col].width=wd
ws1.auto_filter.ref=f"A1:AD1"
print(f"Sheet 1 done: {len(rows)} rows")

# ── Sheet 2: สรุปตามตลาด ─────────────────────────────────────────────────────
ws2=wb.create_sheet("สรุปตามตลาด")
from collections import defaultdict
by_mkt=defaultdict(lambda:{"cif":0,"fob":0,"n":0,"overdue":0})
for r in rows:
    m=r[8]; by_mkt[m]["cif"]+=r[18]; by_mkt[m]["fob"]+=r[15]; by_mkt[m]["n"]+=1
    by_mkt[m]["overdue"]+=(1 if r[25]>0 else 0)
ws2_hdrs=["ประเทศ","จำนวน Shipment","มูลค่า FOB รวม (USD)","มูลค่า CIF รวม (USD)","% ของ FOB ทั้งหมด","Shipments เกินกำหนด","% เกินกำหนด","เฉลี่ย FOB/Shipment"]
for c,h in enumerate(ws2_hdrs,1):
    cell=ws2.cell(1,c,h); cell.font=Font(name=FNT,bold=True,color="FFFFFF",size=9)
    cell.fill=H("006B6B"); cell.alignment=Alignment(horizontal="center",wrap_text=True); cell.border=navy_b
ws2.row_dimensions[1].height=24
total_fob=sum(v["fob"] for v in by_mkt.values())
for ri,(mkt,v) in enumerate(sorted(by_mkt.items(),key=lambda x:-x[1]["fob"]),2):
    pct=v["fob"]/total_fob if total_fob else 0
    late_pct=v["overdue"]/v["n"] if v["n"] else 0
    avg=v["fob"]/v["n"] if v["n"] else 0
    row_data=[mkt,v["n"],v["fob"],v["cif"],pct,v["overdue"],late_pct,avg]
    for ci,val in enumerate(row_data,1):
        c=ws2.cell(ri,ci,val); c.font=Font(name=FNT,size=9); c.border=thin
        if ci in [3,4,8]: c.number_format="#,##0"
        if ci==5: c.number_format="0.0%"
        if ci==7: 
            c.number_format="0.0%"
            c.fill=H("FFCCCC") if val>0.15 else H("FFF8CC") if val>0.05 else H("D5F5E3")
    ws2.cell(ri,1).fill=H("F0FAF5") if ri%2==0 else H("FFFFFF")
for col,wd in [("A",18),("B",14),("C",16),("D",16),("E",12),("F",14),("G",12),("H",16)]:
    ws2.column_dimensions[col].width=wd

# ── Sheet 3: ค่าใช้จ่ายและกำไร ──────────────────────────────────────────────
ws3=wb.create_sheet("ต้นทุนและกำไร")
by_prod=defaultdict(lambda:{"fob":0,"freight":0,"ins":0,"n":0})
for r in rows:
    p=r[4]; by_prod[p]["fob"]+=r[15]; by_prod[p]["freight"]+=r[16]; by_prod[p]["ins"]+=r[17]; by_prod[p]["n"]+=1
ws3_hdrs=["สินค้า","HS Code","จำนวน Shipment","มูลค่า FOB รวม (USD)","ค่าขนส่งรวม (USD)","ค่าประกันรวม (USD)","มูลค่า CIF รวม (USD)","อัตราค่าขนส่ง %","อัตราประกัน %","เฉลี่ย FOB/Shipment (USD)"]
for c,h in enumerate(ws3_hdrs,1):
    cell=ws3.cell(1,c,h); cell.font=Font(name=FNT,bold=True,color="FFFFFF",size=9)
    cell.fill=H("4B0082"); cell.alignment=Alignment(horizontal="center",wrap_text=True); cell.border=navy_b
ws3.row_dimensions[1].height=24
prod_hs={r[4]:r[5] for r in rows}
for ri,(prod,v) in enumerate(sorted(by_prod.items(),key=lambda x:-x[1]["fob"]),2):
    cif=v["fob"]+v["freight"]+v["ins"]
    fr_pct=v["freight"]/v["fob"] if v["fob"] else 0
    ins_pct=v["ins"]/v["fob"] if v["fob"] else 0
    avg=v["fob"]/v["n"] if v["n"] else 0
    row_data=[prod,prod_hs.get(prod,""),v["n"],v["fob"],v["freight"],v["ins"],cif,fr_pct,ins_pct,avg]
    for ci,val in enumerate(row_data,1):
        c=ws3.cell(ri,ci,val); c.font=Font(name=FNT,size=9); c.border=thin
        if ci in [4,5,6,7,10]: c.number_format="#,##0"
        if ci in [8,9]: c.number_format="0.00%"
    ws3.cell(ri,1).fill=H("F8F4FF") if ri%2==0 else H("FFFFFF")
for col,wd in [("A",22),("B",10),("C",14),("D",16),("E",16),("F",14),("G",16),("H",12),("I",10),("J",18)]:
    ws3.column_dimensions[col].width=wd

# ── Sheet 4: การชำระเงิน (ยากมาก — mixed status, overdue) ───────────────────
ws4=wb.create_sheet("การชำระและค้างชำระ")
overdue_rows=[r for r in rows if r[25]>0 or r[27]=="Dispute"]
ws4_hdrs=["เลขที่ Invoice","สินค้า","ประเทศ","มูลค่า CIF (USD)","รับแล้ว (USD)","คงค้าง (USD)","กำหนดชำระ","เกินกำหนด (วัน)","เงื่อนไขการชำระ","สถานะ","หมายเหตุ"]
for c,h in enumerate(ws4_hdrs,1):
    cell=ws4.cell(1,c,h); cell.font=Font(name=FNT,bold=True,color="FFFFFF",size=9)
    cell.fill=H("CC0000"); cell.alignment=Alignment(horizontal="center",wrap_text=True); cell.border=navy_b
ws4.row_dimensions[1].height=24
for ri,r in enumerate(overdue_rows[:150],2):
    outstanding=r[18]-r[26]
    note="ส่งหนังสือทวงถาม" if r[25]>60 else "ติดตามทางโทรศัพท์" if r[25]>30 else "แจ้งเตือนครั้งที่ 1" if r[25]>0 else "ข้อพิพาทด้านคุณภาพ"
    row_data=[r[2],r[4],r[8],r[18],r[26],outstanding,r[23],r[25],r[19],r[27],note]
    for ci,val in enumerate(row_data,1):
        c=ws4.cell(ri,ci,val); c.font=Font(name=FNT,size=9); c.border=thin
        if ci in [4,5,6]: c.number_format="#,##0"
        if ci==8:
            c.fill=H("FF4444") if val>90 else H("FF8800") if val>60 else H("FFCC00") if val>30 else H("FFFFCC")
            c.font=Font(name=FNT,size=9,bold=(val>60),color=("FFFFFF" if val>90 else "000000"))
for col,wd in [("A",16),("B",20),("C",14),("D",14),("E",14),("F",14),("G",11),("H",12),("I",15),("J",16),("K",22)]:
    ws4.column_dimensions[col].width=wd

# ── Sheet 5: สรุปรายไตรมาส ───────────────────────────────────────────────────
ws5=wb.create_sheet("สรุปรายไตรมาส")
by_q=defaultdict(lambda:{"fob":0,"cif":0,"n":0,"paid":0})
for r in rows:
    yr=r[1][:4]; mo=int(r[1][5:7]); q=f"{yr}-Q{(mo-1)//3+1}"
    by_q[q]["fob"]+=r[15]; by_q[q]["cif"]+=r[18]; by_q[q]["n"]+=1; by_q[q]["paid"]+=r[26]
ws5_hdrs=["ไตรมาส","จำนวน Shipment","มูลค่า FOB รวม (USD)","มูลค่า CIF รวม (USD)","รับชำระแล้ว (USD)","% รับชำระ","เติบโต FOB QoQ %"]
for c,h in enumerate(ws5_hdrs,1):
    cell=ws5.cell(1,c,h); cell.font=Font(name=FNT,bold=True,color="FFFFFF",size=9)
    cell.fill=H("0066CC"); cell.alignment=Alignment(horizontal="center",wrap_text=True); cell.border=navy_b
ws5.row_dimensions[1].height=24
sorted_q=sorted(by_q.items())
prev_fob=0
for ri,(q,v) in enumerate(sorted_q,2):
    qoq=((v["fob"]-prev_fob)/prev_fob) if prev_fob>0 else 0
    coll_pct=v["paid"]/v["cif"] if v["cif"] else 0
    row_data=[q,v["n"],v["fob"],v["cif"],v["paid"],coll_pct,qoq if ri>2 else "—"]
    for ci,val in enumerate(row_data,1):
        c=ws5.cell(ri,ci,val); c.font=Font(name=FNT,size=9); c.border=thin
        if ci in [3,4,5]: c.number_format="#,##0"
        if ci==6: c.number_format="0.0%"
        if ci==7 and isinstance(val,float):
            c.number_format="0.0%"
            c.fill=H("D5F5E3") if val>0 else H("FFCCCC")
    prev_fob=v["fob"]
    ws5.cell(ri,1).fill=H("CCE5FF") if ri%2==0 else H("FFFFFF")
for col,wd in [("A",10),("B",14),("C",16),("D",16),("E",16),("F",12),("G",14)]:
    ws5.column_dimensions[col].width=wd

# ── Sheet 6: ลูกค้าและผู้ซื้อ ────────────────────────────────────────────────
ws6=wb.create_sheet("ลูกค้าและผู้ซื้อ")
buyers_sample=[
    ["Tanaka Foods K.K.","JP","ญี่ปุ่น","ข้าวหอมมะลิ","3 years","A","Excellent","tanaka@tanaka-foods.jp","+81-3-5555-1234","L/C at sight","Y","SGS inspection required"],
    ["BioNatur GmbH","DE","เยอรมนี","ข้าวหอมมะลิ, มันสำปะหลัง","2 years","A","Good","import@bionatur.de","+49-89-3456789","T/T 30 days","Y","Organic cert required"],
    ["Shanghai Fresh Import Co.","CN","จีน","ทุเรียนแช่แข็ง","1 year","B","Good","fresh@sh-import.cn","+86-21-5555-9999","T/T 60 days","N","Volume buyer, seasonal"],
    ["Sumitomo Rubber Ind.","JP","ญี่ปุ่น","ยางแผ่น RSS, TSR","5 years","A","Premium","rubber@sumitomo.co.jp","+81-78-265-3000","D/P at sight","Y","SGS + SICOM pricing"],
    ["MedSupply Benelux B.V.","NL","เนเธอร์แลนด์","ถุงมือยาง Medical","3 years","A","Excellent","med@medsupply.nl","+31-20-555-7890","T/T 30 days","Y","FDA/CE/ISO required"],
    ["Patel Trading LLC","AE","UAE","สับปะรดกระป๋อง","2 years","B","Fair","patel@pateltrading.ae","+971-4-555-3456","T/T advance","N","Slower payment, new market"],
    ["REWE Group","DE","เยอรมนี","สินค้าเกษตร","1 year","B+","Good","import@rewe.de","+49-221-1490","Open Account 45","Y","Large EU retailer"],
    ["Carrefour International","FR","ฝรั่งเศส","อาหารแปรรูป","New","C","Under review","","","L/C","N","New buyer 2026"],
    ["Walmart Global Sourcing","US","สหรัฐฯ","เฟอร์นิเจอร์","4 years","A","Strategic","wgs@walmart.com","+1-479-555-0001","T/T 60 days","N","Large volume, strict compliance"],
    ["Mumbai Agro Pvt Ltd","IN","อินเดีย","มันสำปะหลัง","New","B","Developing","agro@mumbaiagro.in","+91-22-5555-8888","L/C at sight","N","High growth market"],
]
ws6_hdrs=["บริษัทผู้ซื้อ","รหัสประเทศ","ประเทศ","สินค้าหลักที่ซื้อ","อายุความสัมพันธ์","Credit Rating","สถานะ","อีเมล","โทรศัพท์","เงื่อนไขชำระ","สัญญาหลัก","หมายเหตุ"]
for c,h in enumerate(ws6_hdrs,1):
    cell=ws6.cell(1,c,h); cell.font=Font(name=FNT,bold=True,color="FFFFFF",size=9)
    cell.fill=H("1A5276"); cell.alignment=Alignment(horizontal="center",wrap_text=True); cell.border=navy_b
ws6.row_dimensions[1].height=24
for ri,row in enumerate(buyers_sample,2):
    for ci,val in enumerate(row,1):
        c=ws6.cell(ri,ci,val); c.font=Font(name=FNT,size=9); c.border=thin
        if ci==6:
            c.fill=H("D5F5E3") if val=="A" else H("D5F5E3") if val=="A+" else H("FFF8CC") if val=="B" else H("FFCCCC") if val=="C" else H("E8F8E8") if "B+" in str(val) else H("FFFFFF")
for col,wd in [("A",24),("B",8),("C",12),("D",24),("E",16),("F",12),("G",14),("H",26),("I",18),("J",18),("K",12),("L",28)]:
    ws6.column_dimensions[col].width=wd

# ── Sheet 7: คำอธิบาย (Usage guide) ──────────────────────────────────────────
ws7=wb.create_sheet("วิธีใช้ไฟล์นี้")
guide=[
    ["THAI SME EXPORT OPERATIONS DATA  |  ไฟล์ข้อมูลส่งออก SME ไทย  2024-2026",""],
    ["",""],
    ["วัตถุประสงค์:","สำหรับทดลองอัปโหลดให้ AI วิเคราะห์ใน Workshop 'AI for SME Export Business'"],
    ["สร้างโดย:","ผู้จัดงาน Workshop  (ข้อมูลสมมติ — ไม่ใช่ข้อมูลจริงของบริษัทใด)"],
    ["จำนวนข้อมูล:",f"{len(rows)} shipments  |  {len(products)} ประเภทสินค้า  |  {len(markets)} ตลาดส่งออก  |  ม.ค. 2024 – มิ.ย. 2026"],
    ["",""],
    ["Sheet 1 — ข้อมูลดิบ:",f"บันทึก shipment ทั้งหมด {len(rows)} รายการ (สินค้า, ประเทศ, ราคา, ค่าขนส่ง, สถานะ ฯลฯ)"],
    ["Sheet 2 — สรุปตามตลาด:","มูลค่ารวมแยกตามประเทศปลายทาง + อัตราการค้างชำระ"],
    ["Sheet 3 — ต้นทุนและกำไร:","วิเคราะห์ต้นทุน (FOB, freight, insurance) แยกตามสินค้า"],
    ["Sheet 4 — การชำระและค้างชำระ:","รายการที่เกินกำหนดชำระ / มีปัญหา — สำหรับวิเคราะห์ credit risk"],
    ["Sheet 5 — สรุปรายไตรมาส:","แนวโน้มการเติบโต QoQ + อัตราการรับชำระ"],
    ["Sheet 6 — ลูกค้าและผู้ซื้อ:","ข้อมูลลูกค้า credit rating เงื่อนไข ความสัมพันธ์"],
    ["",""],
    ["ตัวอย่าง Keyword สำหรับ HOW TO 1:",""],
    ["Keyword 1:",'"จากไฟล์ข้อมูลส่งออกนี้ ช่วยวิเคราะห์ Top 5 ตลาดที่มีโอกาสสูงสุดปี 2026 พร้อมเหตุผลและตัวเลข"'],
    ["Keyword 2:",'"ตลาดไหนมีอัตราค้างชำระสูงสุด และสินค้าอะไรทำกำไรได้ดีที่สุด วิเคราะห์พร้อมแนะนำกลยุทธ์"'],
    ["Keyword 3:",'"ช่วยสร้างรายงานสรุป Executive Summary ของธุรกิจส่งออกนี้ สำหรับนำเสนอต่อธนาคารเพื่อขอสินเชื่อ"'],
    ["Keyword 4 (ยาก):",'"ระบุลูกค้ากลุ่มเสี่ยงที่อาจมีปัญหาชำระเงิน และเสนอวิธีบริหารความเสี่ยง Credit พร้อมวิธีทำสัญญาที่ดีขึ้น"'],
    ["",""],
    ["หมายเหตุ:","ข้อมูลนี้เป็นตัวอย่างสมมติ เพื่อการฝึกอบรมเท่านั้น"],
]
for ri,(a,b) in enumerate(guide,1):
    c1=ws7.cell(ri,1,a); c2=ws7.cell(ri,2,b)
    if ri==1: c1.font=Font(name=FNT,bold=True,size=13,color="003366")
    elif a.endswith(":"): c1.font=Font(name=FNT,bold=True,size=10)
    else: c1.font=Font(name=FNT,size=10)
    c2.font=Font(name=FNT,size=10)
ws7.column_dimensions["A"].width=32; ws7.column_dimensions["B"].width=90

fn=f"{OUT}/HOW_TO_1_Thai_SME_Export_Operations_2024-2026.xlsx"
wb.save(fn); print(f"Excel done: {fn}  ({len(rows)} rows)")
