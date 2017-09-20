var isShowMenu = false;
var tempScrollTop = $(window).scrollTop();

fixIpadLandscape();
fixResponsive();

$(function() {

	fixIpadLandscape();

	/* Позииционирование футера с кнопкой Полная версия */
	positionFooter();
	fixResponsive();
	
	$(window).resize(function(){
		positionFooter();
		fixResponsive();
	});

	/* Andoid keyboard fix
    $('input, textarea').click(function(e){ $(this).focus(); });

    $('input[type="button"]').click(function(e) {
        $(this).trigger('click');
    });*/
	
	
	/* Догрузка страниц с контентом */
	/*$('.more_action').off('click').on('click',function(){
		if($(this).is('.loading')){
			$(this).removeClass('loading');
		} else {
			$(this).addClass('loading');
			//загрузка контента
		}
	});*/

	// обрабатываем кнопку очистки поля ввода
	$('button.close-input-icon').touch(function(e) {
		e.stopPropagation();
		$(this).parent().find('input.with_close').val('').change().focus();
	});

	$(document).on('touch', '.expand_button', function () {
		var $elem = $(this),
			$cont = $(this).closest('.post_wrapper');
		$cont.removeClass('post_wrapper');
		$elem.remove();
	});

	// показываем кнопку скрола вверх если проскролировано больше 200px
	$(window).off('scroll.scrollToTop').on('scroll.scrollToTop', function() {
		$('div.scroll-up').toggleClass('active', $(this).scrollTop() > 200);
	});

	$('span.scroll-up-arrow').off('touch').on('touch', function() {
		if ($(this).parent().hasClass('active')) {
			$('html, body').animate({
				'scrollTop': 0
			}, 300);
		}
	});

	$('.checkbox').tap(function(event){
		var $el = ($(event.target).is('.checkbox')) ? $(event.target) : $(event.target).closest('.checkbox'),
			on = $el.hasClass('on');

		if ($el.hasClass('disabled')) {
			return true;
		}
		$el.toggleClass('on', !on)
			.toggleClass('off', on);
		$el.next().prop('checked', !on).change();
	});

	// показать дополнительные пункты меню
	$('li.menu-group').off('touch').on('touch', function () {
		var navU = navigator.userAgent;
		// Android Mobile
		var isAndroidMobile = navU.indexOf('Android') > -1 && navU.indexOf('Mozilla/5.0') > -1 && navU.indexOf('AppleWebKit') > -1;
		// Android Browser (not Chrome)
		var regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);
		var resultAppleWebKitRegEx = regExAppleWebKit.exec(navU);
		var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navU)[1]));
		var isAndroidBrowser = isAndroidMobile && appleWebKitVersion !== null && appleWebKitVersion < 537;

		if (isAndroidBrowser) {
			// сопля для деволтового браузера андроид
			$('li.menu-extra-item').slideDown(
				300,
				function () {
					$('li.menu-group').slideUp(300);
				}
			);
		} else {
			$('li.menu-extra-item').slideDown(300);
			$('li.menu-group').slideUp(300);
		}
	});
	
	/* Показ/закрытие основного меню на телефоне */
	$('.menu_control, #right_container .header.mobile .logo').off('touch').on('touch',function(event){
		showMenuMainBox();
	});
	$('#sidebar_menu .close_control').on('touch',function(event){
		hideSidebarBox();
	});

	/* Показ/закрытие меню профиля */
	$('.toprofile_control .profile_menu_control').off('touch').on('touch',function(event){
		showMenuProfileBox();
	});
	$('.main_menu_control').off('touch').on('touch',function(event){
		hideMenuProfileBox();
	});

	$('.close_menu_add_control').off('click').on('click',function(event){
		hideMenuAddBox();
	});
	
	
	/* Показ/закрытие всплывающей формы с созданием поста выбранного типа */
	$('.menu_add .control').off('click').on('click',function(event){
		var el = ($(event.target).is('.control')) ? $(event.target) : $(event.target).closest('.control');
		showAddBox(el.attr('data-type'));
	});
	$('#add_container .close_control').off('click').on('click',function(event){
		hideAddBox();
	});
	/* обработка нажатия на кнопку Создать пост */
	$('.submit_button_add').off('click').on('click',function(event){
		//сохранение данных
		hideAddBox();
		hideMenuAddBox();
	});
	/* Создание: после загрузки изображения */
	$('#story_img_file').change(function(){
        $('#add_container .story_new_form_upload').addClass('hidden');
        $('#add_container .story_after_new_form_upload').removeClass('hidden');
 	});
	/* Создание: удалить загруженное изображение */
	$('.close_after_new_upload_control').off('click').on('click',function(event){
		$('#add_container .story_after_new_form_upload').addClass('hidden');
		$('#add_container .story_new_form_upload').removeClass('hidden');
		
		var control = $("#story_img_file");
		control.replaceWith( control = control.clone( true ) );
	});
	$('#add_container .checkbox').on('click',function(event) {
		var el = ($(event.target).is('li')) ? $(event.target) : $(event.target).closest('li');
		el.toggleClass('active');
	});
	/* Показ/закрытие блока с баянными изображениями */
	$('.bayan_count_block_control').off('click').on('click',function(event){
		showAddBayanBox();
	});
	$('#new_story_bayanometr .back_control').off('click').on('click',function(event){
		hideAddBayanBox();
	});
	
	/* Показ/закрытие всплывающей формы с авторизацией
	$('.tologin_control').off('click').on('click',function(event){
		showAuthBox('login');
	});
	$('#auth_box .close_control').off('click').on('click',function(event){
		hideAuthBox();
	});
	// показать форму авторизации
	$('#auth_box .auth_tologin_control').off('click').on('click',function(event){
		showAuthTypeBox('login');
	});
	// показать форму регистрации
	$('#auth_box .auth_toreg_control').off('click').on('click',function(event){
		showAuthTypeBox('registration');
	});
	// показать форму восстановления пароля
	$('#auth_box .auth_retrieve_control').off('click').on('click',function(event){
		showAuthTypeBox('retrieve');
	});
	
	// Показ в анонсе поста панели с шарингом
	$('.post_more').off('click').on('click',function(event){
		togglePostShareBox(event.target);
	});
	 */
	
	/* Показ/скрытие фильтра показа сообщений внутри поста */ 
	$('.post_comments .submenu .control').off('touch').on('touch',function(event){
		togglePostCommentsFilterBox(event.target);
	});
	
	/* Показать текст заминусованного комментария */ 
	$('.comment_minus_toggle').off('touch').on('touch',function(event){
		toggleCommentText(event.target);
	});
	/*
	$('.comment').off('touch').on('touch',function(event){
		var el = ($(event.target).is('.comment')) ? $(event.target) : $(event.target).closest('.comment');
		showCommentActionBox(el);
		showCommentReplyBox(el);
	});
	
	$('.comment_new_form_close').off('touch').on('touch',function(event){
		var el = $(event.target).closest('.comment');
		if (el.find('.comment_new_form').is('.edit')) {
			hideCommentReplyBox(el);
			showCommentActionBox(el);
			showCommentReplyBox(el);
		} else {
			hideCommentReplyBox(el);
		}
		return false;
	});*/
	
	/* Автоматическое изменение высоты поля ввода текста комментария
	$('.comment_new_form textarea, #add_container textarea').off('keyup').on('keyup', function(event){
	    $(this).height(18); // min-height
	    $(this).height(this.scrollHeight);
	});
	*/
	/* Свернуть/развернуть дерево комментариев */ 
	/*$('.reply_count.control').off('click').on('click',function(event){
		toggleCommentTree($(event.target).closest('.comment'));
	});*/
	
	/* Удаление заметки */ 
	/*$('.notice_list .del_item').off('click').on('click',function(event){
		if (confirm('Вы действительно хотите удалить эту заметку?')) {
			//удаление заметки с сервера
			$(event.target).closest('li').remove();
		}
		return false;
	});
	
	// Удаление тега
	$('.tag_list .del_item').off('click').on('click',function(event){
		if (confirm('Вы действительно хотите удалить этот тег?')) {
			//удаление тега с сервера
			$(event.target).closest('li').remove();
		}
		return false;
	});
	
	// Удаление пользователя из подписки/бан-листа
	$('.user_list .del_item').off('click').on('click',function(event){
		if (confirm('Вы действительно хотите удалить этого пользователя?')) {
			//удаление пользователя с сервера
			$(event.target).closest('li').remove();
		}
		return false;
	});*/
	
	/* Удаление комментария */ 
	$('.comment_delete').off('touch').on('touch',function(event){
		if (confirm('Вы действительно хотите удалить этот комментарий?')) {
			//удаление комментария с сервера
			$(event.target).closest('.comment').remove();
		}
		return false;
	});
	
	/* Редактирование комментария */ 
	$('.comment_edit').off('touch').on('touch',function(event){
		showCommentEditBox( $(event.target).closest('.comment'));
		return false;
	});
	
	
	/* Скрыть блок приветствия */ 
	$('.welcome_close_control').off('touch').on('touch',function(event){
		$('.welcome_container').addClass('hidden');
	});
	/* Показ всплывающей формы с регистрацией по кнопке в блоке приветствия */
	$('.welcome_auth_control').off('touch').on('touch',function(event){
		showAuthBox('registration');
	});
	
	/* ДЛЯ ТЕСТОВ: Показ превью загруженных фото при создании комментария */
	$('.comment_new_form_upload input').on('change',function(event){
		$(event.target).closest('.comment_new_form').find('.comment_new_form_thumb_box').removeClass('hidden');
	});
	
});

