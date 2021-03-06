////////////////////////////////////////////////////////////////////////////////
//
// THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
// Copyright (c) 2009 Microsoft Corporation. All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

var L_localizedStrings_Text = [];

////////////////////////////////////////////////////////////////////////////////
//
// Localized City Names ( for defualt city based on OS Locale Setting )
//
////////////////////////////////////////////////////////////////////////////////
var LOCNAME_ARRAY = new Array('المملكة العربية السعودية‎ / الرياض‎  ','台北','Praha','København','Berlin','Αθήνα','New York, NY','Helsinki','Paris','ירושלים','Budapest','Reykjavík','Roma','東京','서울','Amsterdam','Oslo','Warszawa, Mazowieckie','São Paulo','Cuira','Bucureşti','Москва','Zagreb','Bratislava','Stockholm','กรุงเทพมหานคร','İstanbul','كراچى','Jakarta, Indonesia','Київ','Ljubljana','Tallinn','Rīga','Vilnius','Bakı','Budyšin','Tórshavn','नई दिल्ली','Guovdageaidnu','Caerdydd','ᐃᖃᓗᐃᑦ, ᓄᓇᕗᑦ','Amsterdam','Kalakhang Maynila','La Paz','Lëtzebuerg','Nuuk','Santiago','Wellington','Ciudad de Guatemala','العراق / بغداد','北京','Zürich','London','Ciudad de Mexico','Bruxelles','Lugano','Brussel','Oslo','Lisboa','Beograd','Баку','Chóśebuz','Jiellevárri (closest location: Luleå)','Baile Átha Cliath','Iqaluit, NU','Quito','جمهورية مصر العربية / القاهره','香港','Wien','Canberra','Madrid','Québec, QC','Београд','Anár','Lima','الجماهيرية العربية الليبية /  طرابلس','Singapore, Singapore','Luxemburg','Ottawa, ON','Ciudad de Guatemala','Genève','Bodø','الجزائر /  مدينة الجزائر','Vaduz','Wellington','San José','Luxembourg','Sarajevo','Luleå','المملكة المغربية / الرباط','Dublin','Ciudad de Panama','Monaco-Ville, Monaco','Snåase (closest location: Namsos)','الجمهورية التونسية / تونس','Johannesburg/Gauteng','Santo Domingo','Östersund','سلطنة عُمان /  مسقط','Caracas','Сарајево','Aanar','اليمن / صنعاء','Bogotá','Aanaar','الجمهورية العربية السورية / دمشق','Lima','الأردن / عمّان','Buenos Aires','لبنان / بيروت','Quito','الكويت','Kalakhang Maynila','Santiago','الإمارات العربية المتحدة / دبيّ‎','البحرين /  المنامه','Asunción','قطر /  الدوحة‎','New Delhi','La Paz','Kuala Lumpur','San Salvador','Singapore, Singapore','Tegucigalpa','Managua','San Juan','Los Ángeles, CA','Ciudad de México','Redmond, USA','دبيّ‎','دبيّ‎');

////////////////////////////////////////////////////////////////////////////////
//
// Default values for this locale
//
////////////////////////////////////////////////////////////////////////////////
L_localizedStrings_Text['DefaultCity'] = 'Redmond, WA';
L_localizedStrings_Text['DefaultLocationCode'] = 'wc:USWA0367';
L_localizedStrings_Text['DefaultUnit'] = 'Fahrenheit';

////////////////////////////////////////////////////////////////////////////////
//
// GADGET
//
////////////////////////////////////////////////////////////////////////////////
L_localizedStrings_Text['GettingData'] = 'Getting data...';
L_localizedStrings_Text['LocationDontExist'] = 'Location not found';
L_localizedStrings_Text['Searching'] = 'Searching...';
L_localizedStrings_Text['NoSearchQuery'] = 'No search query specified.';
L_localizedStrings_Text['NoResults'] = 'No results returned.';

