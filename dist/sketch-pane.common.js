module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("pixi.js");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("paper");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "paper"
var external_paper_ = __webpack_require__(1);

// EXTERNAL MODULE: external "pixi.js"
var external_pixi_js_ = __webpack_require__(0);

// CONCATENATED MODULE: ./src/ts/sketch-pane/util.ts
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.rotatePoint = function (pointX, pointY, originX, originY, angle) {
        return {
            x: Math.cos(angle) * (pointX - originX) -
                Math.sin(angle) * (pointY - originY) +
                originX,
            y: Math.sin(angle) * (pointX - originX) +
                Math.cos(angle) * (pointY - originY) +
                originY
        };
    };
    Util.calcTiltAngle = function (tiltX, tiltY) {
        var angle = Math.atan2(tiltY, tiltX) * (180 / Math.PI);
        var tilt = Math.max(Math.abs(tiltX), Math.abs(tiltY));
        return { angle: angle, tilt: tilt };
    };
    Util.lerp = function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    };
    // via https://github.com/pixijs/pixi.js/pull/4632/files#diff-e38c1de4b0f48ed1293bccc38b07e6c1R123
    // AKA un-premultiply
    Util.arrayPostDivide = function (pixels) {
        for (var i = 0; i < pixels.length; i += 4) {
            var alpha = pixels[i + 3];
            if (alpha) {
                pixels[i] = Math.round(Math.min(pixels[i] * 255.0 / alpha, 255.0));
                pixels[i + 1] = Math.round(Math.min(pixels[i + 1] * 255.0 / alpha, 255.0));
                pixels[i + 2] = Math.round(Math.min(pixels[i + 2] * 255.0 / alpha, 255.0));
            }
        }
    };
    Util.pixelsToCanvas = function (pixels, width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d');
        var canvasData = context.createImageData(width, height);
        canvasData.data.set(pixels);
        context.putImageData(canvasData, 0, 0);
        return canvas;
    };
    Util.dataURLToFileContents = function (dataURL) {
        return dataURL.replace(/^data:image\/\w+;base64,/, '');
    };
    return Util;
}());
/* harmony default export */ var util = (Util);

// CONCATENATED MODULE: ./src/ts/sketch-pane/brush/brush.ts
var BrushSettings = /** @class */ (function () {
    function BrushSettings(obj) {
        // GENERAL
        this.name = 'default'; // Name of the brush preset
        this.blendMode = 'normal'; // Blend mode of the stroke (not node) on the layer
        this.sizeLimitMax = 1; // UI limit for size
        this.sizeLimitMin = 0;
        this.opacityMax = 1; // UI limit for opacity
        this.opacityMin = 0;
        // STROKE
        this.spacing = 0; // spacing in between brush nodes
        // TEXTURES
        this.brushImage = 'brushcharcoal'; // Name alias of brush alpha
        this.brushRotation = 0; // rotation of texture (0,90,180,270)
        this.brushImageInvert = false; // invert texture
        this.grainImage = 'graingrid'; // Name alias of brush grain texture
        this.grainRotation = 0;
        this.grainImageInvert = false;
        // GRAIN
        this.movement = 1; // % the grain is offset as the brush moves. 0 static. 100 rolling. 100 is like paper
        this.scale = 1; // Scale of the grain texture. 0 super tiny, 100 super large
        this.zoom = 0; // % Scale of the grain texture by the brush size.
        this.rotation = 0; // % Rotation grain rotation is multiplied by rotation
        this.randomOffset = true; // on strokeDown, choose a random grain offset
        // STYLUS
        this.azimuth = true;
        this.pressureOpacity = 1; // % Pressure affects opacity
        this.pressureSize = 1; // % Pressure affects size
        this.pressureBleed = 0; //
        this.tiltAngle = 0; // % the title angle affects the below params
        this.tiltOpacity = 1; // % opacity altered by the tilt
        this.tiltGradiation = 0; // % opacity is gradiated by the tilt
        this.tiltSize = 1; // % size altered by the tilt
        this.orientToScreen = true; // orient the brush shape to the rotation of the screen
        if (obj) {
            Object.assign(this, obj);
        }
    }
    return BrushSettings;
}());

var Brush = /** @class */ (function () {
    function Brush(settings) {
        this.settings = new BrushSettings(settings);
    }
    return Brush;
}());


// CONCATENATED MODULE: ./src/ts/sketch-pane/brush/brush-node-filter.ts
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var fragment = __webpack_require__(3);
var brush_node_filter_BrushNodeFilter = /** @class */ (function (_super) {
    __extends(BrushNodeFilter, _super);
    function BrushNodeFilter(grainSprite) {
        var _this = _super.call(this, null, fragment, {
            // color
            uRed: { type: '1f', value: 0.5 },
            uGreen: { type: '1f', value: 0.5 },
            uBlue: { type: '1f', value: 0.5 },
            // node
            uOpacity: { type: '1f', value: 1 },
            uRotation: { type: '1f', value: 0 },
            // grain
            uBleed: { type: '1f', value: 0 },
            uGrainRotation: { type: '1f', value: 0 },
            uGrainScale: { type: '1f', value: 1 },
            u_x_offset: { type: '1f', value: 0 },
            u_y_offset: { type: '1f', value: 0 },
            // brush
            u_offset_px: { type: 'vec2' },
            u_node_scale: { type: 'vec2', value: [0.0, 0.0] },
            // grain texture
            u_grainTex: { type: 'sampler2D', value: '' },
            // environment (via PIXI and Filter)
            dimensions: { type: 'vec2', value: [0.0, 0.0] },
            filterMatrix: { type: 'mat3' }
        }) || this;
        _this.padding = 0;
        _this.blendMode = external_pixi_js_["BLEND_MODES"].NORMAL;
        // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#fitting-problem
        _this.autoFit = false;
        var grainMatrix = new external_pixi_js_["Matrix"]();
        grainSprite.renderable = false;
        _this.grainSprite = grainSprite;
        _this.grainMatrix = grainMatrix;
        _this.uniforms.u_grainTex = grainSprite.texture;
        _this.uniforms.filterMatrix = grainMatrix;
        return _this;
    }
    // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#filter-area
    BrushNodeFilter.prototype.apply = function (filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;
        this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.grainMatrix, this.grainSprite);
        filterManager.applyFilter(this, input, output, clear);
        // console.log('filterMatrix', this.uniforms.filterMatrix)
        // to log Filter-added uniforms:
        // let shader = this.glShaders[filterManager.renderer.CONTEXT_UID]
        // if (shader) {
        // console.log('dimensions', this.uniforms.dimensions)
        // console.log('filterArea', shader.uniforms.filterArea)
        // console.log('filterClamp', shader.uniforms.filterClamp)
        // console.log('vFilterCoord', shader.uniforms.vFilterCoord)
        // }
    };
    return BrushNodeFilter;
}(external_pixi_js_["Filter"]));
/* harmony default export */ var brush_node_filter = (brush_node_filter_BrushNodeFilter);

