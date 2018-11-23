import urlParse from 'url-parse';

export default class Url {
    static create(url) {
        return new Url(url);
    }

    constructor(url) {
        const urlObj = urlParse(url, true);

        this.scheme = urlObj.protocol;
        this.path = `/${urlObj.host}${urlObj.pathname}`;
        this.query = urlObj.query;
    }

    match({ name, object }) {
        const params = object.match(this.path);

        if (!params) {
            return null;
        }

        return {
            scheme: this.scheme,
            route: name,
            query: this.query,
            params
        };
    }
}
