/**
 * Netlify Function v2: Submit Form
 * Valida Turnstile e dispara webhook
 */

export default async function handler(request) {
  // Apenas POST
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Método não permitido' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const data = await request.json();
    const { turnstileToken, ...formData } = data;

    // 1. Valida Turnstile
    const turnstileValid = await validateTurnstile(turnstileToken);
    if (!turnstileValid) {
      return new Response(
        JSON.stringify({ message: 'Verificação de segurança falhou. Tente novamente.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Dispara webhook
    const webhookUrl = Netlify.env.get('WEBHOOK_URL');
    if (!webhookUrl) {
      console.error('WEBHOOK_URL não configurada');
      return new Response(
        JSON.stringify({ message: 'Erro de configuração do servidor' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: request.headers.get('referer') || 'direct'
      })
    });

    if (!webhookResponse.ok) {
      console.error('Webhook error:', await webhookResponse.text());
      return new Response(
        JSON.stringify({ message: 'Erro ao processar envio. Tente novamente.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Sucesso' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ message: 'Erro interno. Tente novamente.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function validateTurnstile(token) {
  if (!token) return false;

  const secret = Netlify.env.get('TURNSTILE_SECRET');
  if (!secret) {
    console.error('TURNSTILE_SECRET não configurada');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secret,
        response: token
      })
    });

    const result = await response.json();
    return result.success === true;

  } catch (error) {
    console.error('Turnstile validation error:', error);
    return false;
  }
}