// CONCATENATED MODULE: ./src/ts/sketch-pane/cursor.ts
var cursor_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var cursor_Cursor = /** @class */ (function (_super) {
    cursor_extends(Cursor, _super);
    function Cursor(container) {
        var _this = _super.call(this) || this;
        _this.container = container;
        _this.name = 'cursorSprite';
        _this.gfx = new external_pixi_js_["Graphics"]();
        // must be added as a child or the coordinates are incorrect
        _this.addChild(_this.gfx);
        // enabled
        _this._enabled = true;
        // don't show until at least one update
        _this.visible = false;
        _this.updateSize();
        return _this;
    }
    Cursor.prototype.renderCursor = function (e) {
        var point = this.container.localizePoint(e);
        this.position.set(point.x, point.y);
        this.anchor.set(0.5);
        // show (only when moved)
        if (this._enabled) {
            this.visible = true;
        }
    };
    Cursor.prototype.updateSize = function () {
        var resolution = 1;
        var size = this.container.brushSize * 0.7; // optical, approx.
        var x = Math.ceil((size * resolution) / 2);
        var y = Math.ceil((size * resolution) / 2);
        this.gfx
            .clear()
            // pad to avoid texture clipping (hack)
            .lineStyle(resolution * 2, 0xffffff, 0.001)
            .drawCircle(x, y, Math.ceil(size * resolution) + (resolution * 2))
            .closePath()
            // smaller white circle
            .lineStyle(resolution, 0xffffff)
            .drawCircle(x, y, Math.ceil(size * resolution) - resolution)
            .closePath()
            // actual size black circle
            .lineStyle(resolution, 0x000000)
            .drawCircle(x, y, Math.ceil(size * resolution))
            .closePath();
        // destroy any old texture
        this.texture.destroy(true);
        // render to a canvas
        this.texture = this.gfx.generateCanvasTexture();
        // hacky fix to avoid texture clipping and resize sprite appropriately to texture
        this.getLocalBounds();
        // clear the temporary graphics
        this.gfx.clear();
    };
    Cursor.prototype.setEnabled = function (value) {
        this._enabled = value;
        // immediately hide when disabled, but wait for mouse move when re-enabled
        if (!this._enabled)
            this.visible = false;
    };
    Cursor.prototype.getEnabled = function () {
        return this._enabled;
    };
    return Cursor;
}(external_pixi_js_["Sprite"]));


// CONCATENATED MODULE: ./src/ts/sketch-pane/layer.ts


var layer_Layer = /** @class */ (function () {
    function Layer(params) {
        this.renderer = params.renderer;
        this.width = params.width;
        this.height = params.height;
        this.sprite = new external_pixi_js_["Sprite"](external_pixi_js_["RenderTexture"].create(this.width, this.height));
        this.dirty = false;
    }
    Layer.prototype.getOpacity = function () {
        return this.sprite.alpha;
    };
    Layer.prototype.setOpacity = function (opacity) {
        this.sprite.alpha = opacity;
    };
    Layer.prototype.pixels = function (postDivide) {
        if (postDivide === void 0) { postDivide = false; }
        // get pixels as Uint8Array
        // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
        var pixels = this.renderer.plugins.extract.pixels(this.sprite.texture);
        if (postDivide) {
            // un-premultiply
            util.arrayPostDivide(pixels);
        }
        return pixels;
    };
    Layer.prototype.toCanvas = function (postDivide) {
        if (postDivide === void 0) { postDivide = true; }
        var pixels = this.pixels(postDivide);
        return util.pixelsToCanvas(pixels, this.width, this.height);
    };
    // get data url in PNG format
    Layer.prototype.toDataURL = function (postDivide) {
        if (postDivide === void 0) { postDivide = true; }
        return this.toCanvas(postDivide).toDataURL();
    };
    // get PNG data for writing to a file
    Layer.prototype.export = function (index) {
        return util.dataURLToFileContents(this.toDataURL());
    };
    // renders a DisplayObject to this layer’s texture
    Layer.prototype.draw = function (displayObject, clear) {
        if (clear === void 0) { clear = false; }
        this.renderer.render(displayObject, this.sprite.texture, clear);
    };
    Layer.prototype.clear = function () {
        // FIXME why doesn't this work consistently?
        // clear the render texture
        // this.renderer.clearRenderTexture(this.sprite.texture)
        // HACK force clear :/
        this.draw(new external_pixi_js_["Sprite"](external_pixi_js_["Texture"].EMPTY), true);
    };
    // draws a (non-DisplayObject) source to a texture (usually an Image)
    Layer.prototype.replace = function (source, clear) {
        if (clear === void 0) { clear = true; }
        this.draw(external_pixi_js_["Sprite"].from(source), // eslint-disable-line new-cap
        clear);
    };
    // source should be an HTMLCanvasElement
    Layer.prototype.replaceTextureFromCanvas = function (canvasElement) {
        // delete ALL cached canvas textures to ensure canvas is re-rendered
        external_pixi_js_["utils"].clearTextureCache();
        // draw canvas to our sprite's RenderTexture
        this.replace(external_pixi_js_["Texture"].from(canvasElement));
    };
    // write to texture (ignoring alpha)
    // TODO beter name for this?
    Layer.prototype.rewrite = function () {
        // temporarily reset the sprite alpha
        var alpha = this.sprite.alpha;
        // write to the texture
        this.sprite.alpha = 1.0;
        this.replaceTexture(this.sprite);
        // set the sprite alpha back
        this.sprite.alpha = alpha;
    };
    // NOTE this will apply any source Sprite alpha (if present)
    // TODO might be a better way to do this.
    //      would be more efficient to .render over sprite instead (with clear:true)
    //      but attempting that resulted in a blank texture.
    // see also: PIXI's `generateTexture`
    Layer.prototype.replaceTexture = function (displayObject) {
        var rt = external_pixi_js_["RenderTexture"].create(this.width, this.height);
        this.renderer.render(displayObject, rt, true);
        this.sprite.texture = rt;
    };
    // NOTE this is slow
    Layer.prototype.isEmpty = function () {
        var pixels = this.renderer.plugins.extract.pixels(this.sprite.texture);
        for (var _i = 0, pixels_1 = pixels; _i < pixels_1.length; _i++) {
            var i = pixels_1[_i];
            if (i !== 0)
                return false;
        }
        return true;
    };
    Layer.prototype.getDirty = function () {
        return this.dirty;
    };
    Layer.prototype.setDirty = function (value) {
        this.dirty = value;
    };
    Layer.prototype.setVisible = function (value) {
        this.sprite.visible = value;
    };
    Layer.prototype.getVisible = function () {
        return this.sprite.visible;
    };
    //
    //
    // operations
    //
    Layer.prototype.flip = function (vertical) {
        if (vertical === void 0) { vertical = false; }
        var sprite = new external_pixi_js_["Sprite"](this.sprite.texture);
        sprite.anchor.set(0.5, 0.5);
        if (vertical) {
            sprite.pivot.set(-sprite.width / 2, sprite.height / 2);
            sprite.scale.y *= -1;
        }
        else {
            sprite.pivot.set(sprite.width / 2, -sprite.height / 2);
            sprite.scale.x *= -1;
        }
        this.replaceTexture(sprite);
    };
    return Layer;
}());
/* harmony default export */ var sketch_pane_layer = (layer_Layer);

