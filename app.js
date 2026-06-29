/* =============================================================================
   Leather AI Sales Assistant — app.js
   Local-first vanilla JS app. No backend, no external API calls.
   All product / FAQ / use-case / price / lead-time data lives in this file
   (DEMO_DATA) and is mirrored in /data/*.json for reference & easy editing.
   Everything else (leads, chat log, edited KB data, language) is persisted
   to localStorage so the app keeps working fully offline after first load.
   ============================================================================= */

(function () {
  "use strict";

  /* ===========================================================================
     1. EMBEDDED DEMO DATA
     Embedded directly (not fetched) so the app works when index.html is opened
     by double-click via file:// — browsers block fetch() of local JSON in that
     mode. The companion /data/*.json files contain the same content for anyone
     who wants to inspect/edit the "source of truth" outside the app.
     =========================================================================== */
  const DEMO_DATA = {
    products: [
      { id: "P001", productName: "Royal Heritage Genuine Leather", category: "genuine leather", collection: "Heritage Hospitality Collection", colors: ["Cognac Brown","Espresso","Ivory Cream","Charcoal"], thickness: "1.2-1.4 mm", width: "140 cm", properties: ["abrasion resistant","UV resistant (moderate)","breathable","natural grain"], certificates: ["SGS"], bestFor: ["Hotel / Hospitality","Office Furniture","Residential"], notRecommendedFor: ["Yacht / Marine","Aviation","Hospital"], priceRetail: "2,450 บาท/เมตร", priceProject: "ขึ้นอยู่กับปริมาณ ติดต่อ AE เพื่อราคาโครงการ", minimumOrder: "10 เมตร", discountNote: "สั่งเกิน 200 เมตร รับส่วนลดโครงการ (ให้ AE คำนวณ)", stockStatus: "In stock", leadTimeStock: "3-5 วันทำการ", leadTimeMadeToOrder: "20-25 วันทำการ (สีพิเศษ)", deliveryNote: "จัดส่งทั่วประเทศ ผ่านขนส่งคู่สัญญา", warrantyNote: "รับประกันคุณภาพการผลิต 1 ปี", cleaningCare: "เช็ดด้วยผ้านุ่มชุบน้ำหมาดๆ หลีกเลี่ยงแอลกอฮอล์เข้มข้นและแสงแดดจัดต่อเนื่อง", specFileName: "spec-royal-heritage-genuine.pdf", imageUrl: "", internalNote: "มาร์จิ้นสูง เหมาะเสนอลูกค้าโรงแรมระดับ 4-5 ดาว" },
      { id: "P002", productName: "Marine Pro Synthetic Leather", category: "marine", collection: "Marine Grade Collection", colors: ["Navy Blue","Sand Beige","Pearl White","Graphite"], thickness: "1.0-1.1 mm", width: "137 cm", properties: ["water resistant","UV resistant","salt-spray resistant","hydrolysis resistant","abrasion resistant"], certificates: ["IMO","SGS"], bestFor: ["Yacht / Marine"], notRecommendedFor: ["Hospital"], priceRetail: "1,890 บาท/เมตร", priceProject: "ราคาโครงการแจ้งโดย AE ตามขนาดเรือและปริมาณ", minimumOrder: "20 เมตร", discountNote: "ให้ AE ตรวจสอบส่วนลดตามรอบการสั่งซื้อ", stockStatus: "In stock (สีหลัก) / Made-to-order (สีพิเศษ)", leadTimeStock: "5-7 วันทำการ", leadTimeMadeToOrder: "30-35 วันทำการ", deliveryNote: "รองรับจัดส่งไปยังอู่เรือ/ท่าเรือทั่วประเทศ", warrantyNote: "รับประกันการลอกล่อนและซีดจากแสงแดด 18 เดือน", cleaningCare: "ล้างด้วยน้ำสะอาดผสมน้ำยาทำความสะอาดสูตรอ่อน ห้ามใช้สารฟอกขาว", specFileName: "spec-marine-pro.pdf", imageUrl: "", internalNote: "ต้องแจ้งลูกค้าให้ตรวจสอบใบรับรอง IMO กับ AE ก่อนใช้งานในเรือพาณิชย์" },
      { id: "P003", productName: "AeroFlex Aviation Leather", category: "aviation", collection: "Aviation Grade Collection", colors: ["Slate Grey","Cabin Cream","Onyx Black"], thickness: "0.9-1.0 mm", width: "140 cm", properties: ["fire retardant","low smoke toxicity","abrasion resistant","lightweight"], certificates: ["FAR 25.853","SGS"], bestFor: ["Aviation"], notRecommendedFor: ["Yacht / Marine (exterior)","Hospital"], priceRetail: "ราคาตามสเปกเครื่องบิน ติดต่อ AE", priceProject: "ติดต่อ AE เพื่อใบเสนอราคาเฉพาะโครงการ", minimumOrder: "ตามสเปกที่นั่ง ติดต่อ AE", discountNote: "ให้ AE ตรวจสอบ ไม่มีส่วนลดมาตรฐาน", stockStatus: "Made-to-order", leadTimeStock: "ไม่มีสต๊อกพร้อมส่ง", leadTimeMadeToOrder: "45-60 วันทำการ (ต้องผ่านการทดสอบ certificate)", deliveryNote: "จัดส่งพร้อมเอกสารรับรองตามมาตรฐานการบิน", warrantyNote: "รับประกันตามสเปกที่ระบุในสัญญาโครงการ", cleaningCare: "ทำความสะอาดตามคู่มือบำรุงรักษาเฉพาะของสายการบิน", specFileName: "spec-aeroflex-aviation.pdf", imageUrl: "", internalNote: "ต้องให้ AE และทีมเทคนิคยืนยัน certificate ทุกครั้งก่อนเสนอราคา" },
      { id: "P004", productName: "OfficePro Microfiber Leather", category: "microfiber", collection: "Workspace Collection", colors: ["Stone Grey","Mocha","Black","Light Taupe"], thickness: "1.0 mm", width: "140 cm", properties: ["abrasion resistant","stain resistant","breathable","lightweight"], certificates: ["SGS"], bestFor: ["Office Furniture","Cinema","Residential"], notRecommendedFor: ["Yacht / Marine","Aviation"], priceRetail: "990 บาท/เมตร", priceProject: "ราคาพิเศษสำหรับงานโครงการปริมาณมาก ติดต่อ AE", minimumOrder: "10 เมตร", discountNote: "สั่งเกิน 500 เมตร มีส่วนลดขั้นบันได ให้ AE ยืนยัน", stockStatus: "In stock", leadTimeStock: "2-4 วันทำการ", leadTimeMadeToOrder: "15-20 วันทำการ", deliveryNote: "จัดส่งทั่วประเทศ", warrantyNote: "รับประกันการแตกลายงา 1 ปี", cleaningCare: "เช็ดด้วยผ้าชุบน้ำหมาดๆ ใช้น้ำยาทำความสะอาดเฟอร์นิเจอร์สำนักงานทั่วไปได้", specFileName: "spec-officepro-microfiber.pdf", imageUrl: "", internalNote: "สินค้าขายดีสำหรับงานออฟฟิศ ราคาแข่งขันได้สูง" },
      { id: "P005", productName: "CinemaGuard Fire Retardant Synthetic Leather", category: "synthetic leather", collection: "Public Space Safety Collection", colors: ["Deep Red","Charcoal Black","Royal Blue"], thickness: "1.1-1.3 mm", width: "137 cm", properties: ["fire retardant","abrasion resistant","stain resistant","easy clean"], certificates: ["SGS","Intertek"], bestFor: ["Cinema","Hotel / Hospitality"], notRecommendedFor: ["Aviation","Yacht / Marine"], priceRetail: "1,350 บาท/เมตร", priceProject: "ราคาพิเศษงานโรงภาพยนตร์/ห้องประชุมขนาดใหญ่ ติดต่อ AE", minimumOrder: "30 เมตร", discountNote: "ให้ AE ตรวจสอบส่วนลดงานโครงการ", stockStatus: "In stock (สีหลัก)", leadTimeStock: "5-7 วันทำการ", leadTimeMadeToOrder: "20-25 วันทำการ", deliveryNote: "จัดส่งพร้อมเอกสาร certificate กันไฟ", warrantyNote: "รับประกันคุณสมบัติกันไฟตามมาตรฐานที่ระบุใน certificate 2 ปี", cleaningCare: "เช็ดด้วยผ้านุ่ม น้ำยาทำความสะอาดสูตรกลาง ห้ามใช้สารกัดกร่อน", specFileName: "spec-cinemaguard-fr.pdf", imageUrl: "", internalNote: "เน้นขายงานโรงภาพยนตร์ ห้องประชุม และพื้นที่สาธารณะ" },
      { id: "P006", productName: "MediClean Medical Grade Synthetic Leather", category: "synthetic leather", collection: "Healthcare Collection", colors: ["Soft White","Sky Blue","Mint Green","Warm Grey"], thickness: "1.0-1.2 mm", width: "137 cm", properties: ["antibacterial","stain resistant","easy clean","abrasion resistant"], certificates: ["SGS","Intertek"], bestFor: ["Hospital"], notRecommendedFor: ["Yacht / Marine","Aviation"], priceRetail: "1,590 บาท/เมตร", priceProject: "ราคาพิเศษสำหรับโรงพยาบาล/คลินิก ติดต่อ AE", minimumOrder: "20 เมตร", discountNote: "ให้ AE ตรวจสอบส่วนลดงานสถานพยาบาล", stockStatus: "In stock", leadTimeStock: "5-7 วันทำการ", leadTimeMadeToOrder: "20 วันทำการ", deliveryNote: "จัดส่งพร้อมเอกสารรับรองด้านสุขอนามัย", warrantyNote: "รับประกันคุณสมบัติต้านเชื้อแบคทีเรีย 1 ปี", cleaningCare: "ทนต่อแอลกอฮอล์และน้ำยาฆ่าเชื้อมาตรฐานโรงพยาบาล", specFileName: "spec-mediclean-medical.pdf", imageUrl: "", internalNote: "ย้ำกับลูกค้าให้ตรวจสอบ certificate กับ AE เสมอ" },
      { id: "P007", productName: "SunArmor UV Resistant Outdoor Leatherette", category: "synthetic leather", collection: "Outdoor Collection", colors: ["Terracotta","Olive Green","Sand","Charcoal"], thickness: "1.0 mm", width: "137 cm", properties: ["UV resistant","water resistant","fade resistant","abrasion resistant"], certificates: ["SGS"], bestFor: ["Residential","Hotel / Hospitality"], notRecommendedFor: ["Aviation","Hospital"], priceRetail: "1,190 บาท/เมตร", priceProject: "ราคาพิเศษสำหรับงานสวน/ระเบียง/พื้นที่กลางแจ้งขนาดใหญ่ ติดต่อ AE", minimumOrder: "15 เมตร", discountNote: "ให้ AE ตรวจสอบส่วนลดงานโครงการรีสอร์ท", stockStatus: "In stock (สีหลัก)", leadTimeStock: "4-6 วันทำการ", leadTimeMadeToOrder: "18-22 วันทำการ", deliveryNote: "จัดส่งทั่วประเทศ", warrantyNote: "รับประกันการซีดจากแสงแดด 2 ปี", cleaningCare: "ล้างด้วยน้ำสะอาด ผึ่งให้แห้งในที่ไม่อับชื้น", specFileName: "spec-sunarmor-outdoor.pdf", imageUrl: "", internalNote: "เหมาะกับรีสอร์ท สวน ระเบียง พื้นที่ภายนอก" },
      { id: "P008", productName: "DriveStyle Automotive Upholstery Leather", category: "synthetic leather", collection: "Automotive Collection", colors: ["Jet Black","Saddle Tan","Pearl Grey","Burgundy"], thickness: "0.9-1.1 mm", width: "140 cm", properties: ["abrasion resistant","heat resistant (moderate)","stain resistant"], certificates: ["SGS"], bestFor: ["Automotive"], notRecommendedFor: ["Aviation","Hospital"], priceRetail: "1,490 บาท/เมตร", priceProject: "ราคาพิเศษสำหรับอู่/โรงงานหุ้มเบาะปริมาณมาก ติดต่อ AE", minimumOrder: "10 เมตร", discountNote: "ให้ AE ตรวจสอบส่วนลดตามปริมาณการสั่งซื้อ", stockStatus: "In stock", leadTimeStock: "3-5 วันทำการ", leadTimeMadeToOrder: "15-18 วันทำการ", deliveryNote: "จัดส่งทั่วประเทศ", warrantyNote: "รับประกันการแตกลายงาและสีซีด 1 ปี", cleaningCare: "เช็ดด้วยผ้านุ่มชุบน้ำยาทำความสะอาดเบาะรถยนต์โดยเฉพาะ", specFileName: "spec-drivestyle-automotive.pdf", imageUrl: "", internalNote: "นิยมในกลุ่มอู่หุ้มเบาะและงานแต่งรถ" }
    ],

    faqs: [
      { id:"F001", question:"หนังแท้กับหนังเทียมต่างกันอย่างไร", answer:"หนังแท้ (Genuine Leather) ผลิตจากหนังสัตว์จริง ให้สัมผัสและกลิ่นเฉพาะตัว ระบายอากาศได้ดี และมีลายธรรมชาติไม่ซ้ำกัน เหมาะกับงานพรีเมียมที่เน้นความหรูหรา ส่วนหนังเทียม/Microfiber ผลิตจากวัสดุสังเคราะห์ ควบคุมคุณสมบัติได้ตามต้องการ เช่น กันน้ำ กันไฟ ทนแดด และมักมีราคาคุ้มค่ากว่าสำหรับงานปริมาณมาก", relatedProducts:["P001","P004"], relatedUseCase:["Hotel / Hospitality","Residential"], riskLevel:"normal" },
      { id:"F002", question:"ทำไมราคาสูงกว่าเจ้าอื่น", answer:"ราคาสะท้อนคุณภาพวัตถุดิบ การผ่านมาตรฐานทดสอบ (เช่น SGS, Intertek, FAR, IMO) และการรับประกันที่ชัดเจน ทำให้สินค้ามีอายุการใช้งานยาวนานกว่าและลดความเสี่ยงด้านมาตรฐานความปลอดภัยในระยะยาว", relatedProducts:[], relatedUseCase:[], riskLevel:"needs AE confirmation" },
      { id:"F003", question:"กันไฟจริงไหม", answer:"เรามีสินค้าที่ผ่านมาตรฐานกันไฟ เช่น CinemaGuard Fire Retardant และ AeroFlex Aviation Leather ซึ่งมีใบรับรองตามมาตรฐานที่เกี่ยวข้อง อย่างไรก็ตามต้องให้ AE และทีมเทคนิคยืนยันใบรับรองให้ตรงกับสเปกที่ลูกค้าต้องการใช้งานจริงก่อนยืนยันการสั่งซื้อ", relatedProducts:["P003","P005"], relatedUseCase:["Aviation","Cinema"], riskLevel:"needs AE confirmation" },
      { id:"F004", question:"ใช้กับเรือได้ไหม", answer:"ใช้ได้ครับ/ค่ะ เรามี Marine Pro Synthetic Leather ที่ออกแบบมาเฉพาะสำหรับงานเรือ/yacht ทนน้ำเค็ม ทนแดด และมีใบรับรอง IMO กรุณาให้ AE ยืนยันรุ่นที่เหมาะกับพื้นที่ใช้งานอีกครั้ง", relatedProducts:["P002"], relatedUseCase:["Yacht / Marine"], riskLevel:"normal" },
      { id:"F005", question:"ใช้กับเครื่องบินได้ไหม", answer:"เรามี AeroFlex Aviation Leather ที่ออกแบบมาเฉพาะสำหรับเบาะที่นั่งเครื่องบิน ผ่านมาตรฐาน FAR 25.853 อย่างไรก็ตามทุกออเดอร์งาน aviation ต้องผ่านการตรวจสอบและยืนยัน certificate จากทีมเทคนิคและ AE ก่อนเสมอ", relatedProducts:["P003"], relatedUseCase:["Aviation"], riskLevel:"needs AE confirmation" },
      { id:"F006", question:"โดนแดดแล้วซีดไหม", answer:"สินค้าในกลุ่ม UV resistant เช่น Marine Pro และ SunArmor Outdoor Leatherette ได้รับการออกแบบให้ทนต่อแสงแดดและมีการรับประกันการซีดสีตามระยะเวลาที่ระบุ ส่วนหนังแท้ Royal Heritage มีความทนแดดระดับปานกลาง ควรหลีกเลี่ยงแสงแดดจัดต่อเนื่อง", relatedProducts:["P002","P007","P001"], relatedUseCase:["Yacht / Marine","Residential"], riskLevel:"normal" },
      { id:"F007", question:"ทำความสะอาดอย่างไร", answer:"โดยทั่วไปแนะนำให้เช็ดด้วยผ้านุ่มชุบน้ำหมาดๆ และหลีกเลี่ยงสารกัดกร่อนหรือแอลกอฮอล์เข้มข้น (ยกเว้นรุ่น MediClean ที่ออกแบบให้ทนแอลกอฮอล์และน้ำยาฆ่าเชื้อ) กรุณาดูคำแนะนำการดูแลเฉพาะของแต่ละรุ่นในสเปกสินค้า", relatedProducts:[], relatedUseCase:[], riskLevel:"normal" },
      { id:"F008", question:"มี sample ไหม", answer:"มีครับ/ค่ะ ลูกค้าสามารถขอ sample ได้ผ่านหน้า Product Finder หรือฟอร์มขอใบเสนอราคา ทีม AE จะจัดส่ง sample ตามรุ่นและสีที่สนใจให้ตรวจสอบสีและสัมผัสจริงก่อนตัดสินใจสั่งซื้อ", relatedProducts:[], relatedUseCase:[], riskLevel:"normal" },
      { id:"F009", question:"lead time กี่วัน", answer:"lead time แตกต่างกันตามสินค้าและสถานะสต๊อก โดยทั่วไปสินค้าที่มีสต๊อกพร้อมส่งใช้เวลา 2-7 วันทำการ ส่วนสินค้าสั่งผลิตพิเศษใช้เวลา 15-60 วันทำการขึ้นอยู่กับประเภทสินค้า กรุณาระบุรุ่นที่สนใจเพื่อให้ระบบตรวจสอบ lead time ที่แน่นอน", relatedProducts:[], relatedUseCase:[], riskLevel:"normal" },
      { id:"F010", question:"มีบริการจัดส่งไหม", answer:"มีบริการจัดส่งทั่วประเทศผ่านขนส่งคู่สัญญา สำหรับงานเฉพาะทาง เช่น เรือหรือเครื่องบิน จะมีการจัดส่งพร้อมเอกสารรับรองที่เกี่ยวข้อง กรุณาแจ้งจังหวัดจัดส่งในฟอร์มขอใบเสนอราคาเพื่อให้ AE คำนวณค่าจัดส่งและระยะเวลาที่แน่นอน", relatedProducts:[], relatedUseCase:[], riskLevel:"normal" },
      { id:"F011", question:"รับประกันไหม", answer:"สินค้าทุกรุ่นมีการรับประกันคุณภาพตามเงื่อนไขที่ระบุในสเปกสินค้า ระยะเวลาการรับประกันแตกต่างกันตามรุ่น กรุณาตรวจสอบเงื่อนไขการรับประกันเฉพาะรุ่นกับ AE", relatedProducts:[], relatedUseCase:[], riskLevel:"normal" },
      { id:"F012", question:"ขั้นต่ำในการสั่งเท่าไหร่", answer:"ขั้นต่ำในการสั่งซื้อแตกต่างกันตามสินค้า โดยทั่วไปอยู่ที่ 10-30 เมตร ยกเว้นสินค้า aviation grade ที่ขั้นต่ำขึ้นอยู่กับสเปกที่นั่งของลูกค้า กรุณาระบุรุ่นที่สนใจเพื่อตรวจสอบขั้นต่ำที่แน่นอน", relatedProducts:[], relatedUseCase:[], riskLevel:"normal" },
      { id:"F013", question:"ถ่ายรูปมาเทียบได้ไหม", answer:"ได้ครับ/ค่ะ สามารถใช้ฟีเจอร์ Image Match อัปโหลดรูปหนังหรือวัสดุที่ต้องการเทียบ ระบบจะช่วยแนะนำสินค้าที่ใกล้เคียงจากฐานข้อมูล แต่ผลลัพธ์เป็นการประเมินเบื้องต้นเท่านั้น สีจริงและผิวสัมผัสต้องยืนยันด้วย sample จริงอีกครั้ง", relatedProducts:[], relatedUseCase:[], riskLevel:"normal" },
      { id:"F014", question:"ใช้กับโรงแรมควรเลือกรุ่นไหน", answer:"สำหรับโรงแรมแนะนำ Royal Heritage Genuine Leather สำหรับโซนหรูหรา หรือ SunArmor Outdoor Leatherette สำหรับพื้นที่ระเบียง/สระว่ายน้ำ และ CinemaGuard Fire Retardant สำหรับห้องประชุม/โรงภาพยนตร์ในโรงแรม", relatedProducts:["P001","P007","P005"], relatedUseCase:["Hotel / Hospitality"], riskLevel:"normal" },
      { id:"F015", question:"ใช้กับโรงพยาบาลต้องระวังอะไร", answer:"งานโรงพยาบาลควรเลือกวัสดุที่มีคุณสมบัติต้านเชื้อแบคทีเรียและทนต่อแอลกอฮอล์/น้ำยาฆ่าเชื้อ เช่น MediClean Medical Grade Synthetic Leather ทั้งนี้ต้องให้ AE ยืนยันความเข้ากันได้กับน้ำยาฆ่าเชื้อที่โรงพยาบาลใช้งานจริงก่อนสั่งซื้อ", relatedProducts:["P006"], relatedUseCase:["Hospital"], riskLevel:"needs AE confirmation" },
      { id:"F016", question:"มีรุ่นกันน้ำไหม", answer:"มีครับ/ค่ะ รุ่นที่มีคุณสมบัติกันน้ำได้ดี ได้แก่ Marine Pro Synthetic Leather และ SunArmor UV Resistant Outdoor Leatherette เหมาะกับพื้นที่ที่สัมผัสน้ำหรือความชื้นสูง", relatedProducts:["P002","P007"], relatedUseCase:["Yacht / Marine","Residential"], riskLevel:"normal" },
      { id:"F017", question:"สั่งสีพิเศษนอกเหนือจากที่มีได้ไหม", answer:"การสั่งสีพิเศษเป็นไปได้ในบางรุ่น แต่ต้องมีปริมาณขั้นต่ำสูงกว่าสีมาตรฐานและใช้ lead time นานขึ้น กรุณาให้ AE ตรวจสอบความเป็นไปได้และระยะเวลาการผลิตสีพิเศษอีกครั้ง", relatedProducts:[], relatedUseCase:[], riskLevel:"needs AE confirmation" }
    ],

    usecases: [
      { useCaseName:"Hotel / Hospitality", icon:"🏨", recommendedProperties:["abrasion resistant","UV resistant","easy clean"], recommendedProducts:["P001","P005","P007"], buyingCriteria:["ความสวยงามระดับพรีเมียม","ทนต่อการใช้งานหนัก","ทำความสะอาดง่าย"], commonObjections:["ราคาสูงกว่าคู่แข่ง","กลัวสีซีดเร็ว"], AEAdvice:"เน้นความคุ้มค่าระยะยาวและความสวยงามที่ตรงกับแบรนด์โรงแรม แนะนำให้ขอ sample เทียบก่อนตัดสินใจ" },
      { useCaseName:"Yacht / Marine", icon:"⛵", recommendedProperties:["water resistant","UV resistant","salt-spray resistant","hydrolysis resistant"], recommendedProducts:["P002"], buyingCriteria:["ทนน้ำเค็มและความชื้นสูง","มีใบรับรอง IMO","ทนแสงแดดจัด"], commonObjections:["กังวลเรื่องความทนทาน","ต้องการใบรับรองเฉพาะ"], AEAdvice:"ต้องยืนยันใบรับรอง IMO และเงื่อนไขการรับประกันกับ AE ก่อนเสนอราคาสุดท้ายทุกครั้ง" },
      { useCaseName:"Aviation", icon:"✈️", recommendedProperties:["fire retardant","low smoke toxicity","lightweight"], recommendedProducts:["P003"], buyingCriteria:["ผ่านมาตรฐาน FAR 25.853","น้ำหนักเบา","เอกสารรับรองครบ"], commonObjections:["ต้องใช้เอกสารรับรองยืนยัน","lead time ยาว"], AEAdvice:"ห้ามยืนยัน certificate หรือ lead time เอง ต้องส่งต่อทีมเทคนิคและ AE ตรวจสอบทุกออเดอร์" },
      { useCaseName:"Cinema", icon:"🎬", recommendedProperties:["fire retardant","abrasion resistant","easy clean"], recommendedProducts:["P005"], buyingCriteria:["มาตรฐานกันไฟพื้นที่สาธารณะ","ทนต่อการใช้งานหนัก","ทำความสะอาดง่าย"], commonObjections:["ราคาสูงกว่าหนังทั่วไป"], AEAdvice:"ชี้ให้เห็นความคุ้มค่าด้านความปลอดภัยและอายุการใช้งานที่ยาวกว่า" },
      { useCaseName:"Hospital", icon:"🏥", recommendedProperties:["antibacterial","stain resistant","easy clean"], recommendedProducts:["P006"], buyingCriteria:["ทนแอลกอฮอล์และน้ำยาฆ่าเชื้อ","ต้านเชื้อแบคทีเรีย","ทำความสะอาดบ่อยได้"], commonObjections:["ต้องการเอกสารยืนยันเฉพาะ"], AEAdvice:"ให้ AE ยืนยันความเข้ากันได้กับน้ำยาฆ่าเชื้อที่ใช้จริงก่อนปิดการขาย" },
      { useCaseName:"Office Furniture", icon:"🏢", recommendedProperties:["abrasion resistant","stain resistant","breathable"], recommendedProducts:["P004","P001"], buyingCriteria:["ราคาคุ้มค่า","ทนต่อการใช้งานต่อเนื่อง","สีโทนสำนักงาน"], commonObjections:["ต้องการราคาพิเศษงานโครงการ"], AEAdvice:"เสนอ OfficePro Microfiber เป็นตัวเลือกคุ้มค่า และ Royal Heritage สำหรับโซน executive" },
      { useCaseName:"Automotive", icon:"🚗", recommendedProperties:["abrasion resistant","heat resistant (moderate)","stain resistant"], recommendedProducts:["P008"], buyingCriteria:["ทนความร้อนในรถ","ลายใกล้เคียงหนังรถยนต์","ราคาแข่งขันได้"], commonObjections:["กลัวกลิ่นและความร้อนสะสม"], AEAdvice:"แนะนำให้ขอ sample เทียบสีกับเบาะเดิมก่อนสั่งผลิตจริง" },
      { useCaseName:"Residential", icon:"🏠", recommendedProperties:["abrasion resistant","easy clean","comfortable texture"], recommendedProducts:["P001","P004","P007"], buyingCriteria:["ความสวยงามเข้ากับบ้าน","ดูแลง่าย","งบประมาณเหมาะสม"], commonObjections:["ไม่แน่ใจว่าหนังแท้หรือเทียมเหมาะกว่ากัน"], AEAdvice:"ช่วยลูกค้าเทียบหนังแท้กับหนังเทียมตามไลฟ์สไตล์การใช้งานจริงในบ้าน" }
    ],

    priceRules: [
      { productId:"P001", retailPrice:"2,450 บาท/เมตร", projectPrice:"ติดต่อ AE", discountTier:"ลด 5% เมื่อสั่ง 200+ เมตร (ให้ AE ยืนยัน)", minimumOrder:"10 เมตร", remark:"มาร์จิ้นสูง เหมาะงานพรีเมียม", requiresAEConfirmation:true },
      { productId:"P002", retailPrice:"1,890 บาท/เมตร", projectPrice:"ติดต่อ AE", discountTier:"ตามปริมาณ ให้ AE ยืนยัน", minimumOrder:"20 เมตร", remark:"ต้องตรวจสอบ certificate IMO ก่อนเสนอราคาสุดท้าย", requiresAEConfirmation:true },
      { productId:"P003", retailPrice:"ติดต่อ AE", projectPrice:"ติดต่อ AE", discountTier:"ไม่มีส่วนลดมาตรฐาน", minimumOrder:"ตามสเปกที่นั่ง", remark:"ราคาขึ้นกับสเปกเครื่องบิน", requiresAEConfirmation:true },
      { productId:"P004", retailPrice:"990 บาท/เมตร", projectPrice:"ติดต่อ AE", discountTier:"ลดขั้นบันไดเมื่อสั่ง 500+ เมตร", minimumOrder:"10 เมตร", remark:"สินค้าขายดีงานออฟฟิศ", requiresAEConfirmation:false },
      { productId:"P005", retailPrice:"1,350 บาท/เมตร", projectPrice:"ติดต่อ AE", discountTier:"ตามปริมาณงานโครงการ", minimumOrder:"30 เมตร", remark:"ต้องแนบ certificate กันไฟ", requiresAEConfirmation:true },
      { productId:"P006", retailPrice:"1,590 บาท/เมตร", projectPrice:"ติดต่อ AE", discountTier:"ตามปริมาณงานสถานพยาบาล", minimumOrder:"20 เมตร", remark:"ตรวจสอบความเข้ากันได้กับน้ำยาฆ่าเชื้อ", requiresAEConfirmation:true },
      { productId:"P007", retailPrice:"1,190 บาท/เมตร", projectPrice:"ติดต่อ AE", discountTier:"ตามปริมาณงานรีสอร์ท", minimumOrder:"15 เมตร", remark:"เหมาะงาน outdoor", requiresAEConfirmation:false },
      { productId:"P008", retailPrice:"1,490 บาท/เมตร", projectPrice:"ติดต่อ AE", discountTier:"ตามปริมาณการสั่งซื้อ", minimumOrder:"10 เมตร", remark:"นิยมในกลุ่มอู่หุ้มเบาะ", requiresAEConfirmation:false }
    ],

    leadTimes: [
      { id:"L001", condition:"สินค้ามีสต๊อก (สีหลัก)", estimatedDays:"2-7 วันทำการ", note:"ขึ้นอยู่กับรุ่นสินค้าและพื้นที่จัดส่ง", requiresConfirmation:false },
      { id:"L002", condition:"สินค้าสั่งผลิต / สีพิเศษ (ทั่วไป)", estimatedDays:"15-25 วันทำการ", note:"ให้ AE ยืนยันตามรุ่นและปริมาณ", requiresConfirmation:true },
      { id:"L003", condition:"Marine Grade (สีพิเศษ)", estimatedDays:"30-35 วันทำการ", note:"ต้องตรวจสอบ certificate IMO ก่อนยืนยัน", requiresConfirmation:true },
      { id:"L004", condition:"Aviation Grade (ทุกออเดอร์)", estimatedDays:"45-60 วันทำการ", note:"ต้องผ่านการทดสอบและออกเอกสารรับรองก่อนผลิตจริง", requiresConfirmation:true },
      { id:"L005", condition:"งานโครงการปริมาณมาก (มากกว่า 500 เมตร)", estimatedDays:"ขึ้นอยู่กับกำลังการผลิต", note:"ให้ AE จัดทำแผนการผลิตและจัดส่งเฉพาะโครงการ", requiresConfirmation:true }
    ]
  };

  /* ===========================================================================
     2. STORAGE LAYER (localStorage)
     =========================================================================== */
  const STORE_KEYS = {
    products: "leatherai_products",
    faqs: "leatherai_faqs",
    usecases: "leatherai_usecases",
    priceRules: "leatherai_pricerules",
    leadTimes: "leatherai_leadtimes",
    leads: "leatherai_leads",
    chatLog: "leatherai_chatlog",
    lang: "leatherai_lang",
    initFlag: "leatherai_initialized_v1",
    unreadLeads: "leatherai_unread_leads",
    unreadAE: "leatherai_unread_ae"
  };

  /* ===========================================================================
     2b. NOTIFICATIONS — Browser/OS alerts for the sales team
     This app has no backend/server (local-first, static PWA), so there is no
     way to push a real notification to a phone/LINE/email when the app is
     fully closed. What we CAN do, and what this adds, is:
       1) A real Browser/OS notification (Notification API) that pops up
          on this device while the app/tab (or installed PWA) is open/running.
       2) A persistent "unread" badge count saved in localStorage, so even if
          the popup is missed, dismissed, or permission was never granted,
          opening the app shows an unmistakable red counter on the relevant
          menu until it's been viewed.
     This fires for two events: (a) a new Lead is created (quote request or
     sample request), and (b) a chat answer is flagged "ต้องให้ AE ตรวจสอบ".
     =========================================================================== */
  function getUnreadCount(key) { return lsGet(key, 0); }
  function setUnreadCount(key, n) { lsSet(key, Math.max(0, n || 0)); }
  function incUnreadCount(key) { setUnreadCount(key, getUnreadCount(key) + 1); }

  function ensureNotificationPermission() {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(function () {});
    }
  }

  function sendBrowserNotification(title, body) {
    if (typeof Notification === "undefined") return false;
    if (Notification.permission !== "granted") return false;
    try {
      new Notification(title, { body: body });
      return true;
    } catch (e) {
      console.warn("Notification failed:", e);
      return false;
    }
  }

  function lsGet(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn("lsGet failed for", key, e);
      return fallback;
    }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("lsSet failed for", key, e);
    }
  }

  function seedIfNeeded() {
    if (!lsGet(STORE_KEYS.initFlag, false)) {
      lsSet(STORE_KEYS.products, DEMO_DATA.products);
      lsSet(STORE_KEYS.faqs, DEMO_DATA.faqs);
      lsSet(STORE_KEYS.usecases, DEMO_DATA.usecases);
      lsSet(STORE_KEYS.priceRules, DEMO_DATA.priceRules);
      lsSet(STORE_KEYS.leadTimes, DEMO_DATA.leadTimes);
      lsSet(STORE_KEYS.leads, []);
      lsSet(STORE_KEYS.chatLog, []);
      lsSet(STORE_KEYS.initFlag, true);
    }
  }

  function resetDemoData() {
    lsSet(STORE_KEYS.products, DEMO_DATA.products);
    lsSet(STORE_KEYS.faqs, DEMO_DATA.faqs);
    lsSet(STORE_KEYS.usecases, DEMO_DATA.usecases);
    lsSet(STORE_KEYS.priceRules, DEMO_DATA.priceRules);
    lsSet(STORE_KEYS.leadTimes, DEMO_DATA.leadTimes);
    lsSet(STORE_KEYS.leads, []);
    lsSet(STORE_KEYS.chatLog, []);
    lsSet(STORE_KEYS.initFlag, true);
  }

  // Live in-memory mirrors, always read fresh from localStorage via getters.
  const DB = {
    products: () => lsGet(STORE_KEYS.products, []),
    faqs: () => lsGet(STORE_KEYS.faqs, []),
    usecases: () => lsGet(STORE_KEYS.usecases, []),
    priceRules: () => lsGet(STORE_KEYS.priceRules, []),
    leadTimes: () => lsGet(STORE_KEYS.leadTimes, []),
    leads: () => lsGet(STORE_KEYS.leads, []),
    chatLog: () => lsGet(STORE_KEYS.chatLog, [])
  };

  function saveCollection(key, arr) { lsSet(key, arr); }

  /* ===========================================================================
     3. LANGUAGE / i18n
     =========================================================================== */
  let LANG = lsGet(STORE_KEYS.lang, "th");

  const STRINGS = {
    th: {
      navChat: "แชทผู้เชี่ยวชาญ", navFinder: "ค้นหาสินค้า", navCompare: "เทียบสินค้า",
      navImageMatch: "เทียบจากรูป", navQuote: "ขอใบเสนอราคา", navAdmin: "แดชบอร์ดทีมขาย",
      navKB: "จัดการฐานข้อมูล", navLeads: "Lead Inbox",
      sectionCustomer: "สำหรับลูกค้า", sectionSales: "สำหรับทีมขาย",
      fallback: "ข้อมูลนี้ต้องให้ AE ตรวจสอบเพิ่มเติมก่อน เพื่อป้องกันการให้ข้อมูลผิดพลาด",
      askPlaceholder: "พิมพ์คำถามเกี่ยวกับหนัง...",
      send: "ส่ง",
      brandBadge: "ใช้ข้อมูลของบริษัทเท่านั้น",
      welcomeMessage: "สวัสดีค่ะ/ครับ ยินดีต้อนรับสู่ Leather AI Sales Assistant ของ Leather Warehouse สามารถพิมพ์คำถามเกี่ยวกับหนังแท้ หนังเทียม ไมโครไฟเบอร์ มารีน หรืออากาศยานได้เลย หรือเลือกคำถามด่วนด้านบน"
    },
    en: {
      navChat: "Expert Chat", navFinder: "Product Finder", navCompare: "Compare",
      navImageMatch: "Image Match", navQuote: "Request Quote", navAdmin: "Admin Dashboard",
      navKB: "Knowledge Base", navLeads: "Lead Inbox",
      sectionCustomer: "Customer", sectionSales: "Sales Team",
      fallback: "This information needs AE confirmation before we can answer accurately.",
      askPlaceholder: "Type your question about leather...",
      send: "Send",
      brandBadge: "Company Knowledge Only",
      welcomeMessage: "Hi! Welcome to Leather Warehouse's AI Sales Assistant. Ask about genuine leather, faux leather, microfiber, marine, or aviation leather, or pick a quick question above."
    }
  };

  // Quick-question chips shown above the chat input — kept bilingual so the
  // chips themselves switch language along with the rest of the UI. The
  // keyword detector in answerQuery() understands both TH and EN phrasing,
  // so either version still routes to the correct answer.
  const QUICK_QUESTIONS_BY_LANG = {
    th: [
      "หนังแบบไหนเหมาะกับเรือยอชต์", "หนังแบบไหนเหมาะกับโรงแรม", "หนังแบบไหนเหมาะกับเครื่องบิน",
      "หนังแท้กับหนังเทียมต่างกันอย่างไร", "มีรุ่นกันไฟ/กันน้ำ/กัน UV ไหม",
      "ราคาประมาณเท่าไหร่", "lead time กี่วัน", "ขอตัวอย่างสินค้า (Sample)", "ขอใบเสนอราคา"
    ],
    en: [
      "Which leather suits a yacht?", "Which leather suits a hotel?", "Which leather suits an aircraft?",
      "What's the difference between genuine and faux leather?", "Do you have fire/water/UV resistant options?",
      "How much does it cost?", "What's the lead time?", "Request a sample", "Request a quote"
    ]
  };
  function t(key) { return (STRINGS[LANG] && STRINGS[LANG][key]) || STRINGS.th[key] || key; }

  /* ===========================================================================
     4. AI RESPONSE ENGINE (rule-based, searches local DB only)
     =========================================================================== */

  // Keyword maps to detect intent / use case / property from free text (TH + EN).
  const USECASE_KEYWORDS = {
    "Yacht / Marine": ["เรือ", "yacht", "marine", "ดาดฟ้า", "ท่าเรือ", "boat"],
    "Hotel / Hospitality": ["โรงแรม", "hotel", "hospitality", "ล็อบบี้", "รีสอร์ท", "resort"],
    "Aviation": ["เครื่องบิน", "aviation", "aircraft", "เบาะที่นั่งเครื่องบิน", "สายการบิน"],
    "Cinema": ["โรงหนัง", "โรงภาพยนตร์", "cinema", "theater", "theatre"],
    "Hospital": ["โรงพยาบาล", "hospital", "คลินิก", "clinic", "สถานพยาบาล"],
    "Office Furniture": ["ออฟฟิศ", "office", "สำนักงาน"],
    "Automotive": ["รถยนต์", "automotive", "car", "เบาะรถ"],
    "Residential": ["บ้าน", "residential", "house", "ที่พักอาศัย"]
  };

  const PROPERTY_KEYWORDS = {
    "fire retardant": ["กันไฟ", "fire", "ทนไฟ", "retardant"],
    "UV resistant": ["กัน uv", "กันแดด", "uv", "ทนแดด", "ซีด"],
    "water resistant": ["กันน้ำ", "water", "ทนน้ำ"],
    "antibacterial": ["ฆ่าเชื้อ", "antibacterial", "แบคทีเรีย"],
    "abrasion resistant": ["ทนรอยขีดข่วน", "abrasion", "ทนการเสียดสี"]
  };

  const INTENT_KEYWORDS = {
    price: ["ราคา", "price", "เท่าไหร่", "ราคาเท่าไร", "บาท"],
    leadtime: ["lead time", "leadtime", "กี่วัน", "ใช้เวลา", "ระยะเวลา"],
    sample: ["sample", "ตัวอย่าง", "ขอตัวอย่าง"],
    quote: ["ใบเสนอราคา", "quote", "quotation", "เสนอราคา"],
    compare: ["เทียบ", "compare", "ต่างกัน"]
  };

  function normalize(str) { return (str || "").toLowerCase().trim(); }

  function textContainsAny(text, keywords) {
    const t = normalize(text);
    return keywords.some(function (k) { return t.indexOf(normalize(k)) !== -1; });
  }

  function detectUseCase(text) {
    for (const uc in USECASE_KEYWORDS) {
      if (textContainsAny(text, USECASE_KEYWORDS[uc])) return uc;
    }
    return null;
  }
  function detectProperty(text) {
    for (const p in PROPERTY_KEYWORDS) {
      if (textContainsAny(text, PROPERTY_KEYWORDS[p])) return p;
    }
    return null;
  }
  function detectIntent(text) {
    for (const i in INTENT_KEYWORDS) {
      if (textContainsAny(text, INTENT_KEYWORDS[i])) return i;
    }
    return null;
  }

  // Simple token-overlap scoring for FAQ search.
  function scoreFaqMatch(query, faq) {
    const qTokens = normalize(query).split(/\s+/).filter(Boolean);
    const qText = normalize(faq.question);
    let score = 0;
    qTokens.forEach(function (tok) {
      if (tok.length >= 2 && qText.indexOf(tok) !== -1) score += 1;
    });
    if (normalize(query) === qText) score += 5;
    return score;
  }

  function findProductsForUseCase(useCaseName) {
    return DB.products().filter(function (p) {
      return p.bestFor.indexOf(useCaseName) !== -1;
    });
  }

  function findProductsForProperty(property) {
    return DB.products().filter(function (p) {
      return p.properties.indexOf(property) !== -1;
    });
  }

  function getProductById(id) {
    return DB.products().find(function (p) { return p.id === id; }) || null;
  }

  function getPriceRule(productId) {
    return DB.priceRules().find(function (r) { return r.productId === productId; }) || null;
  }

  const SENSITIVE_USECASES = ["Aviation", "Yacht / Marine"];

  /**
   * Core AI engine. Returns a structured answer object:
   * { summaryHtml, recommended:[product...], reasons, cautions, aeConfirm, cta, matched:bool }
   */
  function answerQuery(rawText) {
    const text = rawText || "";
    const intent = detectIntent(text);
    const useCase = detectUseCase(text);
    const property = detectProperty(text);

    // Log for popularity stats regardless of match outcome.
    logChatQuery(text, useCase, null);

    // --- 1) Use-case driven recommendation ---
    if (useCase) {
      const ucEntry = DB.usecases().find(function (u) { return u.useCaseName === useCase; });
      const products = findProductsForUseCase(useCase);
      if (products.length) {
        logChatQuery(text, useCase, products[0].id);
        return buildRecommendationAnswer(useCase, ucEntry, products, intent);
      }
    }

    // --- 2) Property driven recommendation (UV / fire / water / etc.) ---
    if (property) {
      const products = findProductsForProperty(property);
      if (products.length) {
        return buildPropertyAnswer(property, products);
      }
    }

    // --- 3) Price / lead time intent without specific product -> general policy answer ---
    if (intent === "price") {
      return buildGeneralPriceAnswer();
    }
    if (intent === "leadtime") {
      return buildGeneralLeadTimeAnswer();
    }
    if (intent === "compare") {
      return {
        matched: true,
        summaryHtml: "หากต้องการเทียบหนังแท้กับหนังเทียม หรือเทียบสินค้า 2-3 รุ่น แนะนำให้ใช้หน้า <b>Product Compare</b> เพื่อดูตารางเทียบแบบละเอียด",
        recommended: [], reasons: [], cautions: [],
        aeConfirm: [],
        cta: [{ label: "ไปหน้า Product Compare", action: "nav:compare" }]
      };
    }

    // --- 4) FAQ search (token overlap) ---
    const faqs = DB.faqs();
    let bestFaq = null, bestScore = 0;
    faqs.forEach(function (f) {
      const s = scoreFaqMatch(text, f);
      if (s > bestScore) { bestScore = s; bestFaq = f; }
    });
    if (bestFaq && bestScore > 0) {
      return buildFaqAnswer(bestFaq);
    }

    // --- 5) Nothing matched: fallback per hard rule ---
    return {
      matched: false,
      summaryHtml: t("fallback"),
      recommended: [], reasons: [], cautions: [],
      aeConfirm: [],
      cta: [{ label: "ให้ AE ติดต่อกลับ", action: "nav:quote" }]
    };
  }

  function buildRecommendationAnswer(useCaseName, ucEntry, products, intent) {
    const top = products.slice(0, 3);
    const reasons = ucEntry ? ucEntry.buyingCriteria : [];
    const cautions = [];
    top.forEach(function (p) {
      if (p.notRecommendedFor && p.notRecommendedFor.length) {
        cautions.push(p.productName + ": ไม่แนะนำสำหรับ " + p.notRecommendedFor.join(", "));
      }
    });
    const aeConfirm = ["ราคาสุทธิและส่วนลด", "สถานะ stock ปัจจุบัน", "lead time ที่แน่นอนตามจำนวนที่สั่ง"];
    if (SENSITIVE_USECASES.indexOf(useCaseName) !== -1) {
      aeConfirm.unshift("ใบรับรอง/certificate ให้ตรงตามสเปกการใช้งานจริง (" + (useCaseName === "Aviation" ? "FAR 25.853" : "IMO") + ")");
    }
    return {
      matched: true,
      summaryHtml: "สำหรับงาน <b>" + useCaseName + "</b> แนะนำสินค้าดังนี้:",
      recommended: top,
      reasons: reasons,
      cautions: cautions,
      aeConfirm: aeConfirm,
      cta: [
        { label: "ขอ Sample", action: "nav:quote", prefill: { useCase: useCaseName, products: top.map(function(p){return p.productName;}).join(", ") } },
        { label: "ขอใบเสนอราคา", action: "nav:quote", prefill: { useCase: useCaseName, products: top.map(function(p){return p.productName;}).join(", ") } }
      ]
    };
  }

  function buildPropertyAnswer(property, products) {
    const top = products.slice(0, 3);
    return {
      matched: true,
      summaryHtml: "รุ่นที่มีคุณสมบัติ <b>" + property + "</b> ที่เรามีในฐานข้อมูล:",
      recommended: top,
      reasons: ["คุณสมบัติ " + property + " ผ่านการทดสอบตามใบรับรองของแต่ละรุ่น"],
      cautions: ["กรุณายืนยัน certificate ฉบับเต็มกับ AE หากต้องใช้ในงานที่มีข้อกำหนดทางเทคนิคสูง (เช่น เรือ/เครื่องบิน)"],
      aeConfirm: ["ราคาและสถานะ stock", "certificate ฉบับเต็มตามมาตรฐานที่ต้องการ"],
      cta: [{ label: "ขอใบเสนอราคา", action: "nav:quote" }, { label: "ขอ Sample", action: "nav:quote" }]
    };
  }

  function buildGeneralPriceAnswer() {
    return {
      matched: true,
      summaryHtml: "ราคาสินค้าแต่ละรุ่นแสดงเป็นราคาอ้างอิงต่อเมตร ราคาสุทธิและส่วนลดโครงการขึ้นอยู่กับปริมาณการสั่งซื้อ กรุณาระบุรุ่นที่สนใจเพื่อดูราคาอ้างอิง หรือขอใบเสนอราคาเพื่อให้ AE คำนวณราคาสุทธิ",
      recommended: [], reasons: [], cautions: [],
      aeConfirm: ["ราคาสุทธิหลังหักส่วนลด (ถ้ามี)", "ค่าจัดส่งตามพื้นที่"],
      cta: [{ label: "ขอใบเสนอราคา", action: "nav:quote" }, { label: "ดูสินค้าทั้งหมด", action: "nav:finder" }]
    };
  }

  function buildGeneralLeadTimeAnswer() {
    const lt = DB.leadTimes();
    let html = "Lead time โดยทั่วไป:<br>";
    lt.forEach(function (l) {
      html += "• " + l.condition + ": <b>" + l.estimatedDays + "</b><br>";
    });
    return {
      matched: true,
      summaryHtml: html,
      recommended: [], reasons: [],
      cautions: ["lead time ที่แน่นอนต้องยืนยันตามรุ่นสินค้า สี และปริมาณที่สั่งจริง"],
      aeConfirm: ["lead time ที่แน่นอนของรุ่นที่สนใจ"],
      cta: [{ label: "ระบุรุ่นที่สนใจ / ขอใบเสนอราคา", action: "nav:quote" }]
    };
  }

  function buildFaqAnswer(faq) {
    const relatedProducts = (faq.relatedProducts || []).map(getProductById).filter(Boolean);
    const aeConfirm = faq.riskLevel === "needs AE confirmation" || faq.riskLevel === "technical"
      ? ["รายละเอียดเชิงเทคนิค/ราคาที่แน่นอนของกรณีนี้"] : [];
    return {
      matched: true,
      summaryHtml: faq.answer,
      recommended: relatedProducts,
      reasons: [],
      cautions: faq.riskLevel !== "normal" ? ["คำถามนี้มีความเสี่ยงระดับ: " + faq.riskLevel + " กรุณาให้ AE ยืนยันรายละเอียดเพิ่มเติม"] : [],
      aeConfirm: aeConfirm,
      cta: [{ label: "ขอใบเสนอราคา", action: "nav:quote" }, { label: "ให้ AE ติดต่อกลับ", action: "nav:quote" }]
    };
  }

  function logChatQuery(text, useCase, productId) {
    const log = DB.chatLog();
    log.push({
      date: new Date().toISOString(),
      text: text,
      useCase: useCase || null,
      productId: productId || null
    });
    saveCollection(STORE_KEYS.chatLog, log);
  }

  /* ===========================================================================
     5. LEAD MANAGEMENT
     =========================================================================== */
  function createLead(data) {
    const leads = DB.leads();
    const lead = Object.assign({
      id: "LD" + Date.now(),
      date: new Date().toISOString(),
      status: "new"
    }, data);
    leads.unshift(lead);
    saveCollection(STORE_KEYS.leads, leads);
    return lead;
  }

  function updateLeadStatus(leadId, status) {
    const leads = DB.leads();
    const lead = leads.find(function (l) { return l.id === leadId; });
    if (lead) {
      lead.status = status;
      saveCollection(STORE_KEYS.leads, leads);
    }
  }

  function leadsToCsv(leads) {
    const headers = ["id","date","name","company","phone","line","email","jobType","productsInterested","quantity","province","neededDate","note","channel","useCase","painPoint","urgency","suggestedNextAction","status"];
    const rows = [headers.join(",")];
    leads.forEach(function (l) {
      const row = headers.map(function (h) {
        let v = l[h] !== undefined && l[h] !== null ? String(l[h]) : "";
        v = v.replace(/"/g, '""');
        if (v.indexOf(",") !== -1 || v.indexOf("\n") !== -1) v = '"' + v + '"';
        return v;
      });
      rows.push(row.join(","));
    });
    return rows.join("\n");
  }

  function downloadCsv(filename, csvText) {
    const blob = new Blob(["﻿" + csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ===========================================================================
     Expose a shared namespace for ui.js-style code further down in this file.
     (Kept in one file per project requirements: "ไฟล์ที่ต้องสร้าง" lists a single app.js)
     =========================================================================== */
  window.LeatherAI = {
    DEMO_DATA, STORE_KEYS, DB, lsGet, lsSet, saveCollection,
    seedIfNeeded, resetDemoData,
    LANG: function () { return LANG; },
    setLang: function (l) { LANG = l; lsSet(STORE_KEYS.lang, l); },
    t, STRINGS,
    answerQuery, getProductById, getPriceRule, findProductsForUseCase,
    createLead, updateLeadStatus, leadsToCsv, downloadCsv,
    logChatQuery,
    NOTIF_KEYS: { unreadLeads: STORE_KEYS.unreadLeads, unreadAE: STORE_KEYS.unreadAE },
    getUnreadCount, setUnreadCount, incUnreadCount,
    ensureNotificationPermission, sendBrowserNotification
  };
})();

/* =============================================================================
   PART 2 — UI LAYER
   All DOM rendering, event wiring, and view-switching logic. Kept in the same
   app.js file per project spec (single JS file). Relies on window.LeatherAI
   defined above for data + AI engine.
   ============================================================================= */
(function () {
  "use strict";
  const AI = window.LeatherAI;

  /* ---------------------------------------------------------------------------
     KB Manager field configs — drives a single generic CRUD form renderer so
     we don't need 5 hand-built forms for the 5 knowledge-base datasets.
     type: "text" | "textarea" | "list" (comma separated) | "select" | "bool"
     --------------------------------------------------------------------------- */
  const KB_CONFIGS = {
    products: {
      label: "Products", storeKey: AI.STORE_KEYS.products, idField: "id", idPrefix: "P",
      fields: [
        { key: "id", label: "ID", type: "text", readonlyOnEdit: true },
        { key: "productName", label: "Product Name", type: "text" },
        { key: "category", label: "Category", type: "select", options: ["genuine leather","synthetic leather","microfiber","marine","aviation"] },
        { key: "collection", label: "Collection", type: "text" },
        { key: "colors", label: "Colors (comma separated)", type: "list" },
        { key: "thickness", label: "Thickness", type: "text" },
        { key: "width", label: "Width", type: "text" },
        { key: "properties", label: "Properties (comma separated)", type: "list" },
        { key: "certificates", label: "Certificates (comma separated)", type: "list" },
        { key: "bestFor", label: "Best For (comma separated use cases)", type: "list" },
        { key: "notRecommendedFor", label: "Not Recommended For (comma separated)", type: "list" },
        { key: "priceRetail", label: "Price Retail", type: "text" },
        { key: "priceProject", label: "Price Project", type: "text" },
        { key: "minimumOrder", label: "Minimum Order", type: "text" },
        { key: "discountNote", label: "Discount Note", type: "text" },
        { key: "stockStatus", label: "Stock Status", type: "text" },
        { key: "leadTimeStock", label: "Lead Time (Stock)", type: "text" },
        { key: "leadTimeMadeToOrder", label: "Lead Time (Made to Order)", type: "text" },
        { key: "deliveryNote", label: "Delivery Note", type: "text" },
        { key: "warrantyNote", label: "Warranty Note", type: "text" },
        { key: "cleaningCare", label: "Cleaning & Care", type: "textarea" },
        { key: "specFileName", label: "Spec File Name", type: "text" },
        { key: "imageUrl", label: "Image URL", type: "text" },
        { key: "internalNote", label: "Internal Note (sales only)", type: "textarea" }
      ]
    },
    faqs: {
      label: "FAQs", storeKey: AI.STORE_KEYS.faqs, idField: "id", idPrefix: "F",
      fields: [
        { key: "id", label: "ID", type: "text", readonlyOnEdit: true },
        { key: "question", label: "Question", type: "text" },
        { key: "answer", label: "Answer", type: "textarea" },
        { key: "relatedProducts", label: "Related Product IDs (comma separated)", type: "list" },
        { key: "relatedUseCase", label: "Related Use Cases (comma separated)", type: "list" },
        { key: "riskLevel", label: "Risk Level", type: "select", options: ["normal","needs AE confirmation","technical"] }
      ]
    },
    usecases: {
      label: "Use Cases", storeKey: AI.STORE_KEYS.usecases, idField: "useCaseName", idPrefix: "",
      fields: [
        { key: "useCaseName", label: "Use Case Name", type: "text", readonlyOnEdit: true },
        { key: "icon", label: "Icon (emoji)", type: "text" },
        { key: "recommendedProperties", label: "Recommended Properties (comma separated)", type: "list" },
        { key: "recommendedProducts", label: "Recommended Product IDs (comma separated)", type: "list" },
        { key: "buyingCriteria", label: "Buying Criteria (comma separated)", type: "list" },
        { key: "commonObjections", label: "Common Objections (comma separated)", type: "list" },
        { key: "AEAdvice", label: "AE Advice", type: "textarea" }
      ]
    },
    priceRules: {
      label: "Price Rules", storeKey: AI.STORE_KEYS.priceRules, idField: "productId", idPrefix: "",
      fields: [
        { key: "productId", label: "Product ID", type: "text", readonlyOnEdit: true },
        { key: "retailPrice", label: "Retail Price", type: "text" },
        { key: "projectPrice", label: "Project Price", type: "text" },
        { key: "discountTier", label: "Discount Tier", type: "text" },
        { key: "minimumOrder", label: "Minimum Order", type: "text" },
        { key: "remark", label: "Remark", type: "textarea" },
        { key: "requiresAEConfirmation", label: "Requires AE Confirmation", type: "bool" }
      ]
    },
    leadTimes: {
      label: "Lead Times", storeKey: AI.STORE_KEYS.leadTimes, idField: "id", idPrefix: "L",
      fields: [
        { key: "id", label: "ID", type: "text", readonlyOnEdit: true },
        { key: "condition", label: "Condition", type: "text" },
        { key: "estimatedDays", label: "Estimated Days", type: "text" },
        { key: "note", label: "Note", type: "textarea" },
        { key: "requiresConfirmation", label: "Requires Confirmation", type: "bool" }
      ]
    }
  };

  let activeKbTab = "products";
  let kbEditingId = null; // null = adding new
  let selectedFinderUseCase = null;
  let selectedCompareIds = [];
  let uploadedImageDataUrl = null;

  /* ---------------------------------------------------------------------------
     Helpers: toast, modal, view switching
     --------------------------------------------------------------------------- */
  function showToast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 2600);
  }

  function openModal(backdropId) {
    const el = document.getElementById(backdropId);
    if (el) el.classList.add("active");
  }
  function closeModal(backdropId) {
    const el = document.getElementById(backdropId);
    if (el) el.classList.remove("active");
  }

  function switchView(viewName) {
    if (viewName === "more") { openModal("moreSheetBackdrop"); return; }
    document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
    const target = document.getElementById("view-" + viewName);
    if (target) target.classList.add("active");
    document.querySelectorAll(".nav-item[data-view]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === viewName);
    });
    closeModal("moreSheetBackdrop");
    if (viewName === "finder") renderFinderUsecases();
    if (viewName === "compare") renderComparePicker();
    if (viewName === "admin") renderAdminDashboard();
    if (viewName === "kb") renderKbTable();
    if (viewName === "leads") renderLeadsTable();
    if (viewName === "quote") populateQuoteFormOptions();
    // Opening the screen that the notification was about clears its unread badge.
    if (viewName === "leads") { AI.setUnreadCount(AI.NOTIF_KEYS.unreadLeads, 0); renderNotificationBadges(); }
    if (viewName === "chat") { AI.setUnreadCount(AI.NOTIF_KEYS.unreadAE, 0); renderNotificationBadges(); }
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------------------------
     NOTIFICATION BADGES (red counter on nav items, see Part 1 for the
     Notification API trigger). Reflects unread leads / unread AE-confirm
     flags so nothing is missed even if a browser popup was missed or denied.
     --------------------------------------------------------------------------- */
  function setNavBadge(viewName, count) {
    document.querySelectorAll('.nav-item[data-view="' + viewName + '"]').forEach(function (btn) {
      let badge = btn.querySelector(".nav-badge");
      if (count > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "nav-badge";
          badge.style.cssText = "display:inline-block;min-width:18px;height:18px;line-height:18px;" +
            "border-radius:9px;background:#e0383e;color:#fff;font-size:11px;font-weight:700;" +
            "text-align:center;margin-left:6px;padding:0 4px;vertical-align:middle;";
          btn.appendChild(badge);
        }
        badge.textContent = count > 99 ? "99+" : String(count);
      } else if (badge) {
        badge.remove();
      }
    });
  }

  function renderNotificationBadges() {
    setNavBadge("leads", AI.getUnreadCount(AI.NOTIF_KEYS.unreadLeads));
    setNavBadge("chat", AI.getUnreadCount(AI.NOTIF_KEYS.unreadAE));
  }

  function escapeHtml(str) {
    return String(str === undefined || str === null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------------------------------------------------------------------------
     CHAT VIEW
     --------------------------------------------------------------------------- */
  function renderQuickQuestions() {
    const wrap = document.getElementById("quickQuestions");
    if (!wrap) return;
    const list = QUICK_QUESTIONS_BY_LANG[AI.LANG()] || QUICK_QUESTIONS_BY_LANG.th;
    wrap.innerHTML = list.map(function (q) {
      return '<button class="quick-chip" type="button">' + escapeHtml(q) + "</button>";
    }).join("");
    wrap.querySelectorAll(".quick-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.getElementById("chatInput").value = btn.textContent;
        sendChatMessage();
      });
    });
  }

  function appendChatMessage(role, html) {
    const wrap = document.getElementById("chatMessages");
    if (!wrap) return;
    const div = document.createElement("div");
    div.className = "msg " + (role === "user" ? "user" : "bot");
    div.innerHTML =
      '<div class="msg-avatar">' + (role === "user" ? "🙂" : "🤖") + "</div>" +
      '<div class="msg-bubble">' + html + "</div>";
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function renderStructuredAnswer(answer) {
    let html = "<div>" + answer.summaryHtml + "</div>";
    if (answer.recommended && answer.recommended.length) {
      html += '<div class="answer-section"><div class="label">รุ่นที่แนะนำ</div><ul>';
      answer.recommended.forEach(function (p) {
        html += "<li>" + escapeHtml(p.productName) + " — " + escapeHtml(p.category) + "</li>";
      });
      html += "</ul></div>";
    }
    if (answer.reasons && answer.reasons.length) {
      html += '<div class="answer-section"><div class="label">เหตุผล</div><ul>' + answer.reasons.map(function (r) { return "<li>" + escapeHtml(r) + "</li>"; }).join("") + "</ul></div>";
    }
    if (answer.cautions && answer.cautions.length) {
      html += '<div class="answer-section" style="color:var(--color-warn);"><div class="label" style="color:var(--color-warn);">⚠️ ข้อควรระวัง</div><ul>' + answer.cautions.map(function (c) { return "<li>" + escapeHtml(c) + "</li>"; }).join("") + "</ul></div>";
    }
    if (answer.aeConfirm && answer.aeConfirm.length) {
      html += '<div class="answer-section" style="color:var(--color-info);"><div class="label" style="color:var(--color-info);">🔎 รายการที่ต้องให้ AE ยืนยัน</div><ul>' + answer.aeConfirm.map(function (a) { return "<li>" + escapeHtml(a) + "</li>"; }).join("") + "</ul></div>";
    }
    if (answer.cta && answer.cta.length) {
      html += '<div class="msg-cta">' + answer.cta.map(function (c) {
        return '<button class="btn btn-primary btn-sm cta-btn" data-action="' + escapeHtml(c.action) + '">' + escapeHtml(c.label) + "</button>";
      }).join("") + "</div>";
    }
    return html;
  }

  function sendChatMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;
    appendChatMessage("user", escapeHtml(text));
    input.value = "";
    const answer = AI.answerQuery(text);
    appendChatMessage("bot", renderStructuredAnswer(answer));
    document.querySelectorAll("#chatMessages .cta-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { handleCtaAction(btn.getAttribute("data-action")); });
    });
    // Notify the sales team when this answer needs AE confirmation, or matched
    // nothing at all (the hard fallback) — so a wrong/incomplete answer never
    // goes unnoticed by the human in the loop.
    const needsAE = (answer.matched === false) || (answer.aeConfirm && answer.aeConfirm.length > 0);
    if (needsAE) {
      AI.incUnreadCount(AI.NOTIF_KEYS.unreadAE);
      renderNotificationBadges();
      AI.sendBrowserNotification(
        "⚠️ มีคำถามที่ต้องให้ AE ตรวจสอบ",
        "ลูกค้าถาม: " + text
      );
    }
  }

  function handleCtaAction(action) {
    if (action === "nav:quote") switchView("quote");
    else if (action === "nav:compare") switchView("compare");
    else if (action === "nav:finder") switchView("finder");
  }

  /* ---------------------------------------------------------------------------
     PRODUCT FINDER VIEW
     --------------------------------------------------------------------------- */
  function renderFinderUsecases() {
    const wrap = document.getElementById("finderUsecaseGrid");
    if (!wrap) return;
    const usecases = AI.DB.usecases();
    wrap.innerHTML = usecases.map(function (u) {
      return '<div class="usecase-card' + (selectedFinderUseCase === u.useCaseName ? " selected" : "") + '" data-usecase="' + escapeHtml(u.useCaseName) + '">' +
        '<div class="usecase-icon">' + (u.icon || "📦") + '</div>' +
        '<div class="usecase-name">' + escapeHtml(u.useCaseName) + "</div></div>";
    }).join("");
    wrap.querySelectorAll(".usecase-card").forEach(function (card) {
      card.addEventListener("click", function () {
        selectedFinderUseCase = card.getAttribute("data-usecase");
        renderFinderUsecases();
        renderFinderResults();
      });
    });
  }

  function renderFinderResults() {
    const resultsWrap = document.getElementById("finderResultsWrap");
    const results = document.getElementById("finderResults");
    if (!selectedFinderUseCase) { resultsWrap.style.display = "none"; return; }
    const products = AI.findProductsForUseCase(selectedFinderUseCase);
    const ucEntry = AI.DB.usecases().find(function (u) { return u.useCaseName === selectedFinderUseCase; });
    resultsWrap.style.display = "block";
    if (!products.length) {
      results.innerHTML = '<div class="empty-state">ยังไม่มีสินค้าที่ตรงกับ use case นี้ในฐานข้อมูล กรุณาให้ AE ตรวจสอบเพิ่มเติม</div>';
      return;
    }
    results.innerHTML = products.map(productCardHtml).join("");
    wireProductCardButtons(results);
    if (ucEntry && ucEntry.AEAdvice) {
      results.innerHTML += '<div class="card answer-ae" style="grid-column:1/-1;"><b>คำแนะนำสำหรับ AE:</b> ' + escapeHtml(ucEntry.AEAdvice) + "</div>";
    }
  }

  function productCardHtml(p) {
    const caution = (p.notRecommendedFor || []).length
      ? '<div class="product-card-caution">⚠️ ไม่แนะนำสำหรับ: ' + escapeHtml(p.notRecommendedFor.join(", ")) + "</div>" : "";
    return '<div class="product-card">' +
      '<div class="product-card-img">🧵</div>' +
      '<div class="product-card-body">' +
      '<div class="product-card-name">' + escapeHtml(p.productName) + "</div>" +
      '<div class="product-card-collection">' + escapeHtml(p.collection || "") + "</div>" +
      '<div><span class="tag tag-gold">' + escapeHtml(p.category) + '</span>' +
      '<span class="tag">หนา ' + escapeHtml(p.thickness) + '</span>' +
      '<span class="tag">กว้าง ' + escapeHtml(p.width) + "</span></div>" +
      '<div class="product-card-reason">คุณสมบัติ: ' + escapeHtml((p.properties || []).join(", ") || "-") + "</div>" +
      '<div class="product-card-reason">Certificate: ' + escapeHtml((p.certificates || []).join(", ") || "-") + "</div>" +
      '<div class="product-card-reason">ราคาเริ่มต้น: ' + escapeHtml(p.priceRetail) + " · สต๊อก: " + escapeHtml(p.stockStatus) + "</div>" +
      caution +
      '<div class="product-card-footer">' +
      '<button class="btn btn-outline btn-sm" data-sample="' + escapeHtml(p.id) + '">ขอ Sample</button>' +
      '<button class="btn btn-primary btn-sm" data-quote="' + escapeHtml(p.id) + '">ขอใบเสนอราคา</button>' +
      "</div></div></div>";
  }

  function wireProductCardButtons(scopeEl) {
    scopeEl.querySelectorAll("[data-sample]").forEach(function (btn) {
      btn.addEventListener("click", function () { goToQuoteWithProduct(btn.getAttribute("data-sample")); });
    });
    scopeEl.querySelectorAll("[data-quote]").forEach(function (btn) {
      btn.addEventListener("click", function () { goToQuoteWithProduct(btn.getAttribute("data-quote")); });
    });
  }

  function goToQuoteWithProduct(productId) {
    switchView("quote");
    populateQuoteFormOptions();
    setTimeout(function () {
      const chip = document.querySelector('#quoteProductChips [data-pid="' + productId + '"] input');
      if (chip) {
        chip.checked = true;
        chip.closest(".chip-check").classList.add("checked");
      }
    }, 0);
  }

  /* ---------------------------------------------------------------------------
     PRODUCT COMPARE VIEW
     --------------------------------------------------------------------------- */
  function renderComparePicker() {
    const wrap = document.getElementById("comparePicker");
    const products = AI.DB.products();
    wrap.innerHTML = products.map(function (p) {
      const checked = selectedCompareIds.indexOf(p.id) !== -1;
      return '<label class="compare-pill' + (checked ? " selected" : "") + '">' +
        '<input type="checkbox" value="' + escapeHtml(p.id) + '" ' + (checked ? "checked" : "") + " /> " + escapeHtml(p.productName) + "</label>";
    }).join("");
    wrap.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", function () {
        const id = cb.value;
        if (cb.checked) {
          if (selectedCompareIds.length >= 3) { cb.checked = false; showToast("เลือกได้สูงสุด 3 รายการ"); return; }
          selectedCompareIds.push(id);
        } else {
          selectedCompareIds = selectedCompareIds.filter(function (x) { return x !== id; });
        }
        renderComparePicker();
        renderCompareTable();
      });
    });
  }

  function renderCompareTable() {
    const wrap = document.getElementById("compareTableWrap");
    if (selectedCompareIds.length < 2) { wrap.innerHTML = '<div class="empty-state">เลือกสินค้าอย่างน้อย 2 รายการเพื่อเปรียบเทียบ</div>'; return; }
    const products = selectedCompareIds.map(AI.getProductById).filter(Boolean);
    const rows = [
      ["Category", function (p) { return p.category; }],
      ["Collection", function (p) { return p.collection; }],
      ["Thickness", function (p) { return p.thickness; }],
      ["Width", function (p) { return p.width; }],
      ["Properties", function (p) { return (p.properties || []).join(", "); }],
      ["Certificates", function (p) { return (p.certificates || []).join(", ") || "-"; }],
      ["Best For", function (p) { return (p.bestFor || []).join(", "); }],
      ["Not Recommended For", function (p) { return (p.notRecommendedFor || []).join(", ") || "-"; }],
      ["Price (Retail)", function (p) { return p.priceRetail; }],
      ["Minimum Order", function (p) { return p.minimumOrder; }],
      ["Lead Time (Stock)", function (p) { return p.leadTimeStock; }],
      ["Lead Time (Made to order)", function (p) { return p.leadTimeMadeToOrder; }],
      ["Stock Status", function (p) { return p.stockStatus; }]
    ];
    let html = '<table class="compare-table"><thead><tr><th></th>' + products.map(function (p) { return "<th>" + escapeHtml(p.productName) + "</th>"; }).join("") + "</tr></thead><tbody>";
    rows.forEach(function (row) {
      html += "<tr><th>" + row[0] + "</th>" + products.map(function (p) { return "<td>" + escapeHtml(row[1](p)) + "</td>"; }).join("") + "</tr>";
    });
    html += "</tbody></table>";
    wrap.innerHTML = html;
  }

  /* ---------------------------------------------------------------------------
     IMAGE MATCH VIEW (mock — preview only, no real vision AI in Phase 1)
     --------------------------------------------------------------------------- */
  function wireImageMatch() {
    const input = document.getElementById("imgUploadInput");
    const dropzone = document.getElementById("imgDropzone");
    if (!input) return;
    input.addEventListener("change", function () {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        uploadedImageDataUrl = e.target.result;
        const preview = document.getElementById("imgPreview");
        preview.src = uploadedImageDataUrl;
        preview.style.display = "block";
        document.getElementById("imgDropzoneText").textContent = "อัปโหลดแล้ว — เลือกหัวข้อที่ต้องการเทียบด้านล่าง";
        document.getElementById("imgCompareOptions").style.display = "grid";
        document.getElementById("imgMatchResultsWrap").style.display = "none";
      };
      reader.readAsDataURL(file);
    });
    document.querySelectorAll("[data-compare]").forEach(function (btn) {
      btn.addEventListener("click", function () { runImageMatch(btn.getAttribute("data-compare")); });
    });
  }

  function runImageMatch(mode) {
    // Mock matching: since there is no real computer-vision model in Phase 1,
    // we simply surface a representative cross-section of the catalog and make
    // the "preliminary estimate" disclaimer explicit, per the hard rule that
    // image comparisons must never be presented as a confirmed match.
    const products = AI.DB.products();
    let chosen;
    if (mode === "properties") chosen = products.filter(function (p) { return p.properties && p.properties.length; }).slice(0, 3);
    else if (mode === "usecase") chosen = products.slice(0, 3);
    else chosen = products.slice(0, 3);
    const wrap = document.getElementById("imgMatchResultsWrap");
    const results = document.getElementById("imgMatchResults");
    wrap.style.display = "block";
    results.innerHTML = chosen.map(productCardHtml).join("") +
      '<div class="card disclaimer-box" style="grid-column:1/-1;">การเทียบจากรูปเป็นการประเมินเบื้องต้น สีจริงและผิวสัมผัสต้องยืนยันด้วย sample จริง</div>';
    wireProductCardButtons(results);
  }

  /* ---------------------------------------------------------------------------
     QUOTE REQUEST VIEW
     --------------------------------------------------------------------------- */
  function populateQuoteFormOptions() {
    const ucSelect = document.getElementById("quoteUseCaseSelect");
    if (ucSelect && ucSelect.options.length <= 1) {
      AI.DB.usecases().forEach(function (u) {
        const opt = document.createElement("option");
        opt.value = u.useCaseName; opt.textContent = u.useCaseName;
        ucSelect.appendChild(opt);
      });
    }
    const chipsWrap = document.getElementById("quoteProductChips");
    if (chipsWrap && !chipsWrap.dataset.rendered) {
      chipsWrap.innerHTML = AI.DB.products().map(function (p) {
        return '<label class="chip-check" data-pid="' + escapeHtml(p.id) + '"><input type="checkbox" value="' + escapeHtml(p.id) + '" /> ' + escapeHtml(p.productName) + "</label>";
      }).join("");
      chipsWrap.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        cb.addEventListener("change", function () {
          cb.closest(".chip-check").classList.toggle("checked", cb.checked);
        });
      });
      chipsWrap.dataset.rendered = "1";
    }
  }

  function wireQuoteForm() {
    const form = document.getElementById("quoteForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitQuoteForm("quote_form");
    });
    document.getElementById("quoteSampleBtn").addEventListener("click", function () {
      submitQuoteForm("sample_request");
    });
  }

  function submitQuoteForm(channel) {
    const form = document.getElementById("quoteForm");
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    if (!name || !phone) { showToast("กรุณากรอกชื่อและเบอร์โทร"); return; }
    const selectedProducts = Array.from(document.querySelectorAll('#quoteProductChips input:checked')).map(function (cb) { return cb.value; });
    const productNames = selectedProducts.map(function (id) { const p = AI.getProductById(id); return p ? p.productName : id; }).join(", ");
    const lead = AI.createLead({
      name: name, company: (fd.get("company") || "").toString(), phone: phone,
      line: (fd.get("line") || "").toString(), email: (fd.get("email") || "").toString(),
      jobType: (fd.get("useCase") || "").toString(), useCase: (fd.get("useCase") || "").toString(),
      productsInterested: productNames, quantity: (fd.get("quantity") || "").toString(),
      province: (fd.get("province") || "").toString(), neededDate: (fd.get("neededDate") || "").toString(),
      note: (fd.get("note") || "").toString(), channel: channel,
      painPoint: "", urgency: "normal", suggestedNextAction: "AE ติดต่อกลับเพื่อตรวจสอบราคา/stock/lead time"
    });
    const msgEl = document.getElementById("quoteConfirmMsg");
    msgEl.style.display = "block";
    msgEl.textContent = "ได้รับข้อมูลแล้ว ทีม AE จะตรวจสอบราคา stock และ lead time ก่อนยืนยันกลับ";
    showToast("บันทึก Lead เรียบร้อย: " + lead.id);
    // Notify the sales team immediately that a new lead came in.
    AI.incUnreadCount(AI.NOTIF_KEYS.unreadLeads);
    renderNotificationBadges();
    AI.sendBrowserNotification(
      "🔔 Lead ใหม่: " + (channel === "sample_request" ? "ขอตัวอย่างสินค้า" : "ขอใบเสนอราคา"),
      name + (productNames ? " — สนใจ: " + productNames : "") + " (โทร " + phone + ")"
    );
    form.reset();
    document.querySelectorAll('#quoteProductChips input').forEach(function (cb) {
      cb.checked = false;
      cb.closest(".chip-check").classList.remove("checked");
    });
  }

  /* ---------------------------------------------------------------------------
     ADMIN DASHBOARD VIEW
     --------------------------------------------------------------------------- */
  function renderAdminDashboard() {
    const leads = AI.DB.leads();
    const chatLog = AI.DB.chatLog();
    const today = new Date().toDateString();
    const leadsToday = leads.filter(function (l) { return new Date(l.date).toDateString() === today; }).length;

    document.getElementById("adminStatCards").innerHTML =
      statCard("Total Leads", leads.length) +
      statCard("New Leads Today", leadsToday) +
      statCard("Total Chat Questions", chatLog.length);

    const questionCounts = {};
    chatLog.forEach(function (c) { if (c.text) questionCounts[c.text] = (questionCounts[c.text] || 0) + 1; });
    document.getElementById("adminTopQuestions").innerHTML = topListHtml(questionCounts) || '<div class="empty-state">ยังไม่มีข้อมูล</div>';

    const productCounts = {};
    chatLog.forEach(function (c) { if (c.productId) { const p = AI.getProductById(c.productId); const label = p ? p.productName : c.productId; productCounts[label] = (productCounts[label] || 0) + 1; } });
    leads.forEach(function (l) { if (l.productsInterested) { l.productsInterested.split(",").map(function(s){return s.trim();}).filter(Boolean).forEach(function (name) { productCounts[name] = (productCounts[name] || 0) + 1; }); } });
    document.getElementById("adminTopProducts").innerHTML = topListHtml(productCounts) || '<div class="empty-state">ยังไม่มีข้อมูล</div>';

    const usecaseCounts = {};
    chatLog.forEach(function (c) { if (c.useCase) usecaseCounts[c.useCase] = (usecaseCounts[c.useCase] || 0) + 1; });
    leads.forEach(function (l) { if (l.useCase) usecaseCounts[l.useCase] = (usecaseCounts[l.useCase] || 0) + 1; });
    document.getElementById("adminTopUsecases").innerHTML = topListHtml(usecaseCounts) || '<div class="empty-state">ยังไม่มีข้อมูล</div>';
  }

  function statCard(label, value) {
    return '<div class="card stat-card"><div class="stat-value">' + value + '</div><div class="stat-label">' + escapeHtml(label) + "</div></div>";
  }

  function topListHtml(counts) {
    const entries = Object.keys(counts).map(function (k) { return [k, counts[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);
    if (!entries.length) return "";
    return entries.map(function (e) {
      return '<div class="list-row"><span>' + escapeHtml(e[0]) + '</span><span class="tag">' + e[1] + "</span></div>";
    }).join("");
  }

  function wireAdminButtons() {
    document.getElementById("exportCsvBtn").addEventListener("click", function () {
      const leads = AI.DB.leads();
      if (!leads.length) { showToast("ยังไม่มี Lead ให้ export"); return; }
      AI.downloadCsv("leads-export-" + Date.now() + ".csv", AI.leadsToCsv(leads));
      showToast("Export CSV สำเร็จ");
    });
    document.getElementById("resetDemoBtn").addEventListener("click", function () {
      if (!confirm("ยืนยันการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเดโม่เริ่มต้น? การกระทำนี้จะลบ Lead และข้อมูลที่แก้ไขทั้งหมด")) return;
      AI.resetDemoData();
      showToast("รีเซ็ตข้อมูลเดโม่เรียบร้อย");
      renderAdminDashboard();
      renderKbTable();
      renderLeadsTable();
    });
  }

  /* ---------------------------------------------------------------------------
     KNOWLEDGE BASE MANAGER VIEW (generic CRUD)
     --------------------------------------------------------------------------- */
  function renderKbTable() {
    const cfg = KB_CONFIGS[activeKbTab];
    const wrap = document.getElementById("kbTableWrap");
    const data = AI.lsGet(cfg.storeKey, []);
    if (!data.length) { wrap.innerHTML = '<div class="empty-state">ยังไม่มีข้อมูลในตารางนี้</div>'; return; }
    const displayFields = cfg.fields.slice(0, 5);
    let html = '<table class="data-table"><thead><tr>' + displayFields.map(function (f) { return "<th>" + f.label + "</th>"; }).join("") + "<th>จัดการ</th></tr></thead><tbody>";
    data.forEach(function (row) {
      html += "<tr>" + displayFields.map(function (f) {
        let v = row[f.key];
        if (Array.isArray(v)) v = v.join(", ");
        return "<td>" + escapeHtml(v) + "</td>";
      }).join("") +
      '<td><button class="btn btn-outline btn-sm" data-edit="' + escapeHtml(row[cfg.idField]) + '">แก้ไข</button> ' +
      '<button class="btn btn-danger btn-sm" data-del="' + escapeHtml(row[cfg.idField]) + '">ลบ</button></td></tr>';
    });
    html += "</tbody></table>";
    wrap.innerHTML = html;
    wrap.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () { openKbModal(btn.getAttribute("data-edit")); });
    });
    wrap.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.addEventListener("click", function () { deleteKbRow(btn.getAttribute("data-del")); });
    });
  }

  function deleteKbRow(id) {
    if (!confirm("ยืนยันการลบรายการนี้?")) return;
    const cfg = KB_CONFIGS[activeKbTab];
    const data = AI.lsGet(cfg.storeKey, []).filter(function (row) { return String(row[cfg.idField]) !== String(id); });
    AI.saveCollection(cfg.storeKey, data);
    renderKbTable();
    showToast("ลบข้อมูลเรียบร้อย");
  }

  function openKbModal(editId) {
    kbEditingId = editId || null;
    const cfg = KB_CONFIGS[activeKbTab];
    document.getElementById("kbModalTitle").textContent = (editId ? "แก้ไข: " : "เพิ่มใหม่: ") + cfg.label;
    let existing = {};
    if (editId) {
      existing = AI.lsGet(cfg.storeKey, []).find(function (row) { return String(row[cfg.idField]) === String(editId); }) || {};
    }
    const body = document.getElementById("kbModalBody");
    body.innerHTML = cfg.fields.map(function (f) {
      const val = existing[f.key];
      const idAttr = "kbf_" + f.key;
      if (f.type === "textarea") {
        return '<div class="kb-field"><label>' + f.label + '</label><textarea class="form-control" id="' + idAttr + '" rows="2">' + escapeHtml(val) + "</textarea></div>";
      }
      if (f.type === "list") {
        return '<div class="kb-field"><label>' + f.label + '</label><input class="form-control" id="' + idAttr + '" value="' + escapeHtml(Array.isArray(val) ? val.join(", ") : (val || "")) + '" /></div>';
      }
      if (f.type === "select") {
        return '<div class="kb-field"><label>' + f.label + '</label><select class="form-control" id="' + idAttr + '">' +
          f.options.map(function (o) { return '<option value="' + escapeHtml(o) + '" ' + (o === val ? "selected" : "") + ">" + escapeHtml(o) + "</option>"; }).join("") +
          "</select></div>";
      }
      if (f.type === "bool") {
        return '<div class="kb-field"><label><input type="checkbox" id="' + idAttr + '" ' + (val ? "checked" : "") + " /> " + f.label + "</label></div>";
      }
      const readonly = f.readonlyOnEdit && editId ? "readonly" : "";
      return '<div class="kb-field"><label>' + f.label + '</label><input class="form-control" id="' + idAttr + '" value="' + escapeHtml(val) + '" ' + readonly + " /></div>";
    }).join("");
    openModal("kbModalBackdrop");
  }

  function saveKbModal() {
    const cfg = KB_CONFIGS[activeKbTab];
    const row = {};
    cfg.fields.forEach(function (f) {
      const el = document.getElementById("kbf_" + f.key);
      if (!el) return;
      if (f.type === "bool") row[f.key] = el.checked;
      else if (f.type === "list") row[f.key] = el.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      else row[f.key] = el.value;
    });
    const data = AI.lsGet(cfg.storeKey, []);
    if (kbEditingId) {
      const idx = data.findIndex(function (r) { return String(r[cfg.idField]) === String(kbEditingId); });
      if (idx !== -1) data[idx] = Object.assign({}, data[idx], row);
    } else {
      if (!row[cfg.idField]) {
        row[cfg.idField] = cfg.idPrefix ? cfg.idPrefix + Date.now().toString().slice(-6) : ("NEW" + Date.now());
      }
      data.push(row);
    }
    AI.saveCollection(cfg.storeKey, data);
    closeModal("kbModalBackdrop");
    renderKbTable();
    showToast("บันทึกข้อมูลเรียบร้อย");
  }

  function wireKbManager() {
    document.querySelectorAll(".kb-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeKbTab = tab.getAttribute("data-kb");
        document.querySelectorAll(".kb-tab").forEach(function (t) { t.classList.toggle("active", t === tab); });
        renderKbTable();
      });
    });
    document.getElementById("kbAddBtn").addEventListener("click", function () { openKbModal(null); });
    document.getElementById("kbModalSave").addEventListener("click", saveKbModal);
    document.getElementById("kbModalCancel").addEventListener("click", function () { closeModal("kbModalBackdrop"); });
    document.getElementById("kbModalClose").addEventListener("click", function () { closeModal("kbModalBackdrop"); });
  }

  /* ---------------------------------------------------------------------------
     LEAD INBOX VIEW
     --------------------------------------------------------------------------- */
  const LEAD_STATUSES = ["new", "contacted", "quoted", "sample sent", "won", "lost"];

  function renderLeadsTable() {
    const leads = AI.DB.leads();
    const wrap = document.getElementById("leadsTableWrap");
    if (!leads.length) { wrap.innerHTML = '<div class="empty-state">ยังไม่มี Lead เข้ามา</div>'; return; }
    let html = '<table class="data-table"><thead><tr><th>วันที่</th><th>ชื่อ</th><th>บริษัท</th><th>ติดต่อ</th><th>สนใจ</th><th>Use case</th><th>Channel</th><th>สถานะ</th></tr></thead><tbody>';
    leads.forEach(function (l) {
      html += "<tr><td>" + escapeHtml(new Date(l.date).toLocaleDateString("th-TH")) + "</td>" +
        "<td>" + escapeHtml(l.name) + "</td><td>" + escapeHtml(l.company) + "</td>" +
        "<td>" + escapeHtml(l.phone) + (l.line ? " / LINE: " + escapeHtml(l.line) : "") + "</td>" +
        "<td>" + escapeHtml(l.productsInterested) + "</td><td>" + escapeHtml(l.useCase) + "</td>" +
        "<td>" + escapeHtml(l.channel) + "</td>" +
        '<td><select class="form-control lead-status-select" data-leadid="' + escapeHtml(l.id) + '">' +
        LEAD_STATUSES.map(function (s) { return '<option value="' + s + '" ' + (s === l.status ? "selected" : "") + ">" + s + "</option>"; }).join("") +
        "</select></td></tr>";
    });
    html += "</tbody></table>";
    wrap.innerHTML = html;
    wrap.querySelectorAll(".lead-status-select").forEach(function (sel) {
      sel.addEventListener("change", function () {
        AI.updateLeadStatus(sel.getAttribute("data-leadid"), sel.value);
        showToast("อัปเดตสถานะ Lead เรียบร้อย");
      });
    });
  }

  /* ---------------------------------------------------------------------------
     LANGUAGE TOGGLE
     --------------------------------------------------------------------------- */
  function applyLanguageStrings() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = AI.t(el.getAttribute("data-i18n"));
    });
    document.documentElement.lang = AI.LANG();
    const chatInput = document.getElementById("chatInput");
    if (chatInput) chatInput.placeholder = AI.t("askPlaceholder");
    // Quick-question chips have their own per-language text list (not plain
    // data-i18n keys), so they need an explicit re-render on every toggle.
    renderQuickQuestions();
  }

  function wireLangToggle() {
    document.getElementById("langToggleBtn").addEventListener("click", function () {
      AI.setLang(AI.LANG() === "th" ? "en" : "th");
      applyLanguageStrings();
    });
  }

  /* ---------------------------------------------------------------------------
     NAVIGATION WIRING
     --------------------------------------------------------------------------- */
  function wireNavigation() {
    document.querySelectorAll(".nav-item[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () { switchView(btn.getAttribute("data-view")); });
    });
    document.querySelectorAll("#moreSheetBox [data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () { switchView(btn.getAttribute("data-view")); });
    });
    document.getElementById("moreSheetClose").addEventListener("click", function () { closeModal("moreSheetBackdrop"); });
    document.getElementById("moreSheetBackdrop").addEventListener("click", function (e) {
      if (e.target.id === "moreSheetBackdrop") closeModal("moreSheetBackdrop");
    });
    document.getElementById("kbModalBackdrop").addEventListener("click", function (e) {
      if (e.target.id === "kbModalBackdrop") closeModal("kbModalBackdrop");
    });
  }

  /* ---------------------------------------------------------------------------
     INIT
     --------------------------------------------------------------------------- */
  function init() {
    AI.seedIfNeeded();
    renderQuickQuestions();
    appendChatMessage("bot", renderStructuredAnswer({
      summaryHtml: AI.t("welcomeMessage"),
      recommended: [], reasons: [], cautions: [], aeConfirm: [], cta: []
    }));

    document.getElementById("chatSendBtn").addEventListener("click", sendChatMessage);
    document.getElementById("chatInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") sendChatMessage();
    });

    wireImageMatch();
    wireQuoteForm();
    wireAdminButtons();
    wireKbManager();
    wireNavigation();
    wireLangToggle();
    applyLanguageStrings();

    // Notification system: ask permission once, then reflect any unread
    // leads / AE-confirm flags left over from a previous session as badges.
    AI.ensureNotificationPermission();
    renderNotificationBadges();

    // Register service worker only when served over http(s) — file:// does not
    // support service worker registration and would otherwise log a console error.
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("service-worker.js").catch(function (err) {
          console.warn("Service worker registration failed:", err);
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