function fixResponsive() {
	if ($(window).width() > 640) {
		//showTabletContentBox(($(window).width() < 1024) ? 25 : 23);
	} else {
		//hideTabletContentBox();
	}
}
function showCommentEditBox(el) {
	el.find('.comment_top_box').addClass('hidden');
	el.find('.comment_text').addClass('hidden');
	el.find('.comment_actions_box').addClass('hidden');
	el.find('.comment_new_form')
		.addClass('edit')
		.find('.form_input.text').val($.trim(el.find('.comment_text').text()))
		.end()
		.find('.comment_new_form_close').removeClass('hidden')
		.end()
		.find('.comment_new_form_thumb_box').removeClass('hidden');
	showCommentReplyBox(el);
}
function hideCommentEditBox(el) {
	el.find('.comment_new_form')
		.removeClass('edit')
		.find('.form_input.text').val('')
		.end()
		.find('.comment_new_form_close').addClass('hidden')
		.end()
		.find('.comment_new_form_thumb_box').addClass('hidden');
	el.find('.comment_top_box').removeClass('hidden');
	el.find('.comment_text').removeClass('hidden');
	//el.find('.comment_actions_box').removeClass('hidden');
}

function fixIpadLandscape(){
	if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) || navigator.userAgent.match(/iPad;.*CPU.*OS 8_\d/i)) {
    	//$('html').addClass('ipad ios7-8');
	}
}

