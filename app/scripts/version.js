var releasedVersion = '2.5.2';
var downloadLink    = 'href';

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
    <li>Updated file updates.html. version.js used to use rawgit.com. Now domain has been changed to cdn.jsdelivr.net<br/>\
    and also old repository links have been replaced to \"https://github.com/gubrus50/Minecraft-Development-Tools/...\"</li><br/>\
  ");
}
