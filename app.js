// STATE
var currentPage = 'ontology-overview';
var selectedObjectIdx = 1;
var selectedTableIdx = 1;

// HELPERS
function el(id) { return document.getElementById(id); }
function getObject(id) { return OBJECTS.find(function(o){return o.id===id;}); }

// SIDEBAR
function renderSidebar() {
  var nav = el('sidebar-nav');
  var html = '';
  NAV.forEach(function(section) {
    html += '<div class="pt-2 pb-1 px-2"><span class="nav-section-title">' + section.section + '</span></div>';
    section.items.forEach(function(item) {
      html += '<a class="nav-item flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-on-surface-variant hover:bg-surface-container-low transition-colors' + (item.id === currentPage ? ' active' : '') + '" data-page="' + item.id + '" onclick="navigateTo(\'' + item.id + '\')"><span class="material-symbols-outlined" style="font-size:18px;">' + item.icon + '</span><span>' + item.label + '</span></a>';
    });
  });
  nav.innerHTML = html;
}

// NAVIGATION
function navigateTo(pageId) {
  currentPage = pageId;
  document.querySelectorAll('.nav-item').forEach(function(n) {
    n.classList.toggle('active', n.dataset.page === pageId);
  });
  renderPage(pageId);
  el('main-content').scrollTop = 0;
}

function selectObject(objId) {
  for (var i = 0; i < OBJECTS.length; i++) {
    if (OBJECTS[i].id === objId) { selectedObjectIdx = i; break; }
  }
  navigateTo('ontology-model');
}

function selectTable(idx) {
  selectedTableIdx = parseInt(idx);
  if (currentPage === 'field-model') renderFieldModelContent();
}

function prevObject() {
  selectedObjectIdx = (selectedObjectIdx - 1 + OBJECTS.length) % OBJECTS.length;
  renderOntologyModelContent();
}
function nextObject() {
  selectedObjectIdx = (selectedObjectIdx + 1) % OBJECTS.length;
  renderOntologyModelContent();
}

// PAGE DISPATCHER
function renderPage(pageId) {
  var main = el('main-content');
  var fn = pageRenderers[pageId];
  if (fn) { main.innerHTML = fn(); }
  if (pageId === 'ontology-model') { renderOntologyModelContent(); }
  if (pageId === 'field-model') { renderFieldModelContent(); }
}

var pageRenderers = {};

