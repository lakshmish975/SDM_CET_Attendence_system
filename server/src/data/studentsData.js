// Complete hardcoded student roster extracted from reference HTML (165 Students Total)
// 80 students from I PUC (24 CET, 56 NEET)
// 85 students from II PUC (41 CET, 44 NEET)

export const rawIPUCData = [
  { slNo: 1, name: "NIRIKSHA B M", rollNo: "262715", stream: "CET", hostel: "MY3", phone: "9483981013" },
  { slNo: 2, name: "RAMPRASAD T S", rollNo: "262102", stream: "CET", hostel: "AKSHARA", phone: "8310523546" },
  { slNo: 3, name: "SHETHIL JAIN", rollNo: "262755", stream: "CET", hostel: "SVG", phone: "9480554281" },
  { slNo: 4, name: "HARSHITH", rollNo: "262104", stream: "CET", hostel: "AKSHARA", phone: "7975881255" },
  { slNo: 5, name: "AKSHATHA S U", rollNo: "262105", stream: "CET", hostel: "IT", phone: "9019969671" },
  { slNo: 6, name: "TARUN K N", rollNo: "262225", stream: "CET", hostel: "SVG", phone: "9945331384" },
  { slNo: 7, name: "CHINMAY R DADDE", rollNo: "262740", stream: "CET", hostel: "SVG", phone: "9945994262" },
  { slNo: 8, name: "ARHAN JAIN", rollNo: "262707", stream: "CET", hostel: "LOCAL", phone: "9731593125" },
  { slNo: 9, name: "LASHITH B N", rollNo: "262658", stream: "CET", hostel: "AKSHARA", phone: "8884441769" },
  { slNo: 10, name: "TEJAS KUMAR JAIN S P", rollNo: "262173", stream: "CET", hostel: "SVG", phone: "9986712220" },
  { slNo: 11, name: "PREETHAM B Y GOWDA", rollNo: "262263", stream: "CET", hostel: "AKSHARA", phone: "6360820010" },
  { slNo: 12, name: "PRANAV GOWDA L S", rollNo: "262720", stream: "CET", hostel: "IT", phone: "9901759719" },
  { slNo: 13, name: "ABHAY CHANDRA P", rollNo: "262619", stream: "CET", hostel: "AKSHARA", phone: "9741147405" },
  { slNo: 14, name: "NIRAJ B G", rollNo: "262151", stream: "CET", hostel: "AKSHARA", phone: "9535332305" },
  { slNo: 15, name: "ROSHAN DAYANAND", rollNo: "262753", stream: "CET", hostel: "AKSHARA", phone: "8105529922" },
  { slNo: 16, name: "GURU CHARAN R", rollNo: "262133", stream: "CET", hostel: "AKSHARA", phone: "9632838307" },
  { slNo: 17, name: "PRAJITH K NAIR", rollNo: "262117", stream: "CET", hostel: "LOCAL", phone: "8078326716" },
  { slNo: 18, name: "SUCHENDRA D GOUDA", rollNo: "262270", stream: "CET", hostel: "AKSHARA", phone: "9482875087" },
  { slNo: 19, name: "RISHIKESH S PATIL", rollNo: "262611", stream: "CET", hostel: "AKSHARA", phone: "9901375704" },
  { slNo: 20, name: "VIGNESH S POOJARY", rollNo: "262648", stream: "CET", hostel: "AKSHARA", phone: "8660975709" },
  { slNo: 21, name: "KOUSTUBA S G", rollNo: "262240", stream: "CET", hostel: "IT", phone: "9731479806" },
  { slNo: 22, name: "M MAHESH", rollNo: "262266", stream: "CET", hostel: "SVG", phone: "9481385168" },
  { slNo: 23, name: "SHIVANI M S", rollNo: "262168", stream: "CET", hostel: "IT", phone: "8797758459" },
  { slNo: 24, name: "AMULYA H S", rollNo: "262705", stream: "CET", hostel: "IT", phone: "9380513157" },
  { slNo: 25, name: "SMITHA K S", rollNo: "262268", stream: "NEET", hostel: "MY3", phone: "9663943312" },
  { slNo: 26, name: "CHANDRIKA P", rollNo: "262114", stream: "NEET", hostel: "IT", phone: "8105587169" },
  { slNo: 27, name: "BHAVANA G B", rollNo: "262127", stream: "NEET", hostel: "MY3", phone: "9743678443" },
  { slNo: 28, name: "SAMEEKSHA K H", rollNo: "262434", stream: "NEET", hostel: "IT", phone: "7676873302" },
  { slNo: 29, name: "MEGHANA", rollNo: "262148", stream: "NEET", hostel: "IT", phone: "9480620615" },
  { slNo: 30, name: "ADARSH H Y", rollNo: "262368", stream: "NEET", hostel: "LOCAL", phone: "9481608535" },
  { slNo: 31, name: "PUSHPAK B V", rollNo: "262158", stream: "NEET", hostel: "AKSHARA", phone: "9900810278" },
  { slNo: 32, name: "CHARAN P", rollNo: "262358", stream: "NEET", hostel: "BCM", phone: "6364177370" },
  { slNo: 33, name: "NAVYA H P", rollNo: "262261", stream: "NEET", hostel: "IT", phone: "7975245292" },
  { slNo: 34, name: "ANKITHA M G", rollNo: "262107", stream: "NEET", hostel: "IT", phone: "9481622990" },
  { slNo: 35, name: "SUPRIYA BAPUGOUDA PATIL", rollNo: "262271", stream: "NEET", hostel: "IT", phone: "9845189764" },
  { slNo: 36, name: "SRUSTI", rollNo: "262269", stream: "NEET", hostel: "IT", phone: "8618160205" },
  { slNo: 37, name: "LEN AYYAPPA M P", rollNo: "262142", stream: "NEET", hostel: "AKSHARA", phone: "9141583960" },
  { slNo: 38, name: "GAYATHRI H H", rollNo: "262128", stream: "NEET", hostel: "IT", phone: "8861791615" },
  { slNo: 39, name: "PRUTHVI RAJ SHETTY B S", rollNo: "262157", stream: "NEET", hostel: "AKSHARA", phone: "9945458138" },
  { slNo: 40, name: "BHAVISH H N", rollNo: "262110", stream: "NEET", hostel: "SVG", phone: "9108645611" },
  { slNo: 41, name: "SRUJAN N L", rollNo: "262525", stream: "NEET", hostel: "BCM", phone: "6361003689" },
  { slNo: 42, name: "PORVIKA G", rollNo: "262213", stream: "NEET", hostel: "IT", phone: "9901952588" },
  { slNo: 43, name: "SANJANA U K", rollNo: "262265", stream: "NEET", hostel: "IT", phone: "8281421491" },
  { slNo: 44, name: "SADHANA M PATIL", rollNo: "262251", stream: "NEET", hostel: "MY3(A)", phone: "9880868737" },
  { slNo: 45, name: "MITHUN S R", rollNo: "262149", stream: "NEET", hostel: "AKSHARA", phone: "8546823568" },
  { slNo: 46, name: "M P BHARATH", rollNo: "262242", stream: "NEET", hostel: "AKSHARA", phone: "8197029512" },
  { slNo: 47, name: "POORNIMA VINOD MAHINDRAKR", rollNo: "262248", stream: "NEET", hostel: "IT", phone: "8872400031" },
  { slNo: 48, name: "H G GANAVI", rollNo: "262204", stream: "NEET", hostel: "IT", phone: "9449585372" },
  { slNo: 49, name: "THANUSHREE", rollNo: "262272", stream: "NEET", hostel: "IT", phone: "9449620087" },
  { slNo: 50, name: "JYOTHIBA M MUGALI", rollNo: "262140", stream: "NEET", hostel: "AKSHARA", phone: "9945934791" },
  { slNo: 51, name: "HARSHIT H S", rollNo: "262135", stream: "NEET", hostel: "AKSHARA", phone: "9945212847" },
  { slNo: 52, name: "VISHWRADHYA", rollNo: "262540", stream: "NEET", hostel: "VRUNDAVANA PG", phone: "9964874398" },
  { slNo: 53, name: "SANVI R T", rollNo: "262267", stream: "NEET", hostel: "IT", phone: "8660012361" },
  { slNo: 54, name: "KUSHALA B", rollNo: "262206", stream: "NEET", hostel: "IT", phone: "8711937726" },
  { slNo: 55, name: "CHARVI B S", rollNo: "262115", stream: "NEET", hostel: "IT", phone: "7090355863" },
  { slNo: 56, name: "MEGHANA K M", rollNo: "262209", stream: "NEET", hostel: "IT", phone: "9483843828" },
  { slNo: 57, name: "POORVIKA P M", rollNo: "262153", stream: "NEET", hostel: "MY3", phone: "9805078309" },
  { slNo: 58, name: "DISHANTH GOWDA T S", rollNo: "262123", stream: "NEET", hostel: "AKSHARA", phone: "8088113155" },
  { slNo: 59, name: "SHARADHI G P", rollNo: "262220", stream: "NEET", hostel: "IT", phone: "9448666137" },
  { slNo: 60, name: "LALITHYA H R", rollNo: "262207", stream: "NEET", hostel: "IT", phone: "9483144701" },
  { slNo: 61, name: "VINYAS GOWDA H S", rollNo: "262230", stream: "NEET", hostel: "AKSHARA", phone: "9880259749" },
  { slNo: 62, name: "TEJAS R", rollNo: "262227", stream: "NEET", hostel: "AKSHARA", phone: "9036252176" },
  { slNo: 63, name: "ALFIYA BANU", rollNo: "262348", stream: "NEET", hostel: "LOCAL", phone: "8431781403" },
  { slNo: 64, name: "PRAJWAL K H", rollNo: "262155", stream: "NEET", hostel: "AKSHARA", phone: "9845443556" },
  { slNo: 65, name: "TEJAS M", rollNo: "262226", stream: "NEET", hostel: "AKSHARA", phone: "8277269269" },
  { slNo: 66, name: "NITHYA PRIYA", rollNo: "262212", stream: "NEET", hostel: "IT", phone: "9845076704" },
  { slNo: 67, name: "HARSHITH G", rollNo: "262238", stream: "NEET", hostel: "AKSHARA", phone: "8197543089" },
  { slNo: 68, name: "MANOJNA", rollNo: "262260", stream: "NEET", hostel: "IT", phone: "7899440057" },
  { slNo: 69, name: "SNEHA A B", rollNo: "262170", stream: "NEET", hostel: "IT", phone: "9845243706" },
  { slNo: 70, name: "DUSHYANTH G U", rollNo: "262124", stream: "NEET", hostel: "AKSHARA", phone: "9448541867" },
  { slNo: 71, name: "DHANUSH M R", rollNo: "262119", stream: "NEET", hostel: "AKSHARA", phone: "9972209567" },
  { slNo: 72, name: "AMOGHVARSH PATIL", rollNo: "262172", stream: "NEET", hostel: "PG(SRI DEVI KRUPA)", phone: "8197819722" },
  { slNo: 73, name: "ADITYA GURURAJ KUMBAR", rollNo: "262103", stream: "NEET", hostel: "AKSHARA", phone: "9945956629" },
  { slNo: 74, name: "NAGENDRA PRASAD K C", rollNo: "262465", stream: "NEET", hostel: "BALAJI MESS", phone: "9902486634" },
  { slNo: 75, name: "SHIVA KUMAR S A", rollNo: "262167", stream: "NEET", hostel: "AKSHARA", phone: "9901865457" },
  { slNo: 76, name: "SINCHANA", rollNo: "262223", stream: "NEET", hostel: "IT", phone: "9964219777" },
  { slNo: 77, name: "GOWTHAM S G", rollNo: "262131", stream: "NEET", hostel: "AKSHARA", phone: "8660857527" },
  { slNo: 78, name: "B MRUDHURAJA", rollNo: "262178", stream: "NEET", hostel: "AKSHARA", phone: "9886827237" },
  { slNo: 79, name: "LIKHITH T Y", rollNo: "262143", stream: "NEET", hostel: "AKSHARA", phone: "9980497317" },
  { slNo: 80, name: "SAMARATH C A", rollNo: "262163", stream: "NEET", hostel: "AKSHARA", phone: "9448551390" }
];

