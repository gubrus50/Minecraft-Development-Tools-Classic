var releasedVersion = '2.5.2';

function updatePublishedVersion(releasedVersion) {
  var publishedVersion = '2.5.2';
  while (publishedVersion != releasedVersion) { publishedVersion = releasedVersion }
  return publishedVersion;
}

function updateCurrentVersion(releasedVersion) {
  var currentVersion = '2.5.2';
  while (currentVersion != releasedVersion) { currentVersion = releasedVersion }
  return currentVersion;
}

function updateDocumentation() {
  $("#aboutNewRelease").html("\
    <br/>\
    <li>Updated development tools images and the logo. Changed word \"Developing\" to \"Development\"</li><br/>\
  ");
}
