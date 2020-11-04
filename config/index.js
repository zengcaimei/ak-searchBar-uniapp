/**
 * ip地址或域名
 */

const ipAddress = 'http://dpom_api.ak1ak1.com'

const fileAddr = ''
/**
 * api前缀
 */
const apiPrefix = ''
/**
 * 针对不同平台的baseUrl
 */
const getBaseUrl = () => {
	// #ifdef H5
	return ipAddress
	// #endif
	// #ifndef H5
	return ipAddress + apiPrefix
	// #endif
}
export default {
	/**
	 * 针对不同平台的baseUrl
	 */
	baseUrl: getBaseUrl(),
	fileAddr
}
