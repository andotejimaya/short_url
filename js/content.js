/** dom 参照用 event listener */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	var res = null;
	
	if (!msg.target) {
		// 
	} else {
		if ('wiki' === msg.target) {
			res = get_wgArticleId();
		} else {
			console.log(msg.target+' does not supprted');
		}
	}

	sendResponse(res);
});

function get_wgArticleId() {

	let scripts = document.querySelectorAll('script');
	for (let i=0; i<scripts.length; i++) {
		let script = scripts[i];
		let result = script.innerHTML.match(/"wgArticleId":(\d+)/);
//		console.log('result='+result);
		if (result) {
			return result[1];
		}
	}

    return null;
}