export const rawIIPUCData = [
  { slNo: 1, name: "HEMANTH B S", rollNo: "252138", stream: "CET", hostel: "AKSHARA", phone: "7795065653" },
  { slNo: 2, name: "AMITH S", rollNo: "252105", stream: "CET", hostel: "AKSHARA", phone: "9741103368" },
  { slNo: 3, name: "KARUN GOWDA R", rollNo: "252144", stream: "CET", hostel: "AKSHARA", phone: "9886235982" },
  { slNo: 4, name: "NIKITA B MANIKYAL", rollNo: "252158", stream: "CET", hostel: "LOCAL", phone: "8217316825" },
  { slNo: 5, name: "JEEVIKA A", rollNo: "252229", stream: "CET", hostel: "MY3", phone: "9844251395" },
  { slNo: 6, name: "DARSHINI T", rollNo: "252219", stream: "CET", hostel: "MY3", phone: "7829042322" },
  { slNo: 7, name: "GUNAVATHI", rollNo: "252222", stream: "CET", hostel: "MY3", phone: "9900375802" },
  { slNo: 8, name: "VISHNU K V", rollNo: "252348", stream: "CET", hostel: "AKSHARA", phone: "9448124895" },
  { slNo: 9, name: "MOKSHITH H R", rollNo: "252355", stream: "CET", hostel: "AKSHARA", phone: "9448164873" },
  { slNo: 10, name: "YASHASWINI K S", rollNo: "252372", stream: "CET", hostel: "MY3", phone: "9342901844" },
  { slNo: 11, name: "PRETHAM B V", rollNo: "252367", stream: "CET", hostel: "SVG", phone: "9448272127" },
  { slNo: 12, name: "RAKSHITH D S", rollNo: "252320", stream: "CET", hostel: "AKSHARA", phone: "9964467579" },
  { slNo: 13, name: "BHUVANESH K P", rollNo: "252465", stream: "CET", hostel: "PG(ARUNJYOTHI)", phone: "8277416691" },
  { slNo: 14, name: "B H NAGENDRA", rollNo: "252428", stream: "CET", hostel: "VRUNDAVANA MESS", phone: "9449129635" },
  { slNo: 15, name: "YOJITH S R", rollNo: "252551", stream: "CET", hostel: "AKSHARA", phone: "9886946021" },
  { slNo: 16, name: "GAYAN T P", rollNo: "252552", stream: "CET", hostel: "AKSHARA", phone: "9845298708" },
  { slNo: 17, name: "NISHMITH S NAIK", rollNo: "252554", stream: "CET", hostel: "LOCAL", phone: "9880040836" },
  { slNo: 18, name: "NANDAN GANESH MOGER", rollNo: "252638", stream: "CET", hostel: "SVG", phone: "9741810814" },
  { slNo: 19, name: "DUSHYANTH Y P", rollNo: "252757", stream: "CET", hostel: "AKSHARA", phone: "9481080241" },
  { slNo: 20, name: "RUTHWIK S", rollNo: "252769", stream: "CET", hostel: "AKSHARA", phone: "9448520204" },
  { slNo: 21, name: "DHASHWANTH H S", rollNo: "252756", stream: "CET", hostel: "AKSHARA", phone: "7019720772" },
  { slNo: 22, name: "SHOBHITH S H", rollNo: "252717", stream: "CET", hostel: "AKSHARA", phone: "9591072695" },
  { slNo: 23, name: "SUKANTH GOWDA C G", rollNo: "252721", stream: "CET", hostel: "AKSHARA", phone: "9353766144" },
  { slNo: 24, name: "SATHVIK G SALANKE", rollNo: "252744", stream: "CET", hostel: "AKSHARA", phone: "9945614992" },
  { slNo: 25, name: "SAMYAK U G", rollNo: "252771", stream: "CET", hostel: "AKSHARA", phone: "6361389071" },
  { slNo: 26, name: "SWASTHIK SUVARNA", rollNo: "252723", stream: "CET", hostel: "AKSHARA", phone: "9482379958" },
  { slNo: 27, name: "SATHVIK BHAT", rollNo: "252772", stream: "CET", hostel: "LOCAL", phone: "9980897317" },
  { slNo: 28, name: "SHREYAS M", rollNo: "252773", stream: "CET", hostel: "LOCAL", phone: "9972061094" },
  { slNo: 29, name: "KARTHIK G P", rollNo: "252705", stream: "CET", hostel: "PG(SHIVAGIRI)", phone: "9164284489" },
  { slNo: 30, name: "SKANDA", rollNo: "252750", stream: "CET", hostel: "SVG", phone: "7411642170" },
  { slNo: 31, name: "VILAS NGARAJ MOGER", rollNo: "252724", stream: "CET", hostel: "SVG", phone: "8105311715" },
  { slNo: 32, name: "TEJASWI G HEGDE", rollNo: "252774", stream: "CET", hostel: "SVG", phone: "7019332184" },
  { slNo: 33, name: "KISHANKUMAR N N", rollNo: "252731", stream: "CET", hostel: "SVG", phone: "9481053765" },
  { slNo: 34, name: "SUJAY J", rollNo: "252622", stream: "CET", hostel: "AKSHARA", phone: "9945925824" },
  { slNo: 35, name: "VISHRUTH  GOWDA G H", rollNo: "252625", stream: "CET", hostel: "SVG", phone: "9945638773" },
  { slNo: 36, name: "SHREYAS J GOWDA", rollNo: "252718", stream: "CET", hostel: "AKSHARA", phone: "8971399954" },
  { slNo: 37, name: "CHARAN R", rollNo: "252627", stream: "CET", hostel: "AKSHARA", phone: "7899520447" },
  { slNo: 38, name: "GAGAN B V", rollNo: "252249", stream: "CET", hostel: "LOCAL", phone: "9945200000" },
  { slNo: 39, name: "SURAJ MADIVALA", rollNo: "252340", stream: "CET", hostel: "LOCAL", phone: "8123824496" },
  { slNo: 40, name: "SHASHANK BELLAPPA M N", rollNo: "252329", stream: "CET", hostel: "AKSHARA", phone: "9902315185" },
  { slNo: 41, name: "ARAVINDA KALLARE M", rollNo: "252755", stream: "CET", hostel: "AKSHARA", phone: "8197080684" },
  { slNo: 42, name: "VASAVI", rollNo: "252363", stream: "NEET", hostel: "MY3", phone: "9902601000" },
  { slNo: 43, name: "NARASAMMA", rollNo: "252157", stream: "NEET", hostel: "BCM", phone: "9902601459" },
  { slNo: 44, name: "VISHNU PRASAD A", rollNo: "252574", stream: "NEET", hostel: "AKSHARA", phone: "8861108659" },
  { slNo: 45, name: "APTHA H B", rollNo: "252206", stream: "NEET", hostel: "MY3", phone: "8073361540" },
  { slNo: 46, name: "ANUSHA S", rollNo: "252205", stream: "NEET", hostel: "MY3", phone: "9902206639" },
  { slNo: 47, name: "C P RISHI", rollNo: "252212", stream: "NEET", hostel: "MY3", phone: "9481622059" },
  { slNo: 48, name: "CHANDANA K M", rollNo: "252213", stream: "NEET", hostel: "MY3", phone: "6360531181" },
  { slNo: 49, name: "KALPITHA Y D", rollNo: "252231", stream: "NEET", hostel: "MY3", phone: "9900988000" },
  { slNo: 50, name: "MILANA B", rollNo: "252239", stream: "NEET", hostel: "MY3", phone: "9900988974" },
  { slNo: 51, name: "BHOOMIKA B S", rollNo: "252209", stream: "NEET", hostel: "MY3", phone: "8861093306" },
  { slNo: 52, name: "INCHARA G", rollNo: "252226", stream: "NEET", hostel: "MY3", phone: "9448170469" },
  { slNo: 53, name: "MONISHA M", rollNo: "252241", stream: "NEET", hostel: "MY3", phone: "9900337221" },
  { slNo: 54, name: "ADYA SHETTY", rollNo: "252259", stream: "NEET", hostel: "MY3", phone: "8497069122" },
  { slNo: 55, name: "AISHWARYA S B", rollNo: "252201", stream: "NEET", hostel: "MY3", phone: "9611153351" },
  { slNo: 56, name: "BINDUPRIYA H M", rollNo: "252211", stream: "NEET", hostel: "MY3", phone: "7022810293" },
  { slNo: 57, name: "CHAYASHREE G S", rollNo: "252216", stream: "NEET", hostel: "MY3", phone: "9482071836" },
  { slNo: 58, name: "SANIKA M M", rollNo: "252328", stream: "NEET", hostel: "LOCAL", phone: "6360803853" },
  { slNo: 59, name: "SUDEER GOWDA", rollNo: "252338", stream: "NEET", hostel: "AKSHARA", phone: "8105597455" },
  { slNo: 60, name: "NAYANA V D", rollNo: "252310", stream: "NEET", hostel: "MY3", phone: "9945429127" },
  { slNo: 61, name: "SAKSHI SATISH KENI", rollNo: "252361", stream: "NEET", hostel: "MY3", phone: "9920915872" },
  { slNo: 62, name: "YASHASWNI S K", rollNo: "252350", stream: "NEET", hostel: "MY3", phone: "9481504376" },
  { slNo: 63, name: "SANIDHYA H V", rollNo: "252368", stream: "NEET", hostel: "MY3", phone: "7349389563" },
  { slNo: 64, name: "CHANDANA M JAIN", rollNo: "252354", stream: "NEET", hostel: "MY3", phone: "9113277082" },
  { slNo: 65, name: "THANUJA", rollNo: "252342", stream: "NEET", hostel: "MY3", phone: "9743802258" },
  { slNo: 66, name: "SPOORTHI B  L", rollNo: "252370", stream: "NEET", hostel: "MY3", phone: "9743452599" },
  { slNo: 67, name: "SINCHANA A", rollNo: "252336", stream: "NEET", hostel: "MY3", phone: "9379778748" },
  { slNo: 68, name: "PUNARVI JAIN K M", rollNo: "252318", stream: "NEET", hostel: "MY3", phone: "9164327524" },
  { slNo: 69, name: "RUCHITHA", rollNo: "252322", stream: "NEET", hostel: "MY3", phone: "9964389968" },
  { slNo: 70, name: "VINU K L", rollNo: "252371", stream: "NEET", hostel: "MY3", phone: "9611979363" },
  { slNo: 71, name: "GOWRISHREE", rollNo: "252374", stream: "NEET", hostel: "MY3", phone: "8762639612" },
  { slNo: 72, name: "BHAVANI G R", rollNo: "252302", stream: "NEET", hostel: "MY3", phone: "9945808321" },
  { slNo: 73, name: "SHASHANK N", rollNo: "252330", stream: "NEET", hostel: "SVG", phone: "9380964416" },
  { slNo: 74, name: "TARUN P JAIN", rollNo: "252343", stream: "NEET", hostel: "SVG", phone: "8217817528" },
  { slNo: 75, name: "SWAMY R T", rollNo: "252341", stream: "NEET", hostel: "AKSHARA", phone: "8748853635" },
  { slNo: 76, name: "SHREYA M K", rollNo: "252411", stream: "NEET", hostel: "MY3", phone: "9663130649" },
  { slNo: 77, name: "UDAY KUMAR H S", rollNo: "252544", stream: "NEET", hostel: "BCM", phone: "9148353047" },
  { slNo: 78, name: "SRUSTI RAJ M", rollNo: "252575", stream: "NEET", hostel: "LOCAL", phone: "7019554567" },
  { slNo: 79, name: "JITHESH V G", rollNo: "252250", stream: "NEET", hostel: "AKSHARA", phone: "9008138898" },
  { slNo: 80, name: "SHRIDHAR D S", rollNo: "252334", stream: "NEET", hostel: "AKSHARA", phone: "7760472917" },
  { slNo: 81, name: "YATHIRAJ T M", rollNo: "252351", stream: "NEET", hostel: "AKSHARA", phone: "8197497772" },
  { slNo: 82, name: "MANJEETH S B", rollNo: "252254", stream: "NEET", hostel: "AKSHARA", phone: "9909045550" },
  { slNo: 83, name: "BHAVEESH K M", rollNo: "252268", stream: "NEET", hostel: "AKSHARA", phone: "9353814283" },
  { slNo: 84, name: "KAUSHAL K", rollNo: "252252", stream: "NEET", hostel: "AKSHARA", phone: "9448930970" },
  { slNo: 85, name: "SACHITH K SHETTY", rollNo: "252325", stream: "NEET", hostel: "AKSHARA", phone: "8971173375" }
];