// -- 本体总览 --
pageRenderers['ontology-overview'] = function() {
  var cards = '';
  OBJECTS.forEach(function(obj, i) {
    var bgColor = obj.id === 'IntercoEvent' ? 'bg-secondary-fixed' : 'bg-primary-fixed';
    var txtColor = obj.id === 'IntercoEvent' ? 'text-secondary' : 'text-primary';
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary-fixed hover:shadow-md transition-all cursor-pointer" onclick="selectObject(\'' + obj.id + '\')">' +
      '<div class="flex items-start gap-3 mb-3"><div class="w-10 h-10 rounded-lg ' + bgColor + ' flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined ' + txtColor + '" style="font-size:20px;">' + obj.icon + '</span></div>' +
      '<div><div class="text-xs text-on-surface-variant font-code">' + String(i+1).padStart(2,'0') + ' ' + obj.nameEn + '</div><div class="text-sm font-bold text-on-surface font-display">' + obj.name + '</div></div></div>' +
      '<p class="text-xs text-on-surface-variant mb-3">' + obj.desc + '</p>' +
      '<div class="flex items-center gap-3 text-xs"><span class="text-on-surface-variant">属性</span><span class="font-code text-primary">' + obj.properties.length + '</span><span class="text-on-surface-variant ml-2">关系</span><span class="font-code text-primary">' + obj.relations.length + '</span><span class="text-on-surface-variant ml-2">动作</span><span class="font-code text-primary">' + obj.actions.length + '</span></div>' +
      '<div class="flex flex-wrap gap-1 mt-2">' + obj.relations.slice(0,3).map(function(r){return '<span class="font-code text-xs bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">' + r.name + '</span>';}).join('') + '</div></div>';
  });
  var totalProps = OBJECTS.reduce(function(s,o){return s+o.properties.length;},0);
  var totalRels = OBJECTS.reduce(function(s,o){return s+o.relations.length;},0);
  var totalActs = OBJECTS.reduce(function(s,o){return s+o.actions.length;},0);
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><div class="max-w-6xl"><h1 class="text-2xl font-bold text-on-surface font-display">关联交易发票识别及SAP过账本体中心</h1><p class="text-sm text-on-surface-variant mt-1">用本体连接公司、发票、科目、凭证与 AI 推理层</p><div class="mt-3 p-3 bg-surface-container-low rounded-lg text-sm text-on-surface-variant"><span class="text-primary font-medium">核心理念：</span>本体管定义，大模型管推理。本体清晰定义对象/关系/行为/规则，大模型面对具体情境匹配场景、挑选规则、组装链路、推理计算。</div></div></div>' +
    '<div class="px-8 py-4"><div class="grid grid-cols-6 gap-3">' +
    '<div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">业务本体</div><div class="text-2xl font-bold text-primary font-display">' + OBJECTS.length + '</div></div>' +
    '<div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">属性</div><div class="text-2xl font-bold text-primary font-display">' + totalProps + '</div></div>' +
    '<div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">关系</div><div class="text-2xl font-bold text-primary font-display">' + totalRels + '</div></div>' +
    '<div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">动作</div><div class="text-2xl font-bold text-primary font-display">' + totalActs + '</div></div>' +
    '<div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">数据库表</div><div class="text-2xl font-bold text-primary font-display">' + DB_TABLES_DATA.length + '</div></div>' +
    '<div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">SWRL规则</div><div class="text-2xl font-bold text-secondary font-display">' + RULES_DATA.length + '</div></div></div></div>' +
    '<div class="px-8 pb-4"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><h2 class="text-sm font-bold text-on-surface mb-4">核心架构</h2><div class="flex flex-col items-center text-sm">' +
    '<div class="bg-primary text-on-primary px-6 py-2 rounded-lg font-medium">收到一张发票</div><div class="rel-line"></div>' +
    '<div class="bg-primary-container text-on-primary px-6 py-2 rounded-lg font-medium">发票识别 &amp; 结构化</div><div class="rel-line"></div>' +
    '<div class="bg-tertiary text-white px-6 py-2 rounded-lg font-medium">本体层 (Ontology)</div><div class="rel-line"></div>' +
    '<div class="flex gap-8"><div class="text-center"><div class="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-medium">Object</div><div class="text-xs text-on-surface-variant mt-1">Company / Invoice</div></div>' +
    '<div class="text-center"><div class="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-medium">Relation</div><div class="text-xs text-on-surface-variant mt-1">hasSeller / affiliatedWith</div></div>' +
    '<div class="text-center"><div class="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-medium">Action</div><div class="text-xs text-on-surface-variant mt-1">凭证生成 / 过账</div></div></div>' +
    '<div class="rel-line"></div><div class="bg-surface-container text-on-surface px-6 py-2 rounded-lg font-medium">数据库层</div><div class="text-xs text-on-surface-variant mt-1">invoices / accounting_documents</div><div class="rel-line"></div>' +
    '<div class="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-medium">大模型推理层</div><div class="flex gap-6 mt-2"><span class="text-xs bg-secondary-fixed text-secondary px-2 py-1 rounded font-code">场景匹配</span><span class="text-xs bg-secondary-fixed text-secondary px-2 py-1 rounded font-code">规则挑选</span><span class="text-xs bg-secondary-fixed text-secondary px-2 py-1 rounded font-code">链路组装</span><span class="text-xs bg-secondary-fixed text-secondary px-2 py-1 rounded font-code">逻辑推演</span></div>' +
    '<div class="rel-line"></div><div class="bg-error-container text-error px-6 py-2 rounded-lg font-medium">SHACL 校验 &rarr; SAP 过账</div></div></div></div>' +
    '<div class="px-8 pb-8"><div class="flex items-center justify-between mb-4"><h2 class="text-base font-bold text-on-surface font-display">核心本体</h2><span class="text-xs text-on-surface-variant">' + OBJECTS.length + ' Objects</span></div><div class="grid grid-cols-3 gap-4">' + cards + '</div></div>' +
    '<div class="px-8 pb-8"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><h2 class="text-sm font-bold text-on-surface mb-4">核心原则</h2><div class="grid grid-cols-2 gap-4 text-sm">' +
    '<div class="flex items-start gap-2"><span class="material-symbols-outlined text-primary" style="font-size:18px;">arrow_right</span><div><span class="font-code text-primary font-medium">Ontology &ne; Database</span> &mdash; 本体描述业务语义，数据库描述数据存储</div></div>' +
    '<div class="flex items-start gap-2"><span class="material-symbols-outlined text-primary" style="font-size:18px;">arrow_right</span><div><span class="font-code text-primary font-medium">Ontology &ne; Knowledge Graph</span> &mdash; 本体是企业业务语义层</div></div>' +
    '<div class="flex items-start gap-2"><span class="material-symbols-outlined text-primary" style="font-size:18px;">arrow_right</span><div><span class="font-code text-primary font-medium">Ontology &ne; Agent</span> &mdash; Agent 负责 "下一步做什么？"</div></div>' +
    '<div class="flex items-start gap-2"><span class="material-symbols-outlined text-primary" style="font-size:18px;">arrow_right</span><div><span class="font-code text-primary font-medium">本体管定义，大模型管推理</span> &mdash; 静态知识与动态推理分离</div></div>' +
    '</div></div></div></div>';
};

// -- 本体模型 --
pageRenderers['ontology-model'] = function() { return '<div id="ontology-model-page"></div>'; };

function renderOntologyModelContent() {
  var obj = OBJECTS[selectedObjectIdx];
  var page = el('ontology-model-page');
  if (!page) return;
  var selector = '';
  OBJECTS.forEach(function(o, i) {
    selector += '<button class="px-3 py-1.5 rounded text-xs font-medium transition-colors ' + (i === selectedObjectIdx ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high') + '" onclick="selectObject(\'' + o.id + '\')">' + o.nameEn + '</button>';
  });
  page.innerHTML =
    '<div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-4">' +
      '<div class="flex items-center gap-1 text-xs text-on-surface-variant mb-2">' +
        '<span class="cursor-pointer hover:text-primary" onclick="navigateTo(\'ontology-overview\')">本体中心</span>' +
        '<span class="material-symbols-outlined" style="font-size:14px;">chevron_right</span>' +
        '<span class="cursor-pointer hover:text-primary" onclick="navigateTo(\'ontology-overview\')">核心本体模型</span>' +
        '<span class="material-symbols-outlined" style="font-size:14px;">chevron_right</span>' +
        '<span class="text-primary font-medium">' + obj.nameEn + '</span>' +
      '</div>' +
      '<div class="flex items-center justify-between">' +
        '<div><h1 class="text-xl font-bold text-on-surface font-display">' + obj.name + '</h1>' +
        '<div class="flex items-center gap-3 mt-1"><span class="font-code text-xs bg-surface-container px-2 py-0.5 rounded text-primary">Object ID: ' + obj.code + '</span><span class="text-xs text-on-surface-variant">' + obj.desc + '</span></div></div>' +
        '<div class="flex gap-2"><button class="bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded text-xs transition-colors" onclick="prevObject()">&larr; 上一个</button><button class="bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-1.5 rounded text-xs transition-colors" onclick="nextObject()">下一个 &rarr;</button></div>' +
      '</div>' +
    '</div>' +
    '<div class="px-8 py-3 border-b border-outline-variant"><div class="flex flex-wrap gap-2">' + selector + '</div></div>' +
    '<div class="px-8 py-3"><div class="flex gap-1 bg-surface-container-lowest p-1 rounded-lg border border-outline-variant w-fit">' +
      '<button class="tab-btn active px-4 py-1.5 rounded text-xs font-medium" onclick="switchTab(\'om-properties\',this)">属性 (' + obj.properties.length + ')</button>' +
      '<button class="tab-btn px-4 py-1.5 rounded text-xs font-medium text-on-surface-variant hover:bg-surface-container-low" onclick="switchTab(\'om-relations\',this)">关系 (' + obj.relations.length + ')</button>' +
      '<button class="tab-btn px-4 py-1.5 rounded text-xs font-medium text-on-surface-variant hover:bg-surface-container-low" onclick="switchTab(\'om-actions\',this)">动作 (' + obj.actions.length + ')</button>' +
      '<button class="tab-btn px-4 py-1.5 rounded text-xs font-medium text-on-surface-variant hover:bg-surface-container-low" onclick="switchTab(\'om-usage\',this)">本体使用情况</button>' +
    '</div></div><div class="px-8 pb-8" id="om-tab-content"></div>';
  renderOmTab('om-properties');
}

function switchTab(tab, btn) {
  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); b.classList.add('text-on-surface-variant'); });
  btn.classList.add('active'); btn.classList.remove('text-on-surface-variant');
  renderOmTab(tab);
}