// CONCATENATED MODULE: ./src/ts/sketch-pane/layers-collection.ts
var layers_collection_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

// see: https://github.com/wesbos/es6-articles/blob/master/54%20-%20Extending%20Arrays%20with%20Classes%20for%20Custom%20Collections.md
var layers_collection_LayersCollection = /** @class */ (function (_super) {
    layers_collection_extends(LayersCollection, _super);
    function LayersCollection(params) {
        var _this = _super.call(this) || this;
        _this.renderer = params.renderer;
        _this.width = params.width;
        _this.height = params.height;
        _this.currentIndex = undefined; // index of the current layer
        _this.onAdd = undefined;
        _this.onSelect = undefined;
        // via https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work
        Object.setPrototypeOf(_this, LayersCollection.prototype);
        return _this;
    }
    LayersCollection.prototype.create = function () {
        var layer = new sketch_pane_layer({
            renderer: this.renderer,
            width: this.width,
            height: this.height
        });
        this.add(layer);
        return layer;
    };
    LayersCollection.prototype.add = function (layer) {
        var index = this.length;
        this.push(layer);
        layer.index = index;
        layer.name = "Layer " + (index + 1);
        layer.sprite.name = layer.name;
        this.onAdd && this.onAdd(layer.index);
        return layer;
    };
    LayersCollection.prototype.markDirty = function (indices) {
        for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
            var index = indices_1[_i];
            this[index].setDirty(true);
        }
    };
    // getActiveIndices () {
    //   return [...this.activeIndices]
    // }
    // setActiveIndices (indices) {
    //   this.activeIndices = [...indices]
    // }
    LayersCollection.prototype.getCurrentIndex = function () {
        return this.currentIndex;
    };
    LayersCollection.prototype.setCurrentIndex = function (index) {
        this.currentIndex = index;
        this.onSelect && this.onSelect(index);
    };
    LayersCollection.prototype.getCurrentLayer = function () {
        return this[this.currentIndex];
    };
    //
    //
    // operations
    //
    LayersCollection.prototype.flip = function (vertical) {
        if (vertical === void 0) { vertical = false; }
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var layer = _a[_i];
            layer.flip(vertical);
        }
    };
    // for given layers,
    // with specified opacity
    // render a composite texture
    // and return as *pixels*
    //
    // NOTE intentionally transparent. we use it to generate large images as well.
    //
    // TODO sort back to front
    // TODO better antialiasing
    // TODO rename extractCompositePixels ?
    LayersCollection.prototype.extractThumbnailPixels = function (width, height, indices) {
        if (indices === void 0) { indices = []; }
        var rt = PIXI.RenderTexture.create(width, height);
        return this.renderer.plugins.extract.pixels(this.generateCompositeTexture(width, height, indices, rt));
    };
    LayersCollection.prototype.generateCompositeTexture = function (width, height, indices, rt) {
        if (indices === void 0) { indices = []; }
        for (var _i = 0, _a = this; _i < _a.length; _i++) {
            var layer = _a[_i];
            // if indices are specified, include only selected layers
            if (indices.length && indices.includes(layer.index)) {
                // make a new Sprite from the layer texture
                var sprite = new PIXI.Sprite(layer.sprite.texture);
                // copy the layer's alpha
                sprite.alpha = layer.sprite.alpha;
                // resize
                sprite.scale.set(width / this.width, height / this.height);
                this.renderer.render(sprite, rt, false);
            }
        }
        return rt;
    };
    // merge
    //
    // sources is an array of layer indices, ordered back to front
    // destination is the index of the destination layer
    LayersCollection.prototype.merge = function (sources, destination) {
        var rt = PIXI.RenderTexture.create(this.width, this.height);
        rt = this.generateCompositeTexture(this.width, this.height, sources, rt);
        // clear destination
        this[destination].clear();
        // stamp composite onto destination
        // TODO would it be better to write raw pixel data?
        // TODO would it be better to destroy layer texture and assign rt as layer texture?
        this[destination].replace(rt);
        // clear the source layers
        for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
            var index = sources_1[_i];
            if (index !== destination) {
                this[index].clear();
            }
        }
    };
    return LayersCollection;
}(Array));
/* harmony default export */ var layers_collection = (layers_collection_LayersCollection);

