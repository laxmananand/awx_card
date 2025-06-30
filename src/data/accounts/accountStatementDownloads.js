import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from "react-redux";




export const getTransactionHistory = async (formData, custHashId) => {

  var buttonText = document.getElementById("button-text");
  var buttonLoader = document.getElementById("button-loader");

  buttonText.style.display = "none";
  buttonLoader.style.display = "flex";
  document.getElementById('accStatDwButton').disabled = true;

  var filetype = formData.fileFormat;
  const fileFormat = filetype || "PDF";
  var fromDate = formData.startDate;
  var fromDateParseValue = Date.parse(fromDate);

  var fromDateObj = new Date(fromDateParseValue);

  var startDD = String(fromDateObj.getDate()).padStart(2, '0');
  var startMM = String(fromDateObj.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based
  var startYYYY = fromDateObj.getFullYear();

  var startDateFormat = startYYYY + '-' + startMM + '-' + startDD;

  console.log(`Start Date: ${startDateFormat}`);
  sessionStorage.setItem('startDateStatement', startDateFormat);

  var toDate = formData.endDate;
  var toDateParseValue = Date.parse(toDate);

  var toDateObj = new Date(toDateParseValue);

  var endDD = String(toDateObj.getDate()).padStart(2, '0');
  var endMM = String(toDateObj.getMonth() + 1).padStart(2, '0');
  var endYYYY = toDateObj.getFullYear();

  var endDateFormat = endYYYY + '-' + endMM + '-' + endDD;

  console.log(`End Date: ${endDateFormat}`);
  sessionStorage.setItem('endDateStatement', endDateFormat);

  var header = "Transaction Type," + "Transaction Currency," + "Transaction Amount," + "Previous Balanace," + "Date Of Transaction,";

  var expFormat=formData.exportFormat;

  if (custHashId == "" || custHashId == null) {
    toast.error("Please Activate Your Account First!");
    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";
    document.getElementById('accStatDwButton').disabled = false;
  } 

  else if((formData.startDate=="")||(formData.endDate=="")){
    toast.error("Please select a valid date range!");
    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";
    document.getElementById('accStatDwButton').disabled = false;
  }
  else if((expFormat=="Xero")||(expFormat=="QuickBooks")||(expFormat=="Osome")||(expFormat=="NetSuite")||(expFormat=="BusinessOne")){
    toast.info("This export format will be coming soon! Please select Default format for now.")
    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";
    document.getElementById('accStatDwButton').disabled = false;
  }
else{
  try{
      const response = await Axios.get(sessionStorage.getItem("baseUrl")+"/AccountsRoutes/transactionHistory", {
        params : {
          page: "",
          size: 100,
          startDate: startDateFormat,
          endDate: endDateFormat,
          transactionType: formData.txnType,
          custHashId:custHashId
        },
      });
  
      let obj = response.data;

      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";

      console.log(obj);

        if (obj.content.length==0) {
          toast.error("No transactions found for the selected date range!");
          document.getElementById('accStatDwButton').disabled = false;
         
        }
       else if (obj.status=="BAD_REQUEST") {
        toast.error(obj.message);
        document.getElementById('accStatDwButton').disabled = false;
        }  
        else {
          console.log(obj);
          toast.success("Account Statement Downloaded Successfully!");
          document.getElementById('accStatDwButton').disabled = false;
          if(fileFormat=="CSV"){
          return JSONToCSVConvertorTransactions(obj, header, true);
          }
          else if(fileFormat=="PDF"){
           return JSONToPDFConvertorTransactions(obj, "STATEMENT SUMMARY", true);

          }
          else if(fileFormat=="XLSX"){
            return JSONToXLSXConvertorTransactions(obj, "STATEMENT SUMMARY", true);
 
           }

          }
}
catch (error) {
  // Handle any errors here
  console.error("Error:", error);
  toast.error("Something went wrong! Please try again later.");
  buttonText.style.display = "flex";
  buttonLoader.style.display = "none";
  document.getElementById('accStatDwButton').disabled = false;

  }
 } 
};

// ----------------------------------------CSV Report Download---------------------------------------

  function JSONToCSVConvertorTransactions(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {

        var row = "";


        //This loop will extract the label from 1st index of on array
        for (var index in arrData['content']) {

            var arr = arrData['content'][index];

            //Now convert each value to string and comma-seprated

            var transactionType = arr['transactionType'];
			      var txnType = transactionType.replace(/_/g, " ");
				
				
			 row += `${[txnType]},${arr['transactionCurrencyCode']},${arr['cardTransactionAmount']},${arr['previousBalance']},${arr['dateOfTransaction']}\n`;

				
			}
            //Now convert each value to string and comma-seprated
            
        
        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //Generate a file name


    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var fileName = 'Account Statement';
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --------------------------xxxxxxxxxxxx------------PDF Download Format start------------------xxxxxxxxxxx------------------

function JSONToPDFConvertorTransactions(JSONData, ReportTitle, ShowLabel) {
  // Extract data from the JSON
  const data = JSONData.content;

  // Create a PDF document
  const doc = new jsPDF();
  
   // Set Report title
      doc.setFontSize(20);
      doc.setTextColor("black"); // Set text color to blue (RGB values)
      doc.setFont('Helvetica', 'bold');// Set text style to bold
  // Calculate the width of the title
      const titleWidth1 = doc.getStringUnitWidth(ReportTitle) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  // Calculate the X-coordinate to center the title
      const centerX = (doc.internal.pageSize.width - titleWidth1) / 2;
  // Display the title at the top center of the page
      doc.text(ReportTitle, centerX, 20);

      const startDateStatement = sessionStorage.getItem("startDateStatement");
      const endDateStatement = sessionStorage.getItem("endDateStatement");

      const formatDate = (inputDate) => {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return new Date(inputDate).toLocaleDateString('en-GB', options);
      };

      const formattedStartDate = formatDate(startDateStatement);
      const formattedEndDate = formatDate(endDateStatement);
      

  // Statement Sub title 1
const subtitle1 = "Statement Period :";
doc.setFontSize(15); // Adjust the font size as needed
doc.setTextColor("#808080"); // Set text color to grey
doc.setFont("helvetica", "bold"); // Set font family to 'helvetica' and font style to 'normal'
const subtitle1Width = doc.getStringUnitWidth(subtitle1) * doc.internal.getFontSize() / doc.internal.scaleFactor;
const centerX1 = (doc.internal.pageSize.width - subtitle1Width) / 2;
doc.text(subtitle1, centerX1-35, 30);

// Statement Sub title 2
const subtitle2 = formattedStartDate + " to " + formattedEndDate;
doc.setFontSize(15); // Adjust the font size as needed
doc.setTextColor("black"); // Set text color to black
doc.setFont("Helvetica", "bold"); // Set font family to 'helvetica' and font style to 'bold'

// Display Subtitle 2 after Subtitle 1
doc.text(subtitle2, centerX1+13, 30);

// Set business title
const businessName = sessionStorage.getItem("businessName");
doc.setFontSize(15);
doc.setTextColor(0, 0, 255); // Set text color to blue (RGB values)
doc.setFont('Helvetica', 'bolditalic'); // Set text style to bold
const titleY = 45; // Adjust the Y-coordinate for the title
const businessNameHeight = doc.getTextDimensions(businessName).h;
doc.text(businessName, 15, titleY, {maxWidth: 100}); // Adjust the coordinates as needed

// Calculate the dynamic offset for subtitle based on titleY and businessNameHeight
const subtitleOffset = 5 + businessNameHeight;

// Set subtitle under the title
const businessAddress =  JSON.parse(sessionStorage.getItem("BusinessDetailsPost"));

if((businessAddress?.registrationAddress_2 !== null)||(businessAddress?.registrationAddress_2 !== "")){
const subtitle =  businessAddress?.registrationAddress_1+",";
const subtitleY = titleY + subtitleOffset; // Adjust the Y-coordinate for the subtitle, e.g., 10 units below the title
doc.setFontSize(10); // Adjust the font size as needed
doc.setFont('Helvetica', 'bold'); // Adjust the font style as needed
doc.setTextColor("#28282B"); // Set text color 
doc.text(subtitle, 15, subtitleY, {maxWidth: 100}); // Adjust the coordinates as needed

const subtitleB2 =  businessAddress?.registrationAddress_2+","+" "+businessAddress?.registrationCountry+",";
const subtitleYB2 = subtitleY + 5; // Adjust the Y-coordinate for the subtitle, e.g., 10 units below the title
doc.setFontSize(10); // Adjust the font size as needed
doc.setFont('Helvetica', 'bold'); // Adjust the font style as needed
doc.setTextColor("#28282B"); // Set text color 
doc.text(subtitleB2, 15, subtitleYB2, {maxWidth: 100}); // Adjust the coordinates as needed

const subtitleB3 =  businessAddress?.registrationPostCode;
const subtitleYB3 = subtitleYB2 + 5; // Adjust the Y-coordinate for the subtitle, e.g., 10 units below the title
doc.setFontSize(10); // Adjust the font size as needed
doc.setFont('Helvetica', 'bold'); // Adjust the font style as needed
doc.setTextColor("#28282B"); // Set text color 
doc.text(subtitleB3, 15, subtitleYB3, {maxWidth: 100}); // Adjust the coordinates as needed
}
else {
const subtitle =  businessAddress.registrationAddress_1+",";
const subtitleY = titleY + subtitleOffset;; // Adjust the Y-coordinate for the subtitle, e.g., 10 units below the title
doc.setFontSize(10); // Adjust the font size as needed
doc.setFont('Helvetica', 'bold'); // Adjust the font style as needed
doc.setTextColor("#28282B"); // Set text color 
doc.text(subtitle, 15, subtitleY, {maxWidth: 100}); // Adjust the coordinates as needed

const subtitleB2 = businessAddress?.registrationCountry+","+" "+businessAddress.registrationPostCode;
const subtitleYB2 = subtitleY + 5; // Adjust the Y-coordinate for the subtitle, e.g., 10 units below the title
doc.setFontSize(10); // Adjust the font size as needed
doc.setFont('Helvetica', 'bold'); // Adjust the font style as needed
doc.setTextColor("#28282B"); // Set text color 
doc.text(subtitleB2, 15, subtitleYB2, {maxWidth: 100}); // Adjust the coordinates as needed
}

// --------------------Set email info-----------------------------
const emailTag = "Email ID: ";
const email = sessionStorage.getItem("lastemail");

// Calculate the width of the email tag
const emailTagWidth = doc.getStringUnitWidth(emailTag) * 12 / doc.internal.scaleFactor; // Assuming font size 12

// Calculate the X-coordinate for the email tag to position it at the right side of the page
const emailTagX = doc.internal.pageSize.width - emailTagWidth - 69.5; // Adjust the offset as needed

// Set font size and style for the email tag
doc.setFontSize(10);
doc.setTextColor("#808080"); // Set text color to grey
doc.setFont('Helvetica', 'bold'); // Set text style to bold

// Display the email tag
doc.text(emailTag, emailTagX, titleY, { maxWidth: 100 }); // Adjust the Y-coordinate as needed

// Set font size and style for the email address
doc.setFontSize(10);
doc.setTextColor("#28282B"); // Set text color to blue (RGB values)
doc.setFont('Helvetica', 'bold'); // Set text style to bold italic

// Calculate the X-coordinate for the email address to position it next to the email tag
const emailX = emailTagX + emailTagWidth;

// Display the email address next to the email tag
doc.text(email, emailX, titleY, { maxWidth: 100 }); // Adjust the Y-coordinate as needed

//-------------------xxxxxxxxx-------------------------

// ----------------Set phone info------------------
const phoneTag = "Phone No: ";
const applicantDetails = JSON.parse(sessionStorage.getItem("applicantDetailsPost"));
const phone = applicantDetails.applicantContactNumber;

// Calculate the width of the phone tag
const phoneTagWidth = doc.getStringUnitWidth(phoneTag) * 12 / doc.internal.scaleFactor; // Assuming font size 12

// Calculate the X-coordinate for the phone tag to position it at the right side of the page
const phoneTagX = doc.internal.pageSize.width - phoneTagWidth - 69; // Adjust the offset as needed

// Set font size and style for the phone tag
doc.setFontSize(10);
doc.setTextColor("#808080"); // Set text color to grey
doc.setFont('Helvetica', 'bold'); // Set text style to bold

// Display the phone tag
doc.text(phoneTag, phoneTagX, titleY+5, { maxWidth: 100 }); // Adjust the Y-coordinate as needed

// Set font size and style for the phone no
doc.setFontSize(10);
doc.setTextColor("#28282B"); // Set text color to blue (RGB values)
doc.setFont('Helvetica', 'bold'); // Set text style to bold italic

// Calculate the X-coordinate for the phone no to position it next to the phone tag
const phoneX = phoneTagX + phoneTagWidth;

// Display the phone no next to the phone tag
doc.text(phone, phoneX, titleY+5, { maxWidth: 100 }); // Adjust the Y-coordinate as needed

//---------------------------xxxxxxxxx--------------------

// ---------Set Wallet hash id-----------------
//const walletTag = "Wallet Hash ID: ";
//const walletId = sessionStorage.getItem("walletHashId");

// Calculate the width of the wallet tag
//const WalletTagWidth = doc.getStringUnitWidth(walletTag) * 12 / doc.internal.scaleFactor; // Assuming font size 12

// Calculate the X-coordinate for the wallet tag to position it at the right side of the page
//const walletTagX = doc.internal.pageSize.width - WalletTagWidth - 67.5; // Adjust the offset as needed

// Set font size and style for the wallet tag
// doc.setFontSize(10);
// doc.setTextColor("#808080"); // Set text color to grey
// doc.setFont('Helvetica', 'bold'); // Set text style to bold

// Display the wallet tag
//doc.text(walletTag, walletTagX, titleY+10, { maxWidth: 100 }); // Adjust the Y-coordinate as needed

// Set font size and style for the wallet id
// doc.setFontSize(10);
// doc.setTextColor("#28282B"); // Set text color 
// doc.setFont('Helvetica', 'bold'); // Set text style to bold italic

// Calculate the X-coordinate for the wallet id to position it next to the wallet tag
//const walletX = walletTagX + WalletTagWidth;

// Display the wallet id next to the wallet tag
// doc.text(walletId, walletX, titleY+10, { maxWidth: 50 }); // Adjust the Y-coordinate as needed

//--------xxxx-----------

// Function to add content
  if (ShowLabel) {
    const columns = ["Serial No","Transaction Type", "Transaction Currency", "Transaction Amount", "Previous Balance", "Date Of Transaction"];
    const rows = data.map((item,index) => [
      index + 1, // Serial number
      item.transactionType.replace(/_/g, " "),
      item.transactionCurrencyCode,
      {
        content: item.debit === true ? `- ${Math.abs(item.cardTransactionAmount)}` : `+ ${Math.abs(item.cardTransactionAmount)}`,
        styles: {
          textColor: item.debit === true ? "red" : "green"
        }
      },
      item.previousBalance,
      item.dateOfTransaction,
    ]);

  // Add an underline before the table starts
const underlineY = titleY + 30; // Adjust the Y-coordinate for the underline
doc.setLineWidth(0.5); // Set the line width
doc.setDrawColor("#808080"); // Set the color to grey
doc.line(10, underlineY, doc.internal.pageSize.width - 10, underlineY); // Draw the line

let startY =  underlineY + 10;

// Calculate available space on the page
const availableSpace = doc.internal.pageSize.height - startY - 20; // Subtracting startY and some additional margin

// Calculate dynamic chunk size based on available space and row height
const rowHeight = 12; // Assuming each row has a height of 15 units
let dynamicChunkSize = Math.floor(availableSpace / rowHeight);

// Split rows into chunks of dynamicChunkSize
for (let i = 0; i < rows.length; i += dynamicChunkSize) {
  const chunk = rows.slice(i, i + dynamicChunkSize);
   // Build the table for the current chunk
   doc.autoTable({
     head: [columns],
     body: chunk,
     startY: i === 0 ? startY : 40,
     didDrawPage: function () {
       // Page numbering
       let pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
       doc.setPage(i);
       doc.setFontSize(10); // Set font size for page number
       doc.text('Page ' + i + ' of ' + pageCount, doc.internal.pageSize.width-120, doc.internal.pageSize.height - 10);
      }
         }
         
   });

  // If there are more rows remaining and the current chunk doesn't fill the page, add a new page
if (i + dynamicChunkSize < rows.length && doc.autoTable.previous.finalY > availableSpace) {
  doc.addPage();

  // Statement Sub title 1
  const subtitle1 = "Statement Period :";
  doc.setFontSize(15); // Adjust the font size as needed
  doc.setTextColor("#808080"); // Set text color to grey
  doc.setFont("helvetica", "bold"); // Set font family to 'helvetica' and font style to 'bold'
  const subtitle1Width = doc.getStringUnitWidth(subtitle1) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const centerX1 = (doc.internal.pageSize.width - subtitle1Width) / 2;
  doc.text(subtitle1, centerX1-35, 20);

  // Statement Sub title 2
  const subtitle2 = formattedStartDate + " to " + formattedEndDate;
  doc.setFontSize(15); // Adjust the font size as needed
  doc.setTextColor("black"); // Set text color to black
  doc.setFont("Helvetica", "bold"); // Set font family to 'helvetica' and font style to 'bold'

  // Display Subtitle 2 after Subtitle 1
  doc.text(subtitle2, centerX1+13, 20);
  
  // Add an underline before the table starts
   const underlineY1 = 30; // Adjust the Y-coordinate for the underline
   doc.setLineWidth(0.5); // Set the line width
   doc.setDrawColor("#808080"); // Set the color to grey
   doc.line(10, underlineY1, doc.internal.pageSize.width - 10, underlineY1); // Draw the line
}

 } 
}
 // Add ImpNote and page number
const impNoteTag = "Important :-";
const impNote = "This statement summary is issued by ZOQQ. Please review this statement summary immediately. If no error or discrepancy is reported to ZOQQ within 7 days from the date of this statement summary, the information on this statement summary shall be deemed correct. For any errors or discrepancies, please contact us at support@zoqq.com.";
// Calculate the height of the impNote
const impNoteHeight = doc.getTextDimensions(impNote).h / doc.internal.scaleFactor;

// Calculate the Y-coordinate for impNoteTag
//const impNoteTagY = doc.internal.pageSize.height - impNoteHeight - 45;
const impNoteTagY = doc.autoTable.previous.finalY + 15;

doc.setFontSize(12);
doc.setFont('Helvetica', 'bold');
doc.setTextColor(0, 0, 255);
doc.text(impNoteTag, 15, impNoteTagY);
doc.setFontSize(10);
doc.setFont('Helvetica', 'normal');
doc.setTextColor("#28282B");
doc.text(impNote, 15, impNoteTagY + 5, { maxWidth: 180 });

// Check if adding impNote exceeds page height
if (impNoteTagY + impNoteHeight + 5 > doc.internal.pageSize.height) {
  doc.addPage(); // Add new page if impNote overflows
}

  // Save the PDF with a file name
  const fileName = 'Account Statement.pdf';
  doc.save(fileName);
}

//----------------------------------------------PDF END---------------------------------------------

// ------------------------------------XLSX Download Format--------------------------------------

function JSONToXLSXConvertorTransactions(JSONData, ReportTitle, ShowLabel) {
  var arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

  // Create a new Workbook and Worksheet
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet([]);

  // Add the Worksheet to the Workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // Add the data (if ShowLabel is true)
  if (ShowLabel) {
    var data = [];

    // Add header row
    data.push(['Transaction Type', 'Transaction Currency Code', 'Transaction Amount', 'Previous Balance', 'Date of Transaction']);

    // Add data rows
    for (var index in arrData['content']) {
      var arr = arrData['content'][index];

      var transactionType = arr['transactionType'];
      var txnType = transactionType.replace(/_/g, " ");

      data.push([[txnType], arr['transactionCurrencyCode'], arr['cardTransactionAmount'], arr['previousBalance'], arr['dateOfTransaction']]);
    }

    // Add the data to the Worksheet
    XLSX.utils.sheet_add_aoa(ws, data);
  }

  // Generate the XLSX file as an array buffer
  var xlsxArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Convert the array buffer to a Blob
  var xlsxBlob = new Blob([xlsxArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Save the Blob as a file using file-saver
  saveAs(xlsxBlob, ReportTitle + '.xlsx');
}

// account statement pdf for payments

export const AccStatementPdfPayments = async (formData,custHashId) => {

  const size = 20;
  
  var startDateFinal ="";
  var endDateFinal = "";
  
  if (custHashId == "" || custHashId == null) {
    return [];
  } 
  else {
    try {

  // ----------------- dates when from and to date present ---------------------

  var fromDate = formData.fromDate;
  var fromDateParseValue = Date.parse(fromDate);

  var fromDateObj = new Date(fromDateParseValue);

  var startDD = String(fromDateObj.getDate()).padStart(2, '0');
  var startMM = String(fromDateObj.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based
  var startYYYY = fromDateObj.getFullYear();

  var startDateFormat2 = startYYYY + '-' + startMM + '-' + startDD;

  console.log(`Start Date: ${startDateFormat}`);

  var toDate = formData.toDate;
  var toDateParseValue = Date.parse(toDate);

  var toDateObj = new Date(toDateParseValue);

  var endDD = String(toDateObj.getDate()).padStart(2, '0');
  var endMM = String(toDateObj.getMonth() + 1).padStart(2, '0');
  var endYYYY = toDateObj.getFullYear();

  var endDateFormat2 = endYYYY + '-' + endMM + '-' + endDD;

 // ---------- Dates when from date and to date not present -----------------
      const endDate = new Date().toISOString();

      console.log("Current Date:", endDate);

      var endDateParse = Date.parse(endDate);

      var endDateObj = new Date(endDateParse);

      var endDD = String(endDateObj.getDate()).padStart(2, "0");
      var endMM = String(endDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
      var endYYYY = endDateObj.getFullYear();

      var endDateFormat = endYYYY + "-" + endMM + "-" + endDD;

      console.log(`End Date: ${endDateFormat}`);

      const startDateSevenDaysAgo = new Date(
        endDateParse - 7 * 24 * 60 * 60 * 1000
      ); // Subtract 7 days in milliseconds

      var startDateObj = new Date(startDateSevenDaysAgo);

      var startDD = String(startDateObj.getDate()).padStart(2, "0");
      var startMM = String(startDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
      var startYYYY = startDateObj.getFullYear();

      var startDateFormat = startYYYY + "-" + startMM + "-" + startDD;

      console.log(`State Date: ${startDateFormat}`);

      if((fromDate=="")||(fromDate=="NaN-NaN-NaN")||(toDate=="")||(toDate=="NaN-NaN-NaN")){
        startDateFinal = startDateFormat;
        endDateFinal = endDateFormat;
        sessionStorage.setItem('startDateStatement', startDateFinal);
        sessionStorage.setItem('endDateStatement', endDateFinal);
      }
      else{
        startDateFinal = startDateFormat2;
        endDateFinal = endDateFormat2;
        sessionStorage.setItem('startDateStatement', startDateFinal);
        sessionStorage.setItem('endDateStatement', endDateFinal);
      }

      var buttonText = document.getElementById("button-text");
      var buttonLoader = document.getElementById("button-loader");

       buttonText.style.display = "none";
       buttonLoader.style.display = "flex";
       document.getElementById('pdfDwBtn').disabled = true;
       

      const initialData = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/AccountsRoutes/transactionHistory",
        {
          params: {
            page: formData?.currentPage||1,
            size: size,
            startDate: startDateFinal, // Use currentDate here
            endDate: endDateFinal,
            transactionType: formData?.txnType || "",
            custHashId: custHashId
          },
        }
      );

      const obj = initialData.data;
      console.log(obj);
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";


      if (obj.length === 0) {
        toast.error("No transactions recorded during this time frame!");
        document.getElementById('pdfDwBtn').disabled = false;
      } 
      else if (obj.status === "BAD_REQUEST") {
        toast.error(obj.message);
        document.getElementById('pdfDwBtn').disabled = false;
      } 
      else {
          console.log(obj);
          toast.success("Account Statement Downloaded Successfully!");
          document.getElementById('pdfDwBtn').disabled = false;
           return JSONToPDFConvertorTransactions(obj, 'Account Statement', true);           
          }
        }
        catch (error) {
          // Handle any errors here
          console.error("Error:", error);
          if (error instanceof AxiosError) {
           if (error.response && error.response.data && error.response.data.status === 'BAD_REQUEST'){
              toast.error(error.response.data.message);
              buttonText.style.display = "flex";
              buttonLoader.style.display = "none";
              document.getElementById('pdfDwBtn').disabled = false;     
            }
            else{
              toast.error(error.response.data.message);
              buttonText.style.display = "flex";
               buttonLoader.style.display = "none";
               document.getElementById('pdfDwBtn').disabled = false;
            }
          }
          else{
          toast.error("Something went wrong! Please try again later.");
          buttonText.style.display = "flex";
          buttonLoader.style.display = "none";
          document.getElementById('pdfDwBtn').disabled = false;
         
            }
          }

          
}
     
  };


  // account statement csv for payments

export const AccStatementCsvPayments = async (formData,custHashId) => {

  const size = 10;

  var startDateFinal ="";
  var endDateFinal = "";
  
  if (custHashId == "" || custHashId == null) {
    return [];
  } 
  else {
    try {
      var header = "Transaction Type," + "Transaction Currency," + "Transaction Amount," + "Previous Balanace," + "Date Of Transaction,";


      // ----------------- dates when from and to date present ---------------------

  var fromDate = formData.fromDate;
  var fromDateParseValue = Date.parse(fromDate);

  var fromDateObj = new Date(fromDateParseValue);

  var startDD = String(fromDateObj.getDate()).padStart(2, '0');
  var startMM = String(fromDateObj.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based
  var startYYYY = fromDateObj.getFullYear();

  var startDateFormat2 = startYYYY + '-' + startMM + '-' + startDD;

  console.log(`Start Date: ${startDateFormat}`);

  var toDate = formData.toDate;
  var toDateParseValue = Date.parse(toDate);

  var toDateObj = new Date(toDateParseValue);

  var endDD = String(toDateObj.getDate()).padStart(2, '0');
  var endMM = String(toDateObj.getMonth() + 1).padStart(2, '0');
  var endYYYY = toDateObj.getFullYear();

  var endDateFormat2 = endYYYY + '-' + endMM + '-' + endDD;


      // ---------- Dates when from date and to date not present -----------------
      const endDate = new Date().toISOString();

      console.log("Current Date:", endDate);

      var endDateParse = Date.parse(endDate);

      var endDateObj = new Date(endDateParse);

      var endDD = String(endDateObj.getDate()).padStart(2, "0");
      var endMM = String(endDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
      var endYYYY = endDateObj.getFullYear();

      var endDateFormat = endYYYY + "-" + endMM + "-" + endDD;

      console.log(`End Date: ${endDateFormat}`);

      const startDateSevenDaysAgo = new Date(
        endDateParse - 7 * 24 * 60 * 60 * 1000
      ); // Subtract 7 days in milliseconds

      var startDateObj = new Date(startDateSevenDaysAgo);

      var startDD = String(startDateObj.getDate()).padStart(2, "0");
      var startMM = String(startDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
      var startYYYY = startDateObj.getFullYear();

      var startDateFormat = startYYYY + "-" + startMM + "-" + startDD;

      console.log(`State Date: ${startDateFormat}`);

      if((fromDate=="")||(fromDate=="NaN-NaN-NaN")||(toDate=="")||(toDate=="NaN-NaN-NaN")){
        startDateFinal = startDateFormat;
        endDateFinal = endDateFormat;
      }
      else{
        startDateFinal = startDateFormat2;
        endDateFinal = endDateFormat2;
      }

      var buttonText = document.getElementById("button-textTwo");
      var buttonLoader = document.getElementById("button-loaderTwo");

       buttonText.style.display = "none";
       buttonLoader.style.display = "flex";
       document.getElementById('CsvDwBtn').disabled = true;

      const initialData = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/AccountsRoutes/transactionHistory",
        {
          params: {
            page: formData?.currentPage||1,
            size: size,
            startDate: startDateFinal, // Use currentDate here
            endDate: endDateFinal,
            transactionType: formData?.txnType || "",
            custHashId: custHashId
          },
        }
      );

      const obj = initialData.data;
      console.log(obj);

      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";

      if (obj.length === 0) {
        toast.error("No transactions recorded during this time frame!");
        document.getElementById('CsvDwBtn').disabled = false;
      } 
      else if (obj.status === "BAD_REQUEST") {
        toast.error(obj.message);
        document.getElementById('CsvDwBtn').disabled = false;
      } 
      else {
          console.log(obj);
          toast.success("Account Statement Downloaded Successfully!");
          document.getElementById('CsvDwBtn').disabled = false;
          return JSONToCSVConvertorTransactions(obj, header, true);
          }
        }
        catch (error) {
          // Handle any errors here
          console.error("Error:", error);
          if (error instanceof AxiosError) {
           if (error.response && error.response.data && error.response.data.status === 'BAD_REQUEST'){
              toast.error(error.response.data.message);
              buttonText.style.display = "flex";
              buttonLoader.style.display = "none";
              document.getElementById('CsvDwBtn').disabled = false;     
            }
            else{
              toast.error(error.response.data.message);
              buttonText.style.display = "flex";
               buttonLoader.style.display = "none";
               document.getElementById('CsvDwBtn').disabled = false;
            }
          }
          else{
          toast.error("Something went wrong! Please try again later.");
          buttonText.style.display = "flex";
          buttonLoader.style.display = "none";
          document.getElementById('CsvDwBtn').disabled = false;
         
            }
          }

          
}
     
  };