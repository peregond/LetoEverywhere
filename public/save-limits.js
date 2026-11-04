// One place for the save-size limits, shared by the browser (app.js), the server (lib/save-format.js) and the tests.
// Raised from 150 flags / 1500 log records in 0.16.6: the longest known path was at 143 / 1384, which left no room for new chapters.
// Older saves stay valid (the limits only grew). The server still rejects a request body over 500000 characters (lib/progress-api.js).
export const MAX_FLAGS=250;
export const MAX_LOG_RECORDS=2000;