L_localizedStrings_Text['Night-New'] = 'New Moon';
L_localizedStrings_Text['Night-Waxing-Crescent'] = 'Waxing Crescent Moon';
L_localizedStrings_Text['Night-First-Quarter'] = 'First Quarter Moon';
L_localizedStrings_Text['Night-Waxing-Gibbous'] = 'Waxing Gibbous Moon';
L_localizedStrings_Text['Night-Full'] = 'Full Moon';
L_localizedStrings_Text['Night-Waning-Gibbous'] = 'Waning Gibbous Moon';
L_localizedStrings_Text['Night-Last-Quarter'] = 'Last Quarter Moon';
L_localizedStrings_Text['Night-Waning-Crescent'] = 'Waning Crescent Moon';

L_localizedStrings_Text['SensorIconRed'] = 'Cannot get present location';
L_localizedStrings_Text['SensorIconGreen'] = 'Your location is detected';
L_localizedStrings_Text['SensorIconGray'] = 'A location sensor is available';
L_localizedStrings_Text['SensorIconNotConnected'] = 'No location sensors connected';
L_localizedStrings_Text['GettingLocation'] = 'Getting current location...';

////////////////////////////////////////////////////////////////////////////////
//
// SETTINGS
//
////////////////////////////////////////////////////////////////////////////////
L_localizedStrings_Text['DisplayTemperatureIn'] = 'Show temperature in:';
L_localizedStrings_Text['Fahrenheit'] = 'Fahrenheit';
L_localizedStrings_Text['Celsius'] = 'Celsius';
L_localizedStrings_Text['Search'] = 'Search';
L_localizedStrings_Text['CurrentCity'] = 'Current location:';
L_localizedStrings_Text['EnterACityName'] = 'Search for location';
L_localizedStrings_Text['SearchNearbyDisambiguation'] = 'closest location for ';
L_localizedStrings_Text['SearchFuzzyDisambiguation'] = 'closest location:';
L_localizedStrings_Text['SearchedLocationFoundClickOK'] = '"%1" found.\nPress OK to Apply.';

L_localizedStrings_Text['SelectLocation'] = 'Select current location';
L_localizedStrings_Text['Automatically'] = 'Find location automatically';
L_localizedStrings_Text['Refresh'] = 'Refresh';
L_localizedStrings_Text['HelperArticleLinkText'] = 'How does Windows find my location automatically?';
L_localizedStrings_Text['HelperArticleLink'] = 'http://go.microsoft.com/fwlink/?LinkId=128457';



////////////////////////////////////////////////////////////////////////////////
//
// LOCATION API ERROR MESSAGES
//
////////////////////////////////////////////////////////////////////////////////
L_localizedStrings_Text['EC1'] = 'No location sensor is available';
L_localizedStrings_Text['EC4'] = 'No weather information for current location';

////////////////////////////////////////////////////////////////////////////////
//
// CACHED DATA AGE STAMP
//
// For string with localized tokens composed ( ageStampMessage , ageStampMessageForecastedData )
// %1 => represents a numeric value
// %2 => represents the unit (one of min, hrs, day, days)
// eg: ageStampMessage can be '3 hrs ago' or '2 days ago' for en-US
////////////////////////////////////////////////////////////////////////////////
L_localizedStrings_Text['min'] = 'min';
L_localizedStrings_Text['hr'] = 'hr';
L_localizedStrings_Text['hrs'] = 'hrs';
L_localizedStrings_Text['day'] = 'day';
L_localizedStrings_Text['days'] = 'days';
L_localizedStrings_Text['ageStampMessage'] = '%1 %2 ago';
L_localizedStrings_Text['ageStampMessageForecastedData'] = 'Forecasted %1 %2 ago';
L_localizedStrings_Text['DataExpired'] = 'Data expired';
L_localizedStrings_Text['Forecasted'] = 'Forecasted';

////////////////////////////////////////////////////////////////////////////////
//
// ACTIVEX WRAPPER ERROR MESSAGES
//
////////////////////////////////////////////////////////////////////////////////
L_localizedStrings_Text['ConnectToInternetToGetData'] = 'Connect to the internet for fresh data';
L_localizedStrings_Text['ServiceNotAvailable'] = 'Cannot connect to service';
L_localizedStrings_Text['ServiceNotAvailableInYourArea'] = 'Service not available in your region.';