// Helper to format into database documents
export function getAllInitialStudents() {
  const students = [];

  // 1. I PUC CET
  rawIPUCData.filter(d => d.stream === 'CET').forEach((d, idx) => {
    students.push({
      rollNo: d.rollNo,
      name: d.name,
      category: 'IPUC_CET',
      puc: 'I PUC',
      stream: 'CET',
      type: d.hostel || 'LOCAL',
      phone: d.phone,
      slNo: idx + 1,
      isActive: true
    });
  });

  // 2. I PUC NEET
  rawIPUCData.filter(d => d.stream === 'NEET').forEach((d, idx) => {
    students.push({
      rollNo: d.rollNo,
      name: d.name,
      category: 'IPUC_NEET',
      puc: 'I PUC',
      stream: 'NEET',
      type: d.hostel || 'LOCAL',
      phone: d.phone,
      slNo: idx + 1,
      isActive: true
    });
  });

  // 3. II PUC CET
  rawIIPUCData.filter(d => d.stream === 'CET').forEach((d, idx) => {
    students.push({
      rollNo: d.rollNo,
      name: d.name,
      category: 'IIPUC_CET',
      puc: 'II PUC',
      stream: 'CET',
      type: d.hostel || 'LOCAL',
      phone: d.phone,
      slNo: idx + 1,
      isActive: true
    });
  });

  // 4. II PUC NEET
  rawIIPUCData.filter(d => d.stream === 'NEET').forEach((d, idx) => {
    students.push({
      rollNo: d.rollNo,
      name: d.name,
      category: 'IIPUC_NEET',
      puc: 'II PUC',
      stream: 'NEET',
      type: d.hostel || 'LOCAL',
      phone: d.phone,
      slNo: idx + 1,
      isActive: true
    });
  });

  return students;
}

export const defaultGroupLinks = {
  IPUC_CET_ABSENT: 'https://chat.whatsapp.com/',
  IPUC_CET_MARKS: 'https://chat.whatsapp.com/',
  IPUC_NEET_ABSENT: 'https://chat.whatsapp.com/',
  IPUC_NEET_MARKS: 'https://chat.whatsapp.com/',
  IIPUC_CET_ABSENT: 'https://chat.whatsapp.com/',
  IIPUC_CET_MARKS: 'https://chat.whatsapp.com/',
  IIPUC_NEET_ABSENT: 'https://chat.whatsapp.com/',
  IIPUC_NEET_MARKS: 'https://chat.whatsapp.com/'
};

