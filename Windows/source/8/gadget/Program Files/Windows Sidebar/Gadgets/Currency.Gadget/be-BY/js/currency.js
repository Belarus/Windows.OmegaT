////////////////////////////////////////////////////////////////////////////////
//
// THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.
// Copyright (c) 2009 Microsoft Corporation. All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
var g_oService;
var g_oCurr = new Array(4);
var g_oTimer = null;
var g_StartValue = 1;
var g_sRowCount = 1;
var g_sRowHeight = 54;
var g_sBodyHeight;
var g_sMenuHeight;
var g_sFullName = true;
var g_dataFromService;
var g_isStaleData = false;
var g_ageStampText = "";
var spinner;
	
////////////////////////////////////////////////////////////////////////////////
//
// Load gadget's main function
//
////////////////////////////////////////////////////////////////////////////////
function loadMain()
{
	// Set initial values needed for dynamic re-sizing of menu and rows
	g_sBodyHeight = parseInt(document.body.currentStyle.height);
	

	// Check if gadget is new or reloaded with sidebar
	if (readSetting('rowCount'))
	{
		g_sRowCount = readSetting('rowCount');
	}
	else
	{
		saveSetting('rowCount', g_sRowCount);
	}
	spinner = new getSpinner('messageSpinner');
	localizeUI();

	SetUIState('loading');
	
	g_oService = new CurrencyService()
	g_oService.OnDataReady = DataReady;
	
	// If we are actually running in the gadget platform
	// wire up all the events.
	if (gGadgetMode)
	{		
		System.Gadget.onDock = DockGadget;
		System.Gadget.onUndock = UndockGadget;
		
		if (System.Gadget.docked)
		{
			DockGadget();
		}
		else
		{
			UndockGadget();
		}
	}
	else
	{
		UndockGadget();
	}
	
	// Attaching events to the toolbar buttons
	addButton.attachEvent("onmouseover", function(){addButton.style.backgroundImage = 'url(../images/add_over.png)';});
	addButton.attachEvent("onclick", function(){addButton.style.backgroundImage = 'url(../images/add_down.png)'; addRow();});
	addButton.attachEvent("onmouseout", function(){addButton.style.backgroundImage = 'url(../images/add_up.png)';});
	addButton.attachEvent("onfocus", function(){addButton.style.backgroundImage = 'url(../images/add_down.png)';});
	addButton.attachEvent("onblur", function(){addButton.style.backgroundImage = 'url(../images/add_up.png)';});
	addButton.title = L_localizedStrings_Text['Add']
	
	g_StartValue = g_StartValue.toLocaleString();	
	g_oCurr[0].oTextBox.value = g_StartValue; 
	g_oService.GetCurrencies(); 
	
	if (System.Gadget.docked)
	{
		document.getElementById('curr0input').style.display = 'block';
		document.getElementById('curr1input').style.display = 'block';
	}
	
	
}
////////////////////////////////////////////////////////////////////////////////
//
// Localize all data
//
////////////////////////////////////////////////////////////////////////////////
function localizeUI()
{
	for (var i = 0; i < g_oCurr.length; i++)
	{
		g_oCurr[i] = new CurrencyBox('curr' + i, getLocalizedString('GettingExchangeRate'), '0');
		// reverse reference in array
		g_oCurr[i].oTextBox.setAttribute('arrayIdx', i);
		g_oCurr[i].oTextBox.onkeyup = OnAmountChange;
	}
	
	var oDataLink = document.getElementById('dataLink');
	oDataLink.innerHTML = getLocalizedString('DataProviders');
	oDataLink.href = getLocalizedString('MSNMoneyURL');
}
////////////////////////////////////////////////////////////////////////////////
//
// Creates a currency row for each id in g_oCurr array
//
////////////////////////////////////////////////////////////////////////////////
function CurrencyBox(oControl, sCaption, sValue)
{
	// Self reference
	var me = this;
	
	// Private data members
	var m_oCaption = '';
	var m_sCaption = sCaption;
	var m_oControl = oControl;
	var oDeleteButton;
	var oCurrOnline;
	var oValueDiv;
	var oTextBoxBack;
	var sCurrCount = oControl.replace('curr', '');
	var tableCurr;
	var oTableCaption;
	var oTD = new Array();
	var oTDCaption = new Array();
	var oCaptionA;
	var oCurrencyImage;
	
	// Public Properties
	this.oTextBox = null;
	this.oTag = null;
	
	// Get currency div
	m_oControl = document.getElementById(oControl);
	
	// Private methods
	function Initialize()
	{
		// Create table		
		tableCurr = document.createElement('<table cellpadding="0" cellspacing="0" border="0"></table>');
		var tbCurr = document.createElement('tbody');
		var trCurr = document.createElement('tr');
		tableCurr.appendChild(tbCurr);
		tbCurr.appendChild(trCurr);
		for (j=0;j<3;j++)
		{
			oTD[j] = document.createElement('td'); 
			oTD[j].setAttribute("id", m_oControl.id + "TD" + j);
			trCurr.appendChild(oTD[j]);			
		} 
		
		// Create table for Caption and left-right borders	
		oTableCaption = document.createElement('<table cellpadding="0" cellspacing="0" border="0"></table>');
		var oTBCaption = document.createElement('tbody');
		var oTRCaption = document.createElement('tr');
		oTableCaption.appendChild(oTBCaption);
		oTBCaption.appendChild(oTRCaption);
		for (j=0;j<3;j++)
		{
			oTDCaption[j] = document.createElement('td'); 
			oTDCaption[j].setAttribute("id", m_oControl.id + "TDCaption" + j);
			oTRCaption.appendChild(oTDCaption[j]);			
		}			
		
		// Create container for text/textbox
		oValueDiv = document.createElement('div');
		oValueDiv.id = m_oControl.id + 'value';
		
		// Create currency text
		var oLabel = document.createElement('label');
		oLabel.id = m_oControl.id + 'label';
		m_oCaption = document.createElement('div');
		m_oCaption.id = m_oControl.id + 'caption';
		
		if(document.dir == 'rtl')
		{
			m_oCaption.onmouseover = function() {oTDCaption[0].style.backgroundImage = 'url(../images/combo-hover-right.png)';
			oTDCaption[1].style.backgroundImage = 'url(../images/combo-hover-middle.png)';
			oTDCaption[2].style.backgroundImage = 'url(../images/combo-hover-left.png)';};
		}
		else
		{
			m_oCaption.onmouseover = function() {oTDCaption[0].style.backgroundImage = 'url(../images/combo-hover-left.png)';
			oTDCaption[1].style.backgroundImage = 'url(../images/combo-hover-middle.png)';
			oTDCaption[2].style.backgroundImage = 'url(../images/combo-hover-right.png)';};
		}
			
		m_oCaption.onmouseout = function() {oTDCaption[0].style.backgroundImage = '';
											oTDCaption[1].style.backgroundImage = '';
											oTDCaption[2].style.backgroundImage = '';};
		
		oLabel.appendChild(m_oCaption);
		
		//Create Caption A HREF and triangle image
		oCaptionA = document.createElement('a');
		oCaptionA.id = 'captionA';
		oCaptionA.href = "javascript:void;";
		if ( g_isStaleData )
		{
			oCaptionA.title = getLocalizedString('ServiceNotAvailable');
		}
		else
		{
			oCaptionA.title = m_sCaption;
		}
		oCaptionA.innerHTML = m_sCaption;		
		oCurrencyImage = document.createElement('img');
		oCurrencyImage.id = "currencyImage";
                oCurrencyImage.src = 'images/triangle.png';
		oCurrencyImage.border = '0';
		
		oCaptionA.onclick = function() {showCurrencyList(oControl);};
		oCaptionA.appendChild(oCurrencyImage);
		m_oCaption.appendChild(oCaptionA);
		
		
		
		
		
		
		
		
		// Create button for online currency
		oCurrOnline = document.createElement('div');
		oCurrOnline.id = m_oControl.id + 'OnlineButton';
		oCurrOnlineA = document.createElement('a');
		oCurrOnlineA.id = m_oControl.id + 'OnlineButtonA';
		oCurrOnlineA.target = '_blank';

		if ( g_isStaleData )
		{
			oCurrOnlineA.title = getLocalizedString('ServiceNotAvailable');
		}
		else
		{
			oCurrOnlineA.title = L_localizedStrings_Text['Graph'];
		}

		oCurrOnlineAImg = document.createElement('img');
		oCurrOnlineAImg.border = '0';
		oCurrOnlineAImg.src = '../images/graph_up.png';
		oCurrOnlineAImg.onmousedown = function() {this.src = '../images/graph_down.png';};
		oCurrOnlineAImg.onmouseover = function() {this.src = '../images/graph_over.png';};
		oCurrOnlineAImg.onmouseout = function() {this.src = '../images/graph_up.png';}; 
		
		oCurrOnlineA.appendChild(oCurrOnlineAImg);
		oCurrOnline.appendChild(oCurrOnlineA);
		
		// Create delete button
		oDeleteButtonA = document.createElement('a');
		oDeleteButtonA.setAttribute("href","javascript:void;");
		oDeleteButtonA.setAttribute("title",L_localizedStrings_Text['Remove']);
		oDeleteButtonA.style.backgroundImage = 'url(../images/delete_up.png)';
		oDeleteButton = document.createElement('div');
		oDeleteButton.id = m_oControl.id + 'DeleteButton';			
		oDeleteButton.style.backgroundImage = 'url(../images/delete_up.png)';
		oDeleteButtonA.onclick = function() {oDeleteButton.style.backgroundImage = 'url(../images/delete_down.png)'; deleteRow(oControl);};
		oDeleteButton.onmouseover = function() {this.style.backgroundImage = 'url(../images/delete_over.png)';};
		oDeleteButton.onmouseout = function() {this.style.backgroundImage = 'url(../images/delete_up.png)';}; 
		oDeleteButtonA.onfocus = function() {if(m_oControl.id.replace('curr', '') !='0' && g_sRowCount > 1){oDeleteButton.style.backgroundImage = 'url(../images/delete_over.png)';oDeleteButton.style.display = 'block';} };
		oDeleteButtonA.onblur = function() {oDeleteButton.style.backgroundImage = 'url(../images/delete_up.png)'; oDeleteButton.style.display = 'none'; };
		oDeleteButtonA.appendChild(oDeleteButton);
		
		// Create the textbox
		me.oTextBox = document.createElement('input');
		me.oTextBox.id = oLabel.htmlFor = m_oControl.id + 'input';
		me.oTextBox.type = 'text';
		me.oTextBox.maxLength = 20;
		me.oTextBox.value = sValue;
			
		// Create the textbox background
		oTextBoxBack = document.createElement('div');
		oTextBoxBack.id = m_oControl.id + 'InputBack';		
		
		oValueDiv.appendChild(tableCurr);
		oValueDiv.appendChild(me.oTextBox);
		oValueDiv.appendChild(oTextBoxBack);
		
		// Add everything in and make it accessible
		m_oControl.appendChild(oValueDiv);
		
		tableCurr.style.height = '21px';
		oTableCaption.style.height = '21px';
		tableCurr.style.position = 'absolute';
		
		oTD[0].style.width = '16px';
		oTDCaption[0].style.width = '3px';
		oTDCaption[2].style.width = '3px';
		oTD[2].style.width = '16px';		
		oTD[0].appendChild(oCurrOnline);
		oTD[1].appendChild(oTableCaption);
		oTDCaption[1].appendChild(oLabel);
		oTD[2].appendChild(oDeleteButtonA);		
		
		me.setCaption(m_sCaption);
	}
	
	this.setCaption = function(sCaption)
	{
		if ( g_isStaleData )
		{
			oCaptionA.title = getLocalizedString('ServiceNotAvailable');
		}
		else
		{
			oCaptionA.title = sCaption;
		}

		oCaptionA.innerHTML = sCaption + oCurrencyImage.outerHTML;
		
		
	}

	// Set styles depending on docked or undocked
	this.changeMode = function(sMode)
	{
		if (sMode == 'docked')
		{
			oTD[0].style.display = 'none';
			oTD[2].style.display = 'none';
			tableCurr.style.width = '43px';			
			tableCurr.style.left = '9px';
			tableCurr.style.right = '9px';
			tableCurr.style.top = '9px';	
			
			var sCurr = readSetting(oControl) || L_localizedStrings_Text['default'+sCurrCount];
			this.setCaption(sCurr);
			curr1.style.top = '27px';
			tableCurr.className = 'tableFont';
			oTableCaption.className = 'tableCaption';
			m_oControl.className = 'dockedCurrencyContainer';
			m_oCaption.className = 'dockedCurrencyTitle';
			if(document.dir == 'rtl')
			{
				me.oTextBox.className = 'dockedCurrencyValueRtl';
				oTextBoxBack.className = 'dockedCurrencyValueBackRtl';
			}
			else
			{
				me.oTextBox.className = 'dockedCurrencyValue';
				oTextBoxBack.className = 'dockedCurrencyValueBack';
			}
			oValueDiv.className = 'dockedCurrencyDiv';
			oCurrOnline.className = 'dockedCurrencyOnlineButton';
			oDeleteButton.className = 'dockedCurrencyDeleteButton';
			currencyList.className = 'dockedCurrencyList';
			document.getElementById('currencySelect').className = 'dockedCurrencySelect';
			document.getElementById('currencySelect').size = 4;
			document.getElementById('bottomTable').style.display = 'none';
			m_oControl.onmouseover = '';
			m_oControl.onmouseout = '';
			oValueDiv.onmouseover = '';
			oValueDiv.onmouseout = '';
			g_sFullName = false;
		}
		// undocked
		else
		{
			oTD[0].style.display = 'block';
			oTD[2].style.display = 'block';
			tableCurr.style.width = '212px';
			tableCurr.style.left = '3px';
			tableCurr.style.right = '3px';
			tableCurr.style.top = '';
			
			var sCurr = readSetting(oControl) || L_localizedStrings_Text['default'+sCurrCount];
			this.setCaption(getLocalizedString(sCurr));
			curr1.style.top = g_sRowHeight;
			oDeleteButton.style.display = 'none';
			tableCurr.className = 'tableFont';
			oTableCaption.className = 'tableCaption';
			m_oControl.className = 'currencyContainer';
			m_oCaption.className = 'currencyTitle';
			me.oTextBox.className = 'currencyValue';
			me.oTextBox.style.display = '';
			oTextBoxBack.className = 'currencyValueBack';
			oValueDiv.className = 'currencyDiv';
			oCurrOnline.className = 'currencyOnlineButton';
			oDeleteButton.className = 'currencyDeleteButton';
			currencyList.className = 'undockedCurrencyList';
			document.getElementById('currencySelect').className = 'undockedCurrencySelect';
			document.getElementById('currencySelect').size = 4 + (g_sRowCount * 4);
			m_oControl.onmouseover = function() {showDelete(oControl)};
			m_oControl.onmouseout = function() {hideDelete(oControl)};
			oValueDiv.onmouseover = function() {this.style.background = 'url(../images/row_over.png) no-repeat';};
			oValueDiv.onmouseout = function() {this.style.background = '';};
			g_sFullName = true; 
		}
	}	

	// Constructor
	Initialize();
}

