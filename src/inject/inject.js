// chrome.extension.sendMessage({}, function(response) {
var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
		a.init()

	}
}, 10);
// });



var fb_ul_selector = ".uiScrollableAreaWrap.scrollable div > div > ul";
var fb_ul_li_selector = fb_ul_selector+ " li";
var fb_list_selectors = fb_ul_selector+ " li:not([crmattr=123123123123123])";


var a = {
	uid: '',
	data: {},
	init: ()=>{
		catcher(()=>{
			var id = $('html').html().split('USER_ID":"')[1].split('"')[0]
			if(id) a.uid = id;
		})
		chrome.extension.sendMessage({uid: a.uid, type: 'init'}, function(response) {
			a.data = response;
			console.log(a.data)
			setInterval(iterationStart, 500)
		})
	},
	sendMessages(e){
		var startSending = function(id){
			findUserInMessageList(id, (succed1)=>{
				triggerSendMessage(e.message, (succed2)=>{
					setTimeout(()=>{
						if(e.users.length) startSending(e.users.shift())
						// else sendMessages
					}, randomBetween(5000, 30000))
				});
			})
		}
		startSending(e.users.shift())
	}
}


var layerI = 1;
function iterationStart(){
	$(fb_list_selectors).each(function(index) {
        var fbUser = $(this)
            .find('a')
            .attr('data-href')
            .split('/t/')[1];
        if ($(this).find('div.tags-container').length > 0) {
            $(this).find('div.tags-container').remove();
            $(this).attr('fb_user_id', fbUser);
            // $(this)
            //     .find('span._1ht6')
            //     .after(tagDropDown);
        } else {
            $(this).attr('fb_user_id', fbUser);
            // $(this)
            //     .find('span._1ht6')
            //     .after(tagDropDown);
        }
		layerI++;
		var selectedTag = {
			color: 'unset',
			name: 'unset'
		}
		if(a.data.users[fbUser] && a.data.tags[a.data.users[fbUser]]){
			selectedTag = a.data.tags[a.data.users[fbUser]]
		}
		var tags = ''
		for(var tag in a.data.tags){
			tags += `<label tagId="${tag}" class="${a.data.tags[tag].color}">${a.data.tags[tag].name}</label>`
		}
		$(`
			<div id="CRM-123123123123123">
				<div class="dropdown">
				  <button class="dropbtn ${selectedTag.color}">${selectedTag.name}</button>
				  <div class="dropdown-content">
				    ${tags}
				  </div>
				</div>
			</div>
		`).prependTo($(this).attr('CRMattr', '123123123123123').find('div > a > div > div:nth-child(2)')).css('z-index', 3000-layerI).find('label').click(function(){
			$(this).parent().parent().find('button').attr('class', 'dropbtn '+$(this).attr('class')).text($(this).text())
			a.data.users[fbUser] = $(this).attr('tagId')
			a.data.data.users[fbUser] = {
				name: $(this).closest('#CRM-123123123123123').parent().find('span').eq(0).text(),
				image: $(this).closest('#CRM-123123123123123').parent().parent().find('img').attr('src')
			}
			console.log(a.data.data.users[fbUser])
			chrome.extension.sendMessage({ data: a.data, type: 'update'})

		})
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.type == 'checkExistence'){
    	sendResponse({result: true})
    	$('#CRM-123123123123123-Glass').remove()
    	$(`<div id="CRM-123123123123123-Glass"><span>x</span></div>`).prependTo($('html > body')).find('span').click(function(){
    		$(this).parent().remove();
    	})
	}else if(request.type == 'sendMessage'){
		console.log(request)
		a.sendMessages(request.data)
	}else if(request.type == 'updateTags'){
		a.data = request.data;
		$(fb_ul_li_selector).attr('crmattr', '').find('#CRM-123123123123123').remove()
	}
});








function triggerSendMessage(bulkMsgText, cb) {
    selector = 'div[aria-label="New message"] div[contenteditable="true"] span br';
    if ($(selector)
        .length > 0) {
        var evt = new Event('input', {
            bubbles: true
        });
        var input = document.querySelector(selector);
        input.innerHTML = bulkMsgText;
        input.dispatchEvent(evt);
        $(selector)
            .after('<span data-text="true">' + bulkMsgText + '</span>');
        var loc = window.location.href;
        loc = loc.split("/t/");
        $(fb_ul_selector + " li[fb_user_id='" + loc[1] + "']")
            .next('li')
            .find('a')
            .mclick();
        setTimeout(function() {
            var loc1 = window.location.href;
            loc1 = loc1.split("/t/");
            $(fb_ul_selector + " li[fb_user_id='" + loc1[1] + "']")
                .prev('li')
                .find('a')
                .mclick();
            setTimeout(function() {
                $('div[aria-label="New message"]')
                    .find('a[role="button"]')
                    .mclick();
                /*******************/
                var loc = window.location.href;
                loc = loc.split("/t/");
                $(fb_ul_selector + " li[fb_user_id='" + loc[1] + "']")
                    .next('li')
                    .find('a')
                    .mclick();
                setTimeout(function() {
                    var loc1 = window.location.href;
                    loc1 = loc1.split("/t/");
                    $(fb_ul_selector + " li[fb_user_id='" + loc1[1] + "']")
                        .prev('li')
                        .find('a')
                        .mclick();
                        cb(true)
                }, 200);
                /*******************/
            }, 200);
        }, 200);
    } else {
        $('div[aria-label="New message"] div[contenteditable="true"] span span')
            .text(bulkMsgText);
        $('div[aria-label="New message"]')
            .find('a[role="button"]')
            .mclick();
        /*******************/
        var loc = window.location.href;
        loc = loc.split("/t/");
        $(fb_ul_selector + " li[fb_user_id='" + loc[1] + "']")
            .next('li')
            .find('a')
            .mclick();
        setTimeout(function() {
            var loc1 = window.location.href;
            loc1 = loc1.split("/t/");
            $(fb_ul_selector + " li[fb_user_id='" + loc1[1] + "']")
                .prev('li')
                .find('a')
                .mclick();
                cb(true)
        }, 200);
        /*******************/
    }
}

function findUserInMessageList(id, cb) {
    if ($(fb_ul_selector + " li[fb_user_id='" + id + "']")
        .length > 0) {
        $(fb_ul_selector + " li[fb_user_id='" + id + "']")
            .find('a')
            .mclick();
        console.log('found!!!')
        cb(true)
    } else {
        $('._2xhi .uiScrollableAreaWrap.scrollable')
            .animate({
                scrollTop: $('._2xhi .uiScrollableAreaWrap.scrollable') .prop("scrollHeight")
            }, 600);
            setTimeout(()=>{
        		findUserInMessageList(id, cb)
            }, 600)
    }
}

