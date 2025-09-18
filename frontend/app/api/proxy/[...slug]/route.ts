import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/app/config/api';
import { extractTokensFromCookies } from '@/app/lib/tokenUtils';

/**
 * A reusable handler function that proxies requests to the backend.
 *
 * @param request The incoming NextRequest object.
 * @param params An object containing the dynamic route parameters, in this case, the `slug`.
 */
async function proxyHandler(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    const { slug } = await params
    console.log('slug:', slug);

    // 1. Extract the access token from the request's cookies.
    const { accessToken } = extractTokensFromCookies(request);

    if (!accessToken) {
        // If there's no token, the user is not authenticated.
        return NextResponse.json(
            { message: 'Unauthorized: Missing access token.' },
            { status: 401 }
        );
    }

    try {
        // 2. Reconstruct the target URL for the backend microservice.
        // The `slug` parameter is an array of path segments from the URL.
        const destinationPath = slug.join('/');
        const destinationUrl = `${API_CONFIG.backendUrl}/${destinationPath}`;
        console.log('destinationUrl:', destinationUrl);

        // 3. Make the proxied request to the backend service using `fetch`.
        // The `NextRequest` object's headers and body can be passed through directly.
        const backendResponse = await fetch(destinationUrl, {
            method: request.method,
            headers: {
                // Pass through the original headers from the client.
                ...Object.fromEntries(request.headers),
                // Add the crucial Authorization header.
                'Authorization': `Bearer ${accessToken}`,
                // It's important to set the host header to the backend's host.
                'host': new URL(API_CONFIG.backendUrl).host,
            },
            // Pass through the body of the original request.
            body: request.body,
            // `duplex: 'half'` is required by Node.js's fetch implementation when a body is present.
            // @ts-ignore
            duplex: 'half',
        });

        console.log('backendResponse:', backendResponse);

        // 4. Return the response from the backend directly to the client.
        // This includes the status, headers, and body, and is highly efficient as it streams the data.
        return backendResponse;

    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// 5. Export the handler for all the HTTP methods you want to support.
// This allows this single route file to catch all methods without code duplication.
export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
export const PATCH = proxyHandler;
export const HEAD = proxyHandler;
export const OPTIONS = proxyHandler;
