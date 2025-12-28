/**
 * Tracking - Google Tag Manager
 * 
 * Configuração:
 * 1. Substitua GTM-XXXXXXX pelo seu Container ID
 * 2. Descomente a inicialização do GTM
 * 
 * Eventos disparados automaticamente:
 * - page_view: ao carregar a página
 * - generate_lead: ao submeter formulário com sucesso
 */

// ========================================
// GTM CONFIGURATION
// ========================================

const GTM_ID = 'GTM-XXXXXXX'; // Substitua pelo seu Container ID

// Inicialização do GTM
// Descomente o bloco abaixo após configurar GTM_ID
/*
(function initGTM() {
  if (GTM_ID === 'GTM-XXXXXXX') {
    console.warn('⚠️ GTM não configurado. Configure GTM_ID em /js/tracking.js');
    return;
  }

  (function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',GTM_ID);

  console.log('✅ GTM inicializado:', GTM_ID);
})();
*/

// ========================================
// DATALAYER
// ========================================

window.dataLayer = window.dataLayer || [];

// ========================================
// EVENTOS AUTOMÁTICOS
// ========================================

// Page View - dispara ao carregar a página
window.dataLayer.push({
  'event': 'page_view',
  'page_title': document.title,
  'page_location': window.location.href,
  'page_path': window.location.pathname
});

// Generate Lead - dispara ao submeter formulário (vem de form.js)
window.addEventListener('formSubmitSuccess', (event) => {
  const { name, email, phone } = event.detail;
  
  // Separa nome e sobrenome
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  window.dataLayer.push({
    'event': 'generate_lead',
    'lead_data': {
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'phone': phone.replace(/\D/g, '') // Apenas dígitos
    }
  });
  
  console.log('✅ Evento generate_lead disparado');
});

// ========================================
// EVENTOS MANUAIS (usar conforme necessário)
// ========================================

/**
 * View Content - disparar quando usuário visualiza conteúdo importante
 * Exemplo: ao visualizar página de produto/oferta
 */
function trackViewContent(contentName, contentId = null) {
  window.dataLayer.push({
    'event': 'view_content',
    'content_name': contentName,
    'content_id': contentId
  });
  console.log('✅ Evento view_content disparado:', contentName);
}

/**
 * Click CTA - disparar em cliques importantes
 * Exemplo: botões de WhatsApp, compra, etc
 */
function trackClickCTA(ctaName, ctaLocation = null) {
  window.dataLayer.push({
    'event': 'click_cta',
    'cta_name': ctaName,
    'cta_location': ctaLocation
  });
  console.log('✅ Evento click_cta disparado:', ctaName);
}

/**
 * Scroll Depth - disparar quando usuário atinge pontos de scroll
 * Exemplo: 25%, 50%, 75%, 100%
 */
function trackScrollDepth(percentage) {
  window.dataLayer.push({
    'event': 'scroll_depth',
    'scroll_percentage': percentage
  });
}

// ========================================
// EXPORTAR FUNÇÕES
// ========================================

window.tracking = {
  trackViewContent,
  trackClickCTA,
  trackScrollDepth
};
