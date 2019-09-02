var releasedVersion = '2.5.2';
var downloadLink    = 'https://drive.google.com/file/d/1JaJoXQiVqds3Wt3szPCRnrDS-T1-H9QT/view';

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
    and also old repository links have been replaced to \"https://github.com/gubrus50/Minecraft-Development-Tools/...\"</li><br />\
    <li>New release notes have been updated. \"Now Download released version\" link is always updated from github.com/.../MDT/scripts/version.js</li><br/>\
  ");
}
