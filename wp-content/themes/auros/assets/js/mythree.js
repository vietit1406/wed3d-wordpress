// import { hello } from './module.mjs';
// src="https://unpkg.com/three@0.87.1/build/three.js">
//     <script src="https://unpkg.com/three@0.87.1/examples/js/controls/OrbitControls.js"></script>
//     <script src="https://unpkg.com/three@0.87.1/examples/js/loaders/GLTFLoader.js"></script>
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.6/gsap.min.js"></script>


jQuery(document).ready(function () {
    var url3D = jQuery('#my3DUrl').attr('href');
    var url3D = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/39255/ladybug.gltf';
    setTimeout(function () {
        var myWidth = jQuery('#my3DUrl').parent().width();
        console.log(myWidth);
    const backgroundColor = 0x000000;

    /*////////////////////////////////////////*/

    var renderCalls = [];
    function render () {
        requestAnimationFrame( render );
        renderCalls.forEach((callback)=>{ callback(); });
    }
    render();

    /*////////////////////////////////////////*/

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 800 );
    camera.position.set(5,5,5);
        const canvas = document.querySelector('#my3DUrl');
        // const canvas = document.getElementById('my3DUrl');
        var renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(myWidth, myWidth);
    renderer.setClearColor( backgroundColor );//0x );

    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = Math.pow( 0.94, 5.0 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    window.addEventListener( 'resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

        // document.body.appendChild( renderer.domElement);
        // document.body.$(canvas);
        jQuery('body').find('#my3DUrl').html(renderer.domElement);

    function renderScene(){ renderer.render( scene, camera ); }
    renderCalls.push(renderScene);

    /* ////////////////////////////////////////////////////////////////////////// */

    var controls = new THREE.OrbitControls( camera );

    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 0.9;

    controls.minDistance = 3;
    controls.maxDistance = 20;

    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI /2; // radians

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    renderCalls.push(function(){
        controls.update()
    });


    /* ////////////////////////////////////////////////////////////////////////// */
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    var light = new THREE.PointLight( 0xffffcc, 20, 200 );
    light.position.set( 4, 30, -20 );
    scene.add( light );

    var light2 = new THREE.AmbientLight( 0x20202A, 20, 100 );
    light2.position.set( 30, -10, 30 );
    scene.add( light2 );

    /* ////////////////////////////////////////////////////////////////////////// */



    var loader = new THREE.GLTFLoader();
    loader.crossOrigin = true;
        loader.load(url3D, function (data) {


        var object = data.scene;
            object.position.set(-1, -11, -0.75); //X, Y , Z
//     object.rotation.set(Math.PI / -2, 0, 0);

//     TweenLite.from( object.rotation, 1.3, {
//       y: Math.PI * 2,
//       ease: 'Power3.easeOut'
//     });

            // TweenMax.from( object.position, 3, {
            //     y: -8,
            //     yoyo: true,
            //     repeat: -1,
            //     ease: 'Power2.easeInOut'
            // });
        //object.position.y = - 95;
        scene.add( object );
        //, onProgress, onError );
    });

    }, 2000);
    // function main() {
    //     const canvas = document.querySelector('#my3DUrl');
    //     const renderer = new THREE.WebGLRenderer({
    //         canvas,
    //         alpha: true,
    //     });
    //
    //     const fov = 75;
    //     const aspect = 2;  // the canvas default
    //     const near = 0.1;
    //     const far = 5;
    //     const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //     camera.position.z = 2;
    //
    //     const scene = new THREE.Scene();
    //
    //     {
    //         const color = 0xFFFFFF;
    //         const intensity = 1;
    //         const light = new THREE.DirectionalLight(color, intensity);
    //         light.position.set(-1, 2, 4);
    //         scene.add(light);
    //     }
    //
    //     const boxWidth = 1;
    //     const boxHeight = 1;
    //     const boxDepth = 1;
    //     const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    //
    //     function makeInstance(geometry, color, x) {
    //         const material = new THREE.MeshPhongMaterial({color});
    //
    //         const cube = new THREE.Mesh(geometry, material);
    //         scene.add(cube);
    //
    //         cube.position.x = x;
    //
    //         return cube;
    //     }
    //
    //     const cubes = [
    //         makeInstance(geometry, 0x44aa88,  0),
    //         makeInstance(geometry, 0x8844aa, -2),
    //         makeInstance(geometry, 0xaa8844,  2),
    //     ];
    //
    //     function resizeRendererToDisplaySize(renderer) {
    //         const canvas = renderer.domElement;
    //         const width = canvas.clientWidth;
    //         const height = canvas.clientHeight;
    //         const needResize = canvas.width !== width || canvas.height !== height;
    //         if (needResize) {
    //             renderer.setSize(width, height, false);
    //         }
    //         return needResize;
    //     }
    //
    //     function render(time) {
    //         time *= 0.001;
    //
    //         if (resizeRendererToDisplaySize(renderer)) {
    //             const canvas = renderer.domElement;
    //             camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //             camera.updateProjectionMatrix();
    //         }
    //
    //         cubes.forEach((cube, ndx) => {
    //             const speed = 1 + ndx * .1;
    //             const rot = time * speed;
    //             cube.rotation.x = rot;
    //             cube.rotation.y = rot;
    //         });
    //
    //         renderer.render(scene, camera);
    //
    //         requestAnimationFrame(render);
    //     }
    //
    //     requestAnimationFrame(render);
    // }
    //
    // main();


});