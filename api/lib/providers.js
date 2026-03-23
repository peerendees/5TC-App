/**
 * Shared provider adapter for Textschmiede.
 * Supports: Anthropic (Claude), Google (Gemini), xAI (Grok)
 * Uses dynamic import() to only load the needed SDK per request.
 */

export async function callProvider({ provider, apiKey, model, systemPrompt, userPrompt, maxTokens = 8000, jsonMode = false }) {
  // google-free uses server-side key from env
  if (provider === 'google-free') {
    const serverKey = process.env.GEMINI_API_KEY;
    if (!serverKey) throw new Error('Gemini Free ist nicht konfiguriert. Bitte den Betreiber kontaktieren.');
    return await callGoogle({ apiKey: serverKey, model, systemPrompt, userPrompt, maxTokens, jsonMode });
  }

  if (!apiKey) throw new Error('API Key fehlt.');
  if (!model) throw new Error('Kein Modell ausgewählt.');

  try {
    switch (provider) {
      case 'anthropic':
        return await callAnthropic({ apiKey, model, systemPrompt, userPrompt, maxTokens });
      case 'google':
        return await callGoogle({ apiKey, model, systemPrompt, userPrompt, maxTokens, jsonMode });
      case 'xai':
        return await callGrok({ apiKey, model, systemPrompt, userPrompt, maxTokens, jsonMode });
      default:
        throw new Error(`Unbekannter Provider: ${provider}`);
    }
  } catch (error) {
    // Normalize and humanize error messages
    const raw = error?.message || error?.error?.message || String(error);
    const status = error?.status || error?.statusCode || error?.code;

    // Rate limit / quota exceeded
    if (status === 429 || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('quota') || raw.includes('rate')) {
      const providerName = provider === 'anthropic' ? 'Claude' : provider === 'google' ? 'Gemini' : 'Grok';
      throw Object.assign(new Error(
        `${providerName}: Anfragelimit erreicht. Bitte warte einen Moment oder wechsle zu einem anderen Modell.`
      ), { status: 429 });
    }
    // Invalid API key
    if (status === 401 || status === 403 || raw.includes('invalid') && raw.includes('key') || raw.includes('unauthorized')) {
      throw Object.assign(new Error(
        'Ungültiger API-Key. Bitte überprüfe den eingegebenen Schlüssel.'
      ), { status: 401 });
    }
    // Model not found
    if (status === 404 || raw.includes('not found') || raw.includes('does not exist')) {
      throw Object.assign(new Error(
        'Das gewählte Modell ist nicht verfügbar. Bitte wähle ein anderes Modell.'
      ), { status: 404 });
    }
    // Fallback: clean up JSON noise
    const cleaned = raw.replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();
    throw new Error(cleaned || 'Ein unbekannter Fehler ist aufgetreten.');
  }
}

// ── Anthropic (Claude) ──
async function callAnthropic({ apiKey, model, systemPrompt, userPrompt, maxTokens }) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }]
  });

  const content = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  return { content };
}

// ── Google (Gemini) ──
async function callGoogle({ apiKey, model, systemPrompt, userPrompt, maxTokens, jsonMode }) {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  const config = {
    systemInstruction: systemPrompt,
    maxOutputTokens: maxTokens
  };

  if (jsonMode) {
    config.responseMimeType = 'application/json';
  }

  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config
  });

  return { content: response.text };
}

// ── xAI (Grok) ──
async function callGrok({ apiKey, model, systemPrompt, userPrompt, maxTokens, jsonMode }) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.x.ai/v1'
  });

  const params = {
    model,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  };

  if (jsonMode) {
    params.response_format = { type: 'json_object' };
  }

  const response = await client.chat.completions.create(params);
  return { content: response.choices[0].message.content };
}
