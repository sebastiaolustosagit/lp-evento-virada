/**
 * Form Handler
 * - Captura UTMs, parâmetros de tracking e dados de ads
 * - Validação com intl-tel-input (lazy loaded) e Turnstile
 * - Repassa parâmetros no redirect (interno ou externo)
 */

// Parâmetros que devem ser capturados e repassados
const TRACKING_PARAMS = [
  // UTMs
  'utm_source',
  'utm_medium', 
  'utm_campaign',
  'utm_term',
  'utm_content',
  // Tracking adicional
  'src',
  'sck',
  // Ads
  'fbclid',
  'gclid',
  'ttclid',
  'msclkid'
];

// Armazena parâmetros da URL original
let originalParams = {};

// Estado do lazy loading do intl-tel-input
let intlTelInputLoaded = false;
let intlTelInputLoading = false;
let intlTelInputLoadPromise = null;

// URLs do intl-tel-input
const ITI_JS_URL = 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/intlTelInput.min.js';
const ITI_UTILS_URL = 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
  captureUrlParams();
  addPreconnectHints();
  initForms();
});

/**
 * Adiciona preconnect hints para o CDN (melhora performance sem bloquear)
 */
function addPreconnectHints() {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://cdn.jsdelivr.net';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

/**
 * Carrega o intl-tel-input sob demanda
 * @returns {Promise} Promessa que resolve quando carregado
 */
function loadIntlTelInput() {
  // Se já carregou, retorna imediatamente
  if (intlTelInputLoaded && window.intlTelInput) {
    return Promise.resolve();
  }
  
  // Se já está carregando, retorna a promessa existente
  if (intlTelInputLoading && intlTelInputLoadPromise) {
    return intlTelInputLoadPromise;
  }
  
  intlTelInputLoading = true;
  
  intlTelInputLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = ITI_JS_URL;
    script.async = true;
    
    script.onload = () => {
      intlTelInputLoaded = true;
      intlTelInputLoading = false;
      console.log('✅ intl-tel-input carregado sob demanda');
      resolve();
    };
    
    script.onerror = () => {
      intlTelInputLoading = false;
      console.warn('⚠️ Falha ao carregar intl-tel-input');
      reject(new Error('Falha ao carregar intl-tel-input'));
    };
    
    document.head.appendChild(script);
  });
  
  return intlTelInputLoadPromise;
}

/**
 * Captura todos os parâmetros da URL ao carregar a página
 */
function captureUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Captura parâmetros conhecidos
  TRACKING_PARAMS.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      originalParams[param] = value;
    }
  });

  // Captura qualquer outro parâmetro não listado
  urlParams.forEach((value, key) => {
    if (!originalParams[key]) {
      originalParams[key] = value;
    }
  });
}

/**
 * Constrói URL com parâmetros
 * @param {string} baseUrl - URL base
 * @param {object} extraParams - Parâmetros adicionais (name, email, phone para externos)
 * @returns {string} URL completa
 */
