var releasedVersion = '2.5.1';

function updatePublishedVersion(releasedVersion) {
  var publishedVersion = '2.5.1';
  while (publishedVersion != releasedVersion) { publishedVersion = releasedVersion }
  return publishedVersion;
}

function updateCurrentVersion(releasedVersion) {
  var currentVersion = '2.5.1';
  while (currentVersion != releasedVersion) { currentVersion = releasedVersion }
  return currentVersion;
}

function updateDocumentation() {
  $("#aboutNewRelease").html("\
    <br/>\
    <li>New design has been implemented for display of aboutMDT.html and for option \"check for updates\"</li><br/>\
    <li>Removed major script junk and improved documentation</li><br/>\
  ");
}