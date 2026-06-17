// Blocker: prevent loading of known external resources that cause DNS/CSP errors
(function(){
  const forbidden = ['bff.prod.coingoback.com','gstatic.com','translate_http','page.js','coingoback.com'];

  const warn = (...args) => { try{ console.warn('[blocker]',...args); }catch(e){} };

  // Intercept fetch to stub responses for forbidden hosts
  try{
    const origFetch = window.fetch.bind(window);
    window.fetch = function(input, init){
      try{
        const url = typeof input === 'string' ? input : (input && input.url) || '';
        if(url && forbidden.some(f=>url.includes(f))){
          warn('Blocked fetch', url);
          const body = JSON.stringify({});
          return Promise.resolve(new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } }));
        }
      }catch(e){}
      return origFetch(input, init);
    };
  }catch(e){ warn('fetch override failed', e); }

  // Intercept XMLHttpRequest to short-circuit forbidden hosts
  try{
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url){
      try{ this._url = url; }catch(e){}
      return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body){
      try{
        if(this._url && forbidden.some(f=>this._url.includes(f))){
          warn('Blocked XHR', this._url);
          try{ this.readyState = 4; this.status = 200; this.response = '{}'; this.responseText = '{}'; }catch(e){}
          if(typeof this.onreadystatechange === 'function'){
            try{ this.onreadystatechange(); }catch(e){}
          }
          if(typeof this.onload === 'function'){
            try{ this.onload(); }catch(e){}
          }
          return;
        }
      }catch(e){}
      return origSend.apply(this, arguments);
    };
  }catch(e){ warn('XHR override failed', e); }

  // Prevent creation/insertion of obvious external scripts/links
  const origAppend = Element.prototype.appendChild;
  Element.prototype.appendChild = function(node){
    try{
      const src = node.src || node.href || (node.getAttribute && node.getAttribute('src')) || '';
      if(src && forbidden.some(f=>src.includes(f))){ warn('Blocked appendChild', src); return node; }
    }catch(e){}
    return origAppend.call(this,node);
  };

  const origInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(node, ref){
    try{
      const src = node.src || node.href || (node.getAttribute && node.getAttribute('src')) || '';
      if(src && forbidden.some(f=>src.includes(f))){ warn('Blocked insertBefore', src); return node; }
    }catch(e){}
    return origInsertBefore.call(this,node,ref);
  };

  const origCreate = Document.prototype.createElement;
  Document.prototype.createElement = function(tag){
    const el = origCreate.call(this, tag);
    try{
      if(tag && (tag.toLowerCase()==='script' || tag.toLowerCase()==='link')){
        const setAttr = el.setAttribute.bind(el);
        el.setAttribute = function(name, value){
          if((name==='src' || name==='href') && value && forbidden.some(f=>value.includes(f))){ warn('Blocked setAttribute', name, value); return; }
          return setAttr(name, value);
        };
      }
    }catch(e){}
    return el;
  };

})();