// CONCATENATED MODULE: ./src/ts/sketch-pane/sketch-pane.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var sketch_pane_SketchPane = /** @class */ (function () {
    function SketchPane(options) {
        if (options === void 0) { options = { backgroundColor: 0xffffff }; }
        this.images = {
            brush: {},
            grain: {}
        };
        this.pointerDown = false;
        this.layerMask = undefined;
        this.layerBackground = undefined;
        this.viewportRect = undefined;
        // callbacks
        this.onStrokeBefore = options.onStrokeBefore;
        this.onStrokeAfter = options.onStrokeAfter;
        this.setup(options);
        this.setImageSize(options.imageWidth, options.imageHeight);
        this.app.view.style.cursor = 'none';
    }
    SketchPane.prototype.setup = function (options) {
        // @popelyshev: paper typings are wrong
        external_paper_["setup"](undefined);
        external_paper_["view"].setAutoUpdate(false);
        external_pixi_js_["settings"].FILTER_RESOLUTION = 1;
        external_pixi_js_["settings"].PRECISION_FRAGMENT = external_pixi_js_["PRECISION"].HIGH;
        external_pixi_js_["settings"].MIPMAP_TEXTURES = true;
        external_pixi_js_["settings"].WRAP_MODE = external_pixi_js_["WRAP_MODES"].REPEAT;
        external_pixi_js_["utils"].skipHello();
        this.app = new external_pixi_js_["Application"]({
            // width: window.innerWidth,
            // height: window.innerHeight,
            // antialias: false,
            // preserveDrawingBuffer: true,  // for toDataUrl on the webgl context
            backgroundColor: options.backgroundColor,
            // resolution: 2,
            antialias: false
            // powerPreference: 'high-performance'
        });
        this.app.renderer.roundPixels = false;
        // this.app.renderer.transparent = true
        this.sketchPaneContainer = new external_pixi_js_["Container"]();
        this.sketchPaneContainer.name = 'sketchPaneContainer';
        // layer
        this.layerContainer = new external_pixi_js_["Container"]();
        this.layerContainer.name = 'layerContainer';
        this.sketchPaneContainer.addChild(this.layerContainer);
        // static stroke
        // - not shown to user
        // - used only as a temporary area to setup for texture rendering
        this.strokeContainer = new external_pixi_js_["Container"]();
        this.strokeContainer.name = 'static';
        // live stroke
        // - shown to user
        this.liveStrokeContainer = new external_pixi_js_["Container"]();
        this.liveStrokeContainer.name = 'live';
        this.layerContainer.addChild(this.liveStrokeContainer);
        // off-screen container
        // - used for placement of grain sprites
        this.offscreenContainer = new external_pixi_js_["Container"]();
        this.offscreenContainer.name = 'offscreen';
        this.offscreenContainer.renderable = false;
        this.layerContainer.addChild(this.offscreenContainer);
        // erase mask
        this.eraseMask = new external_pixi_js_["Sprite"]();
        this.eraseMask.name = 'eraseMask';
        this.cursor = new cursor_Cursor(this);
        this.sketchPaneContainer.addChild(this.cursor);
        this.app.stage.addChild(this.sketchPaneContainer);
        this.sketchPaneContainer.scale.set(1);
    };
    SketchPane.prototype.setImageSize = function (width, height) {
        this.width = width;
        this.height = height;
        this.layerMask = new external_pixi_js_["Graphics"]()
            .beginFill(0x0, 1)
            .drawRect(0, 0, this.width, this.height)
            .endFill();
        this.layerMask.name = 'layerMask';
        this.layerContainer.mask = this.layerMask;
        this.sketchPaneContainer.addChild(this.layerMask);
        this.layerBackground = new external_pixi_js_["Graphics"]()
            .beginFill(0xffffff)
            .drawRect(0, 0, this.width, this.height)
            .endFill();
        this.layerBackground.name = 'background';
        this.layerContainer.addChild(this.layerBackground);
        this.eraseMask.texture = external_pixi_js_["RenderTexture"].create(this.width, this.height);
        this.centerContainer();
        this.layers = new layers_collection({
            renderer: this.app.renderer,
            width: this.width,
            height: this.height
        });
        this.layers.onAdd = this.onLayersCollectionAdd.bind(this);
        this.layers.onSelect = this.onLayersCollectionSelect.bind(this);
    };
    SketchPane.prototype.onLayersCollectionAdd = function (index) {
        var layer = this.layers[index];
        // layer.sprite.texture.baseTexture.premultipliedAlpha = false
        this.layerContainer.position.set(0, 0);
        this.layerContainer.addChild(layer.sprite);
        this.centerContainer();
    };
    SketchPane.prototype.onLayersCollectionSelect = function (index) {
        this.updateLayerDepths();
    };
    SketchPane.prototype.updateLayerDepths = function () {
        var index = this.layers.getCurrentIndex();
        var selectedLayer = this.layers[index];
        this.layerContainer.setChildIndex(this.layerBackground, 0);
        var childIndex = 1;
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            this.layerContainer.setChildIndex(layer.sprite, childIndex);
            if (layer.sprite === selectedLayer.sprite) {
                this.layerContainer.setChildIndex(this.offscreenContainer, ++childIndex);
                this.layerContainer.setChildIndex(this.liveStrokeContainer, ++childIndex);
            }
            childIndex++;
        }
    };
    SketchPane.prototype.newLayer = function () {
        return this.layers.create();
    };
    SketchPane.prototype.centerContainer = function () {
        this.sketchPaneContainer.pivot.set(this.width / 2, this.height / 2);
        this.sketchPaneContainer.position.set(Math.floor(this.app.renderer.width / 2), Math.floor(this.app.renderer.height / 2));
    };
    // resizeToParent () {
    //   this.resizeToElement(this.app.view.parentElement)
    // }
    //
    // resizeToElement (element) {
    //   const { width, height } = element.getBoundingClientRect()
    //   this.resize(width, height)
    // }
    SketchPane.prototype.resize = function (width, height) {
        this.app.renderer.resize(width, height);
        // fit aspect ratio, set scale
        var frameAspectRatio = width / height;
        var imageAspectRatio = this.width / this.height;
        var dim = (frameAspectRatio > imageAspectRatio)
            ? [this.width * height / this.height, height]
            : [width, this.height * width / this.width];
        var scale = dim[0] / this.width;
        this.sketchPaneContainer.scale.set(scale);
        this.sketchPaneContainer.position.set(Math.floor(this.app.renderer.width / 2), Math.floor(this.app.renderer.height / 2));
        this.viewportRect = this.app.view.getBoundingClientRect();
    };
    // per http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
    // for each brush, add a sprite with the brush and grain images, so we can get the actual transformation matrix for those image textures
    SketchPane.prototype.loadBrushes = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var brushes, brushImagePath, brushImageNames, grainImageNames, promises, _i, _a, _b, names, dict, _loop_1, _c, names_1, name_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        brushes = params.brushes, brushImagePath = params.brushImagePath;
                        this.brushes = brushes.reduce(function (brushes, brush) {
                            brushes[brush.name] = new Brush(brush);
                            return brushes;
                        }, {});
                        brushImageNames = Array.from(new Set(Object.values(this.brushes).map(function (b) { return b.settings.brushImage; })));
                        grainImageNames = Array.from(new Set(Object.values(this.brushes).map(function (b) { return b.settings.grainImage; })));
                        promises = [];
                        for (_i = 0, _a = [[brushImageNames, this.images.brush], [grainImageNames, this.images.grain]]; _i < _a.length; _i++) {
                            _b = _a[_i], names = _b[0], dict = _b[1];
                            _loop_1 = function (name_1) {
                                var sprite = external_pixi_js_["Sprite"].fromImage(brushImagePath + "/" + name_1 + ".png");
                                sprite.renderable = false;
                                dict[name_1] = sprite;
                                var texture = sprite.texture.baseTexture;
                                if (texture.hasLoaded) {
                                    promises.push(Promise.resolve(sprite));
                                }
                                else if (texture.isLoading) {
                                    promises.push(new Promise(function (resolve, reject) {
                                        texture.on('loaded', function (result) { return resolve(texture); });
                                        texture.on('error', function (err) { return reject(err); });
                                    }));
                                }
                                else {
                                    promises.push(Promise.reject(new Error()));
                                }
                            };
                            for (_c = 0, names_1 = names; _c < names_1.length; _c++) {
                                name_1 = names_1[_c];
                                _loop_1(name_1);
                            }
                        }
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _d.sent();
                        this.cursor.updateSize();
                        return [2 /*return*/];
                }
            });
        });
    };
    // stamp = don't clear texture
    SketchPane.prototype.stampStroke = function (source, layer) {
        layer.draw(source, false);
    };
    SketchPane.prototype.disposeContainer = function (container) {
        for (var _i = 0, _a = container.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.destroy({
                children: true,
                // because we re-use the brush texture
                texture: false,
                baseTexture: false
            });
        }
        container.removeChildren();
    };
    SketchPane.prototype.addStrokeNode = function (r, g, b, size, opacity, x, y, pressure, angle, tilt, brush, grainOffsetX, grainOffsetY, strokeContainer) {
        // the brush node
        // is larger than the texture size
        // because, although the x,y coordinates must be integers,
        //   we still want to draw sub-pixels,
        //     so we pad 1px
        //       allowing us to draw a on positive x, y offset
        // and, although, the dimensions must be integers,
        //   we want to have a sub-pixel texture size,
        //     so we sometimes make the node larger than necessary
        //       and scale the texture down to correct
        // to allow us to draw a rotated texture,
        //   we increase the size to accommodate for up to 45 degrees of rotation
        // eslint-disable-next-line new-cap
        var sprite = new external_pixi_js_["Sprite"](this.images.brush[brush.settings.brushImage].texture);
        //
        //
        // brush params
        //
        var nodeSize = size - (1 - pressure) * size * brush.settings.pressureSize;
        var tiltSizeMultiple = (((tilt / 90.0) * brush.settings.tiltSize) * 3) + 1;
        nodeSize *= tiltSizeMultiple;
        // nodeSize = this.brushSize
        var nodeOpacity = 1 - (1 - pressure) * brush.settings.pressureOpacity;
        var tiltOpacity = 1 - tilt / 90.0 * brush.settings.tiltOpacity;
        nodeOpacity *= tiltOpacity * opacity;
        var nodeRotation;
        if (brush.settings.azimuth) {
            nodeRotation = angle * Math.PI / 180.0 - this.sketchPaneContainer.rotation;
        }
        else {
            nodeRotation = 0 - this.sketchPaneContainer.rotation;
        }
        //
        //
        // sprite setup
        //
        // sprite must fit a texture rotated by up to 45 degrees
        var rad = Math.PI * 45 / 180; // extreme angle in radians
        var spriteSize = Math.abs(nodeSize * Math.sin(rad)) + Math.abs(nodeSize * Math.cos(rad));
        var iS = Math.ceil(spriteSize);
        x -= iS / 2;
        y -= iS / 2;
        sprite.x = Math.floor(x);
        sprite.y = Math.floor(y);
        sprite.width = iS;
        sprite.height = iS;
        var dX = x - sprite.x;
        var dY = y - sprite.y;
        var dS = nodeSize / sprite.width;
        var oXY = [dX, dY];
        var oS = [dS, dS];
        //
        //
        // filter setup
        //
        // TODO can we avoid creating a new grain sprite for each render?
        //      used for rendering grain filter texture at correct position
        var grainSprite = this.images.grain[brush.settings.grainImage];
        this.offscreenContainer.addChild(grainSprite);
        // hacky fix to calculate vFilterCoord properly
        this.offscreenContainer.getLocalBounds();
        var filter = new brush_node_filter(grainSprite);
        filter.uniforms.uRed = r;
        filter.uniforms.uGreen = g;
        filter.uniforms.uBlue = b;
        filter.uniforms.uOpacity = nodeOpacity;
        filter.uniforms.uRotation = nodeRotation;
        filter.uniforms.uBleed =
            Math.pow(1 - pressure, 1.6) * brush.settings.pressureBleed;
        filter.uniforms.uGrainScale = brush.settings.scale;
        //
        //
        // DEPRECATED
        //
        filter.uniforms.uGrainRotation = brush.settings.rotation;
        //
        //
        //
        filter.uniforms.u_x_offset = grainOffsetX * brush.settings.movement;
        filter.uniforms.u_y_offset = grainOffsetY * brush.settings.movement;
        // subpixel offset
        filter.uniforms.u_offset_px = oXY; // TODO multiply by app.stage.scale if zoomed
        // console.log('iX', iX, 'iY', iY, 'u_offset_px', oXY)
        // subpixel scale AND padding AND rotation accomdation
        filter.uniforms.u_node_scale = oS; // desired scale
        filter.padding = 1; // for filterClamp
        sprite.filters = [filter];
        // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem
        // @popelyshev this property is for Sprite, not for filter. Thans to TypeScript!
        // @popelyshev at the same time, the fix only makes it worse :(
        // sprite.filterArea = this.app.screen
        strokeContainer.addChild(sprite);
    };
    SketchPane.prototype.down = function (e, options) {
        if (options === void 0) { options = {}; }
        this.pointerDown = true;
        this.strokeBegin(e, options);
        this.app.view.style.cursor = 'none';
        this.cursor.renderCursor(e);
    };
    SketchPane.prototype.move = function (e) {
        if (this.pointerDown) {
            this.strokeContinue(e);
        }
        this.app.view.style.cursor = 'none';
        this.cursor.renderCursor(e);
    };
    SketchPane.prototype.up = function (e) {
        if (this.pointerDown) {
            this.strokeEnd(e);
        }
        this.app.view.style.cursor = 'none';
        this.cursor.renderCursor(e);
    };
    SketchPane.prototype.strokeBegin = function (e, options) {
        // initialize stroke state
        this.strokeState = {
            isErasing: !!options.erase,
            // which layers will be stamped / dirtied by this stroke?
            layerIndices: options.erase
                ? options.erase // array of layers which will be erased
                : [this.layers.currentIndex],
            points: [],
            path: new external_paper_["Path"](),
            lastStaticIndex: 0,
            lastSpacing: undefined,
            grainOffset: this.brush.settings.randomOffset
                ? { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100) }
                : { x: 0, y: 0 },
            // snapshot brush configuration
            size: this.brushSize,
            color: this.brushColor,
            opacity: this.brushOpacity
        };
        this.onStrokeBefore && this.onStrokeBefore(this.strokeState);
        this.addPointerEventAsPoint(e);
        // don't show the live container while we're erasing
        if (this.strokeState.isErasing) {
            if (this.liveStrokeContainer.parent) {
                this.liveStrokeContainer.parent.removeChild(this.liveStrokeContainer);
            }
        }
        else {
            // NOTE only sets liveStrokeContainer.alpha at beginning of stroke
            //      if layer opacity can change during the stroke, we should move this to `drawStroke`
            this.liveStrokeContainer.alpha = this.getLayerOpacity(this.layers.currentIndex);
            this.layerContainer.addChild(this.liveStrokeContainer);
            // TODO can we determine the exact index and use addChildAt instead of brute-force updating all depths?
            this.updateLayerDepths();
        }
        this.drawStroke();
    };
    SketchPane.prototype.strokeContinue = function (e) {
        this.addPointerEventAsPoint(e);
        this.drawStroke();
    };
    SketchPane.prototype.strokeEnd = function (e) {
        this.addPointerEventAsPoint(e);
        this.stopDrawing();
    };
    // public
    SketchPane.prototype.stopDrawing = function () {
        this.drawStroke(true); // finalize
        this.disposeContainer(this.liveStrokeContainer);
        this.offscreenContainer.removeChildren();
        this.layers.markDirty(this.strokeState.layerIndices);
        // add the liveStrokeContainer back
        if (this.strokeState.isErasing) {
            this.layerContainer.addChild(this.liveStrokeContainer);
            // TODO can we determine the exact index and use addChildAt instead of brute-force updating all depths?
            this.updateLayerDepths();
        }
        this.pointerDown = false;
        this.onStrokeAfter && this.onStrokeAfter(this.strokeState);
    };
    SketchPane.prototype.getInterpolatedStrokeInput = function (strokeInput, path) {
        var interpolatedStrokeInput = [];
        // get lookups for each segment so we know how to interpolate
        // for every segment,
        //  find the segments's location on the path,
        //  and find the offset
        //    where 'offset' means the length from
        //    the beginning of the path
        //    up to the segment's location
        var segmentLookup = [];
        // console.log(path.length)
        for (var i_1 = 0; i_1 < path.segments.length; i_1++) {
            if (path.segments[i_1].location) {
                segmentLookup.push(path.segments[i_1].location.offset);
            }
        }
        // console.log(segmentLookup)
        var currentSegment = 0;
        // let nodeSize = this.brushSize - ((1-pressure)*this.brushSize*brush.settings.pressureSize)
        var spacing = Math.max(1, this.strokeState.size * this.brush.settings.spacing);
        // console.log(spacing)
        if (this.strokeState.lastSpacing == null)
            this.strokeState.lastSpacing = spacing;
        var start = (spacing - this.strokeState.lastSpacing);
        var len = path.length;
        var i = 0;
        // default. pushes along in-between spacing when spacing - this.strokeState.lastSpacing is > path.length
        var k = len + -(this.strokeState.lastSpacing + len);
        var singlePoint = false;
        if (len === 0) {
            // single point
            start = 0;
            len = spacing;
            singlePoint = true;
        }
        for (i = start; i < len; i += spacing) {
            var point = path.getPointAt(i);
            for (var z = currentSegment; z < segmentLookup.length; z++) {
                if (segmentLookup[z] < i) {
                    currentSegment = z;
                    // @popelyshev : Why continue?
                    continue;
                }
            }
            var pressure = void 0;
            var tiltAngle = void 0;
            var tilt = void 0;
            if (singlePoint) {
                pressure = strokeInput[currentSegment].pressure;
                tiltAngle = strokeInput[currentSegment].tiltAngle;
                tilt = strokeInput[currentSegment].tilt;
            }
            else {
                var segmentPercent = (i - segmentLookup[currentSegment]) /
                    (segmentLookup[currentSegment + 1] - segmentLookup[currentSegment]);
                pressure = util.lerp(strokeInput[currentSegment].pressure, strokeInput[currentSegment + 1].pressure, segmentPercent);
                tiltAngle = util.lerp(strokeInput[currentSegment].tiltAngle, strokeInput[currentSegment + 1].tiltAngle, segmentPercent);
                tilt = util.lerp(strokeInput[currentSegment].tilt, strokeInput[currentSegment + 1].tilt, segmentPercent);
            }
            interpolatedStrokeInput.push([
                this.strokeState.isErasing ? 0 : ((this.strokeState.color >> 16) & 255) / 255,
                this.strokeState.isErasing ? 0 : ((this.strokeState.color >> 8) & 255) / 255,
                this.strokeState.isErasing ? 0 : (this.strokeState.color & 255) / 255,
                this.strokeState.size,
                this.strokeState.opacity,
                point.x,
                point.y,
                pressure,
                tiltAngle,
                tilt,
                this.brush,
                this.strokeState.grainOffset.x,
                this.strokeState.grainOffset.y
            ]);
            k = i;
        }
        this.strokeState.lastSpacing = len - k;
        return interpolatedStrokeInput;
    };
    SketchPane.prototype.addStrokeNodes = function (strokeInput, path, strokeContainer) {
        // we have 2+ StrokeInput points (with x, y, pressure, etc),
        // and 2+ matching path segments (with location and handles)
        //  e.g.: strokeInput[0].x === path.segments[0].point.x
        var interpolatedStrokeInput = this.getInterpolatedStrokeInput(strokeInput, path);
        for (var _i = 0, interpolatedStrokeInput_1 = interpolatedStrokeInput; _i < interpolatedStrokeInput_1.length; _i++) {
            var args = interpolatedStrokeInput_1[_i];
            ;
            this.addStrokeNode.apply(this, args.concat([strokeContainer]));
        }
    };
    // public
    SketchPane.prototype.localizePoint = function (point) {
        return this.sketchPaneContainer.toLocal(new external_pixi_js_["Point"](point.x - this.viewportRect.x, point.y - this.viewportRect.y), this.app.stage);
    };
    SketchPane.prototype.addPointerEventAsPoint = function (e) {
        var corrected = this.localizePoint(e);
        var pressure = e.pointerType === 'mouse'
            ? e.pressure > 0 ? 0.5 : 0
            : e.pressure;
        var tiltAngle = e.pointerType === 'mouse'
            ? { angle: -90, tilt: 37 }
            : util.calcTiltAngle(e.tiltY, e.tiltX); // NOTE we intentionally reverse these args
        this.strokeState.points.push({
            x: corrected.x,
            y: corrected.y,
            pressure: pressure,
            tiltAngle: tiltAngle.angle,
            tilt: tiltAngle.tilt
        });
        // we added a new point, so decrement lastStaticIndex
        this.strokeState.lastStaticIndex = Math.max(0, this.strokeState.lastStaticIndex - 1);
        // only keep track of input that hasn't been rendered static yet
        this.strokeState.points = this.strokeState.points.slice(Math.max(0, this.strokeState.lastStaticIndex - 1), this.strokeState.points.length);
        this.strokeState.path = new external_paper_["Path"](this.strokeState.points);
        this.strokeState.path.smooth({ type: 'catmull-rom', factor: 0.5 }); // centripetal
    };
    // render the live strokes
    // TODO instead of slices, could pass offset and length?
    SketchPane.prototype.drawStroke = function (finalize) {
        if (finalize === void 0) { finalize = false; }
        var len = this.strokeState.points.length;
        // finalize
        // draws all remaining points we know of
        // called on up
        // useful for drawing a dot for only two points
        //   e.g.: on quick up/down press with no move
        if (finalize) {
            // the index of the last static point we drew
            var a = this.strokeState.lastStaticIndex;
            // the last point we know of
            var b = this.strokeState.points.length - 1;
            // console.log(
            //   '\n',
            //   'rendering to texture.\n',
            //   len, 'points in the array.\n',
            //   // this.strokeState.points, '\n',
            //   'drawing stroke from point idx', a,
            //   'to point idx', b, '\n'
            // )
            this.addStrokeNodes(this.strokeState.points.slice(a, b + 1), new external_paper_["Path"](this.strokeState.path.segments.slice(a, b + 1)), this.strokeContainer);
            // stamp
            if (this.strokeState.isErasing) {
                // stamp to erase texture
                this.updateMask(this.strokeContainer, true);
            }
            else {
                // stamp to layer texture
                this.stampStroke(this.strokeContainer, this.layers.getCurrentLayer());
            }
            this.disposeContainer(this.strokeContainer);
            this.offscreenContainer.removeChildren();
            return;
        }
        // static
        // do we have enough points to render a static stroke to the texture?
        if (len >= 3) {
            var last = this.strokeState.points.length - 1;
            var a = last - 2;
            var b = last - 1;
            // draw to the static container
            this.addStrokeNodes(this.strokeState.points.slice(a, b + 1), new external_paper_["Path"](this.strokeState.path.segments.slice(a, b + 1)), this.strokeContainer);
            // stamp
            if (this.strokeState.isErasing) {
                // stamp to the erase texture
                this.updateMask(this.strokeContainer);
            }
            else {
                // stamp to layer texture
                this.stampStroke(this.strokeContainer, this.layers.getCurrentLayer());
            }
            this.disposeContainer(this.strokeContainer);
            this.offscreenContainer.removeChildren();
            this.strokeState.lastStaticIndex = b;
        }
        // live
        // do we have enough points to draw a live stroke to the container?
        if (len >= 2) {
            this.disposeContainer(this.liveStrokeContainer);
            var last = this.strokeState.points.length - 1;
            var a = last - 1;
            var b = last;
            // render the current stroke live
            if (this.strokeState.isErasing) {
                // TODO find a good way to add live strokes to erase mask
                // this.updateMask(this.liveStrokeContainer)
            }
            else {
                // store the current spacing
                var tmpLastSpacing = this.strokeState.lastSpacing;
                // draw a live stroke
                this.addStrokeNodes(this.strokeState.points.slice(a, b + 1), new external_paper_["Path"](this.strokeState.path.segments.slice(a, b + 1)), this.liveStrokeContainer);
                // revert the spacing so the real stroke will be correct
                this.strokeState.lastSpacing = tmpLastSpacing;
            }
        }
    };
    SketchPane.prototype.updateMask = function (source, finalize) {
        var _this = this;
        if (finalize === void 0) { finalize = false; }
        // find the top-most active layer
        var descending = function (a, b) { return b - a; };
        var layer = this.strokeState.layerIndices
            .map(function (i) { return _this.layers[i]; })
            .sort(function (a, b) { return descending(a.sprite.parent.getChildIndex(a.sprite), b.sprite.parent.getChildIndex(b.sprite)); })[0];
        // we're starting a new round
        if (!layer.sprite.mask) {
            // add the mask on top of all layers
            this.layerContainer.addChild(this.eraseMask);
            // reset the mask with a solid red background
            var graphics = new external_pixi_js_["Graphics"]()
                .beginFill(0xff0000, 1.0)
                .drawRect(0, 0, this.width, this.height)
                .endFill();
            this.app.renderer.render(graphics, this.eraseMask.texture, true);
            // use the mask
            for (var _i = 0, _a = this.strokeState.layerIndices; _i < _a.length; _i++) {
                var i = _a[_i];
                var layer_1 = this.layers[i];
                layer_1.sprite.mask = this.eraseMask;
            }
        }
        // render the white strokes onto the red filled erase mask texture
        this.app.renderer.render(source, this.eraseMask.texture, false);
        // if finalizing,
        if (finalize) {
            for (var _b = 0, _c = this.strokeState.layerIndices; _b < _c.length; _b++) {
                var i = _c[_b];
                // apply the erase texture to the actual layer texture
                var layer_2 = this.layers[i];
                // add child so transform is correct
                layer_2.sprite.addChild(this.eraseMask);
                layer_2.sprite.mask = this.eraseMask;
                // stamp mask'd version of layer sprite to its own texture
                this.layers[i].rewrite();
                // cleanup
                layer_2.sprite.mask = null;
                layer_2.sprite.removeChild(this.eraseMask);
            }
            // TODO GC the eraseMask texture?
        }
    };
    // TODO handle crop / center
    // TODO mark dirty?
    SketchPane.prototype.replaceLayer = function (index, source, clear) {
        if (clear === void 0) { clear = true; }
        index = (index == null) ? this.layers.getCurrentIndex() : index;
        this.layers[index].replace(source, clear);
    };
    // DEPRECATED
    SketchPane.prototype.getLayerCanvas = function (index) {
        console.warn('SketchPane#getLayerCanvas is deprecated. Please fix the caller to use a different method.');
        console.trace();
        index = (index == null) ? this.layers.getCurrentIndex() : index;
        // #canvas reads the raw pixels and converts to an HTMLCanvasElement
        // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
        return this.app.renderer.plugins.extract.canvas(this.layers[index].sprite.texture);
    };
    SketchPane.prototype.exportLayer = function (index, format) {
        if (format === void 0) { format = 'base64'; }
        index = (index == null) ? this.layers.getCurrentIndex() : index;
        return this.layers[index].export(format);
    };
    SketchPane.prototype.extractThumbnailPixels = function (width, height, indices) {
        if (indices === void 0) { indices = []; }
        return this.layers.extractThumbnailPixels(width, height, indices);
    };
    SketchPane.prototype.clearLayer = function (index) {
        index = (index == null) ? this.layers.getCurrentIndex() : index;
        this.layers[index].clear();
    };
    SketchPane.prototype.getNumLayers = function () {
        return this.layers.length - 1;
    };
    // get current layer
    SketchPane.prototype.getCurrentLayerIndex = function (index) {
        return this.layers.getCurrentIndex();
    };
    // set layer by index (0-indexed)
    SketchPane.prototype.setCurrentLayerIndex = function (index) {
        if (this.pointerDown)
            return; // prevent layer change during draw
        this.layers.setCurrentIndex(index);
    };
    Object.defineProperty(SketchPane.prototype, "brushSize", {
        get: function () {
            return this._brushSize;
        },
        // TODO setState instead?
        set: function (value) {
            this._brushSize = value;
            this.cursor.updateSize();
        },
        enumerable: true,
        configurable: true
    });
    SketchPane.prototype.isDrawing = function () {
        return this.pointerDown;
    };
    // getIsErasing () {
    //   return this.isErasing
    // }
    //
    // setIsErasing (value) {
    //   if (this.pointerDown) return // prevent erase mode change during draw
    //
    //   this.isErasing = value
    // }
    //
    // setErasableLayers (indices) {
    //   this.layers.setActiveIndices(indices)
    // }
    SketchPane.prototype.getLayerOpacity = function (index) {
        return this.layers[index].getOpacity();
    };
    SketchPane.prototype.setLayerOpacity = function (index, opacity) {
        this.layers[index].setOpacity(opacity);
    };
    SketchPane.prototype.markLayersDirty = function (indices) {
        return this.layers.markDirty(indices);
    };
    SketchPane.prototype.clearLayerDirty = function (index) {
        this.layers[index].setDirty(false);
    };
    SketchPane.prototype.getLayerDirty = function (index) {
        return this.layers[index].getDirty();
    };
    SketchPane.prototype.isLayerEmpty = function (index) {
        return this.layers[index].isEmpty();
    };
    // getActiveLayerIndices () {
    //   return this.layers.getActiveIndices()
    // }
    SketchPane.prototype.getDOMElement = function () {
        return this.app.view;
    };
    //
    // operations
    //
    //
    SketchPane.prototype.flipLayers = function (vertical) {
        if (vertical === void 0) { vertical = false; }
        this.layers.flip(vertical);
    };
    return SketchPane;
}());
/* harmony default export */ var sketch_pane = (sketch_pane_SketchPane);

