var SketchPane=function(e){function t(t){for(var r,a,o=t[0],h=t[1],l=t[2],p=0,c=[];p<o.length;p++)a=o[p],s[a]&&c.push(s[a][0]),s[a]=0;for(r in h)Object.prototype.hasOwnProperty.call(h,r)&&(e[r]=h[r]);for(u&&u(t);c.length;)c.shift()();return n.push.apply(n,l||[]),i()}function i(){for(var e,t=0;t<n.length;t++){for(var i=n[t],r=!0,o=1;o<i.length;o++){var h=i[o];0!==s[h]&&(r=!1)}r&&(n.splice(t--,1),e=a(a.s=i[0]))}return e}var r={},s={1:0},n=[];function a(t){if(r[t])return r[t].exports;var i=r[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=r,a.d=function(e,t,i){a.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},a.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/dist";var o=window.webpackJsonpSketchPane=window.webpackJsonpSketchPane||[],h=o.push.bind(o);o.push=t,o=o.slice();for(var l=0;l<o.length;l++)t(o[l]);var u=h;return n.push([200,0]),i()}({199:function(e,t,i){const r=i(198),s=i(96),n=i(92),a=i(91),o=i(89);e.exports=class{constructor(){this.layers=[],this.layerMask=void 0,this.layerBackground=void 0,this.images={brush:{},grain:{}},this.isErasing=!1,this.erasableLayers=[],this.brushes=a,this.viewportRect=void 0,this.setup()}async load({brushImagePath:e}){await this.loadBrushTextures(e)}setup(){s.setup(),r.settings.FILTER_RESOLUTION=1,r.settings.PRECISION_FRAGMENT=r.PRECISION.HIGH,r.settings.MIPMAP_TEXTURES=!0,r.settings.WRAP_MODE=r.WRAP_MODES.REPEAT,r.utils.skipHello(),this.app=new r.Application({antialias:!1}),this.app.renderer.roundPixels=!1,this.brush=this.brushes.pencil,this.brushColor={r:0,g:0,b:0},this.brushSize=4,this.brushOpacity=.9,this.sketchpaneContainer=new r.Container,this.sketchpaneContainer.name="sketchpaneContainer",this.layerContainer=new r.Container,this.layerContainer.name="layerContainer",this.sketchpaneContainer.addChild(this.layerContainer),this.strokeContainer=new r.Container,this.strokeContainer.name="static",this.liveStrokeContainer=new r.Container,this.liveStrokeContainer.name="live",this.layerContainer.addChild(this.liveStrokeContainer),this.offscreenContainer=new r.Container,this.offscreenContainer.name="offscreen",this.offscreenContainer.renderable=!1,this.layerContainer.addChild(this.offscreenContainer),this.eraseMask=new r.Sprite,this.eraseMask.name="eraseMask",this.app.stage.addChild(this.sketchpaneContainer),this.sketchpaneContainer.scale.set(1),this.counter=0,this.strokeInput=[],this.strokePath=void 0,this.lastStaticIndex=0,this.strokeGrainOffset={x:0,y:0}}setImageSize(e,t){this.width=e,this.height=t,this.layerMask=(new r.Graphics).beginFill(0,1).drawRect(0,0,this.width,this.height).endFill(),this.layerMask.name="layerMask",this.layerContainer.mask=this.layerMask,this.sketchpaneContainer.addChild(this.layerMask),this.layerBackground=(new r.Graphics).beginFill(16777215).drawRect(0,0,this.width,this.height).endFill(),this.layerBackground.name="background",this.layerContainer.addChild(this.layerBackground),this.eraseMask.texture=r.RenderTexture.create(this.width,this.height),this.centerContainer()}newLayer(){let e=this.layers.length,t={index:e,name:`Layer ${e+1}`,sprite:new r.Sprite(r.RenderTexture.create(this.width,this.height))};return t.sprite.name=t.name,this.layerContainer.position.set(0,0),this.layerContainer.addChild(t.sprite),this.centerContainer(),this.layers[e]=t,this.layers[e]}newLayerFrom(e){this.renderToLayer(new r.Sprite.from(e),this.newLayer())}centerContainer(){this.sketchpaneContainer.pivot.set(this.width/2,this.height/2),this.sketchpaneContainer.position.set(Math.floor(this.app.renderer.width/2),Math.floor(this.app.renderer.height/2))}resize(e,t){this.app.renderer.resize(e,t);let i=(e/t>this.width/this.height?[this.width*t/this.height,t]:[e,this.height*e/this.width])[0]/this.width;this.sketchpaneContainer.scale.set(i),this.sketchpaneContainer.position.set(Math.floor(this.app.renderer.width/2),Math.floor(this.app.renderer.height/2)),this.viewportRect=this.app.view.getBoundingClientRect()}async loadBrushTextures(e){let t=[...new Set(Object.values(this.brushes).map(e=>e.settings.brushImage))],i=[...new Set(Object.values(this.brushes).map(e=>e.settings.grainImage))],s=[];for(let[n,a]of[[t,this.images.brush],[i,this.images.grain]])for(let t of n){let i=r.Sprite.fromImage(`${e}/${t}.png`);i.renderable=!1,a[t]=i;let n=i._texture.baseTexture;n.hasLoaded?s.push(Promise.resolve(i)):n.isLoading?s.push(new Promise((e,t)=>{n.on("loaded",t=>e(n)),n.on("error",e=>t(e))})):s.push(Promise.reject(new Error))}await Promise.all(s)}renderToLayer(e,t,i){this.app.renderer.render(e,t.sprite.texture,i)}stampStroke(e,t){this.renderToLayer(e,t,!1)}disposeContainer(e){for(let t of e.children)t.destroy({children:!0,texture:!1,baseTexture:!1});e.removeChildren()}addStrokeNode(e,t,i,s,n,a,h,l,u,p,c,d,m,g){let f=new r.Sprite.from(this.images.brush[c.settings.brushImage].texture),y=s-(1-l)*s*c.settings.pressureSize;y*=p/90*c.settings.tiltSize*3+1;let v,C=1-(1-l)*c.settings.pressureOpacity;C*=(1-p/90*c.settings.tiltOpacity)*n,v=c.settings.azimuth?u*Math.PI/180-this.sketchpaneContainer.rotation:0-this.sketchpaneContainer.rotation;let k=45*Math.PI/180,x=Math.abs(y*Math.sin(k))+Math.abs(y*Math.cos(k)),b=Math.ceil(x);a-=b/2,h-=b/2,f.x=Math.floor(a),f.y=Math.floor(h),f.width=b,f.height=b;let w=a-f.x,S=h-f.y,I=y/f.width,M=[w,S],_=[I,I],P=this.images.grain[c.settings.grainImage];this.offscreenContainer.addChild(P),this.offscreenContainer.getLocalBounds();let O=new o(P);O.filterArea=this.app.screen,O.uniforms.uRed=e,O.uniforms.uGreen=t,O.uniforms.uBlue=i,O.uniforms.uOpacity=C,O.uniforms.uRotation=v,O.uniforms.uBleed=Math.pow(1-l,1.6)*c.settings.pressureBleed,O.uniforms.uGrainScale=c.settings.scale,O.uniforms.uGrainRotation=c.settings.rotation,O.uniforms.u_x_offset=d*c.settings.movement,O.uniforms.u_y_offset=m*c.settings.movement,O.uniforms.u_offset_px=M,O.uniforms.u_node_scale=_,O.padding=1,f.filters=[O],g.addChild(f)}down(e){this.pointerDown=!0,this.strokeInput=[],this.strokePath=new s.Path,this.lastStaticIndex=0,this.lastSpacing=void 0,this.strokeGrainOffset=this.brush.settings.randomOffset?{x:Math.floor(100*Math.random()),y:Math.floor(100*Math.random())}:{x:0,y:0},e.target===this.app.view&&(this.addPointerEventAsPoint(e),this.isErasing?this.liveStrokeContainer.parent&&this.liveStrokeContainer.parent.removeChild(this.liveStrokeContainer):this.layerContainer.addChild(this.liveStrokeContainer),this.renderLive(),this.app.view.style.cursor="crosshair")}move(e){this.pointerDown&&(this.addPointerEventAsPoint(e),this.renderLive(),this.app.view.style.cursor="crosshair")}up(e){e.target===this.app.view&&this.pointerDown&&(this.addPointerEventAsPoint(e),this.layerContainer.addChild(this.liveStrokeContainer),this.renderLive(!0),this.disposeContainer(this.liveStrokeContainer),this.offscreenContainer.removeChildren()),this.pointerDown=!1,this.app.view.style.cursor="auto"}getInterpolatedStrokeInput(e,t){let i=[],r=[];for(let e=0;e<t.segments.length;e++)t.segments[e].location&&r.push(t.segments[e].location.offset);let s=0,a=Math.max(1,this.brushSize*this.brush.settings.spacing);null==this.lastSpacing&&(this.lastSpacing=a);let o=a-this.lastSpacing,h=0,l=t.length+-(this.lastSpacing+t.length);for(h=o;h<t.length;h+=a){let a=t.getPointAt(h);for(var u=s;u<r.length;u++)r[u]<h&&(s=u);let o=(h-r[s])/(r[s+1]-r[s]),p=n.lerp(e[s].pressure,e[s+1].pressure,o),c=n.lerp(e[s].tiltAngle,e[s+1].tiltAngle,o),d=n.lerp(e[s].tilt,e[s+1].tilt,o);i.push([this.isErasing?0:this.brushColor.r,this.isErasing?0:this.brushColor.g,this.isErasing?0:this.brushColor.b,this.brushSize,this.brushOpacity,a.x,a.y,p,c,d,this.brush,this.strokeGrainOffset.x,this.strokeGrainOffset.y]),l=h}return this.lastSpacing=t.length-l,i}renderStroke(e,t,i){let r=this.getInterpolatedStrokeInput(e,t);for(let e of r)this.addStrokeNode(...e,i)}addPointerEventAsPoint(e){let t=this.sketchpaneContainer.toLocal({x:e.x-this.viewportRect.x,y:e.y-this.viewportRect.y},this.app.stage),i="mouse"===e.pointerType?e.pressure>0?.5:0:e.pressure,r="mouse"===e.pointerType?{angle:-90,tilt:37}:n.calcTiltAngle(e.tiltX,e.tiltY);this.strokeInput.push({x:t.x,y:t.y,pressure:i,tiltAngle:r.angle,tilt:r.tilt}),this.strokeInput=this.strokeInput.slice(Math.max(0,this.lastStaticIndex-2),this.strokeInput.length),this.strokePath=new s.Path(this.strokeInput),this.strokePath.smooth({type:"catmull-rom",factor:.5})}renderLive(e=!1){let t=this.strokeInput.length;if(e){let e=this.strokeInput.length-1,t=this.lastStaticIndex,i=e;return i+1-t<=1?void console.warn("1 or fewer points remaining"):(this.renderStroke(this.strokeInput.slice(t,i+1),new s.Path(this.strokePath.segments.slice(t,i+1)),this.strokeContainer),this.isErasing?this.updateMask(this.strokeContainer,!0):this.stampStroke(this.strokeContainer,this.layers[this.layer]),this.disposeContainer(this.strokeContainer),void this.offscreenContainer.removeChildren())}if(t>=3){let e=this.strokeInput.length-1,t=e-2,i=e-1;this.renderStroke(this.strokeInput.slice(t,i+1),new s.Path(this.strokePath.segments.slice(t,i+1)),this.strokeContainer),this.isErasing?this.updateMask(this.strokeContainer):this.stampStroke(this.strokeContainer,this.layers[this.layer]),this.disposeContainer(this.strokeContainer),this.offscreenContainer.removeChildren(),this.lastStaticIndex=i}if(t>=2){this.disposeContainer(this.liveStrokeContainer);let e=this.strokeInput.length-1,t=e-1,i=e;if(this.isErasing);else{let e=this.lastSpacing;this.renderStroke(this.strokeInput.slice(t,i+1),new s.Path(this.strokePath.segments.slice(t,i+1)),this.liveStrokeContainer),this.lastSpacing=e}}}updateMask(e,t=!1){if(this.erasableLayers.length||(this.erasableLayers=[this.layers[this.layer]]),!this.erasableLayers.sort((e,t)=>t.index-e.index)[0].sprite.mask){this.layerContainer.addChild(this.eraseMask);let e=(new r.Graphics).beginFill(16711680,1).drawRect(0,0,this.width,this.height).endFill();this.app.renderer.render(e,this.eraseMask.texture,!0);for(let e of this.erasableLayers)e.sprite.mask=this.eraseMask}if(this.app.renderer.render(e,this.eraseMask.texture,!1),t){for(let e of this.erasableLayers)e.sprite.mask=this.eraseMask,this.stampMask(e.sprite),e.sprite.mask=null;this.layerContainer.removeChild(this.eraseMask)}}stampMask(e){let t=r.RenderTexture.create(this.width,this.height);this.app.renderer.render(e,t,!0,e.transform.worldTransform.invert(),!0);let i=new r.Sprite.from(t);this.app.renderer.render(i,e.texture,!0),i.destroy({texture:!0,baseTexture:!1})}saveLayer(e){return e=null==e?this.layer:e,this.app.renderer.plugins.extract.image(this.layers[e].sprite)}clearLayer(e){e||(e=this.layer),this.renderToLayer(this.strokeContainer,this.layers[e],!0)}selectLayer(e){if(this.pointerDown)return;let t=this.layers[e].sprite;this.layerContainer.setChildIndex(this.layerBackground,0);let i=1;for(let e of this.layers)this.layerContainer.setChildIndex(e.sprite,i),e.sprite===t&&(this.layer=i-1,this.layerContainer.setChildIndex(this.offscreenContainer,++i),this.layerContainer.setChildIndex(this.liveStrokeContainer,++i)),i++}getIsErasing(){return this.isErasing}setIsErasing(e){this.pointerDown||(this.isErasing=e)}setErasableLayers(e){this.erasableLayers=[];for(let t of this.layers)e.includes(t.index)&&this.erasableLayers.push(t)}getErasableLayers(e){return this.erasableLayers.map(e=>e.index).sort((e,t)=>e-t)}getDOMElement(){return this.app.view}}},200:function(e,t,i){const r=i(199);e.exports=r},88:function(e,t){e.exports="precision highp float;\n\n// brush texture\nuniform sampler2D uSampler;\n// grain texture\nuniform sampler2D u_grainTex;\n\n// color\nuniform float uRed;\nuniform float uGreen;\nuniform float uBlue;\n\n// node\nuniform float uOpacity;\nuniform float uRotation;\n\n// grain\nuniform float uBleed;\nuniform float uGrainRotation;\nuniform float uGrainScale;\nuniform float u_x_offset;\nuniform float u_y_offset;\n\n// brush\nuniform vec2 u_offset_px;\nuniform vec2 u_node_scale;\n\n// from vert shader\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\n// from PIXI\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 filterClamp;\nuniform mat3 filterMatrix;\n\nvec2 rotate (vec2 v, float a) {\n\tfloat s = sin(a);\n\tfloat c = cos(a);\n\tmat2 m = mat2(c, -s, s, c);\n\treturn m * v;\n}\n\nvec2 scale (vec2 v, vec2 _scale) {\n\tmat2 m = mat2(_scale.x, 0.0, 0.0, _scale.y);\n\treturn m * v;\n}\n\nvec2 mapCoord (vec2 coord) {\n  coord *= filterArea.xy;\n  return coord;\n}\n\nvec2 unmapCoord (vec2 coord) {\n  coord /= filterArea.xy;\n  return coord;\n}\n\nvoid main(void) {\n  // user's intended brush color\n  vec3 color = vec3(uRed, uGreen, uBlue);\n\n\t//\n\t//\n\t// brush\n\t//\n  vec2 coord = mapCoord(vTextureCoord) / dimensions;\n\n\t// translate by the subpixel\n\tcoord -= u_offset_px / dimensions;\n\n  // move space from the center to the vec2(0.0)\n  coord -= vec2(0.5);\n\n  // rotate the space\n  coord = rotate(coord, uRotation);\n\n  // move it back to the original place\n  coord += vec2(0.5);\n\n\t// scale\n\tcoord -= 0.5;\n  coord *= 1.0 / u_node_scale;\n\tcoord += 0.5;\n\n\tcoord = unmapCoord(coord * dimensions);\n\n\t//\n\t//\n\t// grain\n\t//\n\tfloat grain_scale = 1024.00 * uGrainScale;\n\n\tvec2 fcoord = vFilterCoord;\n\tfcoord -= (vec2(u_x_offset, u_y_offset) / grain_scale);\n\tvec4 grainSample = texture2D(u_grainTex, fract(fcoord));\n\n\t//\n\t//\n\t// set gl_FragColor\n\t//\n\t// clamp (via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem)\n\tif (coord == clamp(coord, filterClamp.xy, filterClamp.zw)) {\n\t\t// read a sample from the texture\n\t  vec4 brushSample = texture2D(uSampler, coord);\n\t  // tint\n\t  gl_FragColor = vec4(color, 1.);\n\t\tgl_FragColor *= ((brushSample.r * grainSample.r * (1.0+uBleed))- uBleed ) * (1.0+ uBleed) * uOpacity;\n\n\t\t// gl_FragColor = grain;\n\t} else {\n\t\t// don't draw\n\t\tgl_FragColor = vec4(0.);\n\t}\n}\n"},89:function(e,t,i){const r=i(88);e.exports=class extends PIXI.Filter{constructor(e){super(null,r,{uRed:{type:"1f",value:.5},uGreen:{type:"1f",value:.5},uBlue:{type:"1f",value:.5},uOpacity:{type:"1f",value:1},uRotation:{type:"1f",value:0},uBleed:{type:"1f",value:0},uGrainRotation:{type:"1f",value:0},uGrainScale:{type:"1f",value:1},u_x_offset:{type:"1f",value:0},u_y_offset:{type:"1f",value:0},u_offset_px:{type:"vec2"},u_node_scale:{type:"vec2",value:[0,0]},u_grainTex:{type:"sampler2D",value:""},dimensions:{type:"vec2",value:[0,0]},filterMatrix:{type:"mat3"}}),this.padding=0,this.blendMode=PIXI.BLEND_MODES.NORMAL,this.autoFit=!1;let t=new PIXI.Matrix;e.renderable=!1,this.grainSprite=e,this.grainMatrix=t,this.uniforms.u_grainTex=e._texture,this.uniforms.filterMatrix=t}apply(e,t,i,r){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,this.uniforms.filterMatrix=e.calculateSpriteMatrix(this.grainMatrix,this.grainSprite),e.applyFilter(this,t,i,r)}}},90:function(e,t){const i={name:"default",blendMode:"normal",sizeLimitMax:1,sizeLimitMin:0,opacityMax:1,opacityMin:0,spacing:0,brushImage:"brushcharcoal",brushRotation:0,brushImageInvert:!1,grainImage:"graingrid",grainRotation:0,grainImageInvert:!1,movement:1,scale:1,zoom:0,rotation:0,randomOffset:!0,azimuth:!0,pressureOpacity:1,pressureSize:1,pressureBleed:0,tiltAngle:0,tiltOpacity:1,tiltGradiation:0,tiltSize:1,orientToScreen:!0};e.exports=class{constructor(e){this.settings=Object.assign({},i,e)}}},91:function(e,t,i){const r=i(90);e.exports=[{name:"default",descriptiveName:"Default Brush"},{name:"pencil",descriptiveName:"Pencil",brushImage:"brushmediumoval",grainImage:"grainpaper4",pressureOpacity:.7,pressureSize:.8,scale:.8,tiltOpacity:.3,tiltSize:1,movement:1,pressureBleed:1,spacing:.05},{name:"brushpen",descriptiveName:"Brush Pen Bobby",brushImage:"teardrop",grainImage:"hardwood",pressureOpacity:.3,scale:.5,movement:.7,sizecale:.6},{name:"pen",descriptiveName:"Pen",brushImage:"brushhard",grainImage:"grainpaper2",pressureOpacity:.5,pressureSize:.8,sizecale:.8,pressureBleed:2,tiltSize:3.8,tiltOpacity:1,movement:.9,spacing:.05},{name:"copic",descriptiveName:"Copic",brushImage:"brushmediumovalhallow",grainImage:"grainpaper2",pressureOpacity:.2,pressureSize:.9,tiltSize:1,tiltOpacity:1,movement:.5},{name:"charcoal",descriptiveName:"Charcoal",brushImage:"brushcharcoal",grainImage:"graincanvas",pressureOpacity:.4,pressureSize:.8,sizecale:1,tiltOpacity:.4,tiltSize:1,spacing:.05,pressureBleed:.5},{name:"watercolor",descriptiveName:"Watercolor",brushImage:"brushwatercolor",grainImage:"grainwatercolor1",pressureOpacity:1,pressureSize:1,sizecale:1,tiltOpacity:1,tiltSize:1,spacing:.05,pressureBleed:.5},{name:"clouds",descriptiveName:"Clouds",brushImage:"brushclouds",grainImage:"grainclouds",pressureOpacity:1,pressureSize:1,sizecale:1,tiltOpacity:1,tiltSize:1,spacing:.1,movement:1},{name:"slate",descriptiveName:"Clouds",brushImage:"flatbrush",grainImage:"grainslate",pressureOpacity:1,pressureSize:1,sizecale:1,tiltOpacity:1,tiltSize:1,movement:1,spacing:.05}].reduce((e,t)=>(e[t.name]=new r(t),e),{})},92:function(e,t){e.exports=class{static rotatePoint(e,t,i,r,s){return{x:Math.cos(s)*(e-i)-Math.sin(s)*(t-r)+i,y:Math.sin(s)*(e-i)+Math.cos(s)*(t-r)+r}}static calcTiltAngle(e,t){return{angle:Math.atan2(e,t)*(180/Math.PI),tilt:Math.max(Math.abs(e),Math.abs(t))}}static lerp(e,t,i){return e+(t-e)*(i=(i=i<0?0:i)>1?1:i)}}},93:function(e,t){},95:function(e,t){}});