/*
function showTabletContentBox(size) {
	var winWith = $(window).width(), leftWidth = ~~(winWith * size / 100);
	$('#left_container').css('display', 'block').css('width', leftWidth + 'px');
	$('#right_container').css({
		'display': 'block',
		'width' : (winWith - leftWidth) + 'px'
	});
	$('.right_container_wrapper').css({
		'margin-left': leftWidth + 'px'
	});
}*/
/*
function hideTabletContentBox() {
	if (isShowMenu) {
		$('#left_container').css('display','block');
		$('#right_container').css('display','none');
	} else {
		$('#right_container').css('display','block');
		$('#left_container').css('display','none');
	}
	// сбрасываем ширину и отступы контейнеров
	$('#right_container, #left_container').css('width', '');
	$('.right_container_wrapper').css('margin-left', '');
}
*/


function showSidebarBox() {
	isShowMenu = true;
	var $left = $('#left_container');
	if ($left.css('display') == 'none') {
		tempScrollTop = $(window).scrollTop();
		$('#right_container, .right_container_wrapper').hide();
		$left.show();
		return true;
	}
	return false;
}

function hideSidebarBox() {
	isShowMenu = false;
	var $right = $('#right_container');
	if ($right.css('display') == 'none') {
		$('#left_container').hide();
		$right.show();
		$('.right_container_wrapper').show();
		positionFooter();
		$(window).scrollTop(tempScrollTop);
		return true;
	}
	return false;
}