function renderOmTab(tab) {
  var obj = OBJECTS[selectedObjectIdx];
  var c = el('om-tab-content');
  if (!c) return;
  if (tab === 'om-properties') {
    var rows = '';
    obj.properties.forEach(function(p) {
      rows += '<tr class="hover:bg-surface-container-low/50"><td class="px-4 py-2 font-code text-xs text-primary">' + p.name + '</td><td class="px-4 py-2 text-xs"><span class="font-code bg-surface-container px-1.5 py-0.5 rounded">' + p.type + '</span></td><td class="px-4 py-2 text-xs">' + (p.required ? '<span class="bg-error-container text-error px-1.5 py-0.5 rounded">必填</span>' : '<span class="text-on-surface-variant">否</span>') + '</td><td class="px-4 py-2 text-xs text-on-surface-variant">' + p.source + '</td><td class="px-4 py-2 text-xs text-on-surface-variant">' + p.desc + '</td></tr>';
    });
    c.innerHTML = '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden"><table class="w-full text-sm"><thead><tr class="bg-surface-container-low border-b border-outline-variant"><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">属性名称</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">类型</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">必填</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">来源</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">说明</th></tr></thead><tbody class="divide-y divide-outline-variant">' + rows + '</tbody></table></div>';
  } else if (tab === 'om-relations') {
    var cards = '';
    obj.relations.forEach(function(r) {
      cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-center gap-3 mb-3"><div class="obj-node">' + obj.nameEn + '</div><div class="flex flex-col items-center"><span class="material-symbols-outlined text-primary" style="font-size:20px;">arrow_downward</span><span class="font-code text-xs text-primary">' + r.name + '</span></div><div class="obj-node" onclick="selectObject(\'' + r.target + '\')">' + r.target + '</div></div><div class="space-y-1 text-xs"><div class="flex justify-between"><span class="text-on-surface-variant">Cardinality:</span><span class="font-code text-primary">' + r.cardinality + '</span></div><div class="text-on-surface-variant mt-1">' + r.desc + '</div></div></div>';
    });
    c.innerHTML = cards ? '<div class="grid grid-cols-2 gap-4">' + cards + '</div>' : '<div class="text-sm text-on-surface-variant">无关系</div>';
  } else if (tab === 'om-actions') {
    var rows2 = '';
    obj.actions.forEach(function(a) {
      rows2 += '<tr class="hover:bg-surface-container-low/50"><td class="px-4 py-2 font-code text-xs text-primary">' + a.name + '</td><td class="px-4 py-2 text-xs"><span class="bg-surface-container px-1.5 py-0.5 rounded">' + a.type + '</span></td><td class="px-4 py-2 text-xs"><span class="bg-primary-fixed text-primary px-1.5 py-0.5 rounded">' + a.perm + '</span></td><td class="px-4 py-2 text-xs">' + (a.approval === '是' ? '<span class="bg-error-container text-error px-1.5 py-0.5 rounded">是</span>' : '<span class="bg-secondary-fixed text-secondary px-1.5 py-0.5 rounded">否</span>') + '</td></tr>';
    });
    c.innerHTML = '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden"><table class="w-full text-sm"><thead><tr class="bg-surface-container-low border-b border-outline-variant"><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">动作</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">类型</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">权限</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">审批</th></tr></thead><tbody class="divide-y divide-outline-variant">' + rows2 + '</tbody></table></div>';
  } else if (tab === 'om-usage') {
    var dbHtml = obj.dbTables.map(function(t){return '<div class="font-code text-xs bg-surface-container px-2 py-1 rounded">' + t + '</div>';}).join('');
    var skillHtml = obj.skills.map(function(s){return '<div class="flex items-center gap-2 text-sm"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span><span class="font-code text-xs">' + s + '</span></div>';}).join('');
    var mcpHtml = obj.mcp.length ? obj.mcp.map(function(m){return '<div class="flex items-center gap-2 text-sm"><span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span><span class="font-code text-xs">' + m + '</span></div>';}).join('') : '<div class="text-xs text-on-surface-variant">无</div>';
    c.innerHTML = '<div class="grid grid-cols-3 gap-4"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-primary" style="font-size:18px;">storage</span><h3 class="text-sm font-bold text-on-surface">数据库表</h3></div><div class="space-y-2">' + dbHtml + '</div></div><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-secondary" style="font-size:18px;">psychology</span><h3 class="text-sm font-bold text-on-surface">Agent Skills</h3></div><div class="space-y-2">' + (skillHtml||'<div class="text-xs text-on-surface-variant">无</div>') + '</div></div><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-tertiary" style="font-size:18px;">build</span><h3 class="text-sm font-bold text-on-surface">MCP Tools</h3></div><div class="space-y-2">' + mcpHtml + '</div></div></div>';
  }
}

// -- 关系模型 --
pageRenderers['relationship-model'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">关系模型</h1><p class="text-sm text-on-surface-variant mt-1">关联交易发票识别与过账的核心语义网络</p></div>' +
    '<div class="px-8 py-6 flex gap-6"><div class="flex-1">' +
    '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><h2 class="text-sm font-bold text-on-surface mb-4">语义关系图</h2><div class="flex flex-col items-center text-sm">' +
    '<div class="obj-node" onclick="selectObject(\'Company\')">Company<div class="text-xs text-on-surface-variant font-normal">公司</div></div><div class="rel-line"></div><div class="rel-label">affiliatedWith</div><div class="rel-line"></div>' +
    '<div class="obj-node" onclick="selectObject(\'Invoice\')">Invoice<div class="text-xs text-on-surface-variant font-normal">发票</div></div><div class="rel-line"></div><div class="rel-label">hasLineItem</div><div class="rel-line"></div>' +
    '<div class="obj-node" onclick="selectObject(\'InvoiceItem\')">InvoiceItem<div class="text-xs text-on-surface-variant font-normal">行项目</div></div><div class="rel-line"></div>' +
    '<div class="flex gap-12"><div class="flex flex-col items-center"><div class="rel-label">mapsToAccount</div><div class="rel-line"></div><div class="obj-node" onclick="selectObject(\'Account\')">Account<div class="text-xs text-on-surface-variant font-normal">科目</div></div></div>' +
    '<div class="flex flex-col items-center"><div class="rel-label">assignedCostCenter</div><div class="rel-line"></div><div class="obj-node" onclick="selectObject(\'CostCenter\')">CostCenter<div class="text-xs text-on-surface-variant font-normal">成本中心</div></div></div></div>' +
    '<div class="rel-line"></div><div class="flex gap-12"><div class="flex flex-col items-center"><div class="rel-label">basedOn</div><div class="rel-line"></div><div class="obj-node" onclick="selectObject(\'AccountingDocument\')">AccountingDocument<div class="text-xs text-on-surface-variant font-normal">凭证</div></div></div>' +
    '<div class="flex flex-col items-center"><div class="rel-label">partyA/partyB</div><div class="rel-line"></div><div class="obj-node" onclick="selectObject(\'Contract\')">Contract<div class="text-xs text-on-surface-variant font-normal">合同</div></div></div></div>' +
    '</div></div>' +
    '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mt-4"><h2 class="text-sm font-bold text-on-surface mb-4">关系路径树</h2><pre class="font-code text-xs text-on-surface bg-surface-container-low p-4 rounded-lg overflow-x-auto">Invoice\n|\n|-- hasSeller/hasBuyer/issuer/receiver\n|     v\n|   Company\n|\n|-- hasLineItem\n|     v\n|   InvoiceItem\n|     |\n|     |-- mapsToAccount --> Account\n|     `-- assignedCostCenter --> CostCenter\n|\n`-- basedOn (AccountingDocument <-- Invoice)\n      v\n    AccountingDocument\n      |\n      |-- derivedDoc --> AccountingDocument (镜像)\n      `-- postsCompanyCode --> Company</pre></div>' +
    '</div><div class="w-80 flex-shrink-0"><div class="sticky top-0 space-y-4">' +
    '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-on-surface mb-3">关系说明</h3><div class="space-y-3 text-sm">' +
    '<div><span class="font-code text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded">affiliatedWith</span><p class="text-xs text-on-surface-variant mt-2">公司A与公司B属于同一集团（对称关系）。</p></div><hr class="border-outline-variant">' +
    '<div><span class="font-code text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded">hasLineItem</span><p class="text-xs text-on-surface-variant mt-2">发票包含多个行项目。</p></div><hr class="border-outline-variant">' +
    '<div><span class="font-code text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded">derivedDoc</span><p class="text-xs text-on-surface-variant mt-2">公司B凭证派生公司A镜像凭证（借贷方向相反）。</p></div>' +
    '</div></div>' +
    '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-on-surface mb-3">全部关系 (13)</h3><div class="space-y-1.5 text-xs">' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">hasSeller</span><span class="text-on-surface-variant">Invoice &rarr; Company</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">hasBuyer</span><span class="text-on-surface-variant">Invoice &rarr; Company</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">issuer</span><span class="text-on-surface-variant">Invoice &rarr; Company</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">receiver</span><span class="text-on-surface-variant">Invoice &rarr; Company</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">affiliatedWith</span><span class="text-on-surface-variant">Company &rarr; Company</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">hasLineItem</span><span class="text-on-surface-variant">Invoice &rarr; InvoiceItem</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">basedOn</span><span class="text-on-surface-variant">AccountingDocument &rarr; Invoice</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">derivedDoc</span><span class="text-on-surface-variant">AccountingDocument &rarr; AccountingDocument</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">mapsToAccount</span><span class="text-on-surface-variant">InvoiceItem &rarr; Account</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">assignedCostCenter</span><span class="text-on-surface-variant">InvoiceItem &rarr; CostCenter</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">postsCompanyCode</span><span class="text-on-surface-variant">AccountingDocument &rarr; Company</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">partyA</span><span class="text-on-surface-variant">Contract &rarr; Company</span></div>' +
    '<div class="flex items-center gap-2"><span class="font-code text-primary">partyB</span><span class="text-on-surface-variant">Contract &rarr; Company</span></div>' +
    '</div></div></div></div></div>';
};

// -- 动作模型 --
pageRenderers['action-model'] = function() {
  var cards = '';
  ALL_ACTIONS_DATA.forEach(function(a) {
    var typeColors = {'写入类':'bg-primary-fixed text-primary','分析类':'bg-secondary-fixed text-secondary','查询类':'bg-surface-container-high text-on-surface','审批类':'bg-error-container text-error'};
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 hover:border-primary-fixed hover:shadow-md transition-all cursor-pointer"><div class="flex items-start justify-between mb-2"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-primary" style="font-size:18px;">bolt</span></div><div><div class="font-code text-sm font-medium text-on-surface">' + a.name + '</div><div class="text-xs text-on-surface-variant">Object: ' + a.object + '</div></div></div><span class="text-xs ' + (typeColors[a.type]||'') + ' px-2 py-0.5 rounded">' + a.type + '</span></div><div class="grid grid-cols-2 gap-2 mt-3 text-xs"><div><span class="text-on-surface-variant">权限:</span> <span class="font-code">' + a.perm + '</span></div><div><span class="text-on-surface-variant">审批:</span> ' + (a.approval ? '<span class="text-error">是</span>' : '<span class="text-secondary">否</span>') + '</div></div><div class="mt-2 text-xs text-on-surface-variant">' + a.desc + '</div></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">动作模型</h1><p class="text-sm text-on-surface-variant mt-1">本体不仅描述企业中"有什么"，还定义"可以做什么"</p></div>' +
    '<div class="px-8 py-3"><div class="flex gap-1 bg-surface-container rounded p-0.5 w-fit"><button class="px-3 py-1 rounded text-xs font-medium bg-primary text-on-primary">全部动作 (' + ALL_ACTIONS_DATA.length + ')</button></div></div>' +
    '<div class="px-8 pb-8 flex gap-6"><div class="flex-1 grid grid-cols-2 gap-3">' + cards + '</div>' +
    '<div class="w-72 flex-shrink-0"><div class="sticky top-0"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-on-surface mb-3">动作详情</h3><div class="space-y-3 text-sm"><div><div class="text-xs text-on-surface-variant mb-1">动作名称</div><div class="font-code text-sm text-primary font-medium">凭证生成</div></div><div><div class="text-xs text-on-surface-variant mb-1">绑定对象</div><div class="font-code text-sm">AccountingDocument</div></div><div><div class="text-xs text-on-surface-variant mb-1">输入</div><div class="font-code text-xs bg-surface-container px-2 py-1 rounded">Invoice</div></div><div><div class="text-xs text-on-surface-variant mb-1">输出</div><div class="font-code text-xs bg-secondary-fixed text-secondary px-2 py-1 rounded">AccountingDocument</div></div><div><div class="text-xs text-on-surface-variant mb-1">权限</div><span class="text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded">AI Agent</span></div></div></div>' +
    '<div class="bg-error-container border border-error/20 rounded-xl p-5 mt-4"><div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-error" style="font-size:18px;">gavel</span><h3 class="text-sm font-bold text-error">治理约束</h3></div><div class="text-xs text-on-surface space-y-2"><p><strong class="text-error">Action &ne; 自动执行</strong></p><p>对于 <span class="font-code">凭证过账</span>、<span class="font-code">交易确认</span>、<span class="font-code">内部抵消</span> 必须存在：</p><div class="flex flex-wrap gap-2 mt-1"><span class="bg-white text-error px-2 py-0.5 rounded font-code">Permission</span><span class="bg-white text-error px-2 py-0.5 rounded font-code">Approval</span><span class="bg-white text-error px-2 py-0.5 rounded font-code">Audit Log</span></div></div></div>' +
    '</div></div></div></div>';
};

// -- 规则模型 --
pageRenderers['rule-model'] = function() {
  var cards = '';
  RULES_DATA.forEach(function(r) {
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-start justify-between mb-2"><div><div class="font-code text-sm font-bold text-primary">' + r.id + '</div><div class="text-sm font-medium text-on-surface mt-1">' + r.name + '</div></div></div>' +
      '<div class="mt-2 p-3 bg-surface-container-low rounded-lg font-code text-xs text-on-surface break-all">' + r.swrl + '</div>' +
      '<div class="grid grid-cols-2 gap-3 mt-3 text-xs"><div><div class="text-on-surface-variant mb-1">输入</div><div class="flex flex-wrap gap-1">' + r.inputs.map(function(i){return '<span class="bg-surface-container px-2 py-0.5 rounded">' + i + '</span>';}).join('') + '</div></div><div><div class="text-on-surface-variant mb-1">输出</div><div class="flex flex-wrap gap-1">' + r.outputs.map(function(o){return '<span class="bg-secondary-fixed text-secondary px-2 py-0.5 rounded">' + o + '</span>';}).join('') + '</div></div></div>' +
      '<div class="mt-3 text-xs text-on-surface-variant">前置规则: ' + (r.prereq.length?r.prereq.join(', '):'无') + '</div></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">SWRL 规则模型</h1><p class="text-sm text-on-surface-variant mt-1">本体中的业务规则定义（税额推导/科目映射/关联方判定/双主体凭证）</p></div>' +
    '<div class="px-8 py-6 space-y-4">' + cards + '</div></div>';
};

// -- 数据库表 --
pageRenderers['db-tables'] = function() {
  var cards = '';
  DB_TABLES_DATA.forEach(function(t, i) {
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary-fixed hover:shadow-md transition-all cursor-pointer" onclick="navigateTo(\'field-model\'); selectTable(' + i + ')"><div class="flex items-start gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-secondary" style="font-size:20px;">table_rows</span></div><div><div class="text-xs text-on-surface-variant font-code">' + String(i+1).padStart(2,'0') + ' ' + t.object + '</div><div class="text-sm font-bold text-on-surface font-code">' + t.name + '</div></div></div><div class="text-xs text-on-surface-variant">' + t.fields.length + ' fields</div><div class="flex flex-wrap gap-1 mt-2">' + t.fields.slice(0,4).map(function(f){return '<span class="font-code text-xs bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">' + f.name + '</span>';}).join('') + (t.fields.length > 4 ? '<span class="text-xs text-on-surface-variant">...</span>' : '') + '</div></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">数据库模型</h1><p class="text-sm text-on-surface-variant mt-1">Ontology Object 如何落到实际数据表</p></div><div class="px-8 py-6"><div class="grid grid-cols-3 gap-4">' + cards + '</div></div></div>';
};

// -- 字段模型 --
pageRenderers['field-model'] = function() { return '<div id="field-model-page"></div>'; };

function renderFieldModelContent() {
  var page = el('field-model-page');
  if (!page) return;
  var t = DB_TABLES_DATA[selectedTableIdx];
  var options = '';
  DB_TABLES_DATA.forEach(function(tb, i) {
    options += '<option value="' + i + '"' + (i === selectedTableIdx ? ' selected' : '') + '>' + tb.name + ' (' + tb.object + ')</option>';
  });
  var rows = '';
  t.fields.forEach(function(f) {
    rows += '<tr class="hover:bg-surface-container-low/50"><td class="px-4 py-2 font-code text-xs text-primary">' + f.name + '</td><td class="px-4 py-2 text-xs"><span class="font-code bg-surface-container px-1.5 py-0.5 rounded">' + f.type + '</span></td><td class="px-4 py-2 text-xs">' + (f.required ? '<span class="bg-error-container text-error px-1.5 py-0.5 rounded">必填</span>' : '<span class="text-on-surface-variant">否</span>') + '</td><td class="px-4 py-2 text-xs">' + (f.semantic ? '<span class="font-code text-primary bg-primary-fixed px-1.5 py-0.5 rounded">' + f.semantic + '</span>' : '<span class="text-on-surface-variant">-</span>') + '</td><td class="px-4 py-2 text-xs text-on-surface-variant">' + f.source + '</td><td class="px-4 py-2 text-xs text-on-surface-variant">' + f.desc + '</td></tr>';
  });
  page.innerHTML = '<div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">字段模型</h1><p class="text-sm text-on-surface-variant mt-1">数据库表的字段定义与属性映射</p></div><div class="px-8 py-3 border-b border-outline-variant"><select class="bg-transparent text-sm font-code border border-outline-variant rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer" onchange="selectTable(this.value); renderFieldModelContent()">' + options + '</select></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden"><div class="px-5 py-3 border-b border-outline-variant flex items-center justify-between"><h2 class="text-sm font-bold text-on-surface font-code">' + t.name + '</h2><span class="text-xs text-on-surface-variant">' + t.fields.length + ' fields</span></div><table class="w-full text-sm"><thead><tr class="bg-surface-container-low border-b border-outline-variant"><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">字段名</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">数据类型</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">必填</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">语义属性</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">来源</th><th class="text-left px-4 py-2.5 font-medium text-on-surface-variant text-xs">说明</th></tr></thead><tbody class="divide-y divide-outline-variant">' + rows + '</tbody></table></div></div>';
}

// -- 本体-表映射 --
pageRenderers['ontology-mapping'] = function() {
  var html = '';
  OBJECTS.forEach(function(obj) {
    var tables = DB_TABLES_DATA.filter(function(t){return obj.dbTables.indexOf(t.name)>=0;});
    var mappingRows = '';
    tables.forEach(function(t) {
      var mapped = t.fields.filter(function(f){return f.semantic;});
      if (mapped.length > 0) {
        mapped.forEach(function(f) {
          mappingRows += '<div class="flex items-center gap-3 text-xs py-1"><span class="font-code text-primary w-40">' + obj.nameEn + '.' + f.semantic + '</span><span class="material-symbols-outlined text-outline" style="font-size:14px;">arrow_forward</span><span class="font-code text-secondary">' + t.name + '.' + f.name + '</span></div>';
        });
      }
    });
    html += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-center gap-4 mb-4"><div class="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-primary" style="font-size:20px;">' + obj.icon + '</span></div><div class="flex-1"><div class="text-sm font-bold text-on-surface font-display">' + obj.nameEn + ' <span class="text-on-surface-variant font-normal">&mdash; ' + obj.name + '</span></div><div class="text-xs text-on-surface-variant">' + obj.desc + '</div></div></div><div class="flex items-center gap-4"><div class="text-center"><div class="text-xs text-on-surface-variant mb-1">Ontology Object</div><div class="bg-primary-fixed text-primary px-4 py-2 rounded-lg font-code text-sm">' + obj.nameEn + '</div></div><span class="material-symbols-outlined text-primary" style="font-size:24px;">arrow_forward</span><div class="text-center"><div class="text-xs text-on-surface-variant mb-1">Database Tables</div><div class="flex flex-wrap gap-2">' + tables.map(function(t){return '<span class="bg-secondary-fixed text-secondary px-4 py-2 rounded-lg font-code text-sm">' + t.name + '</span>';}).join('') + '</div></div></div><div class="mt-4 pt-4 border-t border-outline-variant"><div class="text-xs text-on-surface-variant mb-2">字段映射</div>' + (mappingRows || '<div class="text-xs text-on-surface-variant">无直接语义映射</div>') + '</div></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">Ontology &rarr; Database Mapping</h1><p class="text-sm text-on-surface-variant mt-1">本体对象到数据库表的映射关系</p></div><div class="px-8 py-6 space-y-4">' + html + '</div></div>';
};

// -- 数据质量 --
pageRenderers['data-quality'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">数据质量</h1><p class="text-sm text-on-surface-variant mt-1">数据缺失时 Agent 必须停止推断的约束规则</p></div><div class="px-8 py-6"><div class="grid grid-cols-2 gap-4 mb-4"><div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">数据完整性</div><div class="text-2xl font-bold text-secondary font-display">93.1%</div></div><div class="kpi-card"><div class="text-xs text-on-surface-variant mb-1">关键字段缺失</div><div class="text-2xl font-bold text-error font-display">5</div></div></div><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h2 class="text-sm font-bold text-on-surface mb-4">数据质量规则</h2><div class="space-y-3"><div class="flex items-start gap-3 p-3 bg-error-container/30 rounded-lg"><span class="material-symbols-outlined text-error" style="font-size:18px;">block</span><div class="text-sm"><div class="font-medium text-on-surface">Invoice 缺少 tax_rate</div><div class="text-xs text-on-surface-variant mt-0.5">无法推导税额，阻断推理</div></div></div><div class="flex items-start gap-3 p-3 bg-error-container/30 rounded-lg"><span class="material-symbols-outlined text-error" style="font-size:18px;">block</span><div class="text-sm"><div class="font-medium text-on-surface">InvoiceItem 缺少 account_code</div><div class="text-xs text-on-surface-variant mt-0.5">科目映射失败，阻断过账</div></div></div><div class="flex items-start gap-3 p-3 bg-surface-container rounded-lg"><span class="material-symbols-outlined text-secondary" style="font-size:18px;">warning</span><div class="text-sm"><div class="font-medium text-on-surface">Invoice 缺少 currency</div><div class="text-xs text-on-surface-variant mt-0.5">币种不完整，影响金额换算</div></div></div></div></div></div></div>';
};

// -- 推理总览 --
pageRenderers['reasoning-overview'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">大模型推理层总览</h1><p class="text-sm text-on-surface-variant mt-1">本体管定义，大模型管推理：面对具体情境，匹配场景、挑选规则、组装链路、推理计算</p></div>' +
    '<div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><div class="flex flex-col items-center text-sm">' +
    '<div class="bg-surface-container-high text-on-surface px-5 py-2 rounded-lg font-medium">输入：具体业务情境（收到一张发票）</div><div class="rel-line"></div>' +
    '<div class="bg-primary text-on-primary px-5 py-2 rounded-lg">Step1 场景匹配</div><div class="rel-line"></div>' +
    '<div class="bg-primary-container text-on-primary px-5 py-2 rounded-lg">Step2 规则挑选</div><div class="rel-line"></div>' +
    '<div class="bg-tertiary text-white px-5 py-2 rounded-lg">Step3 链路组装</div><div class="rel-line"></div>' +
    '<div class="bg-tertiary-container text-white px-5 py-2 rounded-lg">Step4 逻辑推演</div><div class="rel-line"></div>' +
    '<div class="bg-secondary text-on-secondary px-5 py-2 rounded-lg">Step5 结论生成 (SAP BAPI 载荷)</div>' +
    '</div></div></div></div>';
};

// -- 场景匹配 --
pageRenderers['scenario-match'] = function() {
  var cards = '';
  SCENARIOS_DATA.forEach(function(s) {
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-start justify-between mb-2"><div><div class="font-code text-sm font-bold text-primary">' + s.id + '</div><div class="text-sm font-medium text-on-surface mt-1">' + s.name + '</div></div></div><p class="text-xs text-on-surface-variant mb-3">' + s.desc + '</p><div class="text-xs text-on-surface-variant mb-2">条件:</div><div class="flex flex-wrap gap-1 mb-3">' + s.conditions.map(function(c){return '<span class="bg-surface-container px-2 py-0.5 rounded">' + c + '</span>';}).join('') + '</div><div class="text-xs text-on-surface-variant mb-1">适用规则:</div><div class="flex flex-wrap gap-1">' + s.rules.map(function(r){return '<span class="bg-primary-fixed text-primary px-2 py-0.5 rounded font-code">' + r + '</span>';}).join('') + '</div></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">场景匹配</h1><p class="text-sm text-on-surface-variant mt-1">大模型根据输入情境匹配业务场景</p></div><div class="px-8 py-6 space-y-4">' + cards + '</div></div>';
};

// -- 规则挑选 --
pageRenderers['rule-select'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">规则挑选</h1><p class="text-sm text-on-surface-variant mt-1">大模型从本体规则库中挑选适用规则并分析依赖</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><p class="text-sm text-on-surface-variant">根据场景从本体查询相关SWRL规则，筛选适用子集，输出规则列表与参数。例如 SC001 适用 R001/R002/R003/R004，执行链 R001→R002→R003→R004。</p></div></div></div>';
};

// -- 链路组装 --
pageRenderers['chain-assemble'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">链路组装</h1><p class="text-sm text-on-surface-variant mt-1">大模型构建推理执行链 (DAG)</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><div class="flex flex-col items-center text-sm"><div class="bg-primary text-on-primary px-5 py-2 rounded-lg">Step1 R001 税额推导 → net=100, tax=6</div><div class="rel-line"></div><div class="bg-primary-container text-on-primary px-5 py-2 rounded-lg">Step2 R002 收票方映射 → 借费用100+进项6，贷应付106</div><div class="rel-line"></div><div class="bg-tertiary text-white px-5 py-2 rounded-lg">Step3 R003 开票方映射 → 借应收106，贷收入100+销项6</div><div class="rel-line"></div><div class="bg-secondary text-on-secondary px-5 py-2 rounded-lg">Step4 R004 借贷平衡校验 → true</div></div></div></div></div>';
};

// -- 逻辑推演 --
pageRenderers['reasoning-execute'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">逻辑推演</h1><p class="text-sm text-on-surface-variant mt-1">大模型执行推理链，逐步计算结果</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><p class="text-sm text-on-surface-variant">按推理链逐步执行规则：加载情境数据，执行规则，输出中间结果与最终分录。保留计算过程并标注异常。</p></div></div></div>';
};

// -- 结论生成 --
pageRenderers['conclusion-gen'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">结论生成</h1><p class="text-sm text-on-surface-variant mt-1">生成可执行的 SAP 过账载荷 (JSON-LD)</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><pre class="font-code text-xs bg-surface-container-low p-4 rounded-lg overflow-x-auto">{\n  "@context": "http://www.example.com/ontology/group-interco#",\n  "@type": "PostingPayload",\n  "invoice_ref": "INV202608040001",\n  "company_a_posting": { "company_code": "1000", "document_type": "销售", "line_items": [...] },\n  "company_b_posting": { "company_code": "2000", "document_type": "采购", "line_items": [...] },\n  "validation": { "balance_check": true, "related_party_check": true, "tax_calculation_check": true }\n}</pre></div></div></div>';
};

// -- Agent 总览 --
pageRenderers['agent-overview'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">关联交易 Agent</h1><p class="text-sm text-on-surface-variant mt-1">基于企业本体进行发票识别与SAP过账</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-6"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-on-primary" style="font-size:28px;">smart_toy</span></div><div><h2 class="text-lg font-bold text-on-surface font-display">Interco Invoice Agent</h2><p class="text-sm text-on-surface-variant mt-1">利用 Ontology 语义层理解公司、发票、科目与凭证关系，执行发票识别、科目映射、凭证生成与过账。</p></div></div><div class="grid grid-cols-3 gap-4 mt-6"><div><div class="text-xs text-on-surface-variant mb-2 font-medium">Skills (' + SKILLS_DATA.length + ')</div></div><div><div class="text-xs text-on-surface-variant mb-2 font-medium">Tools / MCP (' + MCP_DATA.length + ')</div></div><div><div class="text-xs text-on-surface-variant mb-2 font-medium">Ontology</div><div class="text-xs text-on-surface-variant">' + OBJECTS.length + ' Objects / ' + RULES_DATA.length + ' Rules</div></div></div></div></div></div>';
};

// -- Agent Skill --
pageRenderers['agent-skill'] = function() {
  var cards = '';
  SKILLS_DATA.forEach(function(s) {
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-start justify-between mb-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-secondary" style="font-size:20px;">' + s.icon + '</span></div><div><div class="text-sm font-bold text-on-surface font-display">' + s.name + '</div><div class="font-code text-xs text-secondary">' + s.code + '</div></div></div><span class="text-xs bg-secondary-fixed text-secondary px-2 py-1 rounded">Confidence: ' + s.confidence + '</span></div><p class="text-sm text-on-surface-variant mb-4">' + s.desc + '</p><div class="grid grid-cols-2 gap-4"><div><div class="text-xs text-on-surface-variant font-medium mb-2">Input</div><div class="space-y-1">' + s.inputs.map(function(i){return '<div class="font-code text-xs bg-surface-container px-2 py-1 rounded">' + i + '</div>';}).join('') + '</div></div><div><div class="text-xs text-on-surface-variant font-medium mb-2">Output</div><div class="space-y-1">' + s.outputs.map(function(o){return '<div class="font-code text-xs bg-secondary-fixed/50 text-secondary px-2 py-1 rounded">' + o + '</div>';}).join('') + '</div></div></div><div class="mt-4 pt-3 border-t border-outline-variant"><div class="text-xs text-on-surface-variant font-medium mb-1">使用本体对象</div><div class="flex flex-wrap gap-1">' + s.objects.map(function(o){return '<span class="font-code text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded">' + o + '</span>';}).join('') + '</div></div></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">Agent Skills</h1><p class="text-sm text-on-surface-variant mt-1">Skill 负责 "How should this analysis be performed?"</p></div><div class="px-8 py-6 space-y-4">' + cards + '</div></div>';
};

// -- Tool / MCP --
pageRenderers['agent-tool'] = function() {
  var cards = '';
  MCP_DATA.forEach(function(t) {
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="flex items-start gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center flex-shrink-0"><span class="material-symbols-outlined text-tertiary" style="font-size:20px;">' + t.icon + '</span></div><div><div class="text-sm font-bold text-on-surface font-display">' + t.name + '</div><div class="font-code text-xs text-tertiary">' + t.code + '</div></div></div><p class="text-sm text-on-surface-variant mb-3">' + t.desc + '</p><div class="mb-3"><div class="text-xs text-on-surface-variant font-medium mb-1">Actions</div><div class="flex flex-wrap gap-1">' + t.actions.map(function(a){return '<span class="font-code text-xs bg-surface-container px-2 py-0.5 rounded">' + a + '</span>';}).join('') + '</div></div><div><div class="text-xs text-on-surface-variant font-medium mb-1">访问对象</div><div class="flex flex-wrap gap-1">' + t.objects.map(function(o){return '<span class="font-code text-xs bg-primary-fixed text-primary px-2 py-0.5 rounded">' + o + '</span>';}).join('') + '</div></div></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">Tool / MCP</h1><p class="text-sm text-on-surface-variant mt-1">Agent 通过 MCP 工具访问企业数据</p></div><div class="px-8 py-6"><div class="grid grid-cols-2 gap-4">' + cards + '</div></div></div>';
};

// -- 推理调用链 --
pageRenderers['agent-callchain'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">Agent &rarr; Ontology &rarr; Skill 推理调用链</h1><div class="mt-3 p-3 bg-primary-fixed/30 rounded-lg text-sm"><span class="text-on-surface-variant">用户问题：</span><span class="font-medium text-primary">"收到一张关联交易发票，如何过账到SAP？"</span></div></div>' +
    '<div class="px-8 py-6 flex gap-6"><div class="flex-1 space-y-0">' +
    '<div class="flex gap-4"><div class="flex flex-col items-center"><div class="step-circle bg-primary text-on-primary">01</div><div class="step-connector"></div></div><div class="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-3"><div class="flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-primary" style="font-size:18px;">psychology</span><h3 class="text-sm font-bold text-on-surface">场景匹配</h3></div><div class="text-xs text-on-surface-variant">输出：SC001-标准关联交易开票（置信度0.98）</div></div></div>' +
    '<div class="flex gap-4"><div class="flex flex-col items-center"><div class="step-circle bg-primary text-on-primary">02</div><div class="step-connector"></div></div><div class="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-3"><div class="flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-primary" style="font-size:18px;">filter_list</span><h3 class="text-sm font-bold text-on-surface">规则挑选</h3></div><div class="text-xs text-on-surface-variant">输出：[R001税额推导, R002收票方映射, R003开票方映射, R004平衡校验]</div></div></div>' +
    '<div class="flex gap-4"><div class="flex flex-col items-center"><div class="step-circle bg-tertiary text-white">03</div><div class="step-connector"></div></div><div class="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-3"><div class="flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-tertiary" style="font-size:18px;">route</span><h3 class="text-sm font-bold text-on-surface">链路组装</h3></div><div class="text-xs text-on-surface-variant">输出：R001 → R002 → R003 → R004（串行执行）</div></div></div>' +
    '<div class="flex gap-4"><div class="flex flex-col items-center"><div class="step-circle bg-secondary text-on-secondary">04</div><div class="step-connector"></div></div><div class="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-3"><div class="flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-secondary" style="font-size:18px;">calculate</span><h3 class="text-sm font-bold text-on-surface">逻辑推演</h3></div><div class="text-xs text-on-surface-variant">Step1 net=100,tax=6；Step2 公司B分录；Step3 公司A分录；Step4 借贷平衡=true</div></div></div>' +
    '<div class="flex gap-4"><div class="flex flex-col items-center"><div class="step-circle bg-error text-white">05</div><div class="step-connector"></div></div><div class="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-3"><div class="flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-error" style="font-size:18px;">gavel</span><h3 class="text-sm font-bold text-on-surface">SHACL 校验</h3></div><div class="text-xs text-on-surface-variant">借贷平衡/关联方/双主体凭证校验通过</div></div></div>' +
    '<div class="flex gap-4"><div class="flex flex-col items-center"><div class="step-circle bg-primary text-on-primary">06</div></div><div class="flex-1 bg-primary-fixed/20 border border-primary/20 rounded-xl p-4"><div class="flex items-center gap-2 mb-2"><span class="material-symbols-outlined text-primary" style="font-size:18px;">description</span><h3 class="text-sm font-bold text-primary">结论生成</h3></div><div class="text-xs text-on-surface-variant">输出 SAP BAPI 载荷 (JSON-LD)，调用 BAPI 过账</div></div></div>' +
    '</div><div class="w-72 flex-shrink-0"><div class="sticky top-0"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-on-surface mb-3">调用链路</h3><div class="font-code text-xs bg-inverse-surface text-inverse-on-surface p-4 rounded-lg overflow-x-auto leading-relaxed"><span class="text-secondary-fixed-dim">Invoice Input</span><br>&rarr; <span class="text-primary-fixed-dim">Scenario Match</span><br>&rarr; <span class="text-primary-fixed-dim">Rule Select</span><br>&rarr; <span class="text-primary-fixed-dim">Chain Assemble</span><br>&rarr; <span class="text-secondary-fixed-dim">Reasoning Execute</span><br>&rarr; <span class="text-error-container">SHACL Validate</span><br>&rarr; <span class="text-primary-fixed-dim">Posting Payload</span></div></div></div></div></div></div>';
};

// -- 分析流程 --
pageRenderers['agent-flow'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">Agent 如何使用 Ontology</h1><p class="text-sm text-on-surface-variant mt-1">本体管定义，大模型管推理，SHACL管校验</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><div class="grid grid-cols-3 gap-4"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-primary">Ontology</h3><div class="text-xs text-on-surface-variant mt-2">对象/属性/关系/规则/行为定义</div></div><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-secondary">LLM Reasoning</h3><div class="text-xs text-on-surface-variant mt-2">场景匹配/规则挑选/链路组装/推演/结论</div></div><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-tertiary">SHACL</h3><div class="text-xs text-on-surface-variant mt-2">借贷平衡/关联方/双主体校验</div></div></div></div></div></div>';
};

// -- 案例：标准开票 --
pageRenderers['case-invoice'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">案例：标准关联交易开票</h1><p class="text-sm text-on-surface-variant mt-1">集团内公司A向公司B开具服务费发票</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-4"><h2 class="text-sm font-bold text-on-surface mb-3">输入发票</h2><div class="text-xs text-on-surface-variant space-y-1"><div>发票号: INV202608040001</div><div>开票方: 公司A (1000) / 收票方: 公司B (2000)</div><div>价税合计: 106.00 / 税率: 6%</div></div></div><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h2 class="text-sm font-bold text-on-surface mb-3">输出分录</h2><div class="grid grid-cols-2 gap-4 text-xs"><div class="bg-surface-container-low rounded p-3"><div class="font-medium mb-1">公司B (收票方)</div><div>借: 服务费 100.00</div><div>借: 进项税 6.00</div><div>贷: 应付 106.00</div></div><div class="bg-surface-container-low rounded p-3"><div class="font-medium mb-1">公司A (开票方)</div><div>借: 应收 106.00</div><div>贷: 服务收入 100.00</div><div>贷: 销项税 6.00</div></div></div></div></div></div>';
};

// -- 案例：退货冲销 --
pageRenderers['case-reversal'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">案例：关联交易退货冲销</h1><p class="text-sm text-on-surface-variant mt-1">已过账的关联交易发票需要冲销，生成红字凭证</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><p class="text-sm text-on-surface-variant">存在已过账的关联交易凭证，冲销原因为退货/作废，需生成红字凭证。适用规则 R005/R006。</p></div></div></div>';
};

// -- 案例：折扣处理 --
pageRenderers['case-discount'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">案例：关联交易折扣处理</h1><p class="text-sm text-on-surface-variant mt-1">关联交易涉及商业折扣，双方同步体现</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><p class="text-sm text-on-surface-variant">发票包含折扣行，折扣需要在双方同步体现。适用规则 R007/R008。</p></div></div></div>';
};

// -- 案例：完整工作流 --
pageRenderers['case-workflow'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">完整工作流示例</h1><p class="text-sm text-on-surface-variant mt-1">收到一张关联交易发票的端到端处理</p></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6"><ol class="list-decimal ml-5 space-y-2 text-sm text-on-surface-variant"><li>AI智能体接收发票：OCR识别票面信息、LLM抽取结构化数据、生成JSON-LD写入本体实例</li><li>大模型推理：查询本体上下文 → 场景匹配 → 规则挑选 → 链路组装 → 逻辑推演 → 结论生成</li><li>执行验证：SHACL校验 → 调用SAP BAPI过账 → 凭证号回写本体 → 审计轨迹记录</li></ol></div></div></div>';
};

// -- SHACL 校验 --
pageRenderers['shacl-validation'] = function() {
  var cards = '';
  SHACL_DATA.forEach(function(s) {
    cards += '<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><div class="font-code text-sm font-bold text-primary mb-1">' + s.name + '</div><div class="text-xs text-on-surface-variant mb-2">Target: ' + s.target + '</div><p class="text-sm text-on-surface-variant">' + s.desc + '</p></div>';
  });
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">SHACL 校验</h1><p class="text-sm text-on-surface-variant mt-1">执行层验证：借贷平衡/关联方/双主体凭证</p></div><div class="px-8 py-6 space-y-4">' + cards + '</div></div>';
};

// -- 技术选型 --
pageRenderers['tech-stack'] = function() {
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">技术选型建议</h1></div><div class="px-8 py-6"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><table class="w-full text-sm"><thead><tr class="border-b border-outline-variant"><th class="text-left px-3 py-2 text-xs text-on-surface-variant">层次</th><th class="text-left px-3 py-2 text-xs text-on-surface-variant">组件</th><th class="text-left px-3 py-2 text-xs text-on-surface-variant">建议产品</th></tr></thead><tbody class="text-xs"><tr><td class="px-3 py-2">本体定义层</td><td class="px-3 py-2">本体建模</td><td class="px-3 py-2">Protégé (OWL 2)</td></tr><tr><td class="px-3 py-2">本体定义层</td><td class="px-3 py-2">图存储</td><td class="px-3 py-2">GraphDB (RDF4J)</td></tr><tr><td class="px-3 py-2">本体定义层</td><td class="px-3 py-2">校验引擎</td><td class="px-3 py-2">SHACL</td></tr><tr><td class="px-3 py-2">大模型推理层</td><td class="px-3 py-2">LLM</td><td class="px-3 py-2">GPT-4/Claude/本地模型</td></tr><tr><td class="px-3 py-2">大模型推理层</td><td class="px-3 py-2">Prompt管理</td><td class="px-3 py-2">LangChain/LlamaIndex</td></tr><tr><td class="px-3 py-2">执行验证层</td><td class="px-3 py-2">集成</td><td class="px-3 py-2">SAP PO/CPI (BAPI)</td></tr><tr><td class="px-3 py-2">执行验证层</td><td class="px-3 py-2">事务</td><td class="px-3 py-2">两阶段提交</td></tr></tbody></table></div></div></div>';
};

// -- 设置 --
pageRenderers['settings'] = function() {
  var questions = ['1. 我们到底有哪些业务 Object？','2. Object 与 Database Table 有什么区别？','3. 哪些属性应该进入 Ontology？','4. 哪些关系是真正有业务意义的？','5. 哪些 Action 可以由 Agent 调用？','6. 哪些 Action 必须人工审批？','7. Agent 查询 Ontology 的路径是什么？','8. 哪些分析交给 Skill？','9. 哪些结论必须有 Evidence？','10. 哪些数据缺失时 Agent 必须停止推断？'];
  return '<div><div class="bg-surface-container-lowest border-b border-outline-variant px-8 py-6"><h1 class="text-xl font-bold text-on-surface font-display">设置</h1><p class="text-sm text-on-surface-variant mt-1">系统配置与偏好</p></div><div class="px-8 py-6"><div class="grid grid-cols-2 gap-4"><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-on-surface mb-3">原型信息</h3><div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-on-surface-variant">版本</span><span class="font-code">V1.0</span></div><div class="flex justify-between"><span class="text-on-surface-variant">日期</span><span class="font-code">2026.10</span></div><div class="flex justify-between"><span class="text-on-surface-variant">定位</span><span>Workshop Prototype</span></div><div class="flex justify-between"><span class="text-on-surface-variant">语言</span><span>中文</span></div></div></div><div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5"><h3 class="text-sm font-bold text-on-surface mb-3">讨论问题清单</h3><div class="space-y-1.5 text-xs text-on-surface-variant">' + questions.map(function(q){return '<div>' + q + '</div>';}).join('') + '</div></div></div></div></div>';
};

// INIT
renderSidebar();
renderPage('ontology-overview');
