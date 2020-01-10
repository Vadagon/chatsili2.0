chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------


	}
	}, 10);
});
var layerI = 1;
setInterval(function() {
	$('._1enh._7q1s ul li:not([CRMattr=123123123123123])').each(function(){
		layerI++;
		$(`
			<div id="CRM-123123123123123">
				<div class="dropdown">
				  <button class="dropbtn" style="background-color: #dc493f;">Tag N1</button>
				  <div class="dropdown-content">
				    <a style="background-color: #44a6bb;">Tag N1</a>
				    <a style="background-color: #75c095;">Tag N2</a>
				    <a style="background-color: #dc493f;">Tag N3</a>
				  </div>
				</div>
			</div>
		`).prependTo($(this).attr('CRMattr', '123123123123123').find('._1qt4._7vuo')).css('z-index', 3000-layerI)
		// .css('margin-bottom', '-10px')
	})
}, 300)