// CONCATENATED MODULE: ./src/ts/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "SketchPane", function() { return sketch_pane; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "util", function() { return util; });





/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "precision highp float;\n\n// brush texture\nuniform sampler2D uSampler;\n// grain texture\nuniform sampler2D u_grainTex;\n\n// color\nuniform float uRed;\nuniform float uGreen;\nuniform float uBlue;\n\n// node\nuniform float uOpacity;\nuniform float uRotation;\n\n// grain\nuniform float uBleed;\nuniform float uGrainRotation;\nuniform float uGrainScale;\nuniform float u_x_offset;\nuniform float u_y_offset;\n\n// brush\nuniform vec2 u_offset_px;\nuniform vec2 u_node_scale;\n\n// from vert shader\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\n// from PIXI\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 filterClamp;\nuniform mat3 filterMatrix;\n\nvec2 rotate (vec2 v, float a) {\n\tfloat s = sin(a);\n\tfloat c = cos(a);\n\tmat2 m = mat2(c, -s, s, c);\n\treturn m * v;\n}\n\nvec2 scale (vec2 v, vec2 _scale) {\n\tmat2 m = mat2(_scale.x, 0.0, 0.0, _scale.y);\n\treturn m * v;\n}\n\nvec2 mapCoord (vec2 coord) {\n  coord *= filterArea.xy;\n  return coord;\n}\n\nvec2 unmapCoord (vec2 coord) {\n  coord /= filterArea.xy;\n  return coord;\n}\n\nvoid main(void) {\n  // user's intended brush color\n  vec3 color = vec3(uRed, uGreen, uBlue);\n\n\t//\n\t//\n\t// brush\n\t//\n  vec2 coord = mapCoord(vTextureCoord) / dimensions;\n\n\t// translate by the subpixel\n\tcoord -= u_offset_px / dimensions;\n\n  // move space from the center to the vec2(0.0)\n  coord -= vec2(0.5);\n\n  // rotate the space\n  coord = rotate(coord, uRotation);\n\n  // move it back to the original place\n  coord += vec2(0.5);\n\n\t// scale\n\tcoord -= 0.5;\n  coord *= 1.0 / u_node_scale;\n\tcoord += 0.5;\n\n\tcoord = unmapCoord(coord * dimensions);\n\n\t//\n\t//\n\t// grain\n\t//\n\tvec2 fcoord = vFilterCoord;\n\tfcoord -= vec2(u_x_offset, u_y_offset);\n\tfcoord /= uGrainScale;\n\tvec4 grainSample = texture2D(u_grainTex, fract(fcoord));\n\n\t//\n\t//\n\t// set gl_FragColor\n\t//\n\t// clamp (via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem)\n\tif (coord == clamp(coord, filterClamp.xy, filterClamp.zw)) {\n\t\t// read a sample from the texture\n\t  vec4 brushSample = texture2D(uSampler, coord);\n\t  // tint\n\t  gl_FragColor = vec4(color, 1.);\n\t\tgl_FragColor *= ((brushSample.r * grainSample.r * (1.0+uBleed))- uBleed ) * (1.0+ uBleed) * uOpacity;\n\n\t\t// gl_FragColor = grain;\n\t} else {\n\t\t// don't draw\n\t\tgl_FragColor = vec4(0.);\n\t}\n}\n"

/***/ })
/******/ ]);