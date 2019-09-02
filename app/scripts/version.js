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
  $("#drv").href("https://drive.google.com/file/d/1jQES7mo-BVZZuiMdxlWQNz3cSZc_1Q7t/view");
  $("#aboutNewRelease").html("\
    <br/>\
    <li>Updated development tools images and the logo. Changed word \"Developing\" to \"Development\"</li><br/>\
    <li>Updated file updates.html. version.js used to use rawgit.com. Now domain has been changed to raw.githack.com<br/>\
    and also old repository links have been replaced to \"https://github.com/gubrus50/Minecraft-Development-Tools/...\"</li><br />\
    <li>New release notes have been updated. \"Now Download released version\" link is always updated from github.com/.../MDT/scripts/version.js</li><br/>\
  ");
}