function setBackground(path)
{
	// if you switch backgrounds on the fly, you must set the style size to zero
	// so it dynamically refreshes
	currencybackground.style.width = 0;
	currencybackground.style.height = 0;
	currencybackground.src = path;
}

////////////////////////////////////////////////////////////////////////////////
//
// Add currency row
//
////////////////////////////////////////////////////////////////////////////////
function addRow()
{
	if (g_sRowCount < 3)
	{
		g_sRowCount++;
		document.getElementById('curr'+g_sRowCount).style.display = 'block';
		document.body.style.height = parseInt(document.body.style.height) + g_sRowHeight; 
		setBackground("url(images/base-undocked-"+(g_sRowCount+1)+".png)");
		saveSetting('rowCount', g_sRowCount);
		document.getElementById('currencySelect').size += 4;
		if ( g_oService.IsAvailable )
		{
			loadSettings();
		}
	}	
	
	// "Deactivate" add link if max rows reached
	if (g_sRowCount >= (g_oCurr.length - 1))
	{
		addButton.style.display = 'none';
	}
}
////////////////////////////////////////////////////////////////////////////////
//
// Remove currency row
//
////////////////////////////////////////////////////////////////////////////////
function deleteRow(sControlId)
{
	var sOptionCount = sControlId.replace('curr', '');
	// Must not delete if only 2 rows
	if(sOptionCount ==0 || g_sRowCount < 2)
	{
		return false;
	}
	
	sOptionCount *= 1;

	document.getElementById('curr'+g_sRowCount).style.display = 'none';
	document.getElementById(sControlId+'DeleteButton').style.display = 'none';
	document.body.style.height = parseInt(document.body.style.height) - g_sRowHeight;
	
	currencybackground.style.width = 0;
	currencybackground.style.height = 0;
	currencybackground.src = "url(images/base-undocked-"+(g_sRowCount)+".png)";
		
	for (i = sOptionCount; i < g_sRowCount; i++)
	{
		saveSetting('curr'+i, readSetting('curr'+(i+1)));
		saveSetting('curr'+(i+1), L_localizedStrings_Text['default'+(i+1)]);
	}
		
	g_sRowCount--;
	
	// "Activate" add link if it was greyed out
	if (g_sRowCount <= (g_oCurr.length - 2))
	{
		addButton.style.display = 'block';
	}
	saveSetting('rowCount', g_sRowCount);
	document.getElementById('currencySelect').size -= 4;
	if ( g_oService.IsAvailable )
	{
		loadSettings();
	}
}
////////////////////////////////////////////////////////////////////////////////
//
// Show row deletion button
//
////////////////////////////////////////////////////////////////////////////////
function showDelete(sControlId)
{
	if (sControlId != 'curr0' && g_sRowCount > 1)
	{
		document.getElementById(sControlId + 'DeleteButton').style.display = 'block';
	}
}
////////////////////////////////////////////////////////////////////////////////
//
// Hide row deletion button
//
////////////////////////////////////////////////////////////////////////////////
function hideDelete(sControlId)
{
	document.getElementById(sControlId + 'DeleteButton').style.display = 'none';
}

