const checkbox = document.getElementById('disable');

// Save options to chrome.storage
function save_options() {
    const disable = checkbox.checked;
    chrome.storage.sync.set({
        disable: disable
    }, function() {
        console.log("Options saved");
    });
}

// Restore checkbox state using preferences stored in chrome.storage
function restore_options() {
    // Use default checked state = true
    chrome.storage.sync.get({
        disable: true
    }, function(items) {
        checkbox.checked = items.disable;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
checkbox.addEventListener("click", () => {
    save_options();
    if (checkbox.checked) {
        chrome.runtime.sendMessage({type:'disable_cors', message: "true"});
    } else {
        chrome.runtime.sendMessage({type:'disable_cors', message: "false"});
    }
});