function showAddBox(type) {
	$('#left_container').addClass('hidden');
	$('#right_container').addClass('hidden');
	$('#add_container').removeClass('hidden');
	showAddTypeBox(type);
}
function hideAddBox() {
	$('#add_container').addClass('hidden');
	$('#left_container').removeClass('hidden');
	$('#right_container').removeClass('hidden');
	positionFooter();
}
function showAddTypeBox(type) {
	$('#add_container .add_box_hidden').addClass('hidden');
	$('.add_box_' + type).removeClass('hidden');
}
function showAddBayanBox(type) {
	$('#new_story').addClass('hidden');
	$('#new_story_bayanometr').removeClass('hidden');
}
function hideAddBayanBox() {
	$('#new_story_bayanometr').addClass('hidden');
	$('#new_story').removeClass('hidden');
}

function showAuthBox(type) {
	tempScrollTop = $(window).scrollTop();
	$('#auth_container').fadeIn(100, function(){
		$('#left_container').addClass('hidden');
		$('#right_container').addClass('hidden');
		$('.right_container_wrapper').addClass('hidden');
	});
	showAuthTypeBox(type);
	$(document).scrollTop(0);
	//$('#auth_container .fullversion').css('position', 'absolute');
}
function hideAuthBox() {
	$('#auth_container').fadeOut(100, function(){
		$('#left_container').removeClass('hidden');
		$('#right_container').removeClass('hidden');
		$('.right_container_wrapper').removeClass('hidden');
		positionFooter();
		$(window).scrollTop(tempScrollTop);
	});

	//$('#auth_container .fullversion').css('position', 'relative');
}
function showAuthTypeBox(type) {
	$('#auth_container').find('.auth_box').addClass('hidden').end()
	.find('#'+ type +'_box').removeClass('hidden');
}

function showMenuProfileBox() {
	switchSidebar('#sidebar_menu', '#sidebar_menu_profile');
	
}
function hideMenuProfileBox() {
	switchSidebar('#sidebar_menu_profile', '#sidebar_menu', true);
}
function showMenuAddBox() {
	switchSidebar('#sidebar_menu', '#sidebar_menu_add');
}
function hideMenuAddBox() {
	switchSidebar('#sidebar_menu_add', '#sidebar_menu', true);
}
function showMenuMainBox() {
	switchSidebar('#sidebar_menu_profile', '#sidebar_menu');
}

function switchSidebar(from, to, closeBar) {
	showSidebarBox();
	//tempScrollTop = $(window).scrollTop();
	if (from != '') {
		$(from).addClass('hidden-noim');
		if (from == '#sidebar_menu') {
			$('.left_bar').addClass('no-header');
		}
	}
	if (closeBar) {
		hideSidebarBox();
	}
	$(to).removeClass('hidden-noim');

	if (to == '#sidebar_menu') {
		$('.left_bar').removeClass('no-header');
	}
}

function togglePostShareBox(el) {
	el = $(el);
	var box = el.closest('.post_actions_box');
		
	if (el.is('.active')) {
		el.removeClass('active');
		box.find('.post_share_box').addClass('hidden');
		box.find('.post_rating_box').removeClass('hidden');
	} else {
		el.addClass('active');
		box.find('.post_share_box').removeClass('hidden');
		if (box.width() - box.find('.post_more_box').outerWidth(true) - box.find('.post_share_box').outerWidth(true) <= box.find('.post_rating_box').outerWidth(true)) {
			box.find('.post_rating_box').addClass('hidden');
		}
	}
}