////////////////////////////////////////////////////////////////////////////////
//
// Show Currency List
//
////////////////////////////////////////////////////////////////////////////////
function showCurrencyList(sControlId)
{
 
	var currencyList = new Array();
	var oSelect = document.getElementById('CurrencySelect');
	
	// Clear list
	oSelect.innerHTML = "";
	
	oSelect.onkeypress = function() {if(event.keyCode == 13){optionsDown(CurrencySelect.options[CurrencySelect.selectedIndex].id);}};
	
	// Set up function for creating currencyList object
	function createCurrency(currSymbol, currText, currTextForSorting)
	{
		this.currSymbol = currSymbol;
		this.currText = currText;
		this.currTextForSorting = currTextForSorting;
	}
	
	// Set up sort function
	function currencySort(x, y)
	{
		var xTemp = x.currText;
		var yTemp = y.currText;
			
		if (xTemp > yTemp)
		{
			return 1;
		}
		else if (xTemp < yTemp)
		{
			return -1;
		}
		else
		{
			return 0;
		}
	}
	
	// Iterate through symbol list returned from currency service and create currencyList
	for (x in g_oService.hsCurrencies)
	{
		var currency = g_oService.hsCurrencies[x];
		currencyList.push(new createCurrency(currency.Symbol, getLocalizedString(currency.Symbol), currency.NameForSorting));
	}
	
	// Sort currency list
	currencyList.sort(currencySort);
	
	// Iterate through sorted list and create options
	for (var i = 0; i < currencyList.length; i++)
	{
		var oEachOption = document.createElement('option');
		oEachOption.id = sControlId + "-" + currencyList[i].currSymbol;
		oEachOption.innerText = currencyList[i].currText;
		oSelect.appendChild(oEachOption);		
	}
	
	//Selecting the current currency
	document.getElementById(sControlId + '-' + g_oCurr[sControlId.replace('curr', '')].oTag.Symbol).selected = true;
	
	// Display the Currency List
	var d = document.getElementById('currencyList');
	d.style.display = 'block';
	CurrencySelect.focus();
}
////////////////////////////////////////////////////////////////////////////////
//
// Close menu when option is selected
//
////////////////////////////////////////////////////////////////////////////////
function optionsDown(sOptionID)
{
	saveOptions(sOptionID);
	if ( g_oService.IsAvailable )
	{
		loadSettings();
	}
	currencyList.style.display = 'none';
}
////////////////////////////////////////////////////////////////////////////////
//
// Save newly selected option
//
////////////////////////////////////////////////////////////////////////////////
function saveOptions(sOptionID)
{
	var oOptionID = sOptionID.split('-');
	saveSetting(oOptionID[0], oOptionID[1]);	
	g_oCurr[oOptionID[0].replace('curr', '')].oTextBox.focus();
}
////////////////////////////////////////////////////////////////////////////////
//
// Data for gadget in docked state
//
////////////////////////////////////////////////////////////////////////////////
function DockGadget()
{
	var oBody = document.body.style;
	oBody.width = '130px';
	oBody.height = '83px';
	
	currencybackground.style.width = 0;
	currencybackground.style.height = 0;
	currencybackground.src = "url(images/base-docked.png)";
		
	for (var i = g_sRowCount; i > 1; i--)
	{
		document.getElementById('curr'+i).style.display = 'none';
	}
	
	for (var i=0; i < g_oCurr.length; i++)
	{
		g_oCurr[i].changeMode('docked');
	}
	
	container.className = 'dockedUIBoundary';
	message.className = 'dockedMessage';
	
	if(document.dir == 'rtl')
	{
		ageStampText.className = 'ageStampTextDockedModeRtl';
		ageStampTextTd.className = 'ageStampTextUndockedModeRtl'
	}
	else
	{
		ageStampText.className = 'ageStampTextDockedMode';
		ageStampTextTd.className = 'ageStampTextUndockedMode'
	}
	document.getElementById('ageStampText').innerText = g_ageStampText;
	document.getElementById('ageStampText').style.visibility = "hidden";
	document.getElementById('ageStampTextTd').innerText = g_ageStampText;
	document.getElementById('ageStampTextTd').style.visibility = "hidden";
	
	if (g_oService.IsAvailable)
	{
		if(g_isStaleData)
		{
			document.getElementById('ageStampText').style.visibility = "visible";
		}
		updateValues(g_oCurr[0].oTextBox, false);
	}
	bottomTable.style.display = 'none';
	addButton.style.display = 'none';
}
////////////////////////////////////////////////////////////////////////////////
//
// Data for gadget in undocked state
//
////////////////////////////////////////////////////////////////////////////////
function UndockGadget()
{
	var oBody = document.body.style;
	oBody.width = '254px';
	oBody.height = (g_sBodyHeight - g_sRowHeight) + (g_sRowCount * g_sRowHeight);
	
	currencybackground.style.width = 0;
	currencybackground.style.height = 0;
	currencybackground.src = "url(images/base-undocked-"+(g_sRowCount+1)+".png)";
	
	for (var i = g_sRowCount; i > 1; i--)
	{
		document.getElementById('curr'+i).style.display = 'block';
	}
	
	for (var i=0; i < g_oCurr.length; i++)
	{
		g_oCurr[i].changeMode('undocked');
	}
	
	container.className = 'UIBoundary';
	dataLink.className = 'dataProviderLink';
	message.className = 'message';
	
	if(document.dir == 'rtl')
	{
		ageStampText.className = 'ageStampTextDockedModeRtl';
		ageStampTextTd.className = 'ageStampTextUndockedModeRtl'
	}
	else
	{
		ageStampText.className = 'ageStampTextDockedMode';
		ageStampTextTd.className = 'ageStampTextUndockedMode'
	}
	document.getElementById('ageStampText').innerText = g_ageStampText;
	document.getElementById('ageStampText').style.visibility = "hidden";
	document.getElementById('ageStampTextTd').innerText = g_ageStampText;
	document.getElementById('ageStampTextTd').style.visibility = "hidden";
	
	if (g_oService.IsAvailable)
	{
		if(g_isStaleData)
		{
			document.getElementById('ageStampTextTd').style.visibility = "visible";
		}
		updateValues(g_oCurr[0].oTextBox, false);
		bottomTable.style.display = 'block';
		if(g_sRowCount<3)
		{
			addButton.style.display = 'block';
		}
		
	}
	
	
}

