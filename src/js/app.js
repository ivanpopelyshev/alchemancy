const sketchPane = new SketchPane()
sketchPane.load()
  .then(() => {
    window.sketchPane = sketchPane

    console.log('ready')

    let stats = new Stats()
    stats.showPanel(0)
    document.body.appendChild(stats.dom)

    window.addEventListener("resize", function(e) {
      sketchPane.resize()
    })

    window.addEventListener("pointerdown", function(e) {
      sketchPane.pointerdown(e)
    })

    window.addEventListener("pointerup", function(e) {
      sketchPane.pointerup(e)
    })

    window.addEventListener("pointermove", function(e) {
      // if (e.target.parentNode !== document.body) return
      sketchPane.pointermove(e)
    })

    window.addEventListener("keydown", function(e) {
      // console.log(e)
      switch (e.key) {
        case "1":
          sketchPane.color = {r: Math.random(),g: Math.random(),b: Math.random()}
          break
        case "2":
          sketchPane.size = 10
          break
        case "3":
          sketchPane.size = Math.random()*300
          break
        case "4":
          sketchPane.opacity = Math.random()*0.8+0.2
          break
        case "5":
          sketchPane.opacity = Math.random()*0.8+0.2
          break
        case "6":
          sketchPane.brush = sketchPane.brushes.brushes.pen
          break
        case "7":
          sketchPane.brush = sketchPane.brushes.brushes.pencil
          break
      }
    })

    document.getElementById('l-1').addEventListener("click", function(e) {
      sketchPane.setLayer(1)
    })

    document.getElementById('l-2').addEventListener("click", function(e) {
      sketchPane.setLayer(2)
    })

    document.getElementById('l-3').addEventListener("click", function(e) {
      sketchPane.setLayer(3)
    })

    document.getElementById('b-1').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.pencil
      sketchPane.brushSize = 4
      sketchPane.brushOpacity = .8
      sketchPane.brushColor = {r: 0.05,g: 0.05,b: 0.05}
    })

    document.getElementById('b-2').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.pen
      sketchPane.brushSize = 4
      sketchPane.brushOpacity = .9
      sketchPane.brushColor = {r: 0,g: 0,b: 0}

    })

    document.getElementById('b-copic').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.copic
      sketchPane.brushSize = 40
      sketchPane.brushOpacity = .6
      let val = 0.8
      let val2 = 1
      sketchPane.brushColor = {r: val,g: val,b: val2}

    })

    document.getElementById('b-3').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.charcoal
      sketchPane.brushSize = 50
      sketchPane.brushOpacity = .6
      sketchPane.brushColor = {r: .6,g: 0.6,b: 1}

    })

    document.getElementById('b-4').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.watercolor
      sketchPane.brushSize = 100
      sketchPane.brushOpacity = .4
      sketchPane.brushColor = {r: .8,g: 0.8,b: 1}

    })

    document.getElementById('b-5').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.clouds
    })

    document.getElementById('b-6').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.slate
    })

    document.getElementById('b-7').addEventListener("click", function(e) {
      sketchPane.brush = sketchPane.brushes.brushes.brushpen
      sketchPane.brushSize = 15
      sketchPane.brushOpacity = 1
      sketchPane.brushColor = {r: 0,g: 0,b: 0}
    })

    document.getElementById('c-1').addEventListener("click", function(e) {
      let val = 0
      sketchPane.brushColor = {r: val,g: val,b: val}
    })

    document.getElementById('c-2').addEventListener("click", function(e) {
      let val = 0.0
      let val2 = 0.2
      sketchPane.brushColor = {r: val,g: val,b: val2}
    })

    document.getElementById('c-3').addEventListener("click", function(e) {
      let val = 0.3
      let val2 = 0.6
      sketchPane.brushColor = {r: val,g: val,b: val2}
    })

    document.getElementById('c-4').addEventListener("click", function(e) {
      let val = 0.7
      let val2 = 0.8
      sketchPane.brushColor = {r: val,g: val,b: val2}
    })

    document.getElementById('c-5').addEventListener("click", function(e) {
      let val = 0.8
      let val2 = 1
      sketchPane.brushColor = {r: val,g: val,b: val2}
    })

    document.getElementById('c-6').addEventListener("click", function(e) {
      let val = 0.3
      let val2 = 1
      sketchPane.brushColor = {r: val2,g: val2,b: val}
    })

    document.getElementById('c-7').addEventListener("click", function(e) {
      let val = Math.random()*.4+.6
      let val2 = Math.random()*.4+.2
      sketchPane.brushColor = {r: 1,g: 1,b: 1}
    })

    document.getElementById('s-1').addEventListener("click", function(e) {
      sketchPane.brushSize = 3
    })

    document.getElementById('s-2').addEventListener("click", function(e) {
      sketchPane.brushSize = 6
    })

    document.getElementById('s-3').addEventListener("click", function(e) {
      sketchPane.brushSize = 40
    })

    document.getElementById('s-4').addEventListener("click", function(e) {
      sketchPane.brushSize = 100
    })

    document.getElementById('o-1').addEventListener("click", function(e) {
      sketchPane.brushOpacity = 0.1
    })

    document.getElementById('o-2').addEventListener("click", function(e) {
      sketchPane.brushOpacity = .3
    })

    document.getElementById('o-3').addEventListener("click", function(e) {
      sketchPane.brushOpacity = .5
    })

    document.getElementById('o-4').addEventListener("click", function(e) {
      sketchPane.brushOpacity = .8
    })

    document.getElementById('o-5').addEventListener("click", function(e) {
      sketchPane.brushOpacity = 1
    })

    document.getElementById('clear').addEventListener("click", function(e) {
      sketchPane.clearLayer()
    })

    document.getElementById('spin').addEventListener("click", function(e) {
      sketchPane.spin = !sketchPane.spin
    })

    document.getElementById('save').addEventListener("click", function(e) {
      sketchPane.saveLayer()
    })

    const onSpacingClick = e => {
      sketchPane.brush.settings.spacing = parseFloat(e.target.textContent)
    }
    document.getElementById('spacing-1').addEventListener('click', onSpacingClick)
    document.getElementById('spacing-2').addEventListener('click', onSpacingClick)
    document.getElementById('spacing-3').addEventListener('click', onSpacingClick)
    document.getElementById('spacing-4').addEventListener('click', onSpacingClick)
    document.getElementById('spacing-5').addEventListener('click', onSpacingClick)

    const drawStrokes = () => {
      sketchPane.brush = sketchPane.brushes.brushes.pen
      sketchPane.brushSize = 30
      sketchPane.brushOpacity = 0.9
      sketchPane.brushColor = { r: 0, g: 0, b: 0 }
      sketchPane.brush.settings.spacing = 0.7

      // fake some pointer movements
      const fakeEvent = ({x, y}) => ({ x, y, pressure: 1.0, tiltX: 0, tiltY: 0, target: sketchPane.app.view })

      for (let i = 0; i < Math.PI * 2 * 2; i++) {
        let x = 350 + (i * 50)
        let y = 400 + (Math.cos(i) * 50)
        sketchPane.addMouseEventAsPoint(fakeEvent({ x, y }))
        sketchPane.renderLive()
      }

      ;(async function () {
        // let dur = 100
        sketchPane.pointerdown(fakeEvent({ x: 350, y: 300 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70, y: 305 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70 + 70, y: 310 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70 + 70 + 70, y: 310 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70 + 70 + 70 + 70, y: 310 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointermove(fakeEvent({ x: 350 + 70 + 70 + 70 + 70 + 70, y: 310 }))
        // await new Promise(resolve => setTimeout(resolve, dur))
        sketchPane.pointerup(fakeEvent({ x: 700, y: 310 }))
      }())
    }

    const plotLines = () => {
      // sketchPane.brush = sketchPane.brushes.brushes.pen
      // sketchPane.brushSize = 4
      // sketchPane.brushOpacity = 0.9
      // sketchPane.brushColor = { r: 0, g: 0, b: 0 }

      // sketchPane.brush = sketchPane.brushes.brushes.brushpen
      // sketchPane.brushSize = 15
      // sketchPane.brushOpacity = 1
      // sketchPane.brushColor = { r: 0, g: 0, b: 0 }

      // sketchPane.brush = sketchPane.brushes.brushes.watercolor
      // sketchPane.brushSize = 100
      // sketchPane.brushOpacity = 0.4
      // sketchPane.brushColor = { r: 0.8, g: 0.8, b: 1 }

      let angle = 0
      const plot = (x, y) => {
        angle = (angle + sketchPane.brushSize) % 360
        sketchPane.addStrokeNode(
          sketchPane.brushColor.r,
          sketchPane.brushColor.g,
          sketchPane.brushColor.b,
          sketchPane.brushSize,
          sketchPane.brushOpacity,
          x,
          y,
          1.0, // pressure
          angle, // angle
          0, // tilt
          sketchPane.brush,
          0, // grainOffset
          0, // grainOffset
          sketchPane.strokeContainer
        )
      }

      let origin
      let m
      let spacing

      // Line #1
      origin = [550, 400]
      m = 3 / 400
      spacing = 1
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }

      // Line #2
      origin = [550, 500]
      m = 3 / 400
      spacing = sketchPane.brushSize // 4
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }

      // Line #3
      origin = [550, 600]
      m = 3 / 400
      spacing = 5
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }

      // Line #4
      origin = [550, 700]
      m = 3 / 400
      spacing = 10
      for (let x = 0; x <= 400; x += spacing) {
        let y = m * x
        plot(x + origin[0], y + origin[1])
      }

      setTimeout(() => {
        sketchPane.stampStroke(
          sketchPane.strokeContainer,
          sketchPane.layerContainer.children[sketchPane.layer].texture
        )
        sketchPane.disposeContainer(sketchPane.strokeContainer)
      }, 500)
    }
    document.getElementById('plot-lines').addEventListener('click', event => {
      event.preventDefault()
      plotLines()
    })

    document.getElementById('draw-strokes').addEventListener('click', event => {
      event.preventDefault()
      drawStrokes()
    })

    function animate() {
      stats.begin()
      stats.end()
      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  })
  .catch(err => console.error(err))
