export default function serializeForm(form) {
	const obj = {};
	const formData = new FormData(form);
	let properties = {};
	let hasProperties = false;

	for (const key of formData.keys()) {

		if (key.includes('properties')) {

			if (formData.get(key).length) {
				let newKey = key.slice(0, key.length - 1);
				newKey = newKey.replace('properties[', '');

				properties = Object.assign(properties, {
					[newKey]: formData.get(key)
				})
				hasProperties = true;
			}
		}
		else {
			obj[key] = formData.get(key);
		}
	}

	if (hasProperties)
		obj.properties = properties;

	console.log(obj);
	return JSON.stringify(obj);
}