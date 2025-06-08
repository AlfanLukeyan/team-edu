export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { method, body, url } = req;
    const targetPath = url.replace('/api/proxy', '');
    const targetUrl = `http://20.2.83.17:5002${targetPath}`;

    try {
        const response = await fetch(targetUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
            },
            body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy request failed' });
    }
}