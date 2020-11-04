import akRequest from '../utils/index'
//根据商品69码查询获取商品信息
export const getProductInfoBybarCode = (params) => {
	return akRequest.get('/spu/inter/getProductInfoBybarCode', params)
}
//根据商品主键ID获取商品信息
export const getProductInfoByName = (params) => {
	return akRequest.post('/spu/inter/getProductInfoByName', params)
}