////////////////////////////////////////////////////////////////////////////////
//
// Fire update function on keyup
//
////////////////////////////////////////////////////////////////////////////////
function OnAmountChange()
{
	var sourceTextBox = event.srcElement;

	updateValues(sourceTextBox, true);
}
////////////////////////////////////////////////////////////////////////////////
//
// Update currency field values
//
////////////////////////////////////////////////////////////////////////////////
function updateValues(sourceTextBox,bSkipCurrent)
{	
	if (g_oService.IsAvailable)
	{
		// Get the currency object that goes with this text box
		var sourceCurrency = g_oCurr[sourceTextBox.getAttribute('arrayIdx')];
		
		var oCurrency;
		
		for (var i=0; i < g_oCurr.length; i++)
		{
			oCurrency = g_oCurr[i];
			
			// skip the box where the text changed.
			if(bSkipCurrent)
			{
				if (sourceTextBox != oCurrency.oTextBox)
				{
					try
					{
						oCurrency.oTextBox.value = g_oService.Convert(sourceTextBox.value, sourceCurrency.oTag.Symbol, oCurrency.oTag.Symbol);
					}
					catch(objError)
					{
						oCurrency.oTextBox.value = getLocalizedString('Error');
					}
				}
			}
			else
			{
				try
				{
					oCurrency.oTextBox.value = g_oService.Convert(sourceTextBox.value, sourceCurrency.oTag.Symbol, oCurrency.oTag.Symbol);
				}
				catch(objError)
				{
					oCurrency.oTextBox.value = getLocalizedString('Error');
				}
			}
			
		}
	}
}
////////////////////////////////////////////////////////////////////////////////
//
// Set UI state
//
////////////////////////////////////////////////////////////////////////////////
function SetUIState(sState)
{
	function ShowMessage(sMessage)
	{
		showOrHide('container', false);
		showOrHide('message', true);		
		
	}
	document.getElementById('bottomTable').style.display = 'none';
	
	document.getElementById('ageStampText').innerText = g_ageStampText;
	document.getElementById('ageStampText').style.visibility = "hidden";
	document.getElementById('ageStampTextTd').innerText = g_ageStampText;
	document.getElementById('ageStampTextTd').style.visibility = "hidden";
	
	spinner.stop();
	switch(sState)
	{
		
		case 'loading':
			
			spinner.show();
			spinner.start();
			document.getElementById('messageSpinner').style.display = 'inline';
			document.getElementById('messageIcon').style.display = 'none';
			ShowMessage(getLocalizedString('WaitText'));
			document.getElementById('messageText').innerHTML = getLocalizedString('WaitText');
			break;
			
		case 'error':
			
			document.getElementById('messageIcon').style.display = 'inline';
			document.getElementById('messageSpinner').style.display = 'none';
			ShowMessage(getLocalizedString('ServiceNotAvailable'));
			if(document.dir == 'rtl')
			{
				document.getElementById('messageText').innerHTML = getLocalizedString('ServiceNotAvailable');
				document.getElementById('messageText').style.textAlign = 'right';
			}
			else
			{
				document.getElementById('messageText').innerHTML = getLocalizedString('ServiceNotAvailable');
				document.getElementById('messageText').style.textAlign = 'left';
			}
			break;
			
		case 'ready':
			showOrHide('container', true);
			showOrHide('message', false);
			if (!System.Gadget.docked)
			{
				document.getElementById('bottomTable').style.display = 'block';
			}			
			break;
			
		case 'cached':
			showOrHide('container', true);
			showOrHide('message', false);
			if (!System.Gadget.docked)
			{
				document.getElementById('bottomTable').style.display = 'block';
				document.getElementById('ageStampTextTd').style.visibility = "visible";
			}			
			else
			{
				document.getElementById('ageStampText').style.visibility = "visible";
			}
			break;
	}
}
////////////////////////////////////////////////////////////////////////////////
//
// Check for availability of data
//
////////////////////////////////////////////////////////////////////////////////
function DataReady(data)
{
	var milliSecondsToNextQuery;
	
	g_dataFromService = data;
	g_isStaleData = false;
	g_ageStampText = "";
	
	if (g_oTimer != null)
		clearTimeout(g_oTimer);

	if ((data != null) && g_oService.IsAvailable && (data.Count > 0) && ((data.RetCode == 200) || (data.RetCode == 1507)))
	{
		if (data.RetCode == 200)
		{
			var serviceRefreshInterval;
			
			gTimeStampLastRefreshAvailable = true;
			gTimeStampLastRefresh = data.Timestamp;

			SetUIState('ready');
			loadSettings();
			
			serviceRefreshInterval = g_oService.RefreshInterval();
			if (serviceRefreshInterval != -1)
			{
				// Update the UI after refresh interval
				milliSecondsToNextQuery = 1000 * 60 * serviceRefreshInterval;
			}
			else
			{
				// Update the UI in 1 minute
				milliSecondsToNextQuery = 1000 * 60;
			}
		}
		else
		{
			g_isStaleData = true;
			g_ageStampText = calculateAgeStampText(calculateAge(data.Timestamp));
			SetUIState('cached');
			loadSettings();
			// Update the UI in 1 minute
			milliSecondsToNextQuery = 1000 * 60;
		}
	}
	else
	{
		SetUIState('error');
		// Try again in 1 minute
		milliSecondsToNextQuery = 1000 * 60;
	}
	
	g_oTimer = setTimeout('g_oService.GetCurrencies()', milliSecondsToNextQuery);
}
////////////////////////////////////////////////////////////////////////////////
//
// Load currency symbols for each currency row
//
////////////////////////////////////////////////////////////////////////////////
function loadSettings()
{
	
	for (i = 0; i < g_oCurr.length; i++)
	{
		var sCurr = readSetting('curr'+i) || L_localizedStrings_Text['default'+i];
		saveSetting('curr'+i, sCurr);
		
		g_oCurr[i].oTag = g_oService.hsCurrencies[sCurr];
		
		//Get first available if list of currency is not complete
		if(g_oCurr[i].oTag == undefined)
		{
			sCurr = g_dataFromService.Item(0).Symbol;
			g_oCurr[i].oTag = g_oService.hsCurrencies[sCurr];			
		}			
		
		if (g_sFullName){
			g_oCurr[i].setCaption(g_oService.hsCurrencies[sCurr].Name);
		} else {
			g_oCurr[i].setCaption(g_oCurr[i].oTag.Symbol);
		}
		
		var sURLLocale = '';
		if (g_oCurr[i].oTag.Symbol != 'USD')
		{
			sURLLocale = g_oCurr[i].oTag.Symbol;
		}
		document.getElementById('curr'+i+'OnlineButtonA').href = getLocalizedString('CurrencyLink')+sURLLocale+'USD';
		
	}
	
	updateValues(g_oCurr[0].oTextBox, false);
}
////////////////////////////////////////////////////////////////////////////////
//
// Handle ESCAPE and ENTER keydown
//
////////////////////////////////////////////////////////////////////////////////
function OnKeyDownHandler()
{
	if(event.keyCode == 27)//ESCAPE key
	{
		document.getElementById('currencyList').style.display = 'none';		
	}	
}

