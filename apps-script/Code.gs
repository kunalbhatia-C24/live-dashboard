/**
 * Read-only Google Sheets JSON API for the CARS24 dashboard.
 * Script Properties: SHEET_ID (required), SHEET_NAME (optional, defaults to Data).
 * Expected headers: date, city, listingType, listings, views, leads.
 */
function doGet() {
  try {
    var props = PropertiesService.getScriptProperties();
    var id = props.getProperty('SHEET_ID');
    var name = props.getProperty('SHEET_NAME') || 'Data';
    if (!id) return json_({ error: 'Missing SHEET_ID script property', data: [] });
    var sheet = SpreadsheetApp.openById(id).getSheetByName(name);
    if (!sheet) return json_({ error: 'Sheet not found: ' + name, data: [] });
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return json_({ data: [], updatedAt: new Date().toISOString() });
    var headers = values.shift().map(function(h) { return String(h).trim(); });
    var data = values.filter(function(row) { return row.some(function(v) { return v !== '' && v !== null; }); }).map(function(row) {
      var item = {};
      headers.forEach(function(header, i) {
        var value = row[i];
        item[header] = value instanceof Date ? Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd') : value;
      });
      return item;
    });
    return json_({ data: data, updatedAt: new Date().toISOString(), count: data.length });
  } catch (e) {
    return json_({ error: String(e), data: [] });
  }
}
function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}