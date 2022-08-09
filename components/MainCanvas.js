import React from 'react';
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls'

export default class MainCanvas extends React.Component {

  trackedIds = [];
  dragControls = null;
  orbitControls = null;
  scene = null;
  camera = null;
  mount = null;
  rayCaster = null;
  mousePosition = null;

  constructor (props) {
    super(props)
    this.mount = React.createRef();
  }
  
  componentDidMount () {
    const mount = this.mount.current

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(mount.offsetWidth, mount.offsetHeight)
    mount.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
        75,
        mount.offsetWidth / mount.offsetHeight,
        0.1,
        1000
    )
    this.camera.position.z = 100
    this.camera.position.x = 50
    this.camera.position.y = 100

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x111);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    const axesHelper = new THREE.AxesHelper(1000)
    this.scene.add(axesHelper)
    this.orbitControls.update()

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
    this.cube = new THREE.Mesh(geometry, material)

    // this.scene.add(this.cube)

    const planeGeometry = new THREE.PlaneGeometry(100, 100)
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF,
      side: THREE.DoubleSide
    })
    const plane =  new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    plane.receiveShadow = true
    // this.scene.add(plane)

    const light = new THREE.SpotLight()
    light.position.set(50, 100, 100)
    this.scene.add(light)

    const sLightHelper = new THREE.SpotLightHelper(light)
    this.scene.add(sLightHelper)

    this.rayCaster = new THREE.Raycaster()
    this.mousePosition = new THREE.Vector2()
    mount.addEventListener('pointermove', this.onMouseMove)

    this.start()
  }

  onMouseMove = (e) => {
    const mount = this.mount.current
    let renderWidth = mount.offsetWidth;
    let renderHeight = mount.offsetHeight;
    // Get normalized coordinates
    // Must subtract window.inner against mount.size
    this.mousePosition.x = ((e.layerX - 256) / renderWidth) * 2 - 1
    this.mousePosition.y = - (e.layerY / renderHeight) * 2 + 1
  }

  componentWillUnmount() {
    const mount = this.mount.current
    mount.removeEventListener('pointermove', this.onMouseMove)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    // if (this.mesh) {
    //   this.mesh.rotation.y += this.props.rotationStep
    // }
    this.rayCaster.setFromCamera(this.mousePosition, this.camera)
    const intersects = this.rayCaster.intersectObjects(this.scene.children)
    let isHit = false
    for (let i = 0; i < intersects.length; i++) {
      const id = intersects[i].object.id
      if (this.trackedIds.includes(id)) {
        isHit = true
        intersects[i].object.material.color.set(0xFF0000)
      }
    }
    if (!isHit) {
      this.trackedIds.forEach(id => {
        const obj = this.scene.getObjectById(id)
        if (obj) {
          obj.material.color.set(0xb2ffc8)
        }
      })
    }

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  componentDidUpdate = () => {
    // remove previous objects
    this.trackedIds.forEach(id => {
      const object = this.scene.getObjectById(id)
      this.scene.remove(object);
    })

    this.props.objects.forEach(object => {
      const { type, params } = object
      switch (type) {
        case 'box': { this._renderBox(params); }
        case 'sphere': { this._renderSphere(params); }
        default: break;
      }
    })
    this.addDragControl();
  }

  addDragControl = () => {
    // remove previous control
    if (this.dragControls)  {
      this.dragControls.dispose()
      delete this.dragControls
    }
    const objects = this.trackedIds.map(id => {
      return this.scene.getObjectById(id)
    })
    this.dragControls = new DragControls(objects, this.camera, this.renderer.domElement)
    this.dragControls.addEventListener('dragstart', (event) => {
        this.orbitControls.enabled = false
        event.object.material.opacity = 0.33
    })
    this.dragControls.addEventListener('dragend', (event) => {
        this.orbitControls.enabled = true
        event.object.material.opacity = 1
    })
  }

  render () {
    return (
      <main  
        ref={this.mount} 
        style={{
          flexGrow: '1',
          height: '100%',
          width: '100%'
        }}
      >
      </main>)
  }

  // Methods for rendering three.js Mesh object
  _renderBox = (params) => {
    const boxGeometry = new THREE.BoxBufferGeometry(params.length, params.length, params.length)
    const boxMaterial = new THREE.MeshBasicMaterial()
    const box = new THREE.Mesh(boxGeometry, boxMaterial)
    box.position.set(params.x, params.y, params.z)
    this.trackedIds.push(box.id)
    this.scene.add(box)
  }

  _renderSphere = (params) => {
    const sphereGeometry = new THREE.SphereBufferGeometry(params.radius, 100, 80)
    const sphereMaterial = new THREE.MeshBasicMaterial()
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.set(params.x, params.y, params.z)
    this.trackedIds.push(sphere.id)
    this.scene.add(sphere)
  }
}