////////////////////////////////////////////////////////////////////////////////
//
// Spinner Animation
//
////////////////////////////////////////////////////////////////////////////////
function getSpinner( spinnerDivID ) 
{
 var self = this;
 this.id = spinnerDivID;
 this.parentDiv = document.getElementById( self.id );
 this.fps = 1000/30; 
 with (this.parentDiv.style) {
	fontSize=0;
	posWidth=16;
	posHeight=16;
	backgroundImage = 'url("images/activity16v.png")';
	backgroundPositionY = 0;
 }
 this.hide = function() { self.parentDiv.style.display='none'; }
 this.show = function() { self.parentDiv.style.display='block'; }
 this.stop = function() { clearInterval( self.animationInterval ); }
 this.start = function() {
	clearInterval( self.animationInterval );
	this.animationInterval = setInterval( 'animate(' + self.id + ')', 30 );
 }
} 

function animate(spinnerDiv) 
{
	spinnerDiv.style.backgroundPositionY=parseInt(spinnerDiv.style.backgroundPositionY)-16; 
}

////////////////////////////////////////////////////////////////////////////////
//
// Handle RightClick
//
////////////////////////////////////////////////////////////////////////////////
function OnRightClickHandler()
{
	if(event.srcElement.tagName != 'INPUT')
	{
		if(event.button > 1)
		{
		var selectedText = document.getElementById('curr0input').createTextRange();
		selectedText.moveStart('character', document.getElementById('curr0input').value.length);			
		selectedText.select();
		event.srcElement.focus();		
		}
	}
	return true;
}

