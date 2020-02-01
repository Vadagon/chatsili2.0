// Add native 'click' and 'change' events to be triggered using jQuery
jQuery.fn.extend({
    'mclick': function() {
        var click_event = document.createEvent('MouseEvents')
        click_event.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0,
            false, false, false, false,
            0, null);
        return $(this)
            .each(function() {
                $(this)[0].dispatchEvent(click_event)
            })
    },
    'vchange': function() {
        var change_event = document.createEvent('HTMLEvents')
        change_event.initEvent('change', false, true)
        return $(this)
            .each(function() {
                $(this)[0].dispatchEvent(change_event)
            })
    },
    'vclick': function() {
        var click_event = document.createEvent('HTMLEvents')
        click_event.initEvent('click', false, true)
        return $(this)
            .each(function() {
                $(this)[0].dispatchEvent(click_event)
            })
    },
    'vblur': function() {
        var click_event = document.createEvent('HTMLEvents')
        click_event.initEvent('blur', false, true)
        return $(this)
            .each(function() {
                $(this)[0].dispatchEvent(click_event)
            })
    },
    'vkeyup': function() {
        var keyup_event = document.createEvent('HTMLEvents')
        keyup_event.initEvent('keyup', false, true)
        return $(this)
            .each(function() {
                $(this)[0].dispatchEvent(keyup_event)
            })
    },
    'vkeyupWithChar': function(key) {
        var specific_keyup_event = document.createEvent('HTMLEvents')
        specific_keyup_event.initEvent('keyup', false, true)
        specific_keyup_event.which = key;
        specific_keyup_event.keyCode = key;
        return $(this)
            .each(function() {
                $(this)[0].dispatchEvent(specific_keyup_event)
            })
    }
})

function catcher(f){
    try{
        f()
        return true;
    }catch(err){
        console.log(err)
        // _gaq.push(['_trackEvent', 'catcher', err]);
        return false;
    }
}
function randomBetween(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}