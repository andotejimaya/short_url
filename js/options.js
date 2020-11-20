var msg_invalid_url = chrome.i18n.getMessage('options_invalid_url');
var msg_tweet = chrome.i18n.getMessage('options_tweet');
alert('msg_invalid_url='+msg_invalid_url);

function save() {
//	console.log('aaaaaa');
//	alert ('value = ' + document.getElementById('invalid_url').value );
    chrome.extension.getBackgroundPage().alert('Are you sure you want to delete X?');
}


document.getElementById('invalid_url').onclick = save;
//document.getElementById('invalid_url').addEventListener('change', save);
