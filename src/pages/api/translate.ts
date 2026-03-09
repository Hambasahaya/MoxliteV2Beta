import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let q: string | undefined;
  let lang: string | undefined;

  if (req.method === 'POST') {
    try {
      const body = JSON.parse(req.body);
      q = body.q;
      lang = body.lang;
    } catch {
      // ignore
    }
  } else {
    // fall back to query params for backward compatibility
    q = typeof req.query.q === 'string' ? req.query.q : undefined;
    lang = typeof req.query.lang === 'string' ? req.query.lang : undefined;
  }

  if (!q || !lang) {
    res.status(400).json({ error: 'Missing q or lang parameters' });
    return;
  }

  const text = q.trim();
  const targetLanguage = lang === 'id' ? 'id' : 'en';

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `en|${targetLanguage}`,
    });

    const apiRes = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`, {
      // Node fetch does not need CORS headers
      headers: {
        'Cache-Control': 'max-age=3600',
      },
    });

    if (!apiRes.ok) {
      const body = await apiRes.text();
      res.status(apiRes.status).json({ error: 'Upstream translation error', body });
      return;
    }

    const data = await apiRes.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      res.status(200).json({ translatedText: data.responseData.translatedText });
    } else {
      res.status(502).json({ error: 'Translation service returned invalid data', data });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Translation proxy failure' });
  }
}
