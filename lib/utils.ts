import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export const isMobileDevice = async () => {
    if (typeof process === 'undefined') {
        throw new Error('[Server method] you are importing a server-only module outside of server');
    }

    const headersInstance = await headers();
    const ua = headersInstance.get('user-agent');

    const device = new UAParser(ua || '').getDevice();

    const isMobile = device.type === 'mobile';

    return isMobile;
};