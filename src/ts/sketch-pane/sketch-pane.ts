import * as paper from 'paper'
import * as PIXI from 'pixi.js'

import Util from './util'
import { Brush } from './brush/brush'
import BrushNodeFilter from './brush/brush-node-filter'
import { Cursor } from './cursor'

import LayersCollection from './layers-collection'
import Layer from './layer'

interface IStrokePoint {
  x: number
  y: number
  pressure: number
  tiltAngle: number
  tilt: number
}

interface IStrokeSettings {
  erase?: Array<number>
}

interface IStrokeState {
  isErasing?: boolean
  layerIndices?: Array<number>
  points?: Array<IStrokePoint>
  path?: paper.Path
  lastStaticIndex?: number
  lastSpacing?: number | undefined
  grainOffset?: { x: number, y: number }
// snapshot brush configuration
  size?: number
  color?: number
  opacity?: number
}

export default class SketchPane {
  layerMask: PIXI.Graphics
  layerBackground: PIXI.Graphics
  layers: LayersCollection
  images = {
    brush: {} as any,
    grain: {} as any
  }
  app: PIXI.Application

  viewportRect: { x: number, y: number, width: number, height: number}

  onStrokeBefore: (state?: IStrokeState) => {}
  onStrokeAfter: (state?: IStrokeState) => {}

  constructor (options: any = {backgroundColor: 0xffffff}) {
    this.layerMask = undefined
    this.layerBackground = undefined
    this.viewportRect = undefined

    // callbacks
    this.onStrokeBefore = options.onStrokeBefore
    this.onStrokeAfter = options.onStrokeAfter

    this.setup(options)
    this.setImageSize(options.imageWidth, options.imageHeight)

    this.app.view.style.cursor = 'none'
  }

  sketchPaneContainer: PIXI.Container
  layerContainer: PIXI.Container
  strokeContainer: PIXI.Container
  liveStrokeContainer: PIXI.Container
  offscreenContainer: PIXI.Container
  eraseMask: PIXI.Sprite
  cursor: Cursor

  setup (options: any) {
    // @popelyshev: paper typings are wrong
    paper.setup(undefined)
    ;(paper.view as any).setAutoUpdate(false)

    PIXI.settings.FILTER_RESOLUTION = 1
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
    PIXI.settings.MIPMAP_TEXTURES = true
    PIXI.settings.WRAP_MODE = PIXI.WRAP_MODES.REPEAT
    PIXI.utils.skipHello()

    this.app = new PIXI.Application({
      // width: window.innerWidth,
      // height: window.innerHeight,

      // antialias: false,

      // preserveDrawingBuffer: true,  // for toDataUrl on the webgl context

      backgroundColor: options.backgroundColor,
      // resolution: 2,
      antialias: false
      // powerPreference: 'high-performance'
    })

    this.app.renderer.roundPixels = false

    // this.app.renderer.transparent = true

    this.sketchPaneContainer = new PIXI.Container()
    this.sketchPaneContainer.name = 'sketchPaneContainer'

    // layer
    this.layerContainer = new PIXI.Container()
    this.layerContainer.name = 'layerContainer'
    this.sketchPaneContainer.addChild(this.layerContainer)

    // static stroke
    // - not shown to user
    // - used only as a temporary area to setup for texture rendering
    this.strokeContainer = new PIXI.Container()
    this.strokeContainer.name = 'static'

    // live stroke
    // - shown to user
    this.liveStrokeContainer = new PIXI.Container()
    this.liveStrokeContainer.name = 'live'
    this.layerContainer.addChild(this.liveStrokeContainer)

    // off-screen container
    // - used for placement of grain sprites
    this.offscreenContainer = new PIXI.Container()
    this.offscreenContainer.name = 'offscreen'
    this.offscreenContainer.renderable = false
    this.layerContainer.addChild(this.offscreenContainer)

    // erase mask
    this.eraseMask = new PIXI.Sprite()
    this.eraseMask.name = 'eraseMask'

    this.cursor = new Cursor(this)
    this.sketchPaneContainer.addChild(this.cursor)

    this.app.stage.addChild(this.sketchPaneContainer)
    this.sketchPaneContainer.scale.set(1)
  }