function togglePostCommentsFilterBox(el) {
	el = $(el);
	
	var box = el.closest('.post_comments');
		
	if (box.find('.comments_all_count').is('.hidden')) {
		box.find('.comments_all_count').removeClass('hidden');
		box.find('.submenu .control').addClass('hidden').removeClass('active');
		el.addClass('active').removeClass('hidden');
	} else {
		box.find('.comments_all_count').addClass('hidden');
		box.find('.submenu .control').removeClass('hidden');
	}
}

function toggleCommentText(el) {
	$(el).addClass('hidden').siblings('.text').removeClass('hidden');
}

function showCommentActionBox(el) {
	if (el.is('.shifted')) return;
	hideCommentActionBox();
	
	el.addClass('shifted').css('margin-left', (-1)*el.position().left)
	.find('.comment_actions_box').removeClass('hidden');
}

function hideCommentActionBox() {
	var el = $('.comment.shifted');
	
	if (el.find('.comment_new_form').is('.edit')) hideCommentEditBox(el);
		
	el.removeClass('shifted').css('margin-left', 0)
	.find('.comment_actions_box').addClass('hidden').end()
	.find('.comment_new_form.reply').addClass('hidden');
}

function showCommentReplyBox(el) {
	$(el).find('.comment_new_form.reply').removeClass('hidden');
}
function hideCommentReplyBox(el) {
	$(el).find('.comment_new_form.reply').addClass('hidden');
	hideCommentActionBox();
}
function toggleCommentTree(el) {
	$(el).siblings('.comment_tree').toggleClass('hidden');
}

function bindEventsSettings() {
	$('.submenu .control').off('touch').on('touch',function(event){
		$('.item_list.settings').addClass('hidden');
		$('#' + $(event.target).attr('data-box')).removeClass('hidden');
		$('.submenu .control').removeClass('active');
		$(event.target).addClass('active');
	});
	
	$('.settings_trig_select_control').off('touch').on('touch',function(event){
		if ($(event.target).is('select')) return;
		var el = ($(event.target).is('.settings_control')) ? $(event.target) : $(event.target).closest('.settings_control');
		openSelect(el.find('select'));
	});
	
	$('.settings_control select, .settings_control input').on('change', function(event){
		var el = ($(event.target).is('.settings_control')) ? $(event.target) : $(event.target).closest('.settings_control');
		savingSettings(el);
	});
	
	$('.settings_control .checkbox').on('click',function(event){
		var el = $(event.target).siblings('input');
		el.attr('checked', ! $(event.target).is('.on'));
		savingSettings(el);
		return true;
	});
}

function openSelect(elem) {
    if (document.createEvent) {
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        elem[0].dispatchEvent(e);
    } else if (element.fireEvent) {
        elem[0].fireEvent("onmousedown");
    }
}

function showSettingsPasswordBox(content) {
	if ($('.password_dialog').is('.hidden'))
		$('.password_dialog').removeClass('hidden');
}
function hideSettingsPasswordBox(isSave) {
	if (isSave) {
		// сохранение данных
		savingSettings($('.settings_password'));
	}
	$('.password_dialog').addClass('hidden').find('input').val('');
}

function savingSettings(elem) {
	elem.closest('li').addClass('saving');
	//сохраняем, что надо
	
	//для теста первый таймаут, пока нет обработки самого сохраения
	setTimeout(function(){ 
		elem.closest('li').removeClass('saving').addClass('save');
		setTimeout(function(){ elem.closest('li').removeClass('save'); }, 1000);	
	}, 2000);
	
}

function positionFooter() {
	return;
	var contentBox = $('.right_container_wrapper'),
		headerHeight = contentBox.find('.header').height(),
		windowHeight = $(window).height(),
		footerHeight = $(".fullversion").height(),
		orientation = (window.innerHeight < window.innerWidth) ? 'landscape' : 'portrait';
     
    // fix ipad landscape bug
    if ($('html').attr('class') == 'ipad ios7-8' && orientation == 'landscape' ) { 
    	windowHeight = 672; 
    }
    contentBox.height('auto'); 
    if ( (contentBox.height() + footerHeight) < windowHeight) {
    	contentBox.height(windowHeight - footerHeight - headerHeight);
    } 
}