const BASE_PARAMS = {
    t: '1740370617045',
    shop: 'hoiana.myshopify.com',
    page: 1,
    limit: 24,
    sort: 'relevance',
    locale: 'en',
    build_filter_tree: true,
    sid: 'fcde9db6-c594-4959-90ad-06b34fbf7c66',
    pg: 'search_page',
    zero_options: true,
    product_available: false,
    variant_available: false,
    urlScheme: 2,
    collection_scope: 0,
    q: '',
    event_type: 'init'
};


export default async function BCSearch(data = {}) {
    const params = { ...BASE_PARAMS, ...data };
    const BASEURL = `https://services.mybcapps.com/bc-sf-filter/search?${new URLSearchParams(params).toString()}`;

    try {
        const response = await fetch(BASEURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`${method} request failed:`, error);
        throw error;
    }
}