  width: number
  height: number

  setImageSize (width: number, height: number) {
    this.width = width
    this.height = height

    this.layerMask = new PIXI.Graphics()
      .beginFill(0x0, 1)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
    this.layerMask.name = 'layerMask'
    this.layerContainer.mask = this.layerMask
    this.sketchPaneContainer.addChild(this.layerMask)

    this.layerBackground = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, this.width, this.height)
      .endFill()
    this.layerBackground.name = 'background'
    this.layerContainer.addChild(this.layerBackground)

    this.eraseMask.texture = PIXI.RenderTexture.create(this.width, this.height)

    this.centerContainer()

    this.layers = new LayersCollection({
      renderer: this.app.renderer as PIXI.WebGLRenderer,
      width: this.width,
      height: this.height
    })
    this.layers.onAdd = this.onLayersCollectionAdd.bind(this)
    this.layers.onSelect = this.onLayersCollectionSelect.bind(this)
  }

  onLayersCollectionAdd (index: number) {
    let layer = this.layers[index]

    // layer.sprite.texture.baseTexture.premultipliedAlpha = false
    this.layerContainer.position.set(0, 0)
    this.layerContainer.addChild(layer.sprite)

    this.centerContainer()
  }

  onLayersCollectionSelect (index: number) {
    this.updateLayerDepths()
  }

  updateLayerDepths () {
    let index = this.layers.getCurrentIndex()

    let selectedLayer = this.layers[index]

    this.layerContainer.setChildIndex(this.layerBackground, 0)

    let childIndex = 1
    for (let layer of this.layers) {
      this.layerContainer.setChildIndex(layer.sprite, childIndex)

      if (layer.sprite === selectedLayer.sprite) {
        this.layerContainer.setChildIndex(this.offscreenContainer, ++childIndex)
        this.layerContainer.setChildIndex(this.liveStrokeContainer, ++childIndex)
      }
      childIndex++
    }
  }

  newLayer () {
    return this.layers.create()
  }

  centerContainer () {
    this.sketchPaneContainer.pivot.set(this.width / 2, this.height / 2)
    this.sketchPaneContainer.position.set(
      Math.floor(this.app.renderer.width / 2),
      Math.floor(this.app.renderer.height / 2)
    )
  }

  // resizeToParent () {
  //   this.resizeToElement(this.app.view.parentElement)
  // }
  //
  // resizeToElement (element) {
  //   const { width, height } = element.getBoundingClientRect()
  //   this.resize(width, height)
  // }

  resize (width: number, height: number) {
    this.app.renderer.resize(width, height)

    // fit aspect ratio, set scale
    const frameAspectRatio = width / height
    const imageAspectRatio = this.width / this.height
    let dim = (frameAspectRatio > imageAspectRatio)
      ? [this.width * height / this.height, height]
      : [width, this.height * width / this.width]
    let scale = dim[0] / this.width
    this.sketchPaneContainer.scale.set(scale)

    this.sketchPaneContainer.position.set(
      Math.floor(this.app.renderer.width / 2),
      Math.floor(this.app.renderer.height / 2)
    )

    this.viewportRect = this.app.view.getBoundingClientRect() as any
  }

  brushes: Array<Brush>

  // per http://www.html5gamedevs.com/topic/29327-guide-to-pixi-v4-filters/
  // for each brush, add a sprite with the brush and grain images, so we can get the actual transformation matrix for those image textures
  async loadBrushes (params: { brushes: Array<any>, brushImagePath: string }) {
    let {brushes, brushImagePath} = params
    this.brushes = brushes.reduce((brushes: Array<any>, brush: any) => {
      brushes[brush.name] = new Brush(brush)
      return brushes
    }, {})

    // get unique file names
    let brushImageNames = Array.from(new Set(Object.values(this.brushes).map(b => b.settings.brushImage)))
    let grainImageNames = Array.from(new Set(Object.values(this.brushes).map(b => b.settings.grainImage)))

    let promises: Array<Promise<any>> = []
    for (let [names, dict] of [[brushImageNames, this.images.brush], [grainImageNames, this.images.grain]]) {
      for (let name of names) {
        let sprite = PIXI.Sprite.fromImage(`${brushImagePath}/${name}.png`)
        sprite.renderable = false

        dict[name] = sprite

        let texture = sprite.texture.baseTexture
        if (texture.hasLoaded) {
          promises.push(Promise.resolve(sprite))
        } else if (texture.isLoading) {
          promises.push(
            new Promise((resolve, reject) => {
              texture.on('loaded', result => resolve(texture))
              texture.on('error', err => reject(err))
            })
          )
        } else {
          promises.push(Promise.reject(new Error()))
        }
      }
    }
    await Promise.all(promises)

    this.cursor.updateSize()
  }

  // stamp = don't clear texture
  stampStroke (source: any, layer: Layer) {
    layer.draw(source, false)
  }

  disposeContainer (container: PIXI.Container) {
    for (let child of container.children) {
      (child as PIXI.Container).destroy({
        children: true,

        // because we re-use the brush texture
        texture: false,
        baseTexture: false
      })
    }
    container.removeChildren()
  }

  addStrokeNode (
    r: number,
    g: number,
    b: number,
    size: number,
    opacity: number,
    x: number,
    y: number,
    pressure: number,
    angle: number,
    tilt: number,
    brush: Brush,
    grainOffsetX: number,
    grainOffsetY: number,
    strokeContainer: PIXI.Container
  ) {
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
    let sprite = new PIXI.Sprite(
      this.images.brush[brush.settings.brushImage].texture
    )

    //
    //
    // brush params
    //
    let nodeSize = size - (1 - pressure) * size * brush.settings.pressureSize
    let tiltSizeMultiple = (((tilt / 90.0) * brush.settings.tiltSize) * 3) + 1
    nodeSize *= tiltSizeMultiple
    // nodeSize = this.brushSize

    let nodeOpacity = 1 - (1 - pressure) * brush.settings.pressureOpacity
    let tiltOpacity = 1 - tilt / 90.0 * brush.settings.tiltOpacity
    nodeOpacity *= tiltOpacity * opacity

    let nodeRotation: number
    if (brush.settings.azimuth) {
      nodeRotation = angle * Math.PI / 180.0 - this.sketchPaneContainer.rotation
    } else {
      nodeRotation = 0 - this.sketchPaneContainer.rotation
    }

    //
    //
    // sprite setup
    //
    // sprite must fit a texture rotated by up to 45 degrees
    let rad = Math.PI * 45 / 180 // extreme angle in radians
    let spriteSize = Math.abs(nodeSize * Math.sin(rad)) + Math.abs(nodeSize * Math.cos(rad))

    let iS = Math.ceil(spriteSize)
    x -= iS / 2
    y -= iS / 2
    sprite.x = Math.floor(x)
    sprite.y = Math.floor(y)
    sprite.width = iS
    sprite.height = iS

    let dX = x - sprite.x
    let dY = y - sprite.y
    let dS = nodeSize / sprite.width

    let oXY = [dX, dY]
    let oS = [dS, dS]

    //
    //
    // filter setup
    //
    // TODO can we avoid creating a new grain sprite for each render?
    //      used for rendering grain filter texture at correct position
    let grainSprite = this.images.grain[brush.settings.grainImage]
    this.offscreenContainer.addChild(grainSprite)
    // hacky fix to calculate vFilterCoord properly
    this.offscreenContainer.getLocalBounds()
    let filter = new BrushNodeFilter(grainSprite)

    filter.uniforms.uRed = r
    filter.uniforms.uGreen = g
    filter.uniforms.uBlue = b
    filter.uniforms.uOpacity = nodeOpacity

    filter.uniforms.uRotation = nodeRotation

    filter.uniforms.uBleed =
      Math.pow(1 - pressure, 1.6) * brush.settings.pressureBleed

    filter.uniforms.uGrainScale = brush.settings.scale

    //
    //
    // DEPRECATED
    //
    filter.uniforms.uGrainRotation = brush.settings.rotation
    //
    //
    //

    filter.uniforms.u_x_offset = grainOffsetX * brush.settings.movement
    filter.uniforms.u_y_offset = grainOffsetY * brush.settings.movement

    // subpixel offset
    filter.uniforms.u_offset_px = oXY // TODO multiply by app.stage.scale if zoomed
    // console.log('iX', iX, 'iY', iY, 'u_offset_px', oXY)
    // subpixel scale AND padding AND rotation accomdation
    filter.uniforms.u_node_scale = oS // desired scale
    filter.padding = 1 // for filterClamp

    sprite.filters = [filter]
    // via https://github.com/pixijs/pixi.js/wiki/v4-Creating-Filters#bleeding-problem
    // @popelyshev this property is for Sprite, not for filter. Thans to TypeScript!
    // @popelyshev at the same time, the fix only makes it worse :(
    // sprite.filterArea = this.app.screen

    strokeContainer.addChild(sprite)
  }

  pointerDown = false

  down (e: PointerEvent, options = {}) {
    this.pointerDown = true
    this.strokeBegin(e, options)

    this.app.view.style.cursor = 'none'
    this.cursor.renderCursor(e)
  }

  move (e: PointerEvent) {
    if (this.pointerDown) {
      this.strokeContinue(e)
    }

    this.app.view.style.cursor = 'none'
    this.cursor.renderCursor(e)
  }

  up (e: PointerEvent) {
    if (this.pointerDown) {
      this.strokeEnd(e)
    }

    this.app.view.style.cursor = 'none'
    this.cursor.renderCursor(e)
  }

  strokeState: IStrokeState
  brushColor: number
  brushOpacity: number
  brush: Brush

  strokeBegin (e: PointerEvent, options: IStrokeSettings) {
    // initialize stroke state
    this.strokeState = {
      isErasing: !!options.erase,
      // which layers will be stamped / dirtied by this stroke?
      layerIndices: options.erase
        ? options.erase // array of layers which will be erased
        : [this.layers.currentIndex], // single layer dirtied
      points: [] as any,
      path: new paper.Path(),
      lastStaticIndex: 0,
      lastSpacing: undefined,
      grainOffset: this.brush.settings.randomOffset
        ? {x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100)}
        : {x: 0, y: 0},

      // snapshot brush configuration
      size: this.brushSize,
      color: this.brushColor,
      opacity: this.brushOpacity
    }

    this.onStrokeBefore && this.onStrokeBefore(this.strokeState)

    this.addPointerEventAsPoint(e)

    // don't show the live container while we're erasing
    if (this.strokeState.isErasing) {
      if (this.liveStrokeContainer.parent) {
        this.liveStrokeContainer.parent.removeChild(this.liveStrokeContainer)
      }
    } else {
      // NOTE only sets liveStrokeContainer.alpha at beginning of stroke
      //      if layer opacity can change during the stroke, we should move this to `drawStroke`
      this.liveStrokeContainer.alpha = this.getLayerOpacity(this.layers.currentIndex)
      this.layerContainer.addChild(this.liveStrokeContainer)
      // TODO can we determine the exact index and use addChildAt instead of brute-force updating all depths?
      this.updateLayerDepths()
    }

    this.drawStroke()
  }

  strokeContinue (e: PointerEvent) {
    this.addPointerEventAsPoint(e)
    this.drawStroke()
  }

  strokeEnd (e: PointerEvent) {
    this.addPointerEventAsPoint(e)
    this.stopDrawing()
  }

  // public
  stopDrawing () {
    this.drawStroke(true) // finalize

    this.disposeContainer(this.liveStrokeContainer)
    this.offscreenContainer.removeChildren()

    this.layers.markDirty(this.strokeState.layerIndices)

    // add the liveStrokeContainer back
    if (this.strokeState.isErasing) {
      this.layerContainer.addChild(this.liveStrokeContainer)
      // TODO can we determine the exact index and use addChildAt instead of brute-force updating all depths?
      this.updateLayerDepths()
    }

    this.pointerDown = false

    this.onStrokeAfter && this.onStrokeAfter(this.strokeState)
  }

  getInterpolatedStrokeInput (strokeInput: Array<IStrokePoint>, path: paper.Path) {
    let interpolatedStrokeInput: Array<Array<any>> = []

    // get lookups for each segment so we know how to interpolate

    // for every segment,
    //  find the segments's location on the path,
    //  and find the offset
    //    where 'offset' means the length from
    //    the beginning of the path
    //    up to the segment's location
    let segmentLookup: Array<number> = []

    // console.log(path.length)

    for (let i = 0; i < path.segments.length; i++) {
      if (path.segments[i].location) {
        segmentLookup.push(path.segments[i].location.offset)
      }
    }

    // console.log(segmentLookup)

    let currentSegment = 0

    // let nodeSize = this.brushSize - ((1-pressure)*this.brushSize*brush.settings.pressureSize)

    let spacing = Math.max(1, this.strokeState.size * this.brush.settings.spacing)

    // console.log(spacing)

    if (this.strokeState.lastSpacing == null) this.strokeState.lastSpacing = spacing
    let start = (spacing - this.strokeState.lastSpacing)
    let len = path.length
    let i = 0
    // default. pushes along in-between spacing when spacing - this.strokeState.lastSpacing is > path.length
    let k = len + -(this.strokeState.lastSpacing + len)

    let singlePoint = false
    if (len === 0) {
      // single point
      start = 0
      len = spacing
      singlePoint = true
    }
    for (i = start; i < len; i += spacing) {
      let point = path.getPointAt(i)

      for (let z = currentSegment; z < segmentLookup.length; z++) {
        if (segmentLookup[z] < i) {
          currentSegment = z
          // @popelyshev : Why continue?
          continue
        }
      }

      let pressure: number
      let tiltAngle: number
      let tilt: number

      if (singlePoint) {
        pressure = strokeInput[currentSegment].pressure
        tiltAngle = strokeInput[currentSegment].tiltAngle
        tilt = strokeInput[currentSegment].tilt
      } else {
        let segmentPercent =
          (i - segmentLookup[currentSegment]) /
          (segmentLookup[currentSegment + 1] - segmentLookup[currentSegment])

        pressure = Util.lerp(
          strokeInput[currentSegment].pressure,
          strokeInput[currentSegment + 1].pressure,
          segmentPercent
        )
        tiltAngle = Util.lerp(
          strokeInput[currentSegment].tiltAngle,
          strokeInput[currentSegment + 1].tiltAngle,
          segmentPercent
        )
        tilt = Util.lerp(
          strokeInput[currentSegment].tilt,
          strokeInput[currentSegment + 1].tilt,
          segmentPercent
        )
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
      ])
      k = i
    }
    this.strokeState.lastSpacing = len - k

    return interpolatedStrokeInput
  }

  addStrokeNodes (strokeInput: Array<IStrokePoint>, path: paper.Path, strokeContainer: PIXI.Container) {
    // we have 2+ StrokeInput points (with x, y, pressure, etc),
    // and 2+ matching path segments (with location and handles)
    //  e.g.: strokeInput[0].x === path.segments[0].point.x
    let interpolatedStrokeInput = this.getInterpolatedStrokeInput(strokeInput, path)

    for (let args of interpolatedStrokeInput) {
      ;(this.addStrokeNode as any)(...args, strokeContainer)
    }
  }

  // public
  localizePoint (point: {x: number, y: number}) {
    return this.sketchPaneContainer.toLocal(new PIXI.Point(
      point.x - this.viewportRect.x,
      point.y - this.viewportRect.y
    ),
    this.app.stage)
  }

  addPointerEventAsPoint (e: PointerEvent) {
    let corrected = this.localizePoint(e)

    let pressure = e.pointerType === 'mouse'
      ? e.pressure > 0 ? 0.5 : 0
      : e.pressure

    let tiltAngle = e.pointerType === 'mouse'
      ? {angle: -90, tilt: 37}
      : Util.calcTiltAngle(e.tiltY, e.tiltX) // NOTE we intentionally reverse these args

    this.strokeState.points.push({
      x: corrected.x,
      y: corrected.y,
      pressure: pressure,
      tiltAngle: tiltAngle.angle,
      tilt: tiltAngle.tilt
    })

    // we added a new point, so decrement lastStaticIndex
    this.strokeState.lastStaticIndex = Math.max(0, this.strokeState.lastStaticIndex - 1)

    // only keep track of input that hasn't been rendered static yet
    this.strokeState.points = this.strokeState.points.slice(
      Math.max(0, this.strokeState.lastStaticIndex - 1),
      this.strokeState.points.length
    )
    this.strokeState.path = new paper.Path(
      this.strokeState.points
    )
    // @popelyshev: paper typings are wrong
    ;(this.strokeState.path.smooth as any)({type: 'catmull-rom', factor: 0.5}) // centripetal
  }

  // render the live strokes
  // TODO instead of slices, could pass offset and length?
  drawStroke (finalize = false) {
    let len = this.strokeState.points.length

    // finalize
    // draws all remaining points we know of
    // called on up
    // useful for drawing a dot for only two points
    //   e.g.: on quick up/down press with no move
    if (finalize) {
      // the index of the last static point we drew
      let a = this.strokeState.lastStaticIndex
      // the last point we know of
      let b = this.strokeState.points.length - 1

      // console.log(
      //   '\n',
      //   'rendering to texture.\n',
      //   len, 'points in the array.\n',
      //   // this.strokeState.points, '\n',
      //   'drawing stroke from point idx', a,
      //   'to point idx', b, '\n'
      // )

      this.addStrokeNodes(
        this.strokeState.points.slice(a, b + 1),
        new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      // stamp
      if (this.strokeState.isErasing) {
        // stamp to erase texture
        this.updateMask(this.strokeContainer, true)
      } else {
        // stamp to layer texture
        this.stampStroke(
          this.strokeContainer,
          this.layers.getCurrentLayer()
        )
      }
      this.disposeContainer(this.strokeContainer)
      this.offscreenContainer.removeChildren()

      return
    }

    // static
    // do we have enough points to render a static stroke to the texture?
    if (len >= 3) {
      let last = this.strokeState.points.length - 1
      let a = last - 2
      let b = last - 1

      // draw to the static container
      this.addStrokeNodes(
        this.strokeState.points.slice(a, b + 1),
        new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
        this.strokeContainer
      )

      // stamp
      if (this.strokeState.isErasing) {
        // stamp to the erase texture
        this.updateMask(this.strokeContainer)
      } else {
        // stamp to layer texture
        this.stampStroke(
          this.strokeContainer,
          this.layers.getCurrentLayer()
        )
      }
      this.disposeContainer(this.strokeContainer)
      this.offscreenContainer.removeChildren()

      this.strokeState.lastStaticIndex = b
    }

    // live
    // do we have enough points to draw a live stroke to the container?
    if (len >= 2) {
      this.disposeContainer(this.liveStrokeContainer)

      let last = this.strokeState.points.length - 1
      let a = last - 1
      let b = last

      // render the current stroke live
      if (this.strokeState.isErasing) {
        // TODO find a good way to add live strokes to erase mask
        // this.updateMask(this.liveStrokeContainer)
      } else {
        // store the current spacing
        let tmpLastSpacing = this.strokeState.lastSpacing
        // draw a live stroke
        this.addStrokeNodes(
          this.strokeState.points.slice(a, b + 1),
          new paper.Path(this.strokeState.path.segments.slice(a, b + 1)),
          this.liveStrokeContainer
        )
        // revert the spacing so the real stroke will be correct
        this.strokeState.lastSpacing = tmpLastSpacing
      }
    }
  }

  updateMask (source: any, finalize = false) {
    // find the top-most active layer
    const descending = (a: number, b: number) => b - a
    let layer = this.strokeState.layerIndices
      .map(i => this.layers[i])
      .sort(
        (a, b) => descending(
          a.sprite.parent.getChildIndex(a.sprite),
          b.sprite.parent.getChildIndex(b.sprite)
        )
      )[0]

    // we're starting a new round
    if (!layer.sprite.mask) {
      // add the mask on top of all layers
      this.layerContainer.addChild(this.eraseMask)

      // reset the mask with a solid red background
      let graphics = new PIXI.Graphics()
        .beginFill(0xff0000, 1.0)
        .drawRect(0, 0, this.width, this.height)
        .endFill()
      this.app.renderer.render(
        graphics,
        this.eraseMask.texture as PIXI.RenderTexture,
        true
      )

      // use the mask
      for (let i of this.strokeState.layerIndices) {
        let layer = this.layers[i]
        layer.sprite.mask = this.eraseMask
      }
    }

    // render the white strokes onto the red filled erase mask texture
    this.app.renderer.render(
      source,
      this.eraseMask.texture as PIXI.RenderTexture,
      false
    )

    // if finalizing,
    if (finalize) {
      for (let i of this.strokeState.layerIndices) {
        // apply the erase texture to the actual layer texture
        let layer = this.layers[i]
        // add child so transform is correct
        layer.sprite.addChild(this.eraseMask)
        layer.sprite.mask = this.eraseMask
        // stamp mask'd version of layer sprite to its own texture
        this.layers[i].rewrite()
        // cleanup
        layer.sprite.mask = null
        layer.sprite.removeChild(this.eraseMask)
      }

      // TODO GC the eraseMask texture?
    }
  }

  // TODO handle crop / center
  // TODO mark dirty?
  replaceLayer (index: number, source: any, clear = true) {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    this.layers[index].replace(source, clear)
  }

  // DEPRECATED
  getLayerCanvas (index: number) {
    console.warn('SketchPane#getLayerCanvas is deprecated. Please fix the caller to use a different method.')
    console.trace()
    index = (index == null) ? this.layers.getCurrentIndex() : index

    // #canvas reads the raw pixels and converts to an HTMLCanvasElement
    // see: http://pixijs.download/release/docs/PIXI.extract.WebGLExtract.html
    return this.app.renderer.plugins.extract.canvas(this.layers[index].sprite.texture)
  }

  exportLayer (index: number, format = 'base64') {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    return this.layers[index].export(format)
  }

  extractThumbnailPixels (width: number, height: number, indices : Array<number> = []) {
    return this.layers.extractThumbnailPixels(width, height, indices)
  }

  clearLayer (index: number) {
    index = (index == null) ? this.layers.getCurrentIndex() : index

    this.layers[index].clear()
  }

  getNumLayers () {
    return this.layers.length - 1
  }

  // get current layer
  getCurrentLayerIndex (index: number) {
    return this.layers.getCurrentIndex()
  }

  // set layer by index (0-indexed)
  setCurrentLayerIndex (index: number) {
    if (this.pointerDown) return // prevent layer change during draw

    this.layers.setCurrentIndex(index)
  }

  _brushSize: number

  // TODO setState instead?
  set brushSize (value) {
    this._brushSize = value
    this.cursor.updateSize()
  }

  get brushSize () {
    return this._brushSize
  }

  isDrawing () {
    return this.pointerDown
  }

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

  getLayerOpacity (index: number) {
    return this.layers[index].getOpacity()
  }

  setLayerOpacity (index: number, opacity: number) {
    this.layers[index].setOpacity(opacity)
  }

  markLayersDirty (indices: Array<number>) {
    return this.layers.markDirty(indices)
  }

  clearLayerDirty (index: number) {
    this.layers[index].setDirty(false)
  }

  getLayerDirty (index: number) {
    return this.layers[index].getDirty()
  }

  isLayerEmpty (index: number) {
    return this.layers[index].isEmpty()
  }

  // getActiveLayerIndices () {
  //   return this.layers.getActiveIndices()
  // }

  getDOMElement () {
    return this.app.view
  }

  //
  // operations
  //
  //
  flipLayers (vertical = false) {
    this.layers.flip(vertical)
  }
}
