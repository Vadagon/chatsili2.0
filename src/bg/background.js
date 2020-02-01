// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.type=='init'){
		if(sender.tab){
			user.tabId = sender.tab.id;
			user.uid = request.uid;
			if(!user.data[user.uid]) user.data[user.uid] = user.data.default;
			save()
			sendResponse(user.data[user.uid]);
		}else{
			if(user.tabId == -1) sendResponse({failed: true});
			else chrome.tabs.sendMessage(user.tabId, {type: 'checkExistence'}, function(response){
				if(chrome.runtime.lastError || !response){
					user.tabId = -1;
					sendResponse({failed: user.tabId});
				}else{
					sendResponse(user.data[user.uid]);
				}
			})
		}
	}else if(request.type=='update'){
		if(request.data)
			user.data[user.uid] = request.data;
		else if(request.user)
			user.data[user.uid] = request.user;
		save()
		chrome.tabs.sendMessage(user.tabId, {data: user.data[user.uid], type: 'updateTags'})
	}else if(request.type == 'content'){
		
	}else if(request.type == 'sendMessage'){
		chrome.tabs.sendMessage(user.tabId, request)
	}


	return true;
});



var user = {
	tabId: -1,
	uid: 'default',
	data: {
		default: {
			tags: {},
			users: {},
			data: {
				templates: [],
				users: {}
			}
		}
	}
}




chrome.storage.sync.get(["user"], function(items) {
    if (!chrome.runtime.error && items.hasOwnProperty("user")) {
    	user = items.user;
    }else{
        save()
    }
});

var timeout1;
function save(){
	if(timeout1) clearTimeout(timeout1);
    timeout1 = setTimeout(function() {
		console.log('saved')
	    chrome.storage.sync.set({ "user": user });
    }, 600);
}

function getAccessTocken(data) {
    catcher(()=>{user.uid = data.split('USER_ID\\":\\"')[1].split('\\",')[0]})
    // catcher(()=>{user.uid = data.split('\\"uid\\":')[1].split(',')[0]})

    // const config = {};
    // let o = data.match(/accessToken\\":\\"([^\\]+)/);
    // let t = {};
    // config.access_token = o[1];
    // let n = data.match(/{\\"dtsg\\":{\\"token\\":\\"([^\\]+)/);
    // config.dt = n[1];
    // let r = data.match(/\\"NAME\\":\\"([^"]+)/);
    // r = r[1].slice(0, -1).replace(/\\\\/g, "\\");
    // r = decodeURIComponent(JSON.parse(`"${r}"`));
    // config.name = r;
    // return config;
}
function getCreds(cb){
    return new Promise(async (resolve) => {
        let url = 'https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed';
        let response = await fetch(url);
        let text = await response.text();

        user.creds = getAccessTocken(text);

        cb&&cb()
        resolve()
    });
}


getCreds(()=>{
	console.log(user.uid)
	// if(!user.data[user.uid])
	// 	user.data[user.uid] = {tags:{}, users:{}}
	// user.data[user.uid].tags['_' + Math.random().toString(36).substr(2, 9)] = {
	// 	color: 'red',
	// 	name: 'tag 11'
	// }
	// user.data[user.uid].tags['_' + Math.random().toString(36).substr(2, 9)] = {
	// 	color: 'yellow',
	// 	name: 'tag 22'
	// }
	// user.data[user.uid].tags['_' + Math.random().toString(36).substr(2, 9)] = {
	// 	color: 'blue',
	// 	name: 'tag 33'
	// }
	// '_' + Math.random().toString(36).substr(2, 9)
	save()
})