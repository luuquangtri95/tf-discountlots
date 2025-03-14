import {pinterest,tw,fbButton,reddit,tumblr,vk,ok,mail,linkedin,whatsapp,telegram,line} from 'vanilla-sharing';

const {addEvent} = theme;

const shareButton = {
	pinterest: (url, title)=>{
		pinterest({
			url: url
		})
	}

	,twitter: (url, title)=>{
		tw({
			url: url,
			title: title
		})
	}

	,facebook: (url, title)=>{
		fbButton({
			url: url
		})
	}

	,reddit: (url, title)=>{
		reddit({
			url: url,
			title: title,
		})
	}

	,tumblr: (url, title)=>{
		tumblr({
			url: url,
			title: title
		})
	}

	,vk: (url, title)=>{
		vk({
			url: url,
			title: title
		})
	}

	,ok: (url, title)=>{
		ok({
			url: url,
			title: title
		})
	}

	,mail: (url, title)=>{
		mail({
			url: url,
			title: title
		})
	}

	,linkedin: (url, title)=>{
		linkedin({
			url: url,
			title: title
		})
	}

	,whatsapp: (url, title)=>{
		whatsapp({
			url: url,
			title: title
		})
	}

	,telegram: (url, title)=>{
		telegram({
			url: url,
			title: title
		})
	}

	,line: (url, title)=>{
		line({
			url: url,
			title: title
		})
	}
}

addEvent('click', '.js-social-share', e=>{
	e.preventDefault();
	const link = e.target.closest('.js-social-share');
	const type = link.dataset.type;

	shareButton[type](link.href, link.title);
});