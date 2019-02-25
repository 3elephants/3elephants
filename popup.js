console.log("hello");
function save_options() {
  var betaMode = document.getElementById('beta-mode').checked;
  
  var toSort = document.getElementById('sort-results').checked;
  chrome.storage.sync.set({
    betaMode: betaMode,
    toSort: toSort
  }, function() {
    // Update status to let user know options were saved.
    console.log("options were saved");
  });
};

function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    betaMode: false,
    toSort: false
  }, function(items) {

    document.getElementById('beta-mode').checked = items.betaMode;
    document.getElementById('sort-results').checked = items.toSort;
  });
  document.getElementById('beta-mode').addEventListener('click',
    save_options);
  document.getElementById('sort-results').addEventListener('click',
    save_options);
};

document.addEventListener('DOMContentLoaded', restore_options);
