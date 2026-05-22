import type { RequestHandler } from 'express';
import ipaddr from 'ipaddr.js';
import util from 'util';

function isValidCIDR(range: string): boolean {
	try { ipaddr.parseCIDR(range); return true; } catch { return false; }
}

function isInRanges(ip: string, ranges: string[]): boolean {
	try {
		const addr = ipaddr.parse(ip);
		return ranges.some((range) => {
			try {
				const [net, bits] = ipaddr.parseCIDR(range);
				if (addr.kind() !== net.kind()) {
					// IPv4 address against IPv6 range or vice-versa — no match.
					return false;
				}
				if (addr.kind() === 'ipv4') {
					return (addr as ipaddr.IPv4).match(net as ipaddr.IPv4, bits);
				}
				return (addr as ipaddr.IPv6).match(net as ipaddr.IPv6, bits);
			} catch { return false; }
		});
	} catch { return false; }
}

export default function ipRangeRestrict (ipRanges: string | undefined, wrapHTMLError: (title: string, message: string) => string): RequestHandler {
	return function (req, res, next) {
		if (ipRanges === undefined) {
			throw new Error('Allowed IP range is not defined');
		}

		const allowedRanges: string[] = ipRanges.split(/\s+|,/).filter((ipRange: string) => isValidCIDR(ipRange));

		if (allowedRanges.length <= 0) {
			throw new Error('No valid CIDR ranges were specified');
		}

		const requestIP = (req.ips.length > 0) ? (req.ips.slice().pop() ?? req.ip) : req.ip;
		const requestAllowed = requestIP !== undefined && isInRanges(requestIP, allowedRanges);

		if (!requestAllowed) {
			const msg = '-> blocked request from %s (not in allowed IP range)';
			console.log(util.format(msg, req.ip));
			const title = 'Sorry, your request is not authorized (403)';
			const message = 'Requests from outside permitted IP range are not allowed';
			const htmlError = wrapHTMLError(title, message);
			return res.status(403).send(htmlError);
		}

		return next();
	};
}