function buildUrlWithParams(baseUrl, extraParams = {}) {
  const url = new URL(baseUrl, window.location.origin);
  
  // Adiciona parâmetros originais
  Object.entries(originalParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  // Adiciona parâmetros extras (dados do lead para redirect externo)
  Object.entries(extraParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  
  return url.toString();
}

/**
 * Verifica se URL é externa
 */
function isExternalUrl(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  }
  return false;
}

function initForms() {
  const forms = document.querySelectorAll('[data-form]');
  forms.forEach(form => new FormHandler(form));
}

class FormHandler {
  constructor(form) {
    this.form = form;
    this.submitBtn = form.querySelector('button[type="submit"]');
    this.btnText = this.submitBtn?.querySelector('.btn-text');
    this.btnLoading = this.submitBtn?.querySelector('.btn-loading');
    this.feedback = form.querySelector('.form-feedback');
    this.phoneInput = form.querySelector('input[type="tel"]');
    this.iti = null;
    this.itiReady = false;

    this.init();
  }

  init() {
    // Lazy load intl-tel-input quando o usuário focar no campo de telefone
    if (this.phoneInput) {
      // Primeiro foco: carrega a biblioteca
      this.phoneInput.addEventListener('focus', () => this.initPhoneInput(), { once: true });
      
      // Também tenta carregar no mouseenter (hover) para antecipar
      this.phoneInput.addEventListener('mouseenter', () => this.initPhoneInput(), { once: true });
    }

    // Validação em tempo real do email
    const emailInput = this.form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener('blur', () => this.validateEmail(emailInput));
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
          this.validateEmail(emailInput);
        }
      });
    }

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Inicializa o intl-tel-input (lazy loaded)
   */
  async initPhoneInput() {
    // Se já está pronto, não faz nada
    if (this.itiReady) return;
    
    // Se já carregou globalmente, só inicializa
    if (window.intlTelInput) {
      this.setupIntlTelInput();
      return;
    }
    
    // Mostra loading visual no campo
    this.phoneInput.placeholder = 'Carregando...';
    this.phoneInput.style.opacity = '0.7';
    
    try {
      await loadIntlTelInput();
      this.setupIntlTelInput();
    } catch (error) {
      // Fallback: campo funciona como input normal
      console.warn('intl-tel-input não disponível, usando fallback');
      this.phoneInput.placeholder = 'Digite seu telefone com DDD';
      this.phoneInput.style.opacity = '1';
    }
  }

  /**
   * Configura o intl-tel-input após carregar
   */
  setupIntlTelInput() {
    if (!window.intlTelInput || this.itiReady) return;
    
    this.iti = window.intlTelInput(this.phoneInput, {
      initialCountry: 'br',
      preferredCountries: ['br', 'pt', 'us'],
      separateDialCode: true,
      loadUtilsOnInit: ITI_UTILS_URL,
      i18n: {
        searchPlaceholder: 'Buscar país',
        noResultsText: 'Nenhum resultado encontrado'
      }
    });

    // Restaura visual
    this.phoneInput.placeholder = '';
    this.phoneInput.style.opacity = '1';
    
    // Validação em tempo real
    this.phoneInput.addEventListener('blur', () => this.validatePhone());
    this.phoneInput.addEventListener('input', () => this.validatePhone());
    
    this.itiReady = true;
    console.log('✅ intl-tel-input inicializado');
  }

  validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
      return true;
    }
  }

  validatePhone() {
    if (!this.iti || !this.phoneInput.value.trim()) {
      this.phoneInput.classList.remove('error');
      this.phoneInput.removeAttribute('aria-invalid');
      return true;
    }
    
    if (!this.iti.isValidNumber()) {
      this.phoneInput.classList.add('error');
      this.phoneInput.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      this.phoneInput.classList.remove('error');
      this.phoneInput.removeAttribute('aria-invalid');
      return true;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Limpa erros anteriores
    this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    this.form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));

    // Validação de email
    const emailInput = this.form.querySelector('input[type="email"]');
    if (emailInput) {
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        this.showFeedback('E-mail inválido. Verifique o formato.', 'error');
        emailInput.classList.add('error');
        emailInput.setAttribute('aria-invalid', 'true');
        emailInput.focus();
        return;
      }
    }

    // Se intl-tel-input não carregou ainda, tenta carregar agora
    if (this.phoneInput && !this.itiReady) {
      try {
        await this.initPhoneInput();
      } catch (error) {
        // Continua sem validação avançada se falhar
      }
    }

    // Validação de telefone (se intl-tel-input disponível)
    if (this.iti && !this.iti.isValidNumber()) {
      this.showFeedback('Telefone inválido. Verifique o número.', 'error');
      this.phoneInput.classList.add('error');
      this.phoneInput.setAttribute('aria-invalid', 'true');
      this.phoneInput.focus();
      return;
    }

    // Coleta dados do formulário
    const formData = new FormData(this.form);
    
    // Dados do lead - usa intl-tel-input se disponível, senão valor bruto
    const leadData = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: this.iti ? this.iti.getNumber() : (formData.get('phone') || '')
    };

    // Dados completos para enviar ao webhook
    const data = {
      ...leadData,
      ...originalParams,
      turnstileToken: formData.get('cf-turnstile-response')
    };

    // Valida Turnstile
    if (!data.turnstileToken) {
      this.showFeedback('Complete a verificação de segurança.', 'error');
      return;
    }

    // Envia
    this.setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        this.handleSuccess(leadData);
      } else {
        const error = await response.json();
        this.showFeedback(error.message || 'Erro ao enviar. Tente novamente.', 'error');
      }
    } catch (err) {
      this.showFeedback('Erro de conexão. Verifique sua internet.', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  handleSuccess(leadData) {
    window.dispatchEvent(new CustomEvent('formSubmitSuccess', {
      detail: leadData
    }));

    const redirectUrl = this.form.dataset.redirect;
    
    if (redirectUrl) {
      if (isExternalUrl(redirectUrl)) {
        const finalUrl = buildUrlWithParams(redirectUrl, {
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone
        });
        window.location.href = finalUrl;
      } else {
        const finalUrl = buildUrlWithParams(redirectUrl);
        window.location.href = finalUrl;
      }
    } else {
      this.showFeedback('Enviado com sucesso!', 'success');
      this.form.reset();
      if (window.turnstile) {
        window.turnstile.reset();
      }
    }
  }

  setLoading(isLoading) {
    if (this.submitBtn) {
      this.submitBtn.disabled = isLoading;
    }
    if (this.btnText) {
      this.btnText.hidden = isLoading;
    }
    if (this.btnLoading) {
      this.btnLoading.hidden = !isLoading;
    }
  }

  showFeedback(message, type) {
    if (!this.feedback) return;
    
    this.feedback.textContent = message;
    this.feedback.className = `form-feedback ${type}`;
    this.feedback.hidden = false;

    if (type === 'success' && this.phoneInput) {
      this.phoneInput.classList.remove('error');
    }
  }
}
