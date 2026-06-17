// Blocker: prevent loading of known external resources that cause DNS/CSP errors
(function(){
  const forbidden = ['bff.prod.coingoback.com','gstatic.com','translate_http','page.js','coingoback.com'];

  const warn = (...args) => { try{ console.warn('[blocker]',...args); }catch(e){} };

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