function calculateAge ( timestamp )
{
 var timestampDay = new Date( timestamp );
 var currentDay = new Date();
 
 var millisecondsTillTimestamp = Date.parse( timestamp );
 var millisecondsTillNow = (new Date()).getTime();
 var minutesDifference = parseInt( ( millisecondsTillNow - millisecondsTillTimestamp ) / ( 60 * 1000 ) );
 var hoursDifference = parseInt ( minutesDifference / 60 );
 var daysDifference = parseInt ( hoursDifference / 24 );
 
 this.minutesAge = 0;
 this.hoursAge = 0;
 this.daysAge = 0;
 
 if ( minutesDifference <= 0 )
 {
	return this;
 }

 // shows hours and mins only for the same day
 if ( timestampDay.getDate() == currentDay.getDate()
	&& timestampDay.getMonth() == currentDay.getMonth()
	&& timestampDay.getFullYear() == currentDay.getFullYear() )
 {
	this.minutesAge = minutesDifference % 60;
	this.hoursAge = hoursDifference % 24;
	this.daysAge = daysDifference;
 }
 else // only calculate total no of days past
 {
	timestampDay.setHours(currentDay.getHours(),currentDay.getMinutes(),currentDay.getSeconds(),currentDay.getMilliseconds());
	this.daysAge = parseInt ( ( currentDay.getTime() - timestampDay.getTime() ) / ( 60 * 1000 * 60 * 24 ) );
	if ( this.daysAge < 0 )
	{
	this.daysAge = 0;
	}
 }
 
 return this;
}

function calculateAgeStampText( age )
{
 var ageStampText = "";
 var unitText = "";
 var durationText = "";
 
 if ( age.daysAge > 0 )
 {
	durationText = getLocalizedString('day');
	if ( age.daysAge > 1 )
	{
	durationText = getLocalizedString('days');
	}
	unitText = age.daysAge;
 }
 else if ( age.hoursAge > 0 )
 {
	durationText = getLocalizedString('hr');
	if ( age.hoursAge > 1 )
	{
	durationText = getLocalizedString('hrs');
	}
	unitText = age.hoursAge;
 }
 else
 {
	if ( age.minutesAge != 0 )
	{
	durationText = getLocalizedString('min');
	unitText = age.minutesAge;
	}
 }
 
 if((unitText != "") && (durationText != ""))
 {
	ageStampText = getLocalizedString('ageStampMessage')
	ageStampText = ageStampText.replace("%1", unitText);
	ageStampText = ageStampText.replace("%2", durationText);
 }
 
 return ageStampText;
}
