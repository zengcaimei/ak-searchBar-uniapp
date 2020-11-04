import store from '@/store'
const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')

class AkRequest {
	[config] = {
		baseURL: '',
		header: {
			'content-type': 'application/json',
		},
		method: 'GET',
		dataType: 'json',
		responseType: 'text'
	}

	interceptors = {
		request: (func) => {
			if (func) {
				AkRequest[requestBefore] = func
			} else {
				AkRequest[requestBefore] = (request) => request
			}

		},
		response: (func) => {
			if (func) {
				AkRequest[requestAfter] = func
			} else {
				AkRequest[requestAfter] = (response) => response
			}
		}
	}

	static[requestBefore](config) {
		return config
	}

	static[requestAfter](response) {
		return response
	}

	static[isCompleteURL](url) {
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

	setConfig(func) {
		this[config] = func(this[config])
	}

	request(options = {}) {
		options.baseURL = options.baseURL || this[config].baseURL
		options.dataType = options.dataType || this[config].dataType
		options.url = AkRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
		options.data = options.data
		options.header = { ...options.header,
			...this[config].header
		}
		options.method = options.method || this[config].method

		options = { ...options,
			...AkRequest[requestBefore](options)
		}

		return new Promise((resolve, reject) => {
			options.success = function(res) {
				resolve(AkRequest[requestAfter](res))
			}
			options.fail = function(err) {
				reject(AkRequest[requestAfter](err))
			}
			uni.request(options)
		})
	}

	get(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	}

	post(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}
	
	put(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'Put'
		return this.request(options)
	}
}

AkRequest.install = function(Vue) {
	Vue.mixin({
		beforeCreate: function() {
			if (this.$options.akRequest) {
				Vue._akRequest = this.$options.akRequest
			}
		}
	})
	Object.defineProperty(Vue.prototype, '$akApi', {
		get: function() {
			return Vue._akRequest.apis
		}
	})
}

export default AkRequest
