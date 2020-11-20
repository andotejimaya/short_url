var cmid = null; /** 右クリメニューID */

/** 短いurlをclipboardへコピー */
var cm_click = async function(data, tab) {

//	console.log('data='+JSON.stringify(data)); //data.pageUrl, menuItemId
//	console.log('tab='+JSON.stringify(tab)); 

	var color = [0, 0xaa, 0, 100];

	let txt = await get_short_url[data.menuItemId].call(this, data.pageUrl, tab.id);
//console.log('txt='+txt);
	if (!txt) {
		txt = data.pageUrl;
		color = [0xff, 0, 0, 100];
//		return;
	}
	
	let textArea = document.createElement('textarea');
	textArea.value = txt;
	document.body.appendChild(textArea);
	textArea.select();
	document.execCommand('copy');
	document.body.removeChild(textArea);
	
	chrome.browserAction.setBadgeText({text:"copy", tabId: tab.id});
	chrome.browserAction.setBadgeBackgroundColor({color: color});
};

/** 短いurl取得 */
var get_short_url = {
	/** 
	 * amazon 
	 * 　urlを加工する
	 */
	amazon: function(url) {
		let pos = url.indexOf('/dp/');
		if (-1 === pos) { // 商品ページでないとき
			return null;
		}
		let pos2 = url.indexOf('/', pos+4);
		if (-1 === pos2) {
			pos2 = url.indexOf('?', pos+4);
		}

		let id = null;
		if (-1 < pos2) {
			id = url.substring(pos+4, pos2);
		} else {	
			id = url.substring(pos+4);
		}
//console.log('id='+id);
		let path = getBaseUrl(url)+'/dp/'+id; // 最後の「/」はあってもなくてもOK
		
		return path; 
	},
	/** 
	 * wiki
	 * 　documentからwgArticleIdを探す
	 */
	wiki: function(url, tab_id) {
		// content で wgArticleId を取得
		return new Promise(function(resolve, reject) {
			chrome.tabs.sendMessage(tab_id, {target: "wiki"}, function(id) {
//				console.log("id="+id);
				if (id) {
					let path = getBaseUrl(url)+'/?curid='+id;
					resolve(path); // sample https://ja.wikipedia.org/?curid=136800
				} else {
					resolve(null);
				}
			});
		});
	}
};

function getBaseUrl(url) {
	let pos = url.indexOf('/', 8); // https:// の後の[/]
	return url.substring(0,pos);
}

/** 右クリメニューを切り替える */
var cm = function() {
	chrome.tabs.getSelected(null,function(tab){
//		console.log('url='+tab.url);
		let target = null;
		if (!tab.url) {
//			console.log('undefined');
		} else if (tab.url.match(/^https:\/\/www\.amazon\.[^/]+\/([^\/]*\/|)dp\//)) {
//			console.log('amazon');
			target = 'amazon';
		} else if (tab.url.match(/^https:\/\/.*\.wikipedia.org\//)) {
//			console.log('wiki');
			target = 'wiki';
		} else {
//			console.log('no match');
		}
		
//		chrome.browserAction.setBadgeText({text:null});
		if (cmid) {
//			console.log('cmid='+cmid);
			chrome.contextMenus.remove(cmid);
			cmid = null;
		}

		if (target) {
			let txt = chrome.i18n.getMessage('contextmenu_1');
			let options = {
				id: target,
				title: txt,
				contexts: ['page'],
				onclick: cm_click
			};
			cmid = chrome.contextMenus.create(options);
		}
	});
}

/** タブが切り替わるたびに右クリメニューを切り替える */ //@todo 重かったらoptionにする
chrome.tabs.onActivated.addListener(function (tabId) {
//	console.log('onActivated');
	cm();
});

chrome.tabs.onUpdated.addListener(function (tabId) {
//	console.log('onUpdated');
	cm();
});

/** onCreated はurl が取れないらしいので除外
chrome.tabs.onCreated.addListener(function (tabId, info, tab) {
	console.log('onCreated');
	cm();
});
*/

chrome.browserAction.onClicked.addListener(function(tab){
//	console.log('cmid='+cmid);
	if (!cmid) {
		return;
	}
	cm_click({menuItemId: cmid, pageUrl: tab.url}, tab);
});
