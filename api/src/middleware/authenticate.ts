import { RequestHandler } from 'express';
import asyncHandler from '../utils/async-handler';
import { getAccountabilityForToken } from '../utils/get-accountability-for-token';
import { getIPFromReq } from '../utils/get-ip-from-req';

const authenticate: RequestHandler = asyncHandler(async (req, res, next) => {
	req.accountability = await getAccountabilityForToken(req.token);

	req.accountability.ip = getIPFromReq(req);
	req.accountability.userAgent = req.get('user-agent');

	return next();
});

export default